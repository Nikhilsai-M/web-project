document.addEventListener('DOMContentLoaded', async () => {
    async function fetchStatistics() {
        try {
            const response = await fetch('/api/supervisor/statistics', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            if (data.success) {
                updateStatistics(data.stats);
            } else {
                console.error('Failed to fetch statistics:', data.message);
                document.getElementById('activitySummary').innerHTML = '<p>Error loading statistics.</p>';
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            document.getElementById('activitySummary').innerHTML = '<p>Error loading statistics.</p>';
        }
    }

    function updateStatistics(stats) {
        document.getElementById('totalItemsAdded').textContent = stats.totalItemsAdded || 0;
        document.getElementById('listingsVerified').textContent = stats.listingsVerified || 0;
        document.getElementById('pendingListings').textContent = stats.pendingListings || 0;
        document.getElementById('avgVerificationTime').textContent = stats.avgVerificationTime 
            ? `${stats.avgVerificationTime} mins` 
            : 'N/A';

        document.getElementById('activitySummary').innerHTML = `
            <ul>
                <li><i class="fas fa-box"></i> Items added today: ${stats.itemsAddedToday || 0}</li>
                <li><i class="fas fa-check"></i> Listings verified today: ${stats.verifiedToday || 0}</li>
                <li><i class="fas fa-history"></i> Last activity: ${stats.lastActivity || 'None'}</li>
            </ul>
        `;
    }

    fetchStatistics();

    document.getElementById('logout-button').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/supervisor/logout', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/supervisor/login';
            } else {
                alert('Logout failed: ' + data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error during logout.');
        }
    });
});