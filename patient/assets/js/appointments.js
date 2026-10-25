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
