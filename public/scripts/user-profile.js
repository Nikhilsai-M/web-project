document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const ordersCount = document.getElementById('ordersCount');
    const itemsSoldCount = document.getElementById('itemsSoldCount');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const addressDisplay = document.getElementById('addressDisplay');
    const passwordLastChanged = document.getElementById('passwordLastChanged');
    
    const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');
    const personalInfoDisplay = document.getElementById('personalInfoDisplay');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editStreet = document.getElementById('editStreet');
    const editCity = document.getElementById('editCity');
    const editState = document.getElementById('editState');
    const editPostalCode = document.getElementById('editPostalCode');
    const editCountry = document.getElementById('editCountry');
    const cancelEditPersonalInfo = document.getElementById('cancelEditPersonalInfo');
    
    // Validation error elements (add these to your HTML)
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const streetError = document.getElementById('streetError');
    const cityError = document.getElementById('cityError');
    const stateError = document.getElementById('stateError');
    const postalCodeError = document.getElementById('postalCodeError');
    const countryError = document.getElementById('countryError');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordError = document.getElementById('newPasswordError');
    
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const cancelChangePassword = document.getElementById('cancelChangePassword');

    let pieChart = null;

    // Clear all errors
    function clearAllErrors() {
        [firstNameError, lastNameError, emailError, phoneError, streetError, 
         cityError, stateError, postalCodeError, countryError, 
         currentPasswordError, newPasswordError].forEach(errorEl => {
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.style.display = 'none';
            }
        });
    }

    // Show error message
    function showError(errorEl, message) {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            errorEl.style.color = '#dc3545';
        }
    }

    // Validate personal info
    function validatePersonalInfo() {
        clearAllErrors();
        let isValid = true;

        // First Name validation
        const firstName = editFirstName.value.trim();
        if (!firstName) {
            showError(firstNameError, 'First name is required');
            isValid = false;
        } else if (firstName.length < 2) {
            showError(firstNameError, 'First name must be at least 2 characters');
            isValid = false;
        }

        // Last Name validation
        const lastName = editLastName.value.trim();
        if (!lastName) {
            showError(lastNameError, 'Last name is required');
            isValid = false;
        } else if (lastName.length < 2) {
            showError(lastNameError, 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const emailVal = editEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            showError(emailError, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            showError(emailError, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        const phoneVal = editPhone.value.trim();
        if (phoneVal && !/^[0-9+\-\s()]{10,15}$/.test(phoneVal)) {
            showError(phoneError, 'Please enter a valid phone number');
            isValid = false;
        }

        // Street validation
        const street = editStreet.value.trim();
        if (street && street.length < 3) {
            showError(streetError, 'Street address must be at least 3 characters');
            isValid = false;
        }

        // City validation
        const city = editCity.value.trim();
        if (city && city.length < 2) {
            showError(cityError, 'City must be at least 2 characters');
            isValid = false;
        }

        // State validation
        const state = editState.value.trim();
        if (state && state.length < 2) {
            showError(stateError, 'State must be at least 2 characters');
            isValid = false;
        }

        // Postal Code validation
        const postalCode = editPostalCode.value.trim();
        if (postalCode && !/^[a-zA-Z0-9\s-]{3,10}$/.test(postalCode)) {
            showError(postalCodeError, 'Please enter a valid postal code');
            isValid = false;
        }

        // Country validation
        const country = editCountry.value.trim();
        if (country && country.length < 2) {
            showError(countryError, 'Country must be at least 2 characters');
            isValid = false;
        }

        return isValid;
    }

    // Validate password change
    function validatePasswordChange() {
        clearAllErrors();
        let isValid = true;

        // Current password validation
        const currentPass = currentPassword.value;
        if (!currentPass) {
            showError(currentPasswordError, 'Current password is required');
            isValid = false;
        } else if (currentPass.length < 6) {
            showError(currentPasswordError, 'Current password must be at least 6 characters');
            isValid = false;
        }

        // New password validation
        const newPass = newPassword.value;
        if (!newPass) {
            showError(newPasswordError, 'New password is required');
            isValid = false;
        } else if (newPass.length < 8) {
            showError(newPasswordError, 'New password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPass)) {
            showError(newPasswordError, 'New password must contain uppercase, lowercase, and number');
            isValid = false;
        } else if (newPass === currentPass) {
            showError(newPasswordError, 'New password must be different from current password');
            isValid = false;
        }

        return isValid;
    }

    function updateAddressDisplay(address) {
        if (!address) {
            addressDisplay.innerHTML = '<p class="no-address">Not provided</p>';
            return;
        } 

        const addressParts = [
            address.street ? `<li>${address.street}</li>` : '',
            address.city ? `<li>${address.city}</li>` : '',
            (address.state || address.postal_code) ? 
                `<li>${[address.state, address.postal_code].filter(Boolean).join(' ')}</li>` : '',
            address.country ? `<li>${address.country}</li>` : ''
        ].filter(part => part.trim() !== '');

        addressDisplay.innerHTML = addressParts.length > 0 ? 
            `<ul class="address-list">${addressParts.join('')}</ul>` : 
            '<p class="no-address">Not provided</p>';
    }

    // Fetch user profile data
    async function fetchProfile() {
        try {
            const response = await fetch('/api/customer/profile');
            const data = await response.json();
            
            if (data.success) {
                const user = data.user;
                const fullNameStr = `${user.first_name} ${user.last_name}`;
                
                profileName.textContent = fullNameStr;
                profileEmail.textContent = user.email;
                ordersCount.textContent = user.orders_count || 0;
                itemsSoldCount.textContent = user.items_sold_count || 0;
                
                fullName.textContent = fullNameStr;
                email.textContent = user.email;
                phone.textContent = user.phone || 'Not provided';
                
                updateAddressDisplay(user.address);
                
                passwordLastChanged.textContent = user.password_last_changed 
                    ? new Date(user.password_last_changed).toLocaleDateString() 
                    : 'N/A';

                renderPieChart(user.orders_count || 0, user.items_sold_count || 0);
            } else {
                handleProfileError(data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            handleProfileError('Error loading profile. Please try again later.');
        }
    }

    function handleProfileError(message) {
        alert('Failed to load profile: ' + message);
        profileName.textContent = 'User';
        profileEmail.textContent = 'N/A';
        ordersCount.textContent = '0';
        itemsSoldCount.textContent = '0';
        fullName.textContent = 'N/A';
        email.textContent = 'N/A';
        phone.textContent = 'N/A';
        updateAddressDisplay(null);
        passwordLastChanged.textContent = 'N/A';
        renderPieChart(0, 0);
    }

    function renderPieChart(orders, itemsSold) {
        const ctx = document.getElementById('ordersPieChart').getContext('2d');
        
        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Orders', 'Items Sold'],
                datasets: [{
                    data: [orders, itemsSold],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Orders vs Items Sold'
                    }
                }
            }
        });
    }

    // Edit personal information
    editPersonalInfoBtn.addEventListener('click', async () => {
        try {
            clearAllErrors();
            const response = await fetch('/api/customer/profile');
            const data = await response.json();
            
            if (data.success) {
                const user = data.user;
                const addressObj = user.address || {};
                
                editFirstName.value = user.first_name || '';
                editLastName.value = user.last_name || '';
                editEmail.value = user.email || '';
                editPhone.value = user.phone || '';
                editStreet.value = addressObj.street || '';
                editCity.value = addressObj.city || '';
                editState.value = addressObj.state || '';
                editPostalCode.value = addressObj.postal_code || '';
                editCountry.value = addressObj.country || '';
                
                personalInfoDisplay.style.display = 'none';
                personalInfoForm.style.display = 'grid';
            }
        } catch (error) {
            console.error('Error loading profile for edit:', error);
            alert('Error loading profile for edit. Please try again.');
        }
    });

    cancelEditPersonalInfo.addEventListener('click', () => {
        clearAllErrors();
        personalInfoForm.style.display = 'none';
        personalInfoDisplay.style.display = 'grid';
    });

    // Handle personal information update
    personalInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validatePersonalInfo()) {
            return;
        }
        
        const updatedData = {
            firstName: editFirstName.value,
            lastName: editLastName.value,
            email: editEmail.value,
            phone: editPhone.value,
            address: {
                street: editStreet.value,
                city: editCity.value,
                state: editState.value,
                postal_code: editPostalCode.value,
                country: editCountry.value
            }
        };
        
        try {
            const response = await fetch('/api/customer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            
            const data = await response.json();
            console.log(data);
            if (data.success) {
                // Update UI immediately
                const fullNameStr = `${updatedData.firstName} ${updatedData.lastName}`;
                profileName.textContent = fullNameStr;
                profileEmail.textContent = updatedData.email;
                fullName.textContent = fullNameStr;
                email.textContent = updatedData.email;
                phone.textContent = updatedData.phone || 'Not provided';
                updateAddressDisplay(updatedData.address);
                
                personalInfoForm.style.display = 'none';
                personalInfoDisplay.style.display = 'grid';
            } else {
                alert('Failed to update profile: ' + (data.message || 'Validation errors'));
                if (data.errors) {
                    // Handle server-side validation errors
                    Object.keys(data.errors).forEach(field => {
                        const errorEl = document.getElementById(`${field}Error`);
                        if (errorEl) {
                            showError(errorEl, data.errors[field][0]);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });

    // Password change functionality
    changePasswordBtn.addEventListener('click', () => {
        clearAllErrors();
        changePasswordForm.style.display = 'block';
        changePasswordBtn.style.display = 'none';
    });

    cancelChangePassword.addEventListener('click', () => {
        clearAllErrors();
        changePasswordForm.style.display = 'none';
        changePasswordBtn.style.display = 'block';
        currentPassword.value = '';
        newPassword.value = '';
    });

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validatePasswordChange()) {
            return;
        }
        
        const passwordData = {
            current_password: currentPassword.value,
            new_password: newPassword.value
        };
        
        try {
            const response = await fetch('/api/customer/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Password updated successfully!');
                changePasswordForm.style.display = 'none';
                changePasswordBtn.style.display = 'block';
                currentPassword.value = '';
                newPassword.value = '';
                fetchProfile(); // Refresh last changed date
            } else {
                alert('Failed to update password: ' + data.message);
                if (data.errors) {
                    // Handle server-side validation errors
                    Object.keys(data.errors).forEach(field => {
                        const errorEl = document.getElementById(`${field}Error`);
                        if (errorEl) {
                            showError(errorEl, data.errors[field][0]);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password. Please try again.');
        }
    });

    // Initial fetch
    fetchProfile();
});