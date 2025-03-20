// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');

    notificationMessage.textContent = message;

    // Set icon based on notification type
    notificationIcon.className = 'notification-icon';
    if (type === 'success') {
        notificationIcon.classList.add('fas', 'fa-check-circle');
        notification.className = 'notification notification-success show';
    } else if (type === 'error') {
        notificationIcon.classList.add('fas', 'fa-exclamation-circle');
        notification.className = 'notification notification-error show';
    } else {
        notificationIcon.classList.add('fas', 'fa-info-circle');
        notification.className = 'notification notification-info show';
    }

    // Auto hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);

    // Add click event to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Setup password toggle visibility
function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function () {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}