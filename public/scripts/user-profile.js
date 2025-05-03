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
    
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const cancelChangePassword = document.getElementById('cancelChangePassword');

    let pieChart = null;

    // Helper function to format address display
    // /*
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
                
                // Update profile card
                profileName.textContent = fullNameStr;
                profileEmail.textContent = user.email;
                ordersCount.textContent = user.orders_count || 0;
                itemsSoldCount.textContent = user.items_sold_count || 0;
                
                // Update personal information
                fullName.textContent = fullNameStr;
                email.textContent = user.email;
                phone.textContent = user.phone || 'Not provided';
                
                // Update address display
                updateAddressDisplay(user.address);
                
                // Update password last changed
                passwordLastChanged.textContent = user.password_last_changed 
                    ? new Date(user.password_last_changed).toLocaleDateString() 
                    : 'N/A';

                // Render pie chart
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

    // Render pie chart
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
        personalInfoForm.style.display = 'none';
        personalInfoDisplay.style.display = 'grid';
    });

    // Handle personal information update
    personalInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            first_name: editFirstName.value,
            last_name: editLastName.value,
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
            
            if (data.success) {
                // Update UI immediately
                const fullNameStr = `${updatedData.first_name} ${updatedData.last_name}`;
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
                    console.log('Validation errors:', data.errors);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    });

    // Password change functionality
    changePasswordBtn.addEventListener('click', () => {
        changePasswordForm.style.display = 'block';
        changePasswordBtn.style.display = 'none';
    });

    cancelChangePassword.addEventListener('click', () => {
        changePasswordForm.style.display = 'none';
        changePasswordBtn.style.display = 'block';
        currentPassword.value = '';
        newPassword.value = '';
    });

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password. Please try again.');
        }
    });

    // Initial fetch
    fetchProfile();
});