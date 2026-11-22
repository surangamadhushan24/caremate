async function updateProfile() {
  const form = document.getElementById('profile-form');
  if (!form) {
    console.error('Profile form not found');
    return;
  }

  const formData = new FormData(form);

  const firstName = (formData.get('profile-first-name') || '').trim();
  const lastName  = (formData.get('profile-last-name')  || '').trim();

  if (!firstName || !lastName) {
    alert('Please enter both first name and last name.');
    return;
  }

  const profileData = {
    name:    `${firstName} ${lastName}`.trim(),
    email:   formData.get('profile-email')?.trim()   || null,
    phone:   formData.get('profile-phone')?.trim()   || null,
    age:     formData.get('profile-dob') ? calculateAge(formData.get('profile-dob')) : null,
    gender:  formData.get('profile-gender')          || null,
    address: formData.get('profile-address')?.trim() || null,
    city:    formData.get('profile-city')?.trim()    || null,
    country: formData.get('profile-country')?.trim() || null
  };

  console.log('Sending patient profile data:', profileData);

  try {
    const response = await fetch('http://localhost:8080/patients/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });

    // Always try to parse JSON (don't rely on Content-Type)
    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn('Response was not JSON', e);
    }

    if (response.ok) {
      // Handle both wrapped { data: {...} } and plain object
      const updatedProfile = result?.data ?? result;

      console.log('Updated profile:', updatedProfile);
      alert('Profile updated successfully!');
      displayProfile(updatedProfile);
    } else {
      const msg = result?.message || (await response.text()) || 'Failed to update profile';
      console.error('Update failed:', msg);
      alert(msg);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile: ' + error.message);
  }
}


function displayProfile(profile) {
  // Unwrap ApiResponse if present
  if (profile?.data) {
    profile = profile.data;
  }

  if (!profile || typeof profile !== 'object') {
    console.error('Invalid profile data received:', profile);
    return;
  }

  // ---- Name ----
  let fullName = (profile.name || '').trim();
  if (!fullName || fullName.toLowerCase() === 'null null' || fullName.toLowerCase() === 'null') {
    fullName = '';
  }

  document.getElementById('profile-name').textContent = fullName || 'Patient';

  // ---- Completion % ----
  const fields = ['name', 'email', 'phone', 'age', 'gender', 'address', 'bloodType', 'height', 'weight', 'city', 'country'];
  const filled = fields.filter(f => profile[f] != null && profile[f] !== '').length;
  const completion = Math.round((filled / fields.length) * 100);
  document.getElementById('profile-completion').textContent = `${completion}%`;

  // ---- Split name ----
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';

  // ---- Profile form ----
  document.getElementById('profile-first-name').value = firstName;
  document.getElementById('profile-last-name').value  = lastName;
  document.getElementById('profile-email').value      = profile.email   || '';
  document.getElementById('profile-phone').value      = profile.phone   || '';
  document.getElementById('profile-gender').value     = profile.gender  || '';
  document.getElementById('profile-address').value    = profile.address || '';
  document.getElementById('profile-city').value       = profile.city    || '';
  document.getElementById('profile-country').value    = profile.country || '';

  // Age → DOB (best-effort only – ideally backend should store real DOB)
  if (profile.age != null && !isNaN(profile.age)) {
    const approxYear = new Date().getFullYear() - Number(profile.age);
    document.getElementById('profile-dob').value = `${approxYear}-01-01`;
  } else {
    document.getElementById('profile-dob').value = '';
  }

  // ---- Health form ----
  document.getElementById('health-blood-type').value = profile.bloodType || '';
  document.getElementById('health-height').value     = profile.height    ?? '';
  document.getElementById('health-weight').value     = profile.weight    ?? '';

  // Symptoms: "allergies; conditions; medications"
  const parts = (profile.symptoms || '').split(';').map(s => s.trim());
  document.getElementById('health-allergies').value   = parts[0] || '';
  document.getElementById('health-conditions').value  = parts[1] || '';
  document.getElementById('health-medications').value = parts[2] || '';

  console.log('Patient profile displayed successfully');
}
async function updateHealthInfo() {
  const form = document.getElementById('health-info-form');
  if (!form) return;

  const formData = new FormData(form);

  const healthData = {
    bloodType: formData.get('health-blood-type') || null,
    height:    formData.get('health-height') ? parseInt(formData.get('health-height')) : null,
    weight:    formData.get('health-weight') ? parseInt(formData.get('health-weight')) : null,
    symptoms:  [
      formData.get('health-allergies')   || '',
      formData.get('health-conditions')  || '',
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

    let result = null;
    try { result = await response.json(); } catch (_) {}

    if (response.ok) {
      alert('Health information updated successfully!');
      // Prefer refreshing from server
      if (typeof loadDashboardData === 'function') {
        await loadDashboardData();
      } else {
        const updated = result?.data ?? result;
        if (updated) displayProfile(updated);
      }
    } else {
      alert(result?.message || 'Failed to update health information');
    }
  } catch (error) {
    console.error(error);
    alert('Error updating health information: ' + error.message);
  }
}