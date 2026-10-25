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

function viewPatientDetails(patientId) {
    alert(`Viewing details for patient ${patientId}`);
}

function messagePatient(patientId) {
    alert(`Messaging patient ${patientId}`);
}
