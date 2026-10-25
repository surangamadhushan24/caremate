// Global variables
let currentUser = null;
let jitsiApi = null;
let currentAppointmentId = null;
let currentVideoCallId = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    checkAuthStatus();

    // Load dashboard data
    loadDashboardData();

    // Event listeners
    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        logout();
    });

    document.getElementById('change-password-btn').addEventListener('click', function () {
        const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        changePasswordModal.show();
    });

    // Form submissions
    document.getElementById('profile-form').addEventListener('submit', function (e) {
        e.preventDefault();
        updateProfile();
    });

    document.getElementById('new-prescription-form').addEventListener('submit', function (e) {
        e.preventDefault();
        createPrescription();
    });

    document.getElementById('prescription-form').addEventListener('submit', function (e) {
        e.preventDefault();
        createPrescriptionFromModal();
    });

    document.getElementById('availability-form').addEventListener('submit', function (e) {
        e.preventDefault();
        updateAvailability();
    });

    document.getElementById('change-password-form').addEventListener('submit', function (e) {
        e.preventDefault();
        changePassword();
    });

    // Toggle weekend availability inputs
    document.getElementById('saturday-check').addEventListener('change', function () {
        document.getElementById('saturday-start').disabled = !this.checked;
        document.getElementById('saturday-end').disabled = !this.checked;
    });

    document.getElementById('sunday-check').addEventListener('change', function () {
        document.getElementById('sunday-start').disabled = !this.checked;
        document.getElementById('sunday-end').disabled = !this.checked;
    });

    // Handle video call modal close
    document.getElementById('videoCallModal').addEventListener('hidden.bs.modal', function () {
        endVideoCall();
    });
});

