document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('supervisorLoginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username_error');
    const passwordError = document.getElementById('password_error');
    const loginMessage = document.getElementById('login_message');

    function validateUsername(username) {
        return username.length > 0;
    }

    function validatePassword(password) {
        return password.length >= 3;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        usernameError.textContent = '';
        passwordError.textContent = '';
        loginMessage.textContent = '';
        loginMessage.classList.remove('success', 'error');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!validateUsername(username)) {
            usernameError.textContent = 'Username is required';
            return;
        }

        if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 3 characters';
            return;
        }

        try {
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;

            const response = await fetch('/api/supervisor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            if (data.success) {
                loginMessage.textContent = `Welcome, ${data.firstName} ${data.lastName}! Login successful.`;
                loginMessage.classList.add('success');
                
                setTimeout(() => {
                    window.location.href = '/supervisor';
                }, 1500);
            } else {
                loginMessage.textContent = data.message || 'Invalid username or password';
                loginMessage.classList.add('error');
            }
        } catch (error) {
            loginMessage.textContent = 'An error occurred during login';
            loginMessage.classList.add('error');
            console.error('Login error:', error);
        }
    });
});