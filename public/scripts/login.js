document.addEventListener('DOMContentLoaded', function() {
    // Setup password toggle
    setupPasswordToggles();
    
    // Get form element
    const loginForm = document.getElementById('loginForm');
    
    // Add form submit event listener
    loginForm.addEventListener('submit', function(e) {
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
        
        // Check if user exists
        const user = getUserByEmail(email);
        if (!user) {
            document.getElementById('email-error').textContent = 'No account found with this email';
            return;
        }
        
        // Validate password
        if (user.password !== password) {
            document.getElementById('password-error').textContent = 'Incorrect password';
            return;
        }
        
        // Login successful
        // Store user session
        const session = {
            userId: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentSession', JSON.stringify(session));
        
        // If remember me is checked, store in a longer-term cookie
        if (rememberMe) {
            localStorage.setItem('rememberUser', user.id);
        } else {
            localStorage.removeItem('rememberUser');
        }
        
        // Transfer any items from guest cart to user cart
        transferGuestCart(user.id);
        
        // Show success message
        showNotification('Login successful! Redirecting to homepage...', 'success');
        
        // Redirect to homepage after short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    });
    
    function transferGuestCart(userId) {
        localStorage.removeItem("cart"); // Remove any guest cart
        let userCartKey = `cart_${userId}`;
        let userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        localStorage.setItem(userCartKey, JSON.stringify(userCart)); // Ensure user has their cart
    }
    
    
    // Check for remembered user
    const rememberedUserId = localStorage.getItem('rememberUser');
    if (rememberedUserId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const rememberedUser = users.find(user => user.id === rememberedUserId);
        
        if (rememberedUser) {
            document.getElementById('email').value = rememberedUser.email;
            document.getElementById('remember').checked = true;
        }
    }
    
    // Handle social login buttons (placeholders)
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`${platform} login is not implemented in this demo`, 'info');
        });
    });
    
    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Password reset functionality is not implemented in this demo', 'info');
    });
});