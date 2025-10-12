document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggles();
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        

        clearErrors();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const street = document.getElementById('street').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const country = document.getElementById('country').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation flags
        let isValid = true;
        
        // First Name validation
        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        } else if (firstName.length < 2) {
            showError('firstName', 'First name must be at least 2 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s-]+$/.test(firstName)) {
            showError('firstName', 'First name can only contain letters, spaces, and hyphens');
            isValid = false;
        }
        
        // Last Name validation
        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        } else if (lastName.length < 2) {
            showError('lastName', 'Last name must be at least 2 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s-]+$/.test(lastName)) {
            showError('lastName', 'Last name can only contain letters, spaces, and hyphens');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address (e.g., user@example.com)');
            isValid = false;
        }
        
        // Phone validation
        const phoneRegex = /^\d{10,12}$/;
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('phone', 'Phone number must be 10-12 digits');
            isValid = false;
        }
        
        // Address validations
        if (!street) {
            showError('street', 'Street is required');
            isValid = false;
        }
        if (!city) {
            showError('city', 'City is required');
            isValid = false;
        }
        if (!state) {
            showError('state', 'State is required');
            isValid = false;
        }
        if (!postalCode) {
            showError('postalCode', 'Postal code is required');
            isValid = false;
        } else if (!/^\d{5,10}$/.test(postalCode)) {
            showError('postalCode', 'Postal code must be 5-10 digits');
            isValid = false;
        }
        if (!country) {
            showError('country', 'Country is required');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showError('password', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            isValid = false;
        }
        
        // Confirm Password validation
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Form submission
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';
        
        try {
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
                    address: {
                        street,
                        city,
                        state,
                        postal_code: postalCode,
                        country
                    },
                    password
                })
            });
            
            const data = await response.json();
            console.log('Signup response:', data); // Debug log
            
            if (!response.ok) {
                if (data.errors) {
                    Object.entries(data.errors).forEach(([field, message]) => {
                        // Handle nested address field errors
                        const fieldId = field.startsWith('address.') ? field.split('.')[1] : field;
                        showError(fieldId, message);
                    });
                } else {
                    showNotification(data.message || 'An error occurred', 'error');
                }
            } else {
                showNotification('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});

// Helper functions (unchanged)
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationClose = notification.querySelector('.notification-close');
    
    notificationMessage.textContent = message;
    notification.className = 'notification ' + type;
    notificationIcon.className = 'notification-icon fas ' + 
        (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
    
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
    
    notificationClose.onclick = () => {
        notification.style.display = 'none';
    };
}

function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}