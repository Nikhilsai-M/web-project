document.addEventListener('DOMContentLoaded', () => {
    // Logout functionality
    document.getElementById('logout-button').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/supervisor/logout', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            
            if (result.success) {
                window.location.href = '/supervisor/login';
            } else {
                alert('Error logging out: ' + result.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed');
        }
    });

    // Change password form submission
    const passwordForm = document.getElementById('change-password-form');
    const passwordMessage = document.getElementById('password-message');

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Client-side validation
        if (newPassword !== confirmPassword) {
            passwordMessage.textContent = 'New passwords do not match';
            passwordMessage.className = 'message error';
            return;
        }

        try {
            const response = await fetch('/api/supervisor/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await response.json();

            if (result.success) {
                passwordMessage.textContent = result.message;
                passwordMessage.className = 'message success';
                passwordForm.reset();
            } else {
                passwordMessage.textContent = result.message;
                passwordMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Password update error:', error);
            passwordMessage.textContent = 'An error occurred while updating password';
            passwordMessage.className = 'message error';
        }
    });
});