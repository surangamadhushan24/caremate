document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('appointment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (currentUser) {
      createAppointment();
    } else {
      bootstrap.Modal.getInstance(document.getElementById('loginModal')).show();
    }
  });
});

async function createAppointment() {
  const form = document.getElementById('appointment-form');
  const formData = new FormData(form);

  const appointmentData = {
    doctorId: formData.get('doctor'),
    date: formData.get('date'),
    symptoms: formData.get('symptoms')
  };

  try {
    const response = await fetch('http://localhost:8080/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(appointmentData)
    });

    if (response.ok) {
      const appointment = await response.json();
      form.reset();
      document.querySelector('.sent-message').style.display = 'block';
      if (appointment.requiresPayment) {
        initiatePayment(appointment.id);
      }
    } else {
      const error = await response.json();
      document.querySelector('.error-message').textContent = error.message || 'Failed to create appointment';
      document.querySelector('.error-message').style.display = 'block';
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    document.querySelector('.error-message').textContent = 'An error occurred while creating appointment';
    document.querySelector('.error-message').style.display = 'block';
  }
}
