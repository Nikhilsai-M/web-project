document.addEventListener('DOMContentLoaded', function () {
    // Setup password toggle
    setupPasswordToggles();

    // Get form element
    const loginForm = document.getElementById('loginForm');

    // Add form submit event listener
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;

        // Reset previous error messages
        document.getElementById('email-error').textContent = '';
        document.getElementById('password-error').textContent = '';

        // Validate email format
        if (!isValidEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            return;
        }

        // Send login request to the server
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store user session in local storage (optional)
                    const session = {
                        userId: data.user.userId,
                        email: data.user.email,
                        name: `${data.user.firstName} ${data.user.lastName}`,
                        loggedIn: true,
                        loginTime: new Date().toISOString(),
                    };

                    localStorage.setItem('currentSession', JSON.stringify(session));

                    // If remember me is checked, store in a longer-term cookie
                    if (rememberMe) {
                        localStorage.setItem('rememberUser', data.user.userId);
                    } else {
                        localStorage.removeItem('rememberUser');
                    }

                    // Show success message
                    showNotification('Login successful! Redirecting to homepage...', 'success');

                    // Redirect to homepage after short delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    // Handle login failure
                    document.getElementById('password-error').textContent = data.message || 'Invalid credentials';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred during login', 'error');
            });
    });

    // Check for remembered user
    const rememberedUserId = localStorage.getItem('rememberUser');
    if (rememberedUserId) {
        // You can optionally fetch user details from the server if needed
        document.getElementById('email').value = rememberedUserId;
        document.getElementById('remember').checked = true;
    }


    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        showNotification('Password reset functionality is not implemented in this demo', 'info');
    });
});