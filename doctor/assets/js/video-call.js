let jitsiApi = null;
let currentAppointmentId = null;
let currentVideoCallId = null;

async function startVideoCall(appointmentId) {
    currentAppointmentId = appointmentId;
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please log in again.');
        }

        // Check WebRTC support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('WebRTC is not supported in this browser.');
        }

        // Request video call creation
        const response = await fetch('http://localhost:8080/api/video-calls/appointment/' + appointmentId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: Failed to create video call`);
        }

        const videoCallData = await response.json();
        if (!videoCallData.roomId) {
            throw new Error('Invalid video call data received from server');
        }

        currentVideoCallId = videoCallData.videoCallId;

        // Initialize Jitsi Meet
        await initJitsiMeet(videoCallData.roomId);

        // Show video call modal
        const videoCallModal = new bootstrap.Modal(document.getElementById('videoCallModal'));
        videoCallModal.show();

    } catch (error) {
        console.error('Error starting video call:', error);
        alert(`Failed to start video call: ${error.message}`);
    }
}

async function initJitsiMeet(roomId) {
    try {
        if (!roomId) {
            throw new Error('Missing required parameter: roomId');
        }

        const container = document.querySelector("#video-call-container");
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
                try {
                    const domain = 'meet.jit.si';
                    const options = {
                        roomName: roomId,
                        width: '100%',
                        height: 600,
                        parentNode: container,
                        configOverwrite: {
                            startWithAudioMuted: true,
                            startWithVideoMuted: true,
                        },
                        interfaceConfigOverwrite: {
                            TOOLBAR_BUTTONS: [
                                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                                'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                                'tileview', 'download', 'help', 'mute-everyone', 'security'
                            ],
                        },
                        userInfo: {
                            displayName: currentUser ? currentUser.name : 'Doctor'
                        }
                    };

                    jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

                    jitsiApi.addEventListener('participantLeft', () => {
                        endVideoCall();
                    });

                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            script.onerror = () => {
                reject(new Error('Failed to load Jitsi Meet External API'));
            };
        });
    } catch (error) {
        console.error('Jitsi Meet initialization error:', error);
        throw error;
    }
}

async function endVideoCall() {
    try {
        if (jitsiApi) {
            jitsiApi.dispose();
            jitsiApi = null;
        }
        if (currentVideoCallId) {
            const response = await fetch(`http://localhost:8080/api/video-calls/${currentVideoCallId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify('ENDED')
            });
            if (!response.ok) {
                throw new Error('Failed to update call status');
            }
        }
    } catch (error) {
        console.error('Error ending call:', error);
    } finally {
        currentAppointmentId = null;
        currentVideoCallId = null;
        const container = document.querySelector("#video-call-container");
        if (container) container.innerHTML = '';
        const scripts = document.querySelectorAll('script[src="https://meet.jit.si/external_api.js"]');
        scripts.forEach(script => script.remove());
    }
}

// Prescription Functions
