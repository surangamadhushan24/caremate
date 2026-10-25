async function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to access the dashboard.');
    window.location.href = '/index.html';
    return;
  }
  try {
    const response = await fetch('http://localhost:8080/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const user = await response.json();
      if (user.role.toUpperCase() !== 'PATIENT') {
        window.location.href = `/${user.role.toLowerCase()}/dashboard.html`;
        return;
      }
      currentUser = user;
      updateUIForLoggedInUser(user);
    } else {
      alert('Authentication failed. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/index.html';
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    alert('Error verifying authentication. Please log in again.');
    localStorage.removeItem('token');
    window.location.href = '/index.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
}

function updateUIForLoggedInUser(user) {
  document.getElementById('patient-name').textContent = user.name || 'Patient';
}
