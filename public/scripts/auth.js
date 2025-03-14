/**
 * Common authentication utilities and functions
 */

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    notificationMessage.textContent = message;
    
    // Set icon based on notification type
    notificationIcon.className = 'notification-icon';
    if (type === 'success') {
        notificationIcon.classList.add('fas', 'fa-check-circle');
        notification.className = 'notification notification-success show';
    } else if (type === 'error') {
        notificationIcon.classList.add('fas', 'fa-exclamation-circle');
        notification.className = 'notification notification-error show';
    } else {
        notificationIcon.classList.add('fas', 'fa-info-circle');
        notification.className = 'notification notification-info show';
    }
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
    
    // Add click event to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
function isValidPassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber;
}

// Validate phone number (basic validation for Indian numbers)
function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Check if a user exists with the given email
function userExists(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Get user data by email
function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Setup password toggle visibility
function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

// Get user-specific cart
function getUserCart(userId) {
    const cartKey = `cart_${userId}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// Save user-specific cart
function saveUserCart(userId, cart) {
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// Transfer guest cart to user cart on login
function transferGuestCart(userId) {
    const guestCart = JSON.parse(localStorage.getItem('cart_guest')) || [];
    if (guestCart.length > 0) {
        const userCart = getUserCart(userId);
        
        // Merge carts: For items that exist in both, use the higher quantity
        const mergedCart = [...userCart];
        
        guestCart.forEach(guestItem => {
            const existingItemIndex = mergedCart.findIndex(item => item.id === guestItem.id);
            
            if (existingItemIndex !== -1) {
                // Item exists in user cart, keep the higher quantity
                if (guestItem.quantity > mergedCart[existingItemIndex].quantity) {
                    mergedCart[existingItemIndex].quantity = guestItem.quantity;
                }
            } else {
                // Item doesn't exist in user cart, add it
                mergedCart.push(guestItem);
            }
        });
        
        // Save merged cart to user's cart
        saveUserCart(userId, mergedCart);
        
        // Clear guest cart
        localStorage.setItem('cart_guest', JSON.stringify([]));
    }
}