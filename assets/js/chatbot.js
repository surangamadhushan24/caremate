document.addEventListener('DOMContentLoaded', function () {
  const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));

  document.getElementById('chatbot-btn').addEventListener('click', function (e) {
    e.preventDefault();
    chatbotModal.show();
  });

  document.getElementById('chatbot-send').addEventListener('click', sendChatMessage);
  document.getElementById('chatbot-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
});

// Chatbot Functions
async function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (!message) return;

  // Add user message to chat
  addChatMessage('user', message);
  input.value = '';

  try {
    const response = await fetch('http://localhost:8080/api/chatbot/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header needed since endpoint is public
      },
      body: JSON.stringify({
        symptoms: message,
        patientId: currentUser ? currentUser.id : null
      })
    });

    if (response.ok) {
      const data = await response.json();
      addChatMessage('bot', data.response, data.suggestedSpecialty, data.recommendedDoctorIds);
    } else {
      const error = await response.json();
      addChatMessage('bot', error.message || 'Sorry, I couldn’t process your request. Please try again.');
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    addChatMessage('bot', 'An error occurred while processing your request. Please try again.');
  }

  // Scroll to bottom
  const messagesContainer = document.getElementById('chatbot-messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function loadChatHistory() {
  if (!currentUser) return; // Skip history for non-logged-in users

  try {
    const response = await fetch(`http://localhost:8080/api/chatbot/history/${currentUser.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const history = await response.json();
      const messagesContainer = document.getElementById('chatbot-messages');
      messagesContainer.innerHTML = '<div class="chatbot-message bot"><div class="message-content">Welcome to MediCare Assistant! I\'m here to help you with your health concerns. Please describe your symptoms.</div></div>';

      history.forEach(entry => {
        addChatMessage('user', entry.message);
        addChatMessage('bot', entry.response);
      });

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

function addChatMessage(type, message, suggestedSpecialty = null, recommendedDoctorIds = []) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageElement = document.createElement('div');
  messageElement.className = `chatbot-message ${type}`;

  let content = `<div class="message-content">${message}</div>`;
  if (type === 'bot' && suggestedSpecialty) {
    content = `
      <div class="message-content">
        ${message}
        <div class="suggested-specialty">Suggested Specialty: ${suggestedSpecialty}</div>
        ${recommendedDoctorIds.length > 0 ? `
          <div class="recommended-doctors">
            Recommended Doctors:
            <ul>
              ${recommendedDoctorIds.map(id => `<li><a href="#appointment" onclick="selectDoctor(${id})">Doctor ID: ${id}</a></li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>`;
  }

  messageElement.innerHTML = content;
  messagesContainer.appendChild(messageElement);
}

function selectDoctor(doctorId) {
  // Populate appointment form with selected doctor
  document.getElementById('doctor').value = doctorId;
  bootstrap.Modal.getInstance(document.getElementById('chatbotModal')).hide();
  document.querySelector('#appointment').scrollIntoView({ behavior: 'smooth' });
}
