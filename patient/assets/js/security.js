async function changePassword() {
  const form = document.getElementById('change-password-form');
  const errorMessage = document.querySelector('#change-password-form .error-message');
  errorMessage.style.display = 'none';

  const formData = new FormData(form);
  const currentPassword = formData.get('current-password')?.trim();
  const newPassword = formData.get('new-password')?.trim();
  const confirmPassword = formData.get('confirm-password')?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    errorMessage.textContent = 'All password fields are required';
    errorMessage.style.display = 'block';
    return;
  }
  if (newPassword !== confirmPassword) {
    errorMessage.textContent = 'New passwords do not match';
    errorMessage.style.display = 'block';
    return;
  }
  if (newPassword.length < 8) {
    errorMessage.textContent = 'New password must be at least 8 characters long';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });

    if (!response.ok) {
      const errorText = await response.text();
      errorMessage.textContent = errorText || 'Failed to change password';
      errorMessage.style.display = 'block';
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
      }
      return;
    }

    alert('Password changed successfully!');
    bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
    form.reset();
  } catch (error) {
    console.error('Error changing password:', error);
    errorMessage.textContent = 'Error changing password: ' + error.message;
    errorMessage.style.display = 'block';
  }
}
