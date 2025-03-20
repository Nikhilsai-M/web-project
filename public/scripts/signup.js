document.addEventListener('DOMContentLoaded', function() {
    // Setup password toggle
    setupPasswordToggles();
    
    // Get form element
    const signupForm = document.getElementById('signupForm');
    
    // Add form submit event listener
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset all error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Basic client-side validation
        let isValid = true;
        
        // Validate name fields
        if (firstName.length < 2) {
            document.getElementById('firstName-error').textContent = 'First name must be at least 2 characters';
            isValid = false;
        }
        
        if (lastName.length < 2) {
            document.getElementById('lastName-error').textContent = 'Last name must be at least 2 characters';
            isValid = false;
        }
        
        // If basic validation fails, stop here
        if (!isValid) return;
        
        try {
            // Show loading state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';
            
            // Submit form data to server
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    confirmPassword
                })
            });
            
            const data = await response.json();
            
            // Handle response
            if (!response.ok) {
                // Display validation errors from server
                if (data.errors) {
                    Object.entries(data.errors).forEach(([field, message]) => {
                        const errorElement = document.getElementById(`${field}-error`);
                        if (errorElement) {
                            errorElement.textContent = message;
                        }
                    });
                } else {
                    showNotification(data.message || 'An error occurred', 'error');
                }
            } else {
                // Show success message
                showNotification('Account created successfully! Redirecting to login page...', 'success');
                
                // Redirect to login page after short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
    
   

});

// Helper function for showing notifications (implementation depends on your UI framework)
function showNotification(message, type) {
    // This is a placeholder - implement based on your UI framework
    // Examples: Toast notification, alert, or custom element
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Simple implementation - create a notification div
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to toggle password visibility
function setupPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle icon (assuming you have eye/eye-off icons)
            this.classList.toggle('visible');
        });
    });
}