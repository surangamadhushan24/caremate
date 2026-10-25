function initiatePayment(appointmentId) {
  const paymentRequest = {
    appointmentId: appointmentId,
    amount: "1000.00",
    currency: "LKR",
    returnUrl: window.location.href,
    cancelUrl: window.location.href,
    notifyUrl: "https://your-api-endpoint/payments/notify",
    firstName: currentUser ? currentUser.name.split(' ')[0] : 'Guest',
    lastName: currentUser ? currentUser.name.split(' ')[1] || '' : '',
    email: currentUser ? currentUser.email : document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka"
  };
  payhere.startPayment(paymentRequest);
}
