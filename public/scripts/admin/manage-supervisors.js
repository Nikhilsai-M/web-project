document.addEventListener('DOMContentLoaded', () => {
    loadSupervisors();

    const form = document.getElementById('add-supervisor-form');
    const inputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        username: document.getElementById('username'),
        password: document.getElementById('password')
    };

    const errorDivs = {};
    Object.keys(inputs).forEach(key => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${key}-error`;
        inputs[key].parentNode.appendChild(errorDiv);
        errorDivs[key] = errorDiv;
    });

    const validators = {
        firstName: (value) => /^[A-Za-z]{2,50}$/.test(value.trim()) ? '' : 'First name must be 2-50 letters only.',
        lastName: (value) => /^[A-Za-z]{2,50}$/.test(value.trim()) ? '' : 'Last name must be 2-50 letters only.',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
        phone: (value) => /^(\d{10}|\d{3}-\d{3}-\d{4})$/.test(value.trim()) ? '' : 'Phone must be 10 digits or in format 123-456-7890.',
        username: (value) => /^[A-Za-z0-9]{4,20}$/.test(value.trim()) ? '' : 'Username must be 4-20 alphanumeric characters.',
        password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ? '' : 'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
    };

    Object.entries(inputs).forEach(([key, input]) => {
        input.addEventListener('input', () => {
            const errorMessage = validators[key](input.value);
            errorDivs[key].textContent = errorMessage;
            errorDivs[key].style.color = errorMessage ? 'red' : '';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            username: formData.get('username').trim(),
            password: formData.get('password')
        };

        const messageDiv = document.getElementById('form-message');
        
        if (!/^[A-Za-z]{2,50}$/.test(data.firstName)) {
            messageDiv.textContent = 'First name must be 2-50 letters only.';
            messageDiv.style.color = 'red';
            return;
        }
        if (!/^[A-Za-z]{2,50}$/.test(data.lastName)) {
            messageDiv.textContent = 'Last name must be 2-50 letters only.';
            messageDiv.style.color = 'red';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            messageDiv.textContent = 'Please enter a valid email address.';
            messageDiv.style.color = 'red';
            return;
        }
        if (!/^(\d{10}|\d{3}-\d{3}-\d{4})$/.test(data.phone)) {
            messageDiv.textContent = 'Phone must be 10 digits or in format 123-456-7890.';
            messageDiv.style.color = 'red';
            return;
        }
        if (!/^[A-Za-z0-9]{4,20}$/.test(data.username)) {
            messageDiv.textContent = 'Username must be 4-20 alphanumeric characters.';
            messageDiv.style.color = 'red';
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)) {
            messageDiv.textContent = 'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/admin/add-supervisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.success) {
                messageDiv.textContent = 'Supervisor added successfully!';
                messageDiv.style.color = 'green';
                form.reset();
                Object.values(errorDivs).forEach(div => div.textContent = '');
                loadSupervisors();
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
            loadSupervisors();
            alert('Supervisor deleted successfully!');
        } else {
            alert(result.message || 'Failed to delete supervisor.');
        }
    } catch (error) {
        console.error('Error deleting supervisor:', error);
        alert('Server error.');
    }
}