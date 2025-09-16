document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchStatistics();

    setInterval(fetchStatistics, 3000);

    document.getElementById('logout-button').addEventListener('click', handleLogout);
});

async function fetchStatistics() {
    try {
        const response = await fetch('/api/supervisor/statistics', {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include' 
        });

        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        
        if (data.success) {
            updateStatistics(data.statistics);
        } else {
            console.error('Error from server:', data.message);
            showError('Failed to load statistics');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showError('Error connecting to server');
    }
}

function updateStatistics(stats) {
    // Update DOM elements with new data
    document.getElementById('totalItemsAdded').textContent = stats.totalItemsAdded;
    document.getElementById('listingsVerified').textContent = stats.listingsVerified;
    document.getElementById('pendingListings').textContent = stats.pendingListings;


    // Update activity summary
    const activityContainer = document.getElementById('activitySummary');
    activityContainer.innerHTML = ''; // Clear existing content
    
    if (stats.recentActivity.length === 0) {
        activityContainer.innerHTML = '<p>No recent activity</p>';
    } else {
        const ul = document.createElement('ul');
        stats.recentActivity.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="activity-action">${activity.action}</span> 
                           <span class="activity-time">[${activity.timestamp}]</span>`;
            ul.appendChild(li);
        });
        activityContainer.appendChild(ul);
    }
}

function showError(message) {
    const statsGrid = document.querySelector('.stats-grid');
    statsGrid.innerHTML = `<p class="error-message">${message}</p>`;
    
    const activityContainer = document.getElementById('activitySummary');
    activityContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

async function handleLogout() {
    try {
        const response = await fetch('/api/supervisor/logout', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/supervisor/login';
        } else {
            alert('Logout failed: ' + data.message);
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout');
    }
}