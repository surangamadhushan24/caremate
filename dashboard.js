/* global bootstrap, JitsiMeetExternalAPI */
let currentUser = null;
let jitsiApi = null;
let currentAppointmentId = null;
let currentVideoCallId = null;
let pendingAppointmentId = null;

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
      if (user.role.toUpperCase() !== 'PATIENT') {
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

async function loadDoctorsBySpecialty(specialty) {
  try {
    const response = await fetch(`http://localhost:8080/doctors?specialty=${specialty}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (response.ok) {
      const doctors = await response.json();
      const doctorSelect = document.getElementById('appointment-doctor');
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty}`;
        doctorSelect.appendChild(option);
      });
    } else {
      console.error('Failed to fetch doctors:', response.status);
    }
  } catch (error) {
    console.error('Error loading doctors:', error);
  }
}

async function createAppointment() {
  const form = document.getElementById('new-appointment-form');
  const formData = new FormData(form);
  const errorMessage = document.querySelector('#new-appointment-form .error-message');
  const sentMessage = document.querySelector('#new-appointment-form .sent-message');
  const loading = document.querySelector('#new-appointment-form .loading');

  errorMessage.style.display = 'none';
  sentMessage.style.display = 'none';
  loading.style.display = 'block';

  const appointmentData = {
    doctorId: formData.get('doctor'),
    date: `${formData.get('date')}T${formData.get('time')}:00Z`,
    symptoms: formData.get('reason')
  };

  if (!appointmentData.doctorId) {
    errorMessage.textContent = 'Please select a doctor';
    errorMessage.style.display = 'block';
    loading.style.display = 'none';
    return;
  }

  if (!formData.get('date') || !formData.get('time')) {
    errorMessage.textContent = 'Please select a valid date and time';
    errorMessage.style.display = 'block';
    loading.style.display = 'none';
    return;
  }

  if (!formData.get('amount') || parseFloat(formData.get('amount')) <= 0) {
    errorMessage.textContent = 'Please enter a valid payment amount';
    errorMessage.style.display = 'block';
    loading.style.display = 'none';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(appointmentData)
    });

    loading.style.display = 'none';

    if (response.ok) {
      const appointment = await response.json();
      pendingAppointmentId = appointment.id;
      sentMessage.style.display = 'block';
      sentMessage.textContent = 'Appointment created. Please complete the payment to confirm.';
      initiatePayment(appointment.id, formData.get('amount'));
    } else {
      const error = await response.text(); // Use text() to handle non-JSON responses
      errorMessage.textContent = error || 'Failed to book appointment';
      errorMessage.style.display = 'block';
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
      }
    }
  } catch (error) {
    loading.style.display = 'none';
    errorMessage.textContent = 'Error booking appointment';
    errorMessage.style.display = 'block';
    console.error('Error creating appointment:', error);
  }
}

