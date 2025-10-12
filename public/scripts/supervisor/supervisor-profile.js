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

    // Profile editing functionality
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const profileDetails = document.getElementById('profile-details');
    const profileMessage = document.getElementById('profile-message');
    let originalValues = {};

    editProfileBtn.addEventListener('click', () => {
        // Store original values and switch to edit mode
        const editableFields = profileDetails.querySelectorAll('.editable');
        editableFields.forEach(field => {
            const detailItem = field.parentElement;
            const fieldName = field.dataset.field;
            originalValues[fieldName] = field.textContent;
            
            detailItem.classList.add('editing');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = field.textContent;
            input.dataset.field = fieldName;
            detailItem.appendChild(input);
        });

        editProfileBtn.style.display = 'none';
        saveProfileBtn.style.display = 'inline-flex';
        cancelEditBtn.style.display = 'inline-flex';
    });

    cancelEditBtn.addEventListener('click', () => {
        // Restore original values and exit edit mode
        const editableFields = profileDetails.querySelectorAll('.editable');
        editableFields.forEach(field => {
            const detailItem = field.parentElement;
            const fieldName = field.dataset.field;
            field.textContent = originalValues[fieldName];
            detailItem.classList.remove('editing');
            const input = detailItem.querySelector('input');
            if (input) input.remove();
        });

        editProfileBtn.style.display = 'inline-flex';
        saveProfileBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';
        profileMessage.textContent = '';
    });

    saveProfileBtn.addEventListener('click', async () => {
        const updatedProfile = {};
        const inputs = profileDetails.querySelectorAll('input');
        
        inputs.forEach(input => {
            updatedProfile[input.dataset.field] = input.value.trim();
        });

        try {
            const response = await fetch('/api/supervisor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updatedProfile)
            });

            const result = await response.json();

            if (result.success) {
                // Update displayed values and exit edit mode
                const editableFields = profileDetails.querySelectorAll('.editable');
                editableFields.forEach(field => {
                    const detailItem = field.parentElement;
                    const fieldName = field.dataset.field;
                    field.textContent = updatedProfile[fieldName];
                    detailItem.classList.remove('editing');
                    const input = detailItem.querySelector('input');
                    if (input) input.remove();
                });

                editProfileBtn.style.display = 'inline-flex';
                saveProfileBtn.style.display = 'none';
                cancelEditBtn.style.display = 'none';
                
                profileMessage.textContent = 'Profile updated successfully';
                profileMessage.className = 'message success';
            } else {
                profileMessage.textContent = result.message || 'Failed to update profile';
                profileMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Profile update error:', error);
            profileMessage.textContent = 'An error occurred while updating profile';
            profileMessage.className = 'message error';
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