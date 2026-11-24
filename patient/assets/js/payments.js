let pendingAppointmentId = null;

async function initiatePayment(appointmentId, amount) {
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const loading = document.getElementById('payment-loading');
  const success = document.getElementById('payment-success');
  const failed = document.getElementById('payment-failed');
  const retryBtn = document.getElementById('retry-payment-btn');
  const formContainer = document.getElementById('payment-form-container');

  loading.style.display = 'block';
  success.style.display = 'none';
  failed.style.display = 'none';
  retryBtn.style.display = 'none';
  formContainer.innerHTML = '';
  paymentModal.show();

  try {
    const profileResponse = await fetch('http://localhost:8080/patients/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile');
    }

    const result = await profileResponse.json();
    const profile = result.data;   // ← IMPORTANT FIX

    if (!profile || !profile.email || !profile.name) {
      alert('Please update your profile with email and name to proceed with payment.');
      paymentModal.hide();
      return;
    }

    const paymentData = {
      appointmentId: appointmentId,
      amount: parseFloat(amount).toFixed(2),
      currency: 'LKR',
      returnUrl: `${window.location.origin}/patient/dashboard.html?payment_status=success`,
      cancelUrl: `${window.location.origin}/patient/dashboard.html?payment_status=cancelled`,
      notifyUrl: 'http://localhost:8080/api/payments/notify',
      firstName: profile.name.split(' ')[0] || 'Unknown',
      lastName: profile.name.split(' ').slice(1).join(' ') || 'Unknown',
      email: profile.email,
      phone: profile.phone || 'N/A',
      address: profile.address || 'N/A',
      city: profile.city || 'N/A',
      country: profile.country || 'Sri Lanka'
    };

    const response = await fetch('http://localhost:8080/api/payments/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });

    if (response.ok) {
      const paymentResponse = await response.json();
      loading.style.display = 'none';

      if (paymentResponse.status && paymentResponse.status.startsWith('ERROR')) {
        throw new Error(paymentResponse.status);
      }

      const data = paymentResponse.paymentData;

      if (!data) {
        throw new Error('Payment data missing from server response');
      }

      let formHtml = `<form id="payhere-form" action="${paymentResponse.paymentUrl}" method="POST">`;
      for (const [key, value] of Object.entries(data)) {
        formHtml += `<input type="hidden" name="${key}" value="${value}">`;
      }
      formHtml += `</form>`;

      formContainer.innerHTML = formHtml;
      document.getElementById('payhere-form').submit();

    } else {
      const error = await response.text();
      throw new Error(error || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    loading.style.display = 'none';
    failed.style.display = 'block';
    failed.innerHTML = `
      <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
      <p>${error.message || 'Failed to initiate payment. Please try again.'}</p>
    `;
    retryBtn.style.display = 'block';
  }
}

async function handlePaymentRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment_status');
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const loading = document.getElementById('payment-loading');
  const success = document.getElementById('payment-success');
  const failed = document.getElementById('payment-failed');
  const retryBtn = document.getElementById('retry-payment-btn');

  loading.style.display = 'none';
  success.style.display = 'none';
  failed.style.display = 'none';
  retryBtn.style.display = 'none';
  paymentModal.show();

  if (paymentStatus === 'success') {
    success.style.display = 'block';
    success.innerHTML = `
      <i class="bi bi-check-circle-fill" style="font-size: 2rem;"></i>
      <p>Payment successful! Your appointment is confirmed.</p>
    `;
    if (typeof loadDashboardData === 'function') {
      await loadDashboardData();
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => paymentModal.hide(), 3000);
  } else if (paymentStatus === 'cancelled') {
    failed.style.display = 'block';
    retryBtn.style.display = 'block';
    failed.innerHTML = `
      <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
      <p>Payment was cancelled. Please try again.</p>
    `;
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}