// API Functions
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to access the dashboard.');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            if (user.role.toUpperCase() !== 'DOCTOR') {
                window.location.href = `/${user.role.toLowerCase()}/dashboard.html`;
                return;
            }
            currentUser = user;
            updateUIForLoggedInUser(user);
        } else {
            alert('Authentication failed. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        alert('Error verifying authentication. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
}

async function loadDashboardData() {
    try {
        const [appointmentsRes, patientsRes, prescriptionsRes, profileRes] = await Promise.all([
            fetch('http://localhost:8080/appointments/doctor', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch('http://localhost:8080/patients', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch('http://localhost:8080/prescriptions/doctor', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch('http://localhost:8080/doctors/me', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
        ]);

        if (appointmentsRes.ok) {
            const appointments = await appointmentsRes.json();
            displayAppointments(appointments);
        } else {
            console.error('Failed to load appointments:', await appointmentsRes.text());
        }

        if (patientsRes.ok) {
            const patients = await patientsRes.json();
            displayPatients(patients);
        } else {
            console.error('Failed to load patients:', await patientsRes.text());
        }

        if (prescriptionsRes.ok) {
            const prescriptions = await prescriptionsRes.json();
            displayPrescriptions(prescriptions);
        } else {
            console.error('Failed to load prescriptions:', await prescriptionsRes.text());
        }

        if (profileRes.ok) {
            const profile = await profileRes.json();
            displayProfile(profile);
        } else {
            console.error('Failed to load profile:', await profileRes.text());
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Please try again.');
    }
}

async function updateProfile() {
    const formData = new FormData(document.getElementById('profile-form'));

    const profileData = {
        name: `${formData.get('profile-first-name')} ${formData.get('profile-last-name')}`.trim(),
        email: formData.get('profile-email'),
        phone: formData.get('profile-phone'),
        specialty: formData.get('profile-specialty'),
        yearsOfExperience: parseInt(formData.get('profile-years')) || 0,
        bio: formData.get('profile-bio'),
        education: formData.get('profile-education')
    };

    try {
        const response = await fetch('http://localhost:8080/doctors/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const updatedProfile = await response.json();
            alert('Profile updated successfully!');
            displayProfile(updatedProfile);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
}

async function createPrescription() {
    const formData = new FormData(document.getElementById('new-prescription-form'));

    const prescriptionData = {
        appointmentId: parseInt(formData.get('appointment')) || null,
        medication: formData.get('medication'),
        dosage: formData.get('dosage'),
        frequency: formData.get('frequency'),
        duration: formData.get('duration'),
        refills: parseInt(formData.get('refills')) || 0,
        instructions: formData.get('instructions'),
        notes: formData.get('notes')
    };

    try {
        const response = await fetch('http://localhost:8080/prescriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(prescriptionData)
        });

        if (response.ok) {
            alert('Prescription created successfully!');
            document.getElementById('new-prescription-form').reset();
            loadDashboardData();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create prescription');
        }
    } catch (error) {
        console.error('Error creating prescription:', error);
        alert('An error occurred while creating prescription');
    }
}

async function createPrescriptionFromModal() {
    const formData = new FormData(document.getElementById('prescription-form'));

    const prescriptionData = {
        appointmentId: parseInt(formData.get('appointmentId')),
        medication: formData.get('medication'),
        dosage: formData.get('dosage'),
        frequency: formData.get('frequency'),
        duration: formData.get('duration'),
        refills: parseInt(formData.get('refills')) || 0,
        instructions: formData.get('instructions'),
        notes: formData.get('notes')
    };

    try {
        const response = await fetch('http://localhost:8080/prescriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(prescriptionData)
        });

        if (response.ok) {
            alert('Prescription created successfully!');
            const prescriptionModal = bootstrap.Modal.getInstance(document.getElementById('prescriptionModal'));
            prescriptionModal.hide();
            document.getElementById('prescription-form').reset();
            loadDashboardData();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create prescription');
        }
    } catch (error) {
        console.error('Error creating prescription:', error);
        alert('An error occurred while creating prescription');
    }
}

async function updateAvailability() {
    const formData = new FormData(document.getElementById('availability-form'));

    const availabilityData = {
        schedule: {
            monday: {
                available: document.getElementById('monday-check').checked,
                startTime: formData.get('monday-start'),
                endTime: formData.get('monday-end')
            },
            tuesday: {
                available: document.getElementById('tuesday-check').checked,
                startTime: formData.get('tuesday-start'),
                endTime: formData.get('tuesday-end')
            },
            wednesday: {
                available: document.getElementById('wednesday-check').checked,
                startTime: formData.get('wednesday-start'),
                endTime: formData.get('wednesday-end')
            },
            thursday: {
                available: document.getElementById('thursday-check').checked,
                startTime: formData.get('thursday-start'),
                endTime: formData.get('thursday-end')
            },
            friday: {
                available: document.getElementById('friday-check').checked,
                startTime: formData.get('friday-start'),
                endTime: formData.get('friday-end')
            },
            saturday: {
                available: document.getElementById('saturday-check').checked,
                startTime: formData.get('saturday-start'),
                endTime: formData.get('saturday-end')
            },
            sunday: {
                available: document.getElementById('sunday-check').checked,
                startTime: formData.get('sunday-start'),
                endTime: formData.get('sunday-end')
            }
        },
        appointmentDuration: parseInt(formData.get('appointmentDuration'))
    };

    try {
        const response = await fetch('http://localhost:8080/doctors/availability', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(availabilityData)
        });

        if (response.ok) {
            alert('Availability updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update availability');
        }
    } catch (error) {
        console.error('Error updating availability:', error);
        alert('An error occurred while updating availability');
    }
}

async function changePassword() {
    const form = document.getElementById('change-password-form');
    const errorMessage = document.querySelector('#change-password-form .error-message');
    errorMessage.style.display = 'none';

    if (!form) {
        console.error('Change password form not found');
        errorMessage.textContent = 'Error: Form not found. Please try again.';
        errorMessage.style.display = 'block';
        return;
    }

    const formData = new FormData(form);
    const currentPassword = formData.get('current-password')?.trim();
    const newPassword = formData.get('new-password')?.trim();
    const confirmPassword = formData.get('confirm-password')?.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
        console.error('One or more password fields are empty or undefined');
        errorMessage.textContent = 'All password fields are required';
        errorMessage.style.display = 'block';
        return;
    }

    if (newPassword !== confirmPassword) {
        console.error('New passwords do not match');
        errorMessage.textContent = 'New passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    if (newPassword.length < 8) {
        console.error('New password is too short');
        errorMessage.textContent = 'New password must be at least 8 characters long';
        errorMessage.style.display = 'block';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        errorMessage.textContent = 'Session expired. Please log in again.';
        errorMessage.style.display = 'block';
        localStorage.removeItem('token');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });

        const contentType = response.headers.get('content-type');
        let errorMsg = 'Failed to change password';

        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMsg = error.message || errorMsg;
            } else {
                errorMsg = await response.text();
            }
            console.error('Change password error:', errorMsg);
            if (response.status === 401) {
                errorMessage.textContent = 'Session expired. Please log in again.';
                errorMessage.style.display = 'block';
                localStorage.removeItem('token');
                window.location.href = '/index.html';
                return;
            }
            if (errorMsg.includes('Current password is incorrect')) {
                errorMsg += '. Please verify your current password or try logging in again.';
            }
            errorMessage.textContent = errorMsg;
            errorMessage.style.display = 'block';
            return;
        }

        alert('Password changed successfully!');
        bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
        form.reset();
    } catch (error) {
        console.error('Error changing password:', error);
        errorMessage.textContent = 'Error changing password. Please try again.';
        errorMessage.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../index.html';
}

// UI Update Functions
function updateUIForLoggedInUser(user) {
    document.getElementById('doctor-name').textContent = user.name;
}

function displayAppointments(appointments) {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const todaysAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate >= todayStart && appointmentDate <= todayEnd;
    });

    const upcomingAppointments = appointments.filter(a => new Date(a.date) > now);
    const pastAppointments = appointments.filter(a => new Date(a.date) <= now);

    // Update counts
    document.getElementById('todays-appointments-count').textContent = todaysAppointments.length;

    // Display today's appointments in dashboard
    const dashboardTable = document.getElementById('upcoming-appointments');
    dashboardTable.innerHTML = '';

    todaysAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleTimeString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start Call</button>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        dashboardTable.appendChild(row);
    });

    // Display upcoming appointments in appointments section
    const upcomingTable = document.getElementById('upcoming-appointments-list');
    upcomingTable.innerHTML = '';

    upcomingAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td><span class="badge bg-success">Confirmed</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start Call</button>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        upcomingTable.appendChild(row);
    });

    // Display past appointments in appointments section
    const pastTable = document.getElementById('past-appointments-list');
    pastTable.innerHTML = '';

    pastAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td><span class="badge bg-secondary">Completed</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        pastTable.appendChild(row);
    });

    // Populate appointment dropdown in prescription form
    const appointmentSelect = document.getElementById('prescription-appointment');
    appointmentSelect.innerHTML = '<option value="">Select Appointment</option>';
    appointments.forEach(appointment => {
        const option = document.createElement('option');
        option.value = appointment.id;
        option.textContent = `${appointment.patient.name} - ${new Date(appointment.date).toLocaleString()}`;
        appointmentSelect.appendChild(option);
    });
}

