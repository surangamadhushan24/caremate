let pendingAppointmentId = null;

async function initiatePayment(appointmentId, amount) {
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const loading = document.getElementById('payment-loading');
  const success = document.getElementById('payment-success');
  const failed = document.getElementById('payment-failed');
  const retryBtn = document.getElementById('retry-payment-btn');
  const formContainer = document.getElementById('payment-form-container');

  pendingAppointmentId = appointmentId;

  loading.style.display = 'block';
  success.style.display = 'none';
  failed.style.display = 'none';
  retryBtn.style.display = 'none';
  formContainer.innerHTML = '';
  paymentModal.show();

  try {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid payment amount');
    }

    const profileResponse = await fetch('http://localhost:8080/patients/me', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile');
    }

    const result = await profileResponse.json();
    const profile = result.data;

    if (!profile || !profile.email || !profile.name) {
      alert('Please update your profile with email and name to proceed with payment.');
      paymentModal.hide();
      return;
    }

    // For local testing use your ngrok URL, e.g. https://abcd-1234.ngrok-free.app
    const PUBLIC_BACKEND_URL = 'https://YOUR-NGROK-URL.ngrok-free.app';

    const paymentData = {
      appointmentId: appointmentId,
      amount: Number(numericAmount.toFixed(2)),
      currency: 'LKR',
      returnUrl: `${window.location.origin}/patient/dashboard.html?payment_status=success`,
      cancelUrl: `${window.location.origin}/patient/dashboard.html?payment_status=cancelled`,
      notifyUrl: `${PUBLIC_BACKEND_URL}/api/payments/notify`,
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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to initiate payment');
    }

    const paymentResponse = await response.json();
    loading.style.display = 'none';

    if (paymentResponse.status && paymentResponse.status.startsWith('ERROR')) {
      throw new Error(paymentResponse.status);
    }

    const data = paymentResponse.paymentData;
    if (!data) {
      throw new Error('Payment data missing from server response');
    }

    // Remember the order so we can check its status after PayHere redirects back
    sessionStorage.setItem('pendingOrderId', paymentResponse.payhereOrderId);

    // Build the form with DOM APIs (avoids HTML injection / quoting problems)
    const form = document.createElement('form');
    form.id = 'payhere-form';
    form.action = paymentResponse.paymentUrl;
    form.method = 'POST';
    for (const [key, value] of Object.entries(data)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    formContainer.appendChild(form);
    form.submit();

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

// Poll backend until the PayHere notification has been processed
async function waitForPaymentCompletion(orderId, maxAttempts = 15, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://localhost:8080/api/payments/order/${orderId}/status`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const { status } = await res.json();
        if (status === 'COMPLETED') return 'COMPLETED';
        if (['FAILED', 'CANCELLED', 'CHARGEDBACK'].includes(status)) return status;
      }
    } catch (e) {
      console.error('Status check failed:', e);
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return 'PENDING';
}

async function handlePaymentRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment_status');
  if (!paymentStatus) return;

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
    const orderId = sessionStorage.getItem('pendingOrderId');

    // Show "confirming" while we wait for PayHere's server-to-server notification
    loading.style.display = 'block';
    loading.innerHTML = `<p>Confirming your payment, please wait...</p>`;

    const finalStatus = orderId ? await waitForPaymentCompletion(orderId) : 'PENDING';
    loading.style.display = 'none';

    if (finalStatus === 'COMPLETED') {
      sessionStorage.removeItem('pendingOrderId');
      success.style.display = 'block';
      success.innerHTML = `
        <i class="bi bi-check-circle-fill" style="font-size: 2rem;"></i>
        <p>Payment successful! Your appointment is confirmed.</p>
      `;
    } else if (finalStatus === 'PENDING') {
      success.style.display = 'block';
      success.innerHTML = `
        <i class="bi bi-hourglass-split" style="font-size: 2rem;"></i>
        <p>Your payment is still being processed. Please refresh in a moment.</p>
      `;
    } else {
      failed.style.display = 'block';
      retryBtn.style.display = 'block';
      failed.innerHTML = `
        <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
        <p>Payment ${finalStatus.toLowerCase()}. Please try again.</p>
      `;
    }

    if (typeof loadDashboardData === 'function') {
      await loadDashboardData();
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    if (finalStatus === 'COMPLETED') {
      setTimeout(() => paymentModal.hide(), 3000);
    }

  } else if (paymentStatus === 'cancelled') {
    sessionStorage.removeItem('pendingOrderId');
    failed.style.display = 'block';
    retryBtn.style.display = 'block';
    failed.innerHTML = `
      <i class="bi bi-x-circle-fill" style="font-size: 2rem;"></i>
      <p>Payment was cancelled. Please try again.</p>
    `;
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}