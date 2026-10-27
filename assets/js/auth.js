let currentUser = null;

document.addEventListener('DOMContentLoaded', function () {
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

  checkAuthStatus();

  document.getElementById('login-btn').addEventListener('click', function (e) {
    e.preventDefault();
    loginModal.show();
  });

  document.getElementById('register-btn').addEventListener('click', function (e) {
    e.preventDefault();
    registerModal.show();
  });

  document.getElementById('show-register').addEventListener('click', function (e) {
    e.preventDefault();
    loginModal.hide();
    registerModal.show();
  });

  document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    registerModal.hide();
    loginModal.show();
  });

  document.getElementById('logout-btn').addEventListener('click', function (e) {
    e.preventDefault();
    logout();
  });

  document.getElementById('dashboard-btn').addEventListener('click', function (e) {
    e.preventDefault();
    redirectToDashboard();
  });

  document.getElementById('register-role').addEventListener('change', function () {
    const role = this.value;
    if (role === 'DOCTOR') {
      document.getElementById('doctor-fields').style.display = 'block';
      document.getElementById('patient-fields').style.display = 'none';
    } else if (role === 'PATIENT') {
      document.getElementById('doctor-fields').style.display = 'none';
      document.getElementById('patient-fields').style.display = 'block';
    } else {
      document.getElementById('doctor-fields').style.display = 'none';
      document.getElementById('patient-fields').style.display = 'none';
    }
  });

  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    login();
  });

  document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    register();
  });
});

async function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8080/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          const user = result.data;          
          currentUser = user;
          updateUIForLoggedInUser(user);
        } else {
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      const { token, user } = result.data;

      localStorage.setItem('token', token);
      currentUser = user;
      updateUIForLoggedInUser(user);

      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      loginModal.hide();

      alert(`Welcome back, ${user.name}!`);
      window.location.href = '/patient/dashboard.html';
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
}

function updateUIForLoggedInUser(user) {
  document.getElementById('auth-links').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-role').textContent = `Hi, ${user.name} (${user.role})`;
}

async function register() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const role = document.getElementById('register-role').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  const registerData = {
    email: email,
    password: password,
    role: role,
    name: name
  };

  if (role === 'DOCTOR') {
    registerData.specialty = document.getElementById('register-specialty').value;
    registerData.availability = document.getElementById('register-availability').value;
  } else if (role === 'PATIENT') {
    registerData.age = document.getElementById('register-age').value;
    registerData.gender = document.getElementById('register-gender').value;
  }

  try {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });

    if (response.ok) {
      const data = await response.json();
      alert('Registration successful! Please login.');
      const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      registerModal.hide();
    } else {
      const error = await response.json();
      alert(error.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration');
  }
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  updateUIForLoggedOutUser();
  alert('You have been logged out');
}


function updateUIForLoggedOutUser() {
  document.getElementById('auth-links').style.display = 'flex';
  document.getElementById('user-info').style.display = 'none';
}

function redirectToDashboard() {
  if (!currentUser) return;

  switch (currentUser.role) {
    case 'ADMIN':
      window.location.href = '/admin/dashboard.html';
      break;
    case 'DOCTOR':
      window.location.href = '/doctor/dashboard.html';
      break;
    case 'PATIENT':
      window.location.href = '/patient/dashboard.html';
      break;
    default:
      window.location.href = '/';
  }
}
