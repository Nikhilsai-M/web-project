document.addEventListener("DOMContentLoaded", function () {
    console.log("manage-inventory.js loaded!");
    const inventoryContainer = document.getElementById("inventoryContainer");
    const modal = document.getElementById("inventoryModal");
    const productDetails = document.getElementById("productDetails");
    const actionButtons = document.getElementById("actionButtons");
    const closeModalBtn = document.querySelector(".close");
    let currentProduct = null;
    let allProducts = [];

    // Fetch approved listings
    async function fetchApprovedListings() {
        console.log("Fetching approved listings...");
        try {
            const response = await fetch('/api/supervisor/approved-listings');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Response data:", data);
            if (data.success) {
                allProducts = data.products;
                displayProducts(allProducts);
            } else {
                inventoryContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${data.message || 'No approved listings found.'}</div>`;
            }
        } catch (error) {
            console.error('Error fetching approved listings:', error);
            inventoryContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error loading listings: ${error.message}</div>`;
        }
    }

    // Display products
    function displayProducts(products) {
        inventoryContainer.innerHTML = '';
        if (products.length === 0) {
            inventoryContainer.innerHTML = '<div class="no-items"><i class="fas fa-info-circle"></i> No approved listings found.</div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('inventory-card');
            card.innerHTML = `
                <h3>${product.type === 'phone' ? 'Phone' : 'Laptop'} #${product.id}</h3>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Model:</strong> ${product.model}</p>
                <p><strong>Status:</strong> ${product.status}</p>
                <p><strong>Submitted:</strong> ${new Date(product.created_at).toLocaleDateString()}</p>
                <button class="btn-view"><i class="fas fa-eye"></i> View Details</button>
            `;
            card.querySelector('.btn-view').addEventListener('click', () => showProductDetails(product));
            inventoryContainer.appendChild(card);
        });
    }

    // Show product details in modal
    async function showProductDetails(product) {
        try {
            const response = await fetch(`/api/supervisor/application/${product.type}/${product.id}`);
            const data = await response.json();
            if (data.success) {
                currentProduct = { type: data.type, id: data.application.id };
                productDetails.innerHTML = `
                    <p><strong>Type:</strong> ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
                    <p><strong>ID:</strong> ${data.application.id}</p>
                    <p><strong>Brand:</strong> ${data.application.brand}</p>
                    <p><strong>Model:</strong> ${data.application.model}</p>
                    <p><strong>RAM:</strong> ${data.application.ram}</p>
                    ${data.type === 'phone' ? `
                        <p><strong>ROM:</strong> ${data.application.rom}</p>
                        <p><strong>Processor:</strong> ${data.application.processor}</p>
                        <p><strong>Battery:</strong> ${data.application.battery} mAh</p>
                        <p><strong>Camera:</strong> ${data.application.camera}</p>
                        <p><strong>OS:</strong> ${data.application.os || 'N/A'}</p>
                        <p><strong>Network:</strong> ${data.application.network}</p>
                    ` : `
                        <p><strong>Storage:</strong> ${data.application.storage}</p>
                        <p><strong>Processor:</strong> ${data.application.processor}</p>
                        <p><strong>Generation:</strong> ${data.application.generation || 'N/A'}</p>
                        <p><strong>Display Size:</strong> ${data.application.display_size || 'N/A'}</p>
                        <p><strong>OS:</strong> ${data.application.os || 'N/A'}</p>
                    `}
                    <p><strong>Image:</strong> <a href="${data.application.image_path}" target="_blank">View Image</a></p>
                    <p><strong>Status:</strong> ${data.application.status}</p>
                `;

                actionButtons.innerHTML = '';
                if (data.application.status === 'approved') {
                    actionButtons.innerHTML = `
                        <label for="priceInput">Price (₹):</label>
                        <input type="number" id="priceInput" class="input-field" placeholder="Enter price" min="0" step="1" required>
                        <label for="conditionSelect">Condition:</label>
                        <select id="conditionSelect" class="input-field">
                            <option value="Used">Used</option>
                            <option value="Like New">Like New</option>
                            <option value="Refurbished">Refurbished</option>
                        </select>
                        <label for="discountInput">Discount (%):</label>
                        <input type="number" id="discountInput" class="input-field" placeholder="Discount (%)" min="0" max="100" value="0">
                        <button id="addToInventoryBtn" class="btn add-to-inventory"><i class="fas fa-plus"></i> Add to Inventory</button>
                    `;
                    document.getElementById('addToInventoryBtn').addEventListener('click', () => addToInventory(data.application));
                } else if (data.application.status === 'added_to_inventory') {
                    actionButtons.innerHTML = `<p><strong>Status:</strong> Already added to inventory</p>`;
                }

                modal.style.display = 'flex';
            } else {
                alert('Error loading product details: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            alert('Error loading product details.');
        }
    }

    // Add product to inventory and update modal
    async function addToInventory(application) {
        const price = parseFloat(document.getElementById('priceInput').value);
        const condition = document.getElementById('conditionSelect').value;
        const discount = parseFloat(document.getElementById('discountInput').value) || 0;

        if (!price || isNaN(price) || price <= 0) {
            alert('Please enter a valid price.');
            return;
        }
        if (!condition) {
            alert('Please select a condition.');
            return;
        }
        if (isNaN(discount) || discount < 0 || discount > 100) {
            alert('Please enter a valid discount between 0 and 100.');
            return;
        }

        try {
            const response = await fetch(`/api/supervisor/add-to-inventory/${currentProduct.type}/${currentProduct.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price, condition, discount })
            });
            const data = await response.json();
            if (data.success) {
                // Update modal content
                productDetails.innerHTML = `
                    <p><strong>Type:</strong> ${currentProduct.type.charAt(0).toUpperCase() + currentProduct.type.slice(1)}</p>
                    <p><strong>ID:</strong> ${application.id}</p>
                    <p><strong>Brand:</strong> ${application.brand}</p>
                    <p><strong>Model:</strong> ${application.model}</p>
                    <p><strong>RAM:</strong> ${application.ram}</p>
                    ${currentProduct.type === 'phone' ? `
                        <p><strong>ROM:</strong> ${application.rom}</p>
                        <p><strong>Processor:</strong> ${application.processor}</p>
                        <p><strong>Battery:</strong> ${application.battery} mAh</p>
                        <p><strong>Camera:</strong> ${application.camera}</p>
                        <p><strong>OS:</strong> ${application.os || 'N/A'}</p>
                        <p><strong>Network:</strong> ${application.network}</p>
                    ` : `
                        <p><strong>Storage:</strong> ${application.storage}</p>
                        <p><strong>Processor:</strong> ${application.processor}</p>
                        <p><strong>Generation:</strong> ${application.generation || 'N/A'}</p>
                        <p><strong>Display Size:</strong> ${application.display_size || 'N/A'}</p>
                        <p><strong>OS:</strong> ${application.os || 'N/A'}</p>
                    `}
                    <p><strong>Image:</strong> <a href="${application.image_path}" target="_blank">View Image</a></p>
                    <p><strong>Status:</strong> Added to inventory</p>
                    <p><strong>Price:</strong> ₹${price}</p>
                    <p><strong>Condition:</strong> ${condition}</p>
                    <p><strong>Discount:</strong> ${discount}%</p>
                `;
                actionButtons.innerHTML = `<p><strong>Status:</strong> Already added to inventory</p>`;
                alert('Added to inventory successfully!');
                fetchApprovedListings(); // Refresh the list in the background
                // Update stats on the home page if it's open
                if (window.updateItemsAdded) {
                    window.updateItemsAdded();
                }
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding to inventory:', error);
            alert('Error adding to inventory.');
        }
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
        currentProduct = null;
    }

    // Event listener for close button
    closeModalBtn.addEventListener('click', closeModal);

    // Initial fetch
    fetchApprovedListings();
});