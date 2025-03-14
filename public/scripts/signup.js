document.addEventListener('DOMContentLoaded', function() {
    // Setup password toggle
    setupPasswordToggles();
    
    // Get form element
    const signupForm = document.getElementById('signupForm');
    
    // Add form submit event listener
    signupForm.addEventListener('submit', function(e) {
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
        const agreeTerms = document.getElementById('terms').checked;
        
        // Validate form inputs
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
        
        // Validate email
        if (!isValidEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        } else if (userExists(email)) {
            document.getElementById('email-error').textContent = 'This email is already registered';
            isValid = false;
        }
        
        // Validate phone number
        if (!isValidPhone(phone)) {
            document.getElementById('phone-error').textContent = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }
        
        // Validate password strength
        if (!isValidPassword(password)) {
            document.getElementById('password-error').textContent = 
                'Password must be at least 8 characters with uppercase, lowercase, and number';
            isValid = false;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            document.getElementById('confirmPassword-error').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        // Check terms agreement
        if (!agreeTerms) {
            document.getElementById('terms-error').textContent = 'You must agree to the Terms of Service';
            isValid = false;
        }
        
        // If form is not valid, stop here
        if (!isValid) return;
        
        // Form is valid, create new user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Generate a unique ID
        const userId = 'user_' + Date.now();
        
        // Create user object
        const newUser = {
            id: userId,
            firstName,
            lastName,
            email,
            phone,
            password, // Note: In a real app, you should hash passwords
            createdAt: new Date().toISOString()
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showNotification('Account created successfully! Redirecting to login page...', 'success');
        
        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    });
    
    // Handle social signup buttons (placeholders)
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} signup is not implemented in this demo`, 'info');
        });
    });
});