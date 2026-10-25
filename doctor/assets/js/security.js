async function changePassword() {
    const form = document.getElementById('change-password-form');
    const errorMessage = document.querySelector('#change-password-form .error-message');
    errorMessage.style.display = 'none';

    if (!form) {
        console.error('Change password form not found');
        errorMessage.textContent = 'Error: Form not found. Please try again.';
        errorMessage.style.display = 'block';
        return;
    }

    const formData = new FormData(form);
    const currentPassword = formData.get('current-password')?.trim();
    const newPassword = formData.get('new-password')?.trim();
    const confirmPassword = formData.get('confirm-password')?.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
        console.error('One or more password fields are empty or undefined');
        errorMessage.textContent = 'All password fields are required';
        errorMessage.style.display = 'block';
        return;
    }

    if (newPassword !== confirmPassword) {
        console.error('New passwords do not match');
        errorMessage.textContent = 'New passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    if (newPassword.length < 8) {
        console.error('New password is too short');
        errorMessage.textContent = 'New password must be at least 8 characters long';
        errorMessage.style.display = 'block';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        errorMessage.textContent = 'Session expired. Please log in again.';
        errorMessage.style.display = 'block';
        localStorage.removeItem('token');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });

        const contentType = response.headers.get('content-type');
        let errorMsg = 'Failed to change password';

        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMsg = error.message || errorMsg;
            } else {
                errorMsg = await response.text();
            }
            console.error('Change password error:', errorMsg);
            if (response.status === 401) {
                errorMessage.textContent = 'Session expired. Please log in again.';
                errorMessage.style.display = 'block';
                localStorage.removeItem('token');
                window.location.href = '/index.html';
                return;
            }
            if (errorMsg.includes('Current password is incorrect')) {
                errorMsg += '. Please verify your current password or try logging in again.';
            }
            errorMessage.textContent = errorMsg;
            errorMessage.style.display = 'block';
            return;
        }

        alert('Password changed successfully!');
        bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
        form.reset();
    } catch (error) {
        console.error('Error changing password:', error);
        errorMessage.textContent = 'Error changing password. Please try again.';
        errorMessage.style.display = 'block';
    }
}
