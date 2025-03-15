/**
 * SmartExchange Administrator Authentication
 * Updated to work with server-side authentication
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const adminIdInput = document.getElementById('admin_id');
    const passwordInput = document.getElementById('password');
    const securityTokenInput = document.getElementById('security_token');
    const adminIdError = document.getElementById('admin_id_error');
    const passwordError = document.getElementById('password_error');
    const securityTokenError = document.getElementById('security_token_error');
    const loginMessage = document.getElementById('login_message');

    // Validate admin ID format (ADMIN followed by digits)
    function validateAdminId(adminId) {
        const pattern = /^ADMIN\d{3}$/;
        return pattern.test(adminId);
    }

    // Validate password requirements (at least 8 chars, with at least one uppercase, lowercase, and special char)
    function validatePassword(password) {
        if (password.length < 8) return false;
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUppercase && hasLowercase && hasSpecialChar;
    }

    // Validate security token format (TOKEN followed by digits)
    function validateSecurityToken(token) {
        const pattern = /^TOKEN\d{3}$/;
        return pattern.test(token);
    }

    // Clear all error messages
    function clearErrors() {
        adminIdError.textContent = '';
        passwordError.textContent = '';
        securityTokenError.textContent = '';
        loginMessage.textContent = '';
        loginMessage.classList.remove('error', 'success');
    }

    // Disable/enable the form
    function disableForm(disabled) {
        adminIdInput.disabled = disabled;
        passwordInput.disabled = disabled;
        securityTokenInput.disabled = disabled;
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = disabled;
    }

    // Form submission handler
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();

        const admin_id = adminIdInput.value.trim();
        const password = passwordInput.value;
        const security_token = securityTokenInput.value.trim();
        let isValid = true;

        // Validate admin ID
        if (!admin_id) {
            adminIdError.textContent = 'Admin ID is required';
            isValid = false;
        } else if (!validateAdminId(admin_id)) {
            adminIdError.textContent = 'Invalid format. Use ADMIN followed by 3 digits';
            isValid = false;
        }

        // Validate password
        if (!password) {
            passwordError.textContent = 'Password is required';
            isValid = false;
        } else if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters with uppercase, lowercase, and special characters';
            isValid = false;
        }

        // Validate security token
        if (!security_token) {
            securityTokenError.textContent = 'Security token is required';
            isValid = false;
        } else if (!validateSecurityToken(security_token)) {
            securityTokenError.textContent = 'Invalid token format. Use TOKEN followed by 3 digits';
            isValid = false;
        }

        // If validation passes, send credentials to server
        if (isValid) {
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
                    // Success - redirect to admin home page
                    loginMessage.textContent = `Welcome, ${data.name}! Access granted.`;
                    loginMessage.classList.add('success');
                    
                    // Redirect after showing success message
                    setTimeout(() => {
                        window.location.href = '/admin/home';
                    }, 1500);
                } else {
                    // Authentication failed
                    loginMessage.textContent = data.message || 'Invalid credentials. This attempt has been logged.';
                    loginMessage.classList.add('error');
                    
                    // Lock the form after 3 failed attempts
                    const failedAttempts = parseInt(sessionStorage.getItem('failedAdminLoginAttempts') || '0') + 1;
                    sessionStorage.setItem('failedAdminLoginAttempts', failedAttempts.toString());
                    
                    if (failedAttempts >= 3) {
                        // Lock the form for security
                        disableForm(true);
                        loginMessage.textContent = 'Too many failed attempts. Access locked for security reasons.';
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                loginMessage.textContent = 'A server error occurred. Please try again later.';
                loginMessage.classList.add('error');
            }
        }
    });

    // Real-time validation feedback
    adminIdInput.addEventListener('input', () => {
        adminIdError.textContent = '';
        if (adminIdInput.value.trim() && !validateAdminId(adminIdInput.value.trim())) {
            adminIdError.textContent = 'Format: ADMIN followed by 3 digits (e.g., ADMIN001)';
        }
    });

    passwordInput.addEventListener('input', () => {
        passwordError.textContent = '';
    });

    securityTokenInput.addEventListener('input', () => {
        securityTokenError.textContent = '';
        if (securityTokenInput.value.trim() && !validateSecurityToken(securityTokenInput.value.trim())) {
            securityTokenError.textContent = 'Format: TOKEN followed by 3 digits (e.g., TOKEN001)';
        }
    });

    // Check if the account is locked
    const failedAttempts = parseInt(sessionStorage.getItem('failedAdminLoginAttempts') || '0');
    if (failedAttempts >= 3) {
        disableForm(true);
        loginMessage.textContent = 'Too many failed attempts. Access locked for security reasons.';
        loginMessage.classList.add('error');
    }
});