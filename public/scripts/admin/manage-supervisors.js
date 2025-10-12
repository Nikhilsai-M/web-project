document.addEventListener('DOMContentLoaded', () => {
    loadSupervisors();

    const form = document.getElementById('add-supervisor-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/admin/add-supervisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            const messageDiv = document.getElementById('form-message');
            if (result.success) {
                messageDiv.textContent = 'Supervisor added successfully!';
                messageDiv.style.color = 'green';
                form.reset();
                loadSupervisors(); // Refresh the list
            } else {
                messageDiv.textContent = result.message || 'Failed to add supervisor.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error adding supervisor:', error);
            document.getElementById('form-message').textContent = 'Server error.';
            document.getElementById('form-message').style.color = 'red';
        }
    });
});

async function loadSupervisors() {
    try {
        const response = await fetch('/api/admin/supervisors');
        const result = await response.json();
        console.log('API response:', result); // Debug log

        const container = document.getElementById('supervisors-container');
        container.innerHTML = '';

        if (result.success && result.supervisors && result.supervisors.length > 0) {
            result.supervisors.forEach(supervisor => {
                const card = document.createElement('div');
                card.className = 'supervisor-card';
                card.innerHTML = `
                    <div>
                        <strong>${supervisor.first_name} ${supervisor.last_name}</strong><br>
                        Email: ${supervisor.email}<br>
                        Phone: ${supervisor.phone}<br>
                        Username: ${supervisor.username}<br>
                        Created: ${supervisor.created_at ? new Date(supervisor.created_at).toLocaleString() : 'N/A'}
                    </div>
                    <button onclick="deleteSupervisor('${supervisor.user_id}')">Delete</button>
                `;
                container.appendChild(card);
            });
        } else {
            container.textContent = 'No supervisors found.';
        }
    } catch (error) {
        console.error('Error loading supervisors:', error);
        document.getElementById('supervisors-container').textContent = 'Failed to load supervisors.';
    }
}

async function deleteSupervisor(userId) {
    if (!confirm('Are you sure you want to delete this supervisor?')) return;

    try {
        const response = await fetch(`/api/admin/supervisors/${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            loadSupervisors(); // Refresh the list
            alert('Supervisor deleted successfully!');
        } else {
            alert(result.message || 'Failed to delete supervisor.');
        }
    } catch (error) {
        console.error('Error deleting supervisor:', error);
        alert('Server error.');
    }
}