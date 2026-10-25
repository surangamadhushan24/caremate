document.addEventListener('DOMContentLoaded', function () {
  loadDoctors();

  document.getElementById('specialty').addEventListener('change', function () {
    const specialty = this.value;
    if (specialty) {
      loadDoctorsBySpecialty(specialty);
    }
  });
});

async function loadDoctors() {
  try {
    const response = await fetch('http://localhost:8080/doctors');
    if (response.ok) {
      const doctors = await response.json();
      displayDoctors(doctors);
    }
  } catch (error) {
    console.error('Error loading doctors:', error);
  }
}

async function loadDoctorsBySpecialty(specialty) {
  try {
    const response = await fetch(`http://localhost:8080/doctors?specialty=${specialty}`);
    if (response.ok) {
      const doctors = await response.json();
      const doctorSelect = document.getElementById('doctor');
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';

      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty} (${doctor.availability})`;
        doctorSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading doctors by specialty:', error);
  }
}

function displayDoctors(doctors) {
  const doctorsList = document.getElementById('doctors-list');
  doctorsList.innerHTML = '';

  doctors.forEach((doctor, index) => {
    const doctorElement = document.createElement('div');
    doctorElement.className = 'col-lg-6';
    doctorElement.innerHTML = `
      <div class="team-member d-flex align-items-start" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
        <div class="pic"><img src="${doctor.image || 'assets/img/doctors/doctor-default.jpg'}" class="img-fluid" alt=""></div>
        <div class="member-info">
          <h4>${doctor.name}</h4>
          <span>${doctor.specialty}</span>
          <p>${doctor.bio || 'Specialized in ' + doctor.specialty}</p>
          <p><strong>Availability:</strong> ${doctor.availability}</p>
          ${doctor.verified ? '<span class="badge bg-success">Verified</span>' : '<span class="badge bg-warning">Pending Verification</span>'}
          <div class="social mt-2">
            <a href="#appointment" class="btn btn-sm btn-primary">Book Appointment</a>
            ${currentUser && currentUser.role === 'PATIENT' ? `<button class="btn btn-sm btn-success ms-2" onclick="startVideoCall('${doctor.id}')">Video Consult</button>` : ''}
          </div>
        </div>
      </div>
    `;
    doctorsList.appendChild(doctorElement);
  });
}