function displayPatients(patients) {
    // Update count
    document.getElementById('patients-count').textContent = patients.length;

    // Display patients
    const patientsTable = document.getElementById('patients-list');
    patientsTable.innerHTML = '';

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age || 'N/A'}</td>
            <td>${patient.gender || 'N/A'}</td>
            <td>${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</td>
            <td>${patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatientDetails('${patient.id}')">View</button>
                <button class="btn btn-sm btn-success" onclick="messagePatient('${patient.id}')">Message</button>
            </td>
        `;
        patientsTable.appendChild(row);
    });

    // Populate patient dropdown in prescription form
    const patientSelect = document.getElementById('prescription-patient');
    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        patientSelect.appendChild(option);
    });
}

function displayPrescriptions(prescriptions) {
    // Update count
    document.getElementById('prescriptions-count').textContent = prescriptions.length;

    // Display prescriptions
    const prescriptionsTable = document.getElementById('active-prescriptions');
    prescriptionsTable.innerHTML = '';

    prescriptions.forEach(prescription => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(prescription.createdAt).toLocaleDateString()}</td>
            <td>${prescription.appointment.patient.name}</td>
            <td>${prescription.medication}</td>
            <td>${prescription.dosage}</td>
            <td>${prescription.refills || 0}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewPrescription('${prescription.id}')">View</button>
            </td>
        `;
        prescriptionsTable.appendChild(row);
    });
}

