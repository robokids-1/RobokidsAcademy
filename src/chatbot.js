// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');
    const chatbotBadge = document.querySelector('.chatbot-badge');

    let isOpen = false;

    // Toggle chatbot window
    function toggleChatbot() {
        isOpen = !isOpen;
        if (isOpen) {
            chatbotWindow.classList.add('active');
            chatbotInput.focus();
            if (chatbotBadge) {
                chatbotBadge.style.display = 'none';
            }
        } else {
            chatbotWindow.classList.remove('active');
        }
    }

    // Close chatbot
    function closeChatbot() {
        isOpen = false;
        chatbotWindow.classList.remove('active');
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'chatbot-message-user' : 'chatbot-message-bot'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar-small';
        avatar.textContent = isUser ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'chatbot-message-content';
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Get bot response
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Program information
        if (message.includes('program') || message.includes('course') || message.includes('class')) {
            return "We offer four amazing programs:\n\n🧩 X-Bots Beginners (Ages 8-10) - Perfect for your child to make the first steps into technology.\n\n⚙️ X-Creators (Ages 10-12) - Dive deeper into the world of Robotics and Coding.\n\n🚀 X-Innovators (Ages 12-14) - Prepare to launch your child into a great career ahead.\n\n🔧 X-Engineers (Ages 14-16) - Advanced engineering concepts and real-world applications.\n\nWould you like to know more about any specific program?";
        }
        
        // Age information
        if (message.includes('age') || message.includes('old')) {
            return "We serve children from ages 8 to 16! Our programs are divided into four programs:\n\n• Ages 8-10: X-Bots Beginners\n• Ages 10-12: X-Creators\n• Ages 12-14: X-Innovators\n• Ages 14-16: X-Engineers\n\nWhich program are you interested in?";
        }
        
        // Booking/Trial
        if (message.includes('book') || message.includes('trial') || message.includes('enroll') || message.includes('register') || message.includes('sign up')) {
            return "Great! You can book a free trial by clicking the 'Book a free trial' button in the navigation, or visit our enquiry page. We offer a 1:1 Live Online Robotics Session for free! Would you like me to help you with anything else?";
        }
        
        // Contact information
        if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('address')) {
            return "You can reach us at:\n\n📧 Email: robokids209@gmail.com\n📞 Phone: (555) ROBOT-01\n📍 Address: 123 Robot Street, Tech City\n\nFeel free to ask me any other questions!";
        }
        
        // Pricing
        if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('payment')) {
            return "We offer a free 1:1 Live Online Robotics Session trial! For detailed pricing information, please contact us directly at robokids209@gmail.com or book a free trial to discuss our programs and pricing options.";
        }
        
        // Curriculum
        if (message.includes('curriculum') || message.includes('syllabus') || message.includes('learn') || message.includes('teach')) {
            return "Our curriculum includes hands-on projects, coding, robotics building, and problem-solving activities. Each program has a detailed curriculum that you can view by clicking 'View Curriculum' on any program card. Would you like to know more about a specific program?";
        }
        
        // Default responses
        const defaultResponses = [
            "That's a great question! Let me help you with that. You can ask me about our programs, ages, booking a trial, or contact information.",
            "I'm here to help! Feel free to ask about our robotics programs, age groups, or how to get started.",
            "Thanks for your question! I can help you learn about our programs, book a trial, or get contact information. What would you like to know?",
            "I'd be happy to help! Ask me about our programs, ages we serve, or how to book a free trial."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Disable send button
        chatbotSend.disabled = true;
        
        // Simulate bot thinking
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }, 500);
    }

    // Event listeners
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Quick reply buttons
    quickReplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            if (message && chatbotInput) {
                chatbotInput.value = message;
                sendMessage();
            }
        });
    });

    // Hide badge after first interaction
    if (chatbotBadge && chatbotMessages.children.length > 0) {
        chatbotBadge.style.display = 'none';
    }
});

