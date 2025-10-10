document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const adminIdInput = document.getElementById('admin_id');
    const passwordInput = document.getElementById('password');
    const securityTokenInput = document.getElementById('security_token');
    const adminIdError = document.getElementById('admin_id_error');
    const passwordError = document.getElementById('password_error');
    const securityTokenError = document.getElementById('security_token_error');
    const loginMessage = document.getElementById('login_message');

    function validateAdminId(adminId) {
        return adminId.length > 0;
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateSecurityToken(token) {
        return token.length > 0;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        adminIdError.textContent = '';
        passwordError.textContent = '';
        securityTokenError.textContent = '';
        loginMessage.textContent = '';
        loginMessage.classList.remove('success', 'error');

        const admin_id = adminIdInput.value.trim();
        const password = passwordInput.value;
        const security_token = securityTokenInput.value.trim();

        if (!validateAdminId(admin_id)) {
            adminIdError.textContent = 'Admin ID is required';
            return;
        }

        if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters';
            return;
        }

        if (!validateSecurityToken(security_token)) {
            securityTokenError.textContent = 'Security token is required';
            return;
        }

        try {
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Authenticating...';
            submitButton.disabled = true;

            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ admin_id, password, security_token })
            });

            const data = await response.json();
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            if (data.success) {
                loginMessage.textContent = `Welcome, ${data.name}! Authentication successful.`;
                loginMessage.classList.add('success');
                
                setTimeout(() => {
                    window.location.href = data.redirect; // Use redirect from response
                }, 1500);
            } else {
                loginMessage.textContent = data.message || 'Invalid login credentials';
                loginMessage.classList.add('error');
            }
        } catch (error) {
            loginMessage.textContent = 'An error occurred during authentication';
            loginMessage.classList.add('error');
            console.error('Login error:', error);
            // Reset button state in case of error
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Secure Login';
            submitButton.disabled = false;
        }
    });
});