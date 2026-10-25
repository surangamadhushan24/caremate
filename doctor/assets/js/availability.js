async function updateAvailability() {
    const formData = new FormData(document.getElementById('availability-form'));

    const availabilityData = {
        schedule: {
            monday: {
                available: document.getElementById('monday-check').checked,
                startTime: formData.get('monday-start'),
                endTime: formData.get('monday-end')
            },
            tuesday: {
                available: document.getElementById('tuesday-check').checked,
                startTime: formData.get('tuesday-start'),
                endTime: formData.get('tuesday-end')
            },
            wednesday: {
                available: document.getElementById('wednesday-check').checked,
                startTime: formData.get('wednesday-start'),
                endTime: formData.get('wednesday-end')
            },
            thursday: {
                available: document.getElementById('thursday-check').checked,
                startTime: formData.get('thursday-start'),
                endTime: formData.get('thursday-end')
            },
            friday: {
                available: document.getElementById('friday-check').checked,
                startTime: formData.get('friday-start'),
                endTime: formData.get('friday-end')
            },
            saturday: {
                available: document.getElementById('saturday-check').checked,
                startTime: formData.get('saturday-start'),
                endTime: formData.get('saturday-end')
            },
            sunday: {
                available: document.getElementById('sunday-check').checked,
                startTime: formData.get('sunday-start'),
                endTime: formData.get('sunday-end')
            }
        },
        appointmentDuration: parseInt(formData.get('appointmentDuration'))
    };

    try {
        const response = await fetch('http://localhost:8080/doctors/availability', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(availabilityData)
        });

        if (response.ok) {
            alert('Availability updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update availability');
        }
    } catch (error) {
        console.error('Error updating availability:', error);
        alert('An error occurred while updating availability');
    }
}
