async function updateProfile() {
  const form = document.getElementById('profile-form');
  const formData = new FormData(form);

  const profileData = {
    name: `${formData.get('profile-first-name')} ${formData.get('profile-last-name')}`.trim(),
    email: formData.get('profile-email') || null,
    phone: formData.get('profile-phone') || null,
    age: formData.get('profile-dob') ? calculateAge(formData.get('profile-dob')) : null,
    gender: formData.get('profile-gender') || null,
    address: formData.get('profile-address') || null,
    city: formData.get('profile-city') || null,
    country: formData.get('profile-country') || null
  };

  try {
    const response = await fetch('http://localhost:8080/patients/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      let updatedProfile = {};
      if (contentType && contentType.includes('application/json')) {
        updatedProfile = await response.json();
      } else {
        console.warn('Non-JSON response received:', await response.text());
      }
      alert('Profile updated successfully!');
      displayProfile(updatedProfile);
    } else {
      const errorText = await response.text();
      console.error('Failed to update profile:', errorText);
      alert(errorText || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile: ' + error.message);
  }
}

async function updateHealthInfo() {
  const form = document.getElementById('health-info-form');
  const formData = new FormData(form);

  const healthData = {
    bloodType: formData.get('health-blood-type') || null,
    height: formData.get('health-height') ? parseInt(formData.get('health-height')) : null,
    weight: formData.get('health-weight') ? parseInt(formData.get('health-weight')) : null,
    symptoms: [
      formData.get('health-allergies') || '',
      formData.get('health-conditions') || '',
      formData.get('health-medications') || ''
    ].filter(Boolean).join('; ') || null
  };

  try {
    const response = await fetch('http://localhost:8080/patients/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(healthData)
    });

    if (response.ok) {
      alert('Health information updated successfully!');
      await loadDashboardData(); // Refresh profile data
    } else {
      const errorText = await response.text();
      alert(errorText || 'Failed to update health information');
    }
  } catch (error) {
    console.error('Error updating health information:', error);
    alert('Error updating health information: ' + error.message);
  }
}

function displayProfile(profile) {
  document.getElementById('profile-name').textContent = profile.name || 'Patient';
  const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'bloodType', 'height', 'weight', 'city', 'country'];
  const filledFields = fields.filter(field => profile[field] && profile[field] !== '').length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);
  document.getElementById('profile-completion').textContent = `${completionPercentage}%`;

  const nameParts = (profile.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  document.getElementById('profile-first-name').value = firstName;
  document.getElementById('profile-last-name').value = lastName;
  document.getElementById('profile-email').value = profile.email || '';
  document.getElementById('profile-phone').value = profile.phone || '';
  document.getElementById('profile-dob').value = profile.age ? new Date(new Date().getFullYear() - profile.age, 0, 1).toISOString().split('T')[0] : '';
  document.getElementById('profile-gender').value = profile.gender || '';
  document.getElementById('profile-address').value = profile.address || '';
  document.getElementById('profile-city').value = profile.city || '';
  document.getElementById('profile-country').value = profile.country || '';

  document.getElementById('health-blood-type').value = profile.bloodType || '';
  document.getElementById('health-height').value = profile.height || '';
  document.getElementById('health-weight').value = profile.weight || '';
  document.getElementById('health-allergies').value = profile.symptoms ? profile.symptoms.split('; ')[0] || '' : '';
  document.getElementById('health-conditions').value = profile.symptoms ? profile.symptoms.split('; ')[1] || '' : '';
  document.getElementById('health-medications').value = profile.symptoms ? profile.symptoms.split('; ')[2] || '' : '';
}
