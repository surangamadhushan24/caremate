function displayAppointments(appointments) {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const todaysAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate >= todayStart && appointmentDate <= todayEnd;
    });

    const upcomingAppointments = appointments.filter(a => new Date(a.date) > now);
    const pastAppointments = appointments.filter(a => new Date(a.date) <= now);

    // Update counts
    document.getElementById('todays-appointments-count').textContent = todaysAppointments.length;

    // Display today's appointments in dashboard
    const dashboardTable = document.getElementById('upcoming-appointments');
    dashboardTable.innerHTML = '';

    todaysAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleTimeString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start Call</button>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        dashboardTable.appendChild(row);
    });

    // Display upcoming appointments in appointments section
    const upcomingTable = document.getElementById('upcoming-appointments-list');
    upcomingTable.innerHTML = '';

    upcomingAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td><span class="badge bg-success">Confirmed</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start Call</button>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        upcomingTable.appendChild(row);
    });

    // Display past appointments in appointments section
    const pastTable = document.getElementById('past-appointments-list');
    pastTable.innerHTML = '';

    pastAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(appointment.date).toLocaleString()}</td>
            <td>${appointment.patient.name}</td>
            <td>${appointment.symptoms || 'Not specified'}</td>
            <td>${appointment.type || 'Regular'}</td>
            <td><span class="badge bg-secondary">Completed</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
            </td>
        `;
        pastTable.appendChild(row);
    });

    // Populate appointment dropdown in prescription form
    const appointmentSelect = document.getElementById('prescription-appointment');
    appointmentSelect.innerHTML = '<option value="">Select Appointment</option>';
    appointments.forEach(appointment => {
        const option = document.createElement('option');
        option.value = appointment.id;
        option.textContent = `${appointment.patient.name} - ${new Date(appointment.date).toLocaleString()}`;
        appointmentSelect.appendChild(option);
    });
}
