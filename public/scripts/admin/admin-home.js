
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Navigation menu functionality
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');
                
                // For demo purposes
                const menuName = this.querySelector('span').textContent;
                alert(`Navigating to ${menuName} section`);
            });
        });
        

        const notificationBell = document.querySelector('.notification-bell');
        
        notificationBell.addEventListener('click', function() {
            alert('You have 3 new notifications');
            // In a real app, you would show a dropdown with notifications
        });
        
        // User avatar functionality
        const avatar = document.querySelector('.avatar');
        
        avatar.addEventListener('click', function() {
            alert('User profile options');
            // In a real app, you would show a dropdown with user options
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                alert(`Searching for: ${this.value}`);
                // In a real app, you would perform the search and display results
            }
        });
        
        // Product action buttons
        const editButtons = document.querySelectorAll('.actions .fa-pen');
        const deleteButtons = document.querySelectorAll('.actions .fa-trash');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productRow = this.closest('tr');
                const productName = productRow.querySelector('.product-name').textContent;
                alert(`Editing product: ${productName}`);
                // In a real app, you would show an edit form
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productRow = this.closest('tr');
                const productName = productRow.querySelector('.product-name').textContent;
                
                if (confirm(`Are you sure you want to delete ${productName}?`)) {
                    alert(`Product ${productName} deleted`);
                    // In a real app, you would remove the product from the database
                    // For demo purposes, just remove the row from the DOM
                    productRow.remove();
                }
            });
        });
        
        // Add product button
        // First, let's add the button to the HTML dynamically
        const inventoryTitle = document.querySelector('.section-title');
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary';
        addButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
        addButton.style.float = 'right';
        inventoryTitle.appendChild(addButton);
        
        addButton.addEventListener('click', function() {
            showAddProductForm();
        });
        
        // Function to show add product form
        function showAddProductForm() {
            // Create modal backdrop
            const backdrop = document.createElement('div');
            backdrop.style.position = 'fixed';
            backdrop.style.top = '0';
            backdrop.style.left = '0';
            backdrop.style.width = '100%';
            backdrop.style.height = '100%';
            backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            backdrop.style.zIndex = '1000';
            backdrop.style.display = 'flex';
            backdrop.style.justifyContent = 'center';
            backdrop.style.alignItems = 'center';
            
            // Create modal content
            const modal = document.createElement('div');
            modal.style.backgroundColor = 'white';
            modal.style.padding = '2rem';
            modal.style.borderRadius = '0.5rem';
            modal.style.width = '500px';
            modal.style.maxWidth = '90%';
            
            modal.innerHTML = `
                <h2 style="margin-bottom: 1.5rem;">Add New Product</h2>
                <form id="addProductForm">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Product Name</label>
                        <input type="text" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;" required>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Category</label>
                        <select style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;" required>
                            <option value="">Select Category</option>
                           
                            <option value="Smartphones">Smartphones</option>
                           <option value="Laptops">Laptops</option>                 
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Price ($)</label>
                        <input type="number" step="0.01" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;" required>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Stock</label>
                        <input type="number" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;" required>
                    </div>
                    <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
                        <button type="button" id="cancelBtn" class="btn btn-outline" style="padding: 0.5rem 1rem;">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem;">Add Product</button>
                    </div>
                </form>
            `;
            
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
            
            // Handle form submission
            const form = document.getElementById('addProductForm');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const inputs = form.querySelectorAll('input, select');
                const productName = inputs[0].value;
                const category = inputs[1].value;
                const price = inputs[2].value;
                const stock = inputs[3].value;
                
                // Add the new product to the table
                addProductToTable(productName, category, price, stock);
                
                // Close the modal
                document.body.removeChild(backdrop);
                
                // Show success message
                alert(`Product ${productName} added successfully!`);
            });
            
            // Handle cancel button
            const cancelBtn = document.getElementById('cancelBtn');
            cancelBtn.addEventListener('click', function() {
                document.body.removeChild(backdrop);
            });
        }
        
        // Function to add a product to the table
        function addProductToTable(name, category, price, stock) {
            const tableBody = document.querySelector('.products-table tbody');
            const newRow = document.createElement('tr');
            
            // Determine the product icon based on category
            let icon = 'fa-box';
            if (category === 'Electronics') icon = 'fa-laptop';
            else if (category === 'Smartphones') icon = 'fa-mobile-screen';
            else if (category === 'Audio') icon = 'fa-headphones';
            else if (category === 'Tablets') icon = 'fa-tablet';
            else if (category === 'Accessories') icon = 'fa-keyboard';
            
            // Determine the status based on stock
            let status = 'In Stock';
            let statusClass = 'status-in-stock';
            if (stock == 0) {
                status = 'Out of Stock';
                statusClass = 'status-out';
            } else if (stock < 10) {
                status = 'Low Stock';
                statusClass = 'status-low';
            }
            
            newRow.innerHTML = `
                <td>
                    <div class="product-cell">
                        <div class="product-img">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <div>
                            <div class="product-name">${name}</div>
                            <div class="product-category">${category}</div>
                        </div>
                    </div>
                </td>
                <td>${category}</td>
                <td>$${parseFloat(price).toFixed(2)}</td>
                <td>${stock}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-outline"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            tableBody.prepend(newRow);
            
            // Add event listeners to the new buttons
            const newEditBtn = newRow.querySelector('.fa-pen');
            const newDeleteBtn = newRow.querySelector('.fa-trash');
            
            newEditBtn.addEventListener('click', function() {
                alert(`Editing product: ${name}`);
            });
            
            newDeleteBtn.addEventListener('click', function() {
                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    newRow.remove();
                    alert(`Product ${name} deleted`);
                }
            });
        }
        
        // Create a simple chart for sales data
        // First, let's add a new section for the chart
        const recentSection = document.querySelector('.recent-section');
        const chartSection = document.createElement('div');
        chartSection.className = 'products-table';
        chartSection.style.marginTop = '2rem';
        chartSection.innerHTML = `
            <div class="section-title">Monthly Sales</div>
            <div style="padding: 1rem;">
                <canvas id="salesChart" width="400" height="200"></canvas>
            </div>
        `;
        
        recentSection.parentNode.insertBefore(chartSection, recentSection.nextSibling);
        
        // Add Chart.js library
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
        document.head.appendChild(chartScript);
        
        // Initialize the chart when the script loads
        chartScript.onload = function() {
            const ctx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales (₹)',
                        data: [15000, 19000, 17000, 18500, 21000, 24350],
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 2,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        };   
        
    });
