
async function updateProfile() {
    const formData = new FormData(document.getElementById('profile-form'));

    const profileData = {
        name: `${formData.get('profile-first-name')} ${formData.get('profile-last-name')}`.trim(),
        email: formData.get('profile-email'),
        phone: formData.get('profile-phone'),
        specialty: formData.get('profile-specialty'),
        yearsOfExperience: parseInt(formData.get('profile-years'), 10) || 0,
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

        const result = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');

            const updatedProfile = result.data || result;
            displayProfile(updatedProfile);
        } else {
            alert(result.message || 'Failed to update profile');
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
}



function displayProfile(profile) {

    // Handle wrapped API response
    if (profile && profile.data) {
        profile = profile.data;
    }

    if (!profile || typeof profile !== 'object') {
        console.error('Invalid profile data:', profile);
        return;
    }

    // Display doctor information
    const fullName = profile.name || profile.fullName || '';

    document.getElementById('profile-name').textContent = fullName || 'Doctor';
    document.getElementById('profile-specialty').textContent =
        profile.specialty || 'Not specified';

    // Split name
    const nameParts = fullName.trim().split(/\s+/);

    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Populate form
    document.getElementById('profile-first-name').value = firstName;
    document.getElementById('profile-last-name').value = lastName;
    document.getElementById('profile-email').value = profile.email || '';
    document.getElementById('profile-phone').value = profile.phone || '';
    document.getElementById('profile-specialty').value = profile.specialty || '';
    document.getElementById('profile-years').value =
        profile.yearsOfExperience ?? '';
    document.getElementById('profile-bio').value = profile.bio || '';
    document.getElementById('profile-education').value = profile.education || '';

    // Availability handling
   
    
    // Availability handling
    let availability = profile.availability;

    // Convert JSON strings into JavaScript objects
    if (typeof availability === 'string') {
        const trimmedAvailability = availability.trim();

        if (
            trimmedAvailability.startsWith('{') ||
            trimmedAvailability.startsWith('[')
        ) {
            try {
                availability = JSON.parse(trimmedAvailability);
            } catch (error) {
                console.error('Invalid availability JSON:', error);
                availability = null;
            }
        } else {
            // Plain text availability, e.g. "Monday 9am - 12pm"
            console.log('Plain text availability:', availability);
            availability = null;
        }
    }

    // Process structured availability only
    if (
        availability &&
        typeof availability === 'object' &&
        !Array.isArray(availability)
    ) {
        const schedule = availability.schedule;

        const days = [
            'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday'
        ];

        if (schedule && typeof schedule === 'object') {

            days.forEach(day => {
                const dayAvailability = schedule[day];

                if (!dayAvailability) return;

                document.getElementById(`${day}-check`).checked =
                    !!dayAvailability.available;

                document.getElementById(`${day}-start`).value =
                    dayAvailability.startTime || '';

                document.getElementById(`${day}-end`).value =
                    dayAvailability.endTime || '';
            });

            // Weekend availability
            ['saturday', 'sunday'].forEach(day => {
                const isAvailable = !!schedule[day]?.available;

                document.getElementById(`${day}-start`).disabled =
                    !isAvailable;

                document.getElementById(`${day}-end`).disabled =
                    !isAvailable;
            });

            // Appointment duration
            if (availability.appointmentDuration) {
                const durationInput = document.querySelector(
                    `input[name="appointmentDuration"][value="${availability.appointmentDuration}"]`
                );

                if (durationInput) {
                    durationInput.checked = true;
                }
            }
        }
    }

}



