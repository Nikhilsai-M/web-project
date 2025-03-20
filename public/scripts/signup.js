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

        
        // Client-side validation
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
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Phone validation
        if (phone.length < 10) {
            document.getElementById('phone-error').textContent = 'Please enter a valid phone number';
            isValid = false;
        }
        
        // Password validation
        if (password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        // Confirm password
        if (password !== confirmPassword) {
            document.getElementById('confirmPassword-error').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        // If basic validation fails, stop here
        if (!isValid) return;
        
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';
        try {
            // Show loading state
     
            
            // Submit form data to server - use the route consistent with your createCustomer function in db.js
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
                    password
                })
            });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response. Check server endpoint configuration.');
            }
            
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
            showNotification('Network error or server issue. Please try again.', 'error');
        } finally {
            // Make sure to reference the button 
            const submitButton = signupForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText || 'Create Account';
            }
        }
    });
});

// Helper function for showing notifications
function showNotification(message, type) {
    const notification = document.querySelector('.notification');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationClose = notification.querySelector('.notification-close');
    
    // Set message
    notificationMessage.textContent = message;
    
    // Set appropriate icon and class
    notification.className = 'notification ' + type;
    
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fas fa-check-circle';
    } else if (type === 'error') {
        notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
    }
    
    // Show notification
    notification.style.display = 'flex';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
    
    // Close on click
    notificationClose.addEventListener('click', function() {
        notification.style.display = 'none';
    });
}

// Function to toggle password visibility
function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    // Set up toggle password button
    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Set up toggle confirm password button
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}