async function updateProfile() {
    const formData = new FormData(document.getElementById('profile-form'));

    const profileData = {
        name: `${formData.get('profile-first-name')} ${formData.get('profile-last-name')}`.trim(),
        email: formData.get('profile-email'),
        phone: formData.get('profile-phone'),
        specialty: formData.get('profile-specialty'),
        yearsOfExperience: parseInt(formData.get('profile-years')) || 0,
        bio: formData.get('profile-bio'),
        education: formData.get('profile-education')
    };

    try {
        const response = await fetch('http://localhost:8080/doctors/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const updatedProfile = await response.json();
            alert('Profile updated successfully!');
            displayProfile(updatedProfile);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
}

function displayProfile(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-specialty').textContent = profile.specialty || 'Not specified';

    // Split name into first and last
    const nameParts = profile.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Fill profile form
    document.getElementById('profile-first-name').value = firstName;
    document.getElementById('profile-last-name').value = lastName;
    document.getElementById('profile-email').value = profile.email;
    document.getElementById('profile-phone').value = profile.phone || '';
    document.getElementById('profile-specialty').value = profile.specialty || '';
    document.getElementById('profile-years').value = profile.yearsOfExperience || '';
    document.getElementById('profile-bio').value = profile.bio || '';
    document.getElementById('profile-education').value = profile.education || '';

    // The API exposes availability as a string; older responses may already be objects.
    let availability = profile.availability;
    if (typeof availability === 'string') {
        try {
            availability = JSON.parse(availability);
        } catch (error) {
            console.error('Failed to parse doctor availability:', error);
            availability = null;
        }
    }

    const schedule = availability?.schedule;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (schedule && days.every(day => schedule[day] && typeof schedule[day] === 'object')) {
        days.forEach(day => {
            const dayAvailability = schedule[day];
            document.getElementById(`${day}-check`).checked = dayAvailability.available;
            document.getElementById(`${day}-start`).value = dayAvailability.startTime || '';
            document.getElementById(`${day}-end`).value = dayAvailability.endTime || '';
        });

        ['saturday', 'sunday'].forEach(day => {
            document.getElementById(`${day}-start`).disabled = !schedule[day].available;
            document.getElementById(`${day}-end`).disabled = !schedule[day].available;
        });

        const durationInput = document.querySelector(
            `input[name="appointmentDuration"][value="${availability.appointmentDuration}"]`
        );
        if (durationInput) {
            durationInput.checked = true;
        }
    }
}

// Video Call Functions
