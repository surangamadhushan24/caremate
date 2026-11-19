
async function updateProfile() {
    const form = document.getElementById('profile-form');

    if (!form) {
        console.error('Profile form not found');
        return;
    }

    const formData = new FormData(form);

    // Get first and last names safely
    const firstName = (formData.get('profile-first-name') || '').trim();
    const lastName = (formData.get('profile-last-name') || '').trim();

    // Validate name fields
    if (!firstName || !lastName) {
        alert('Please enter both first name and last name.');
        return;
    }

    // Construct full name
    const fullName = `${firstName} ${lastName}`.trim();

    // Prepare request data
    const profileData = {
        name: fullName,
        email: formData.get('profile-email')?.trim() || '',
        phone: formData.get('profile-phone')?.trim() || '',
        specialty: formData.get('profile-specialty')?.trim() || '',
        yearsOfExperience: parseInt(formData.get('profile-years'), 0),
        bio: formData.get('profile-bio')?.trim() || '',
        education: formData.get('profile-education')?.trim() || ''
    };

    console.log('Sending profile data:', profileData);

    try {
        const response = await fetch('http://localhost:8080/doctors/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profileData)
        });

        // Parse API response
        const result = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');

            // Handle ApiResponse wrapper
            const updatedProfile = result.data || result;

            console.log('Updated profile:', updatedProfile);

            displayProfile(updatedProfile);

        } else {
            console.error('Update failed:', result);
            alert(result.message || 'Failed to update profile');
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
}


// ========================================
// DISPLAY DOCTOR PROFILE
// ========================================

function displayProfile(profile) {

    // Handle ApiResponse wrapper
    if (profile?.data) {
        profile = profile.data;
    }

    // Validate profile object
    if (!profile || typeof profile !== 'object') {
        console.error('Invalid profile data:', profile);
        return;
    }

    // ------------------------------------
    // 1. HANDLE DOCTOR NAME
    // ------------------------------------

    let fullName = profile.name || profile.fullName || '';

    // Prevent null null and other invalid names
    if (
        !fullName ||
        fullName.toLowerCase().trim() === 'null null' ||
        fullName.toLowerCase().trim() === 'null' ||
        fullName.toLowerCase().trim() === 'undefined'
    ) {
        fullName = '';
    }

    fullName = fullName.trim();

    // Display doctor name
    document.getElementById('profile-name').textContent =
        fullName || 'Doctor';

    // Display specialty
    document.getElementById('profile-specialty').textContent =
        profile.specialty || 'Not specified';

    // ------------------------------------
    // 2. SPLIT FULL NAME
    // ------------------------------------

    const nameParts = fullName.split(/\s+/).filter(Boolean);

    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // ------------------------------------
    // 3. POPULATE PROFILE FORM
    // ------------------------------------

    document.getElementById('profile-first-name').value = firstName;
    document.getElementById('profile-last-name').value = lastName;

    document.getElementById('profile-email').value =
        profile.email || '';

    document.getElementById('profile-phone').value =
        profile.phone || '';

    document.getElementById('profile-specialty').value =
        profile.specialty || '';

    document.getElementById('profile-years').value =
        profile.yearsOfExperience ?? '';

    document.getElementById('profile-bio').value =
        profile.bio || '';

    document.getElementById('profile-education').value =
        profile.education || '';

    // ------------------------------------
    // 4. HANDLE AVAILABILITY
    // ------------------------------------

    let availability = profile.availability;

    // Parse JSON availability if necessary
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
            // Plain text availability
            console.log('Plain text availability:', availability);
            availability = null;
        }
    }

    // Process structured availability
    if (
        availability &&
        typeof availability === 'object' &&
        !Array.isArray(availability)
    ) {

        const schedule = availability.schedule;

        const days = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ];

        if (schedule && typeof schedule === 'object') {

            days.forEach(day => {

                const dayAvailability = schedule[day];

                const checkbox = document.getElementById(`${day}-check`);
                const startInput = document.getElementById(`${day}-start`);
                const endInput = document.getElementById(`${day}-end`);

                if (!checkbox || !startInput || !endInput) {
                    return;
                }

                const isAvailable = !!dayAvailability?.available;

                checkbox.checked = isAvailable;

                startInput.value =
                    dayAvailability?.startTime || '';

                endInput.value =
                    dayAvailability?.endTime || '';

                // Enable or disable time inputs
                startInput.disabled = !isAvailable;
                endInput.disabled = !isAvailable;
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

    } else {
        console.log('No structured availability found');
    }

    console.log('Doctor profile displayed successfully:', profile);
}
