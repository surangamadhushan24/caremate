let jitsiApi = null;
let currentAppointmentId = null;
let currentVideoCallId = null;

async function startVideoCall(appointmentId) {
  if (!appointmentId) {
    alert('Invalid appointment ID');
    return;
  }
  currentAppointmentId = parseInt(appointmentId);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again.');
      window.location.href = '/index.html';
      return;
    }

    const paymentResponse = await fetch(`http://localhost:8080/api/payments/${appointmentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (paymentResponse.ok) {
      const payment = await paymentResponse.json();
      if (payment.status !== 'COMPLETED') {
        alert('Payment is not completed. Please complete the payment to start the video call.');
        initiatePayment(appointmentId);
        return;
      }
    } else if (paymentResponse.status === 404) {
      alert('No payment found for this appointment. Please complete the payment.');
      initiatePayment(appointmentId);
      return;
    }

    const response = await fetch(`http://localhost:8080/api/video-calls/appointment/${appointmentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
      }
      throw new Error(errorText || 'Failed to start video call');
    }

    const videoCallData = await response.json();
    if (!videoCallData.roomId) {
      throw new Error('Invalid video call data');
    }

    currentVideoCallId = videoCallData.videoCallId;
    await initJitsiMeet(videoCallData.roomId);

    const videoCallModal = new bootstrap.Modal(document.getElementById('videoCallModal'));
    videoCallModal.show();
  } catch (error) {
    console.error('Error starting video call:', error);
    alert(`Failed to start video call: ${error.message}`);
  }
}

async function initJitsiMeet(roomId) {
  if (!roomId) {
    throw new Error('Missing room ID');
  }

  const container = document.getElementById('video-call-container');
  if (!container) {
    throw new Error('Video call container not found');
  }

  container.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://meet.jit.si/external_api.js';
  script.async = true;
  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = () => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        width: '100%',
        height: 600,
        parentNode: container,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true
        },
        userInfo: {
          displayName: currentUser ? currentUser.name : 'Patient'
        }
      };

      jitsiApi = new JitsiMeetExternalAPI(domain, options);
      jitsiApi.addEventListener('participantLeft', () => {
        endVideoCall();
      });
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Jitsi API'));
  });
}

async function endVideoCall() {
  try {
    if (jitsiApi) {
      jitsiApi.dispose();
      jitsiApi = null;
    }
    if (currentVideoCallId) {
      await fetch(`http://localhost:8080/api/video-calls/${currentVideoCallId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify('ENDED')
      });
    }
  } catch (error) {
    console.error('Error ending call:', error);
  } finally {
    currentAppointmentId = null;
    currentVideoCallId = null;
    const container = document.getElementById('video-call-container');
    if (container) container.innerHTML = '';
    const scripts = document.querySelectorAll('script[src="https://meet.jit.si/external_api.js"]');
    scripts.forEach(script => script.remove());
  }
}
