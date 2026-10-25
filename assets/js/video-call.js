let zegoCloudEngine = null;
let currentAppointmentId = null;

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('end-call').addEventListener('click', function () {
    endVideoCall();
    bootstrap.Modal.getInstance(document.getElementById('videoCallModal')).hide();
  });
});

async function startVideoCall(appointmentId) {
  currentAppointmentId = appointmentId;

  try {
    const response = await fetch(`http://localhost:8080/api/videocalls/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        appointmentId: appointmentId
      })
    });

    if (response.ok) {
      const videoCallData = await response.json();
      zegoCloudEngine = await initZegoCloud(videoCallData.token, videoCallData.roomId);
      const videoCallModal = new bootstrap.Modal(document.getElementById('videoCallModal'));
      videoCallModal.show();
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to start video call');
    }
  } catch (error) {
    console.error('Error starting video call:', error);
    alert('An error occurred while starting video call');
  }
}

async function initZegoCloud(token, roomId) {
  const engine = new ZegoExpressEngine(appID, server);
  await engine.loginRoom(roomId, token, { userID: currentUser ? currentUser.id : 'guest', userName: currentUser ? currentUser.name : 'Guest' });
  const localStream = await engine.createStream();
  const localVideoElement = document.getElementById('local-video');
  localVideoElement.srcObject = localStream;
  await engine.startPublishingStream(localStream.streamID);

  engine.on('roomStreamUpdate', (roomID, updateType, streamList) => {
    if (updateType === 'ADD') {
      const remoteVideoElement = document.getElementById('remote-video');
      engine.startPlayingStream(streamList[0].streamID).then(mediaStream => {
        remoteVideoElement.srcObject = mediaStream;
      });
    }
  });

  return engine;
}

async function endVideoCall() {
  if (zegoCloudEngine) {
    await zegoCloudEngine.logoutRoom();
    zegoCloudEngine.destroy();
    zegoCloudEngine = null;
  }

  try {
    await fetch(`http://localhost:8080/api/videocalls/${currentAppointmentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        status: 'COMPLETED'
      })
    });
  } catch (error) {
    console.error('Error updating call status:', error);
  }

  currentAppointmentId = null;
}