async function initiatePayment(appointmentId, amount) {
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const loading = document.getElementById('payment-loading');
  const success = document.getElementById('payment-success');
  const failed = document.getElementById('payment-failed');
  const retryBtn = document.getElementById('retry-payment-btn');
  const formContainer = document.getElementById('payment-form-container');

  loading.style.display = 'block';
  success.style.display = 'none';
  failed.style.display = 'none';
  retryBtn.style.display = 'none';
  formContainer.innerHTML = '';
  paymentModal.show();

  try {
    const profileResponse = await fetch('http://localhost:8080/patients/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profile = await profileResponse.json();

    // Relaxed validation: Only email and name are mandatory
    if (!profile.email || !profile.name) {
      alert('Please update your profile with email and name to proceed with payment.');
      paymentModal.hide();
      return;
    }

    // Provide default values for optional fields
    const paymentData = {
      appointmentId: appointmentId,
      amount: parseFloat(amount).toFixed(2),
      currency: 'LKR',
      returnUrl: `${window.location.origin}/patient/dashboard.html?payment_status=success`,
      cancelUrl: `${window.location.origin}/patient/dashboard.html?payment_status=cancelled`,
      notifyUrl: 'http://localhost:8080/api/payments/notify',
      firstName: profile.name.split(' ')[0] || 'Unknown',
      lastName: profile.name.split(' ').slice(1).join(' ') || 'Unknown',
      email: profile.email,
      phone: profile.phone || 'N/A',
      address: profile.address || 'N/A',
      city: profile.city || 'N/A',
      country: profile.country || 'N/A'
    };

    const response = await fetch('http://localhost:8080/api/payments/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });

    if (response.ok) {
      const paymentResponse = await response.json();
      loading.style.display = 'none';
      if (paymentResponse.status && paymentResponse.status.startsWith('ERROR')) {
        throw new Error(paymentResponse.status);
      }
      formContainer.innerHTML = `
        <form id="payhere-form" action="${paymentResponse.paymentUrl}" method="POST">
          ${Object.entries(paymentResponse)
            .map(([key, value]) => key !== 'paymentUrl' && key !== 'status' ? `<input type="hidden" name="${key}" value="${value}">` : '')
            .join('')}
        </form>
      `;
      document.getElementById('payhere-form').submit();
    } else {
      const error = await response.text(); // Use text() to handle non-JSON responses
      throw new Error(error || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    loading.style.display = 'none';
    failed.style.display = 'block';
    failed.innerHTML = `
      <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
      <p>${error.message || 'Failed to initiate payment. Please try again.'}</p>
    `;
    retryBtn.style.display = 'block';
  }
}

async function handlePaymentRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment_status');
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const loading = document.getElementById('payment-loading');
  const success = document.getElementById('payment-success');
  const failed = document.getElementById('payment-failed');
  const retryBtn = document.getElementById('retry-payment-btn');

  loading.style.display = 'none';
  success.style.display = 'none';
  failed.style.display = 'none';
  retryBtn.style.display = 'none';
  paymentModal.show();

  if (paymentStatus === 'success' && pendingAppointmentId) {
    try {
      const paymentResponse = await fetch(`http://localhost:8080/api/payments/${pendingAppointmentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        if (payment.status === 'COMPLETED') {
          await fetch(`http://localhost:8080/appointments/${pendingAppointmentId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify('CONFIRMED')
          });
          success.style.display = 'block';
          success.innerHTML = `
            <i class="bi bi-check-circle-fill" style="font-size: 2rem;"></i>
            <p>Payment successful! Your appointment is confirmed.</p>
          `;
          await loadDashboardData();
          pendingAppointmentId = null;
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => paymentModal.hide(), 3000);
        } else {
          throw new Error('Payment not completed');
        }
      } else {
        throw new Error('Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      failed.style.display = 'block';
      retryBtn.style.display = 'block';
      failed.innerHTML = `
        <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
        <p>Payment verification failed: ${error.message}. Please try again.</p>
      `;
    }
  } else if (paymentStatus === 'cancelled') {
    try {
      if (pendingAppointmentId) {
        await fetch(`http://localhost:8080/appointments/${pendingAppointmentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify('CANCELLED')
        });
      }
      failed.style.display = 'block';
      retryBtn.style.display = 'block';
      failed.innerHTML = `
        <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
        <p>Payment was cancelled. Please try again.</p>
      `;
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      failed.style.display = 'block';
      retryBtn.style.display = 'block';
      failed.innerHTML = `
        <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
        <p>Error processing cancellation: ${error.message}. Please try again.</p>
      `;
    }
  }
}

async function updateProfile() {
  const form = document.getElementById('profile-form');
  const formData = new FormData(form);

  const profileData = {
    name: `${formData.get('profile-first-name')} ${formData.get('profile-last-name')}`.trim(),
    email: formData.get('profile-email') || null,
    phone: formData.get('profile-phone') || null,
    age: formData.get('profile-dob') ? calculateAge(formData.get('profile-dob')) : null,
    gender: formData.get('profile-gender') || null,
    address: formData.get('profile-address') || null,
    city: formData.get('profile-city') || null,
    country: formData.get('profile-country') || null
  };

  try {
    const response = await fetch('http://localhost:8080/patients/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      let updatedProfile = {};
      if (contentType && contentType.includes('application/json')) {
        updatedProfile = await response.json();
      } else {
        console.warn('Non-JSON response received:', await response.text());
      }
      alert('Profile updated successfully!');
      displayProfile(updatedProfile);
    } else {
      const errorText = await response.text();
      console.error('Failed to update profile:', errorText);
      alert(errorText || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile: ' + error.message);
  }
}

async function updateHealthInfo() {
  const form = document.getElementById('health-info-form');
  const formData = new FormData(form);

  const healthData = {
    bloodType: formData.get('health-blood-type') || null,
    height: formData.get('health-height') ? parseInt(formData.get('health-height')) : null,
    weight: formData.get('health-weight') ? parseInt(formData.get('health-weight')) : null,
    symptoms: [
      formData.get('health-allergies') || '',
      formData.get('health-conditions') || '',
      formData.get('health-medications') || ''
    ].filter(Boolean).join('; ') || null
  };

  try {
    const response = await fetch('http://localhost:8080/patients/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(healthData)
    });

    if (response.ok) {
      alert('Health information updated successfully!');
      await loadDashboardData(); // Refresh profile data
    } else {
      const errorText = await response.text();
      alert(errorText || 'Failed to update health information');
    }
  } catch (error) {
    console.error('Error updating health information:', error);
    alert('Error updating health information: ' + error.message);
  }
}

async function changePassword() {
  const form = document.getElementById('change-password-form');
  const errorMessage = document.querySelector('#change-password-form .error-message');
  errorMessage.style.display = 'none';

  const formData = new FormData(form);
  const currentPassword = formData.get('current-password')?.trim();
  const newPassword = formData.get('new-password')?.trim();
  const confirmPassword = formData.get('confirm-password')?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    errorMessage.textContent = 'All password fields are required';
    errorMessage.style.display = 'block';
    return;
  }
  if (newPassword !== confirmPassword) {
    errorMessage.textContent = 'New passwords do not match';
    errorMessage.style.display = 'block';
    return;
  }
  if (newPassword.length < 8) {
    errorMessage.textContent = 'New password must be at least 8 characters long';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });

    if (!response.ok) {
      const errorText = await response.text();
      errorMessage.textContent = errorText || 'Failed to change password';
      errorMessage.style.display = 'block';
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
      }
      return;
    }

    alert('Password changed successfully!');
    bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
    form.reset();
  } catch (error) {
    console.error('Error changing password:', error);
    errorMessage.textContent = 'Error changing password: ' + error.message;
    errorMessage.style.display = 'block';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
}

function updateUIForLoggedInUser(user) {
  document.getElementById('patient-name').textContent = user.name || 'Patient';
}

function displayAppointments(appointments) {
  const now = new Date();
  const upcomingAppointments = appointments.filter(a => new Date(a.date) > now);
  const pastAppointments = appointments.filter(a => new Date(a.date) <= now);

  document.getElementById('upcoming-appointments-count').textContent = upcomingAppointments.length;
  document.getElementById('video-consultations-count').textContent = upcomingAppointments.filter(a => a.meetingLink).length;

  const upcomingTable = document.getElementById('upcoming-appointments');
  upcomingTable.innerHTML = '';

  upcomingAppointments.forEach(async appointment => {
    if (!appointment.id) {
      console.warn('Missing appointment ID:', appointment);
      return;
    }
    let paymentStatus = 'N/A';
    try {
      const paymentResponse = await fetch(`http://localhost:8080/api/payments/${appointment.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        paymentStatus = payment.status || 'PENDING';
      } else if (paymentResponse.status === 404) {
        paymentStatus = 'NOT_FOUND';
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      paymentStatus = 'ERROR';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(appointment.date).toLocaleString()}</td>
      <td>${appointment.doctor?.name || 'Unknown'}</td>
      <td>${appointment.doctor?.specialty || 'N/A'}</td>
      <td><span class="badge bg-${appointment.status === 'CONFIRMED' ? 'success' : 'warning'}">${appointment.status}</span></td>
      <td><span class="badge bg-${paymentStatus === 'COMPLETED' ? 'success' : paymentStatus === 'PENDING' ? 'warning' : paymentStatus === 'NOT_FOUND' ? 'secondary' : 'danger'}">${paymentStatus}</span></td>
      <td>
        ${appointment.meetingLink && paymentStatus === 'COMPLETED' ? `<button class="btn btn-sm btn-primary" onclick="startVideoCall(${appointment.id})">Start Video</button>` : ''}
        ${paymentStatus !== 'COMPLETED' && paymentStatus !== 'NOT_FOUND' ? `<button class="btn btn-sm btn-warning" onclick="initiatePayment(${appointment.id})">Pay Now</button>` : ''}
        <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${appointment.id})">Cancel</button>
      </td>
    `;
    upcomingTable.appendChild(row);
  });

  const pastTable = document.getElementById('past-appointments');
  pastTable.innerHTML = '';

  pastAppointments.forEach(async appointment => {
    if (!appointment.id) {
      console.warn('Missing appointment ID:', appointment);
      return;
    }
    let paymentStatus = 'N/A';
    try {
      const paymentResponse = await fetch(`http://localhost:8080/api/payments/${appointment.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        paymentStatus = payment.status || 'PENDING';
      } else if (paymentResponse.status === 404) {
        paymentStatus = 'NOT_FOUND';
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      paymentStatus = 'ERROR';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(appointment.date).toLocaleString()}</td>
      <td>${appointment.doctor?.name || 'Unknown'}</td>
      <td>${appointment.doctor?.specialty || 'N/A'}</td>
      <td><span class="badge bg-secondary">${appointment.status}</span></td>
      <td><span class="badge bg-${paymentStatus === 'COMPLETED' ? 'success' : paymentStatus === 'PENDING' ? 'warning' : paymentStatus === 'NOT_FOUND' ? 'secondary' : 'danger'}">${paymentStatus}</span></td>
      <td>
        <button class="btn btn-sm btn-info" onclick="viewAppointmentDetails(${appointment.id})">Details</button>
      </td>
    `;
    pastTable.appendChild(row);
  });
}

function displayPrescriptions(prescriptions) {
  document.getElementById('prescriptions-count').textContent = prescriptions.length;

  const prescriptionsTable = document.getElementById('prescriptions-list');
  prescriptionsTable.innerHTML = '';

  prescriptions.forEach(prescription => {
    if (!prescription.appointment || !prescription.appointment.doctor) {
      console.warn('Incomplete prescription data:', prescription);
      return;
    }
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(prescription.createdAt).toLocaleDateString()}</td>
      <td>${prescription.appointment.doctor.name}</td>
      <td>${prescription.medication || 'N/A'}</td>
      <td>${prescription.dosage || 'N/A'}</td>
      <td>${prescription.instructions}</td>
      <td><span class="badge bg-success">Active</span></td>
    `;
    prescriptionsTable.appendChild(row);
  });

  if (prescriptions.length === 0) {
    prescriptionsTable.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No prescriptions found.</td>
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

function viewPrescriptionDetails(prescriptionId) {
  alert(`Viewing details for prescription ${prescriptionId}`);
}

function displayProfile(profile) {
  document.getElementById('profile-name').textContent = profile.name || 'Patient';
  const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'bloodType', 'height', 'weight', 'city', 'country'];
  const filledFields = fields.filter(field => profile[field] && profile[field] !== '').length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);
  document.getElementById('profile-completion').textContent = `${completionPercentage}%`;

  const nameParts = (profile.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  document.getElementById('profile-first-name').value = firstName;
  document.getElementById('profile-last-name').value = lastName;
  document.getElementById('profile-email').value = profile.email || '';
  document.getElementById('profile-phone').value = profile.phone || '';
  document.getElementById('profile-dob').value = profile.age ? new Date(new Date().getFullYear() - profile.age, 0, 1).toISOString().split('T')[0] : '';
  document.getElementById('profile-gender').value = profile.gender || '';
  document.getElementById('profile-address').value = profile.address || '';
  document.getElementById('profile-city').value = profile.city || '';
  document.getElementById('profile-country').value = profile.country || '';

  document.getElementById('health-blood-type').value = profile.bloodType || '';
  document.getElementById('health-height').value = profile.height || '';
  document.getElementById('health-weight').value = profile.weight || '';
  document.getElementById('health-allergies').value = profile.symptoms ? profile.symptoms.split('; ')[0] || '' : '';
  document.getElementById('health-conditions').value = profile.symptoms ? profile.symptoms.split('; ')[1] || '' : '';
  document.getElementById('health-medications').value = profile.symptoms ? profile.symptoms.split('; ')[2] || '' : '';
}

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

async function cancelAppointment(appointmentId) {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    try {
      const response = await fetch(`http://localhost:8080/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify('CANCELLED')
      });

      if (response.ok) {
        alert('Appointment cancelled successfully');
        loadDashboardData();
      } else {
        const errorText = await response.text();
        alert(errorText || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment: ' + error.message);
    }
  }
}

function viewAppointmentDetails(appointmentId) {
  alert(`Viewing details for appointment ${appointmentId}`);
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