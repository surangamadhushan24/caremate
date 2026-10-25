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

function showPrescriptionModal(appointmentId, patientName) {
    const prescriptionModal = new bootstrap.Modal(document.getElementById('prescriptionModal'));

    document.getElementById('prescription-patient-name').value = patientName;
    document.getElementById('prescription-date').valueAsDate = new Date();
    document.getElementById('prescription-appointment-id').value = appointmentId;

    prescriptionModal.show();
}

// Helper functions

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
