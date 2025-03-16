document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('supervisorLoginForm');
    const employeeIdInput = document.getElementById('employee_id');
    const passwordInput = document.getElementById('password');
    const employeeIdError = document.getElementById('employee_id_error');
    const passwordError = document.getElementById('password_error');
    const loginMessage = document.getElementById('login_message');

    function validateEmployeeId(employeeId) {
        return employeeId.length > 0;
    }

    function validatePassword(password) {
        return password.length >= 3;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        employeeIdError.textContent = '';
        passwordError.textContent = '';
        loginMessage.textContent = '';
        loginMessage.classList.remove('success', 'error');

        const employee_id = employeeIdInput.value.trim();
        const password = passwordInput.value;

        if (!validateEmployeeId(employee_id)) {
            employeeIdError.textContent = 'Employee ID is required';
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
                body: JSON.stringify({ employee_id, password })
            });

            const data = await response.json();
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            if (data.success) {
                loginMessage.textContent = `Welcome, ${data.name}! Login successful.`;
                loginMessage.classList.add('success');
                
                setTimeout(() => {
                    window.location.href = '/supervisor/home';
                }, 1500);
            } else {
                loginMessage.textContent = data.message || 'Invalid employee ID or password';
                loginMessage.classList.add('error');
            }
        } catch (error) {
            loginMessage.textContent = 'An error occurred during login';
            loginMessage.classList.add('error');
            console.error('Login error:', error);
        }
    });
});