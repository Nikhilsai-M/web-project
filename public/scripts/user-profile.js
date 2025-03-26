document.addEventListener('DOMContentLoaded', function () {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const ordersCount = document.getElementById('ordersCount');
    const itemsSoldCount = document.getElementById('itemsSoldCount');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const passwordLastChanged = document.getElementById('passwordLastChanged');
    
    const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');
    const personalInfoDisplay = document.getElementById('personalInfoDisplay');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const cancelEditPersonalInfo = document.getElementById('cancelEditPersonalInfo');
    
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const cancelChangePassword = document.getElementById('cancelChangePassword');

    let pieChart; // To store the Chart instance

    // Fetch user profile data and render pie chart
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
                phone.textContent = user.phone;
                
                // Update password last changed
                passwordLastChanged.textContent = user.password_last_changed 
                    ? new Date(user.password_last_changed).toLocaleDateString() 
                    : 'N/A';

                // Render pie chart
                renderPieChart(user.orders_count || 0, user.items_sold_count || 0);
            } else {
                alert('Failed to load profile: ' + data.message);
                profileName.textContent = 'User';
                profileEmail.textContent = 'N/A';
                ordersCount.textContent = '0';
                itemsSoldCount.textContent = '0';
                fullName.textContent = 'N/A';
                email.textContent = 'N/A';
                phone.textContent = 'N/A';
                passwordLastChanged.textContent = 'N/A';
                renderPieChart(0, 0); // Fallback chart
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Error loading profile. Please try again later.');
            profileName.textContent = 'User';
            profileEmail.textContent = 'N/A';
            ordersCount.textContent = '0';
            itemsSoldCount.textContent = '0';
            fullName.textContent = 'N/A';
            email.textContent = 'N/A';
            phone.textContent = 'N/A';
            passwordLastChanged.textContent = 'N/A';
            renderPieChart(0, 0); // Fallback chart
        }
    }

    // Render pie chart
    function renderPieChart(orders, itemsSold) {
        const ctx = document.getElementById('ordersPieChart').getContext('2d');
        
        // Destroy existing chart if it exists
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

    // Show edit form for personal information
    editPersonalInfoBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/customer/profile');
            const data = await response.json();
            
            if (data.success) {
                const user = data.user;
                editFirstName.value = user.first_name || '';
                editLastName.value = user.last_name || '';
                editEmail.value = user.email || '';
                editPhone.value = user.phone || '';
                
                personalInfoDisplay.style.display = 'none';
                personalInfoForm.style.display = 'grid';
            }
        } catch (error) {
            console.error('Error loading profile for edit:', error);
            alert('Error loading profile for edit. Please try again.');
        }
    });

    // Cancel editing personal information
    cancelEditPersonalInfo.addEventListener('click', () => {
        personalInfoForm.style.display = 'none';
        personalInfoDisplay.style.display = 'grid';
    });

    // Handle personal information update
    personalInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            firstName: editFirstName.value,
            lastName: editLastName.value,
            email: editEmail.value,
            phone: editPhone.value
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
                personalInfoForm.style.display = 'none';
                personalInfoDisplay.style.display = 'grid';
                fetchProfile(); // Refresh profile data and chart
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

    // Show change password form
    changePasswordBtn.addEventListener('click', () => {
        changePasswordForm.style.display = 'block';
        changePasswordBtn.style.display = 'none';
    });

    // Cancel changing password
    cancelChangePassword.addEventListener('click', () => {
        changePasswordForm.style.display = 'none';
        changePasswordBtn.style.display = 'block';
        currentPassword.value = '';
        newPassword.value = '';
    });

    // Handle password change
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const passwordData = {
            currentPassword: currentPassword.value,
            newPassword: newPassword.value
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
                fetchProfile(); // Refresh password last changed date and chart
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