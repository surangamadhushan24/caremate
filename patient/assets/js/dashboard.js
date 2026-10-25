/* global bootstrap, JitsiMeetExternalAPI */
let currentUser = null;
document.addEventListener('DOMContentLoaded', function () {
  checkAuthStatus();
  loadDashboardData();

  document.getElementById('logout-btn').addEventListener('click', function (e) {
    e.preventDefault();
    logout();
  });

  document.getElementById('change-password-btn').addEventListener('click', function () {
    const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    changePasswordModal.show();
  });

  document.getElementById('appointment-specialty').addEventListener('change', function () {
    const specialty = this.value;
    if (specialty) {
      loadDoctorsBySpecialty(specialty);
    }
  });

  document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    updateProfile();
  });

  document.getElementById('health-info-form').addEventListener('submit', function (e) {
    e.preventDefault();
    updateHealthInfo();
  });

  document.getElementById('new-appointment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    createAppointment();
  });

  document.getElementById('change-password-form').addEventListener('submit', function (e) {
    e.preventDefault();
    changePassword();
  });

  document.getElementById('retry-payment-btn').addEventListener('click', function () {
    if (pendingAppointmentId) {
      initiatePayment(pendingAppointmentId);
    }
  });

  document.getElementById('videoCallModal').addEventListener('hidden.bs.modal', function () {
    endVideoCall();
  });

  // Check for payment status in URL parameters (after PayHere redirect)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment_status')) {
    handlePaymentRedirect();
  }
});

async function loadDashboardData() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const [appointmentsRes, prescriptionsRes, profileRes] = await Promise.all([
      fetch('http://localhost:8080/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch('http://localhost:8080/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch('http://localhost:8080/patients/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    let appointments = [];
    let prescriptions = [];
    let profile = null;

    if (appointmentsRes.ok) {
      appointments = await appointmentsRes.json();
      displayAppointments(appointments);
    } else {
      console.error('Failed to fetch appointments:', appointmentsRes.status);
      document.getElementById('upcoming-appointments').innerHTML = `
        <tr><td colspan="6" class="text-center">Error loading appointments.</td></tr>
      `;
      document.getElementById('past-appointments').innerHTML = `
        <tr><td colspan="6" class="text-center">Error loading appointments.</td></tr>
      `;
    }

    if (prescriptionsRes.ok) {
      prescriptions = await prescriptionsRes.json();
      displayPrescriptions(prescriptions);
    } else {
      console.error('Failed to fetch prescriptions:', prescriptionsRes.status);
      document.getElementById('prescriptions-list').innerHTML = `
        <tr><td colspan="5" class="text-center">Error loading prescriptions.</td></tr>
      `;
    }

    if (profileRes.ok) {
      profile = await profileRes.json();
      displayProfile(profile);
    } else {
      console.error('Failed to fetch profile:', profileRes.status);
      document.getElementById('profile-name').textContent = 'Error loading profile';
    }

    displayRecentActivities(appointments, prescriptions);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    document.getElementById('recent-activity').innerHTML = `
      <tr>
        <td colspan="4" class="text-center">Error loading recent activities.</td>
      </tr>
    `;
  }
}

function displayRecentActivities(appointments, prescriptions) {
  const activityTable = document.getElementById('recent-activity');
  activityTable.innerHTML = '';

  const activities = [
    ...appointments.map(appointment => ({
      id: appointment.id,
      date: new Date(appointment.date),
      type: 'Appointment',
      description: `Appointment with Dr. ${appointment.doctor?.name || 'Unknown'} (${appointment.doctor?.specialty || 'N/A'})`,
      status: new Date(appointment.date) > new Date() ? 'Upcoming' : 'Completed',
      action: `<button class="btn btn-sm btn-info" onclick="viewAppointmentDetails(${appointment.id})">View Details</button>`
    })),
    ...prescriptions.map(prescription => ({
      id: prescription.id,
      date: new Date(prescription.createdAt),
      type: 'Prescription',
      description: `Prescription for ${prescription.medication || 'Medication'} by Dr. ${prescription.appointment?.doctor?.name || 'Unknown'}`,
      status: 'Active',
      action: `<button class="btn btn-sm btn-info" onclick="viewPrescriptionDetails(${prescription.id})">View Details</button>`
    }))
  ];

  activities.sort((a, b) => b.date - a.date);
  const recentActivities = activities.slice(0, 5);

  recentActivities.forEach(activity => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${activity.date.toLocaleDateString()}</td>
      <td>${activity.description}</td>
      <td><span class="badge bg-${activity.status === 'Upcoming' ? 'warning' : activity.status === 'Completed' ? 'secondary' : 'success'}">${activity.status}</span></td>
      <td>${activity.action}</td>
    `;
    activityTable.appendChild(row);
  });

  if (recentActivities.length === 0) {
    activityTable.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">No recent activities found.</td>
      </tr>
    `;
  }
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
