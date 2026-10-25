// Global variables
let currentUser = null;
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
