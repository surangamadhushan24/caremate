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

function viewPrescriptionDetails(prescriptionId) {
  alert(`Viewing details for prescription ${prescriptionId}`);
}
