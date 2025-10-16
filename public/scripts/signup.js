document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggles();
    const signupForm = document.getElementById('signupForm');
    
    // Real-time validation setup
    const fields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postalCode', 'country', 'password', 'confirmPassword'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => validateField(fieldId));
        }
    });
    // Special handling for confirmPassword when password changes
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', () => validateField('confirmPassword'));
    }
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearErrors();
        
        // Revalidate all fields
        fields.forEach(validateField);
        
        // Check if any errors exist
        const hasErrors = Array.from(document.querySelectorAll('.error-message')).some(el => el.textContent.trim() !== '');
        if (hasErrors) {
            return;
        }
        
        // Proceed with form submission if no errors
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

// Real-time field validation
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const value = field.value.trim();
    let message = '';
    
    const nameRegex = /^[a-zA-Z\s-]+$/;
    
    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`;
            } else if (value.length < 2) {
                message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} must be at least 2 characters`;
            } else if (!nameRegex.test(value)) {
                message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} can only contain letters, spaces, and hyphens`;
            }
            break;
        
        case 'street':
        case 'city':
        case 'state':
        case 'country':
            if (!value) {
                message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`;
            } else if (!nameRegex.test(value)) {
                message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} can only contain letters, spaces, and hyphens`;
            }
            break;
        
        case 'email':
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!value) {
                message = 'Email is required';
            } else if (!emailRegex.test(value)) {
                message = 'Please enter a valid email address (e.g., user@example.com)';
            }
            break;
        
        case 'phone':
            const phoneRegex = /^\d{10,12}$/;
            if (!value) {
                message = 'Phone number is required';
            } else if (!phoneRegex.test(value)) {
                message = 'Phone number must be 10-12 digits';
            }
            break;
        
        case 'postalCode':
            if (!value) {
                message = 'Postal code is required';
            } else if (!/^\d{5,10}$/.test(value)) {
                message = 'Postal code must be 5-10 digits';
            }
            break;
        
        case 'password':
            if (!value) {
                message = 'Password is required';
            } else if (value.length < 6) {
                message = 'Password must be at least 6 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                message = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
            }
            break;
        
        case 'confirmPassword':
            const passwordValue = document.getElementById('password').value;
            if (!value) {
                message = 'Please confirm your password';
            } else if (value !== passwordValue) {
                message = 'Passwords do not match';
            }
            break;
    }
    
    if (message) {
        showError(fieldId, message);
    } else {
        clearError(fieldId);
    }
}

// Helper functions
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
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