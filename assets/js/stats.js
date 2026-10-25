document.addEventListener('DOMContentLoaded', loadStats);

async function loadStats() {
  try {
    const response = await fetch('http://localhost:8080/analytics/doctor');
    if (response.ok) {
      const stats = await response.json();
      document.getElementById('doctors-count').setAttribute('data-purecounter-end', stats.doctors);
      document.getElementById('patients-count').setAttribute('data-purecounter-end', stats.patients);
      document.getElementById('appointments-count').setAttribute('data-purecounter-end', stats.appointments);
      document.getElementById('prescriptions-count').setAttribute('data-purecounter-end', stats.prescriptions);
      new PureCounter();
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
