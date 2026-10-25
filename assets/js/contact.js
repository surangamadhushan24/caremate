document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    sendContactMessage();
  });
});

async function sendContactMessage() {
  const form = document.getElementById('contact-form');
  const formData = new FormData(form);

  const messageData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    if (response.ok) {
      form.reset();
      document.querySelector('.sent-message').style.display = 'block';
    } else {
      const error = await response.json();
      document.querySelector('.error-message').textContent = error.message || 'Failed to send message';
      document.querySelector('.error-message').style.display = 'block';
    }
  } catch (error) {
    console.error('Error sending contact message:', error);
    document.querySelector('.error-message').textContent = 'An error occurred while sending message';
    document.querySelector('.error-message').style.display = 'block';
  }
}
