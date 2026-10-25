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

    // Fill availability form if available
    if (profile.availability) {
        document.getElementById('monday-check').checked = profile.availability.schedule.monday.available;
        document.getElementById('monday-start').value = profile.availability.schedule.monday.startTime;
        document.getElementById('monday-end').value = profile.availability.schedule.monday.endTime;

        document.getElementById('tuesday-check').checked = profile.availability.schedule.tuesday.available;
        document.getElementById('tuesday-start').value = profile.availability.schedule.tuesday.startTime;
        document.getElementById('tuesday-end').value = profile.availability.schedule.tuesday.endTime;

        document.getElementById('wednesday-check').checked = profile.availability.schedule.wednesday.available;
        document.getElementById('wednesday-start').value = profile.availability.schedule.wednesday.startTime;
        document.getElementById('wednesday-end').value = profile.availability.schedule.wednesday.endTime;

        document.getElementById('thursday-check').checked = profile.availability.schedule.thursday.available;
        document.getElementById('thursday-start').value = profile.availability.schedule.thursday.startTime;
        document.getElementById('thursday-end').value = profile.availability.schedule.thursday.endTime;

        document.getElementById('friday-check').checked = profile.availability.schedule.friday.available;
        document.getElementById('friday-start').value = profile.availability.schedule.friday.startTime;
        document.getElementById('friday-end').value = profile.availability.schedule.friday.endTime;

        document.getElementById('saturday-check').checked = profile.availability.schedule.saturday.available;
        document.getElementById('saturday-start').value = profile.availability.schedule.saturday.startTime;
        document.getElementById('saturday-start').disabled = !profile.availability.schedule.saturday.available;
        document.getElementById('saturday-end').value = profile.availability.schedule.saturday.endTime;
        document.getElementById('saturday-end').disabled = !profile.availability.schedule.saturday.available;

        document.getElementById('sunday-check').checked = profile.availability.schedule.sunday.available;
        document.getElementById('sunday-start').value = profile.availability.schedule.sunday.startTime;
        document.getElementById('sunday-start').disabled = !profile.availability.schedule.sunday.available;
        document.getElementById('sunday-end').value = profile.availability.schedule.sunday.endTime;
        document.getElementById('sunday-end').disabled = !profile.availability.schedule.sunday.available;

        // Set appointment duration
        document.querySelector(`input[name="appointmentDuration"][value="${profile.availability.appointmentDuration}"]`).checked = true;
    }
}

// Video Call Functions