function displayProfile(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-specialty').textContent = profile.specialty || 'Not specified';

    // Split name into first and last
    const nameParts = profile.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Fill profile form
    document.getElementById('profile-first-name').value = firstName;
    document.getElementById('profile-last-name').value = lastName;
    document.getElementById('profile-email').value = profile.email;
    document.getElementById('profile-phone').value = profile.phone || '';
    document.getElementById('profile-specialty').value = profile.specialty || '';
    document.getElementById('profile-years').value = profile.yearsOfExperience || '';
    document.getElementById('profile-bio').value = profile.bio || '';
    document.getElementById('profile-education').value = profile.education || '';

    // Fill availability form if available
    if (profile.availability) {
        document.getElementById('monday-check').checked = profile.availability.schedule.monday.available;
        document.getElementById('monday-start').value = profile.availability.schedule.monday.startTime;
        document.getElementById('monday-end').value = profile.availability.schedule.monday.endTime;

        document.getElementById('tuesday-check').checked = profile.availability.schedule.tuesday.available;
        document.getElementById('tuesday-start').value = profile.availability.schedule.tuesday.startTime;
        document.getElementById('tuesday-end').value = profile.availability.schedule.tuesday.endTime;

        document.getElementById('wednesday-check').checked = profile.availability.schedule.wednesday.available;
        document.getElementById('wednesday-start').value = profile.availability.schedule.wednesday.startTime;
        document.getElementById('wednesday-end').value = profile.availability.schedule.wednesday.endTime;

        document.getElementById('thursday-check').checked = profile.availability.schedule.thursday.available;
        document.getElementById('thursday-start').value = profile.availability.schedule.thursday.startTime;
        document.getElementById('thursday-end').value = profile.availability.schedule.thursday.endTime;

        document.getElementById('friday-check').checked = profile.availability.schedule.friday.available;
        document.getElementById('friday-start').value = profile.availability.schedule.friday.startTime;
        document.getElementById('friday-end').value = profile.availability.schedule.friday.endTime;

        document.getElementById('saturday-check').checked = profile.availability.schedule.saturday.available;
        document.getElementById('saturday-start').value = profile.availability.schedule.saturday.startTime;
        document.getElementById('saturday-start').disabled = !profile.availability.schedule.saturday.available;
        document.getElementById('saturday-end').value = profile.availability.schedule.saturday.endTime;
        document.getElementById('saturday-end').disabled = !profile.availability.schedule.saturday.available;

        document.getElementById('sunday-check').checked = profile.availability.schedule.sunday.available;
        document.getElementById('sunday-start').value = profile.availability.schedule.sunday.startTime;
        document.getElementById('sunday-start').disabled = !profile.availability.schedule.sunday.available;
        document.getElementById('sunday-end').value = profile.availability.schedule.sunday.endTime;
        document.getElementById('sunday-end').disabled = !profile.availability.schedule.sunday.available;

        // Set appointment duration
        document.querySelector(`input[name="appointmentDuration"][value="${profile.availability.appointmentDuration}"]`).checked = true;
    }
}

// Video Call Functions
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
function showPrescriptionModal(appointmentId, patientName) {
    const prescriptionModal = new bootstrap.Modal(document.getElementById('prescriptionModal'));

    document.getElementById('prescription-patient-name').value = patientName;
    document.getElementById('prescription-date').valueAsDate = new Date();
    document.getElementById('prescription-appointment-id').value = appointmentId;

    prescriptionModal.show();
}

// Helper functions
function viewPatientDetails(patientId) {
    alert(`Viewing details for patient ${patientId}`);
}

function messagePatient(patientId) {
    alert(`Messaging patient ${patientId}`);
}

async function viewPrescription(prescriptionId) {
    try {
        const response = await fetch(`http://localhost:8080/prescriptions/${prescriptionId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
            const prescription = await response.json();
            alert(`Prescription Details:\nMedication: ${prescription.medication}\nDosage: ${prescription.dosage}\nFrequency: ${prescription.frequency}\nDuration: ${prescription.duration}\nRefills: ${prescription.refills}\nInstructions: ${prescription.instructions}\nNotes: ${prescription.notes}`);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to load prescription details');
        }
    } catch (error) {
        console.error('Error viewing prescription:', error);
        alert('An error occurred while viewing prescription');
    }
}
