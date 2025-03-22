document.addEventListener("DOMContentLoaded", function () {
    // Fetch dashboard data (e.g., pending listings, items added today)
    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/supervisor/dashboard');
            const data = await response.json();

            if (data.success) {
                document.getElementById('pendingListings').textContent = data.pendingListings || 0;
                document.getElementById('itemsAddedToday').textContent = data.itemsAddedToday || 0;

                const recentActivityList = document.getElementById('recentActivityList');
                recentActivityList.innerHTML = '';
                if (data.recentActivity && data.recentActivity.length > 0) {
                    data.recentActivity.forEach(activity => {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check-circle"></i> ${activity}`;
                        recentActivityList.appendChild(li);
                    });
                } else {
                    recentActivityList.innerHTML = '<li><i class="fas fa-circle-notch"></i> No recent activity available.</li>';
                }
            } else {
                console.error('Failed to load dashboard data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    // Logout functionality
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async function(e) {
            e.preventDefault();

            try {
                const response = await fetch('/api/supervisor/logout', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.removeItem("currentSession");
                    if (!localStorage.getItem("rememberUser")) {
                        localStorage.removeItem("rememberUser");
                    }
                    window.location.href = '/';
                } else {
                    console.error('Logout failed:', data.message);
                    alert('Failed to log out. Please try again.');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Error during logout. Please try again.');
            }
        });
    }

    // Initial fetch of dashboard data (if on dashboard page)
    if (document.getElementById('pendingListings')) {
        fetchDashboardData();
    }
});
