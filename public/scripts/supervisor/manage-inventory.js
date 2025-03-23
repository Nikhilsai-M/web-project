document.addEventListener("DOMContentLoaded", function () {
    console.log("manage-inventory.js loaded!");
    const inventoryContainer = document.getElementById("inventoryContainer");
    const modal = document.getElementById("inventoryModal");
    const productDetails = document.getElementById("productDetails");
    const actionButtons = document.getElementById("actionButtons");
    const closeModalBtn = document.querySelector(".close");
    const createForm = document.getElementById("createInventoryForm");
    const createMessage = document.getElementById("createMessage");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const itemTypeSelect = document.getElementById("itemType");
    const dynamicFields = document.getElementById("dynamicFields");
    const submitButton = document.querySelector(".btn-submit"); // Add reference to submit button
    let currentProduct = null;
    let allProducts = [];

    // Dynamic field definitions
    const fieldTemplates = {
        phone: `
            <div class="form-group"><label>Model:</label><input type="text" name="model" required></div>
            <div class="form-group"><label>Color:</label><input type="text" name="color" required></div>
            <div class="form-group"><label>Processor:</label><input type="text" name="processor" required></div>
            <div class="form-group"><label>Display:</label><input type="text" name="display" required></div>
            <div class="form-group"><label>Battery:</label><input type="number" name="battery" required></div>
            <div class="form-group"><label>Camera:</label><input type="text" name="camera" required></div>
            <div class="form-group"><label>OS:</label><input type="text" name="os" required></div>
            <div class="form-group"><label>Network:</label><input type="text" name="network" required></div>
            <div class="form-group"><label>Weight:</label><input type="text" name="weight" required></div>
            <div class="form-group"><label>RAM:</label><input type="text" name="ram" required></div>
            <div class="form-group"><label>ROM:</label><input type="text" name="rom" required></div>
            <div class="form-group"><label>Condition:</label><select name="condition" required><option value="Used">Used</option><option value="Like New">Like New</option><option value="Refurbished">Refurbished</option></select></div>
        `,
        laptop: `
            <div class="form-group"><label>Series:</label><input type="text" name="series" required></div>
            <div class="form-group"><label>Processor Name:</label><input type="text" name="processor_name" required></div>
            <div class="form-group"><label>Processor Generation:</label><input type="text" name="processor_generation" required></div>
            <div class="form-group"><label>RAM:</label><input type="text" name="ram" required></div>
            <div class="form-group"><label>Storage Type:</label><input type="text" name="storage_type" required></div>
            <div class="form-group"><label>Storage Capacity:</label><input type="text" name="storage_capacity" required></div>
            <div class="form-group"><label>Display Size:</label><input type="number" name="display_size" step="0.1" required></div>
            <div class="form-group"><label>Weight:</label><input type="number" name="weight" step="0.1" required></div>
            <div class="form-group"><label>Condition:</label><select name="condition" required><option value="Used">Used</option><option value="Like New">Like New</option><option value="Refurbished">Refurbished</option></select></div>
            <div class="form-group"><label>OS:</label><input type="text" name="os" required></div>
        `,
        earphones: `
            <div class="form-group"><label>Title:</label><input type="text" name="title" required></div>
            <div class="form-group"><label>Design:</label><input type="text" name="design" required></div>
            <div class="form-group"><label>Battery Life:</label><input type="text" name="battery_life" required></div>
        `,
        chargers: `
            <div class="form-group"><label>Title:</label><input type="text" name="title" required></div>
            <div class="form-group"><label>Wattage:</label><input type="text" name="wattage" required></div>
            <div class="form-group"><label>Type:</label><input type="text" name="type" required></div>
            <div class="form-group"><label>Output Current:</label><input type="text" name="output_current" required></div>
        `,
        mouses: `
            <div class="form-group"><label>Title:</label><input type="text" name="title" required></div>
            <div class="form-group"><label>Type:</label><input type="text" name="type" required></div>
            <div class="form-group"><label>Connectivity:</label><input type="text" name="connectivity" required></div>
            <div class="form-group"><label>Resolution:</label><input type="text" name="resolution" required></div>
        `,
        smartwatches: `
            <div class="form-group"><label>Title:</label><input type="text" name="title" required></div>
            <div class="form-group"><label>Display Size:</label><input type="text" name="display_size" required></div>
            <div class="form-group"><label>Display Type:</label><input type="text" name="display_type" required></div>
            <div class="form-group"><label>Battery Runtime:</label><input type="text" name="battery_runtime" required></div>
        `
    };

    // Update dynamic fields based on item type
    itemTypeSelect.addEventListener("change", () => {
        dynamicFields.innerHTML = fieldTemplates[itemTypeSelect.value] || "";
    });
    dynamicFields.innerHTML = fieldTemplates[itemTypeSelect.value];

    // Fetch all inventory items
    async function fetchInventory() {
        try {
            const response = await fetch('/api/supervisor/inventory');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            if (data.success) {
                allProducts = data.items;
                displayProducts(allProducts);
            } else {
                inventoryContainer.innerHTML = `<div class="no-items"><i class="fas fa-info-circle"></i> ${data.message || 'No inventory items found.'}</div>`;
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            inventoryContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error loading inventory: ${error.message}</div>`;
        }
    }

    // Display products
    function displayProducts(products) {
        inventoryContainer.innerHTML = '';
        if (products.length === 0) {
            inventoryContainer.innerHTML = '<div class="no-items"><i class="fas fa-info-circle"></i> No items found.</div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('inventory-card');
            let details = `
                <h3>${product.type.charAt(0).toUpperCase() + product.type.slice(1)} #${product.id}</h3>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> ₹${product.originalPrice || product.base_price ||product.pricing.basePrice ||'N/A'}</p>
                <p><strong>Discount:</strong> ${product.discount || product.pricing.discount ||'0'}</p>
            `;
            if (product.type === 'phone') details += `<p><strong>Model:</strong> ${product.model || 'N/A'}</p>`;
            if (product.type === 'laptop') details += `<p><strong>Series:</strong> ${product.series || 'N/A'}</p>`;
            if (['earphones', 'chargers', 'mouses', 'smartwatches'].includes(product.type)) details += `<p><strong>Title:</strong> ${product.title || 'N/A'}</p>`;
            card.innerHTML = details + `<button class="btn-view"><i class="fas fa-eye"></i> View/Manage</button>`;
            card.querySelector('.btn-view').addEventListener('click', () => showProductDetails(product));
            inventoryContainer.appendChild(card);
        });
    }

    // Show product details in modal
    function showProductDetails(product) {
        currentProduct = { type: product.type, id: product.id };
        console.log(product);
        let formHTML = `
            <form id="editForm">
                <p><strong>Type:</strong> ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}</p>
                <p><strong>ID:</strong> ${product.id}</p>
                <div class="form-group"><label>Brand:</label><input type="text" name="brand" value="${product.brand || ''}" required></div>
                <div class="form-group"><label>Original Price (₹):</label><input type="number" name="price" value="${product.originalPrice || product.basePrice || product.pricing.basePrice||''}" min="0" step="1" required></div>
                <div class="form-group"><label>Discount (%):</label><input type="number" name="discount" value="${product.discount || product.pricing.discount||'0'}" min="0" max="100" step="1" required></div>
                <div class="form-group"><label>Image URL:</label><input type="text" name="image" value="${product.image || ''}" required></div>
        `;
        if (product.type === 'phones') {
            formHTML += `
                <div class="form-group"><label>Model:</label><input type="text" name="model" value="${product.model || ''}" required></div>
                <div class="form-group"><label>Processor:</label><input type="text" name="processor" value="${product.specs.processor || ''}" required></div>
                <div class="form-group"><label>Display:</label><input type="text" name="display" value="${product.specs.display || ''}" required></div>
                <div class="form-group"><label>Battery:</label><input type="number" name="battery" value="${product.specs.battery || ''}" required></div>
                <div class="form-group"><label>Camera:</label><input type="text" name="camera" value="${product.specs.camera || ''}" required></div>
                <div class="form-group"><label>OS:</label><input type="text" name="os" value="${product.specs.os || ''}" required></div>
                <div class="form-group"><label>Network:</label><input type="text" name="network" value="${product.specs.network || ''}" required></div>
                <div class="form-group"><label>Weight:</label><input type="text" name="weight" value="${product.specs.weight || ''}" required></div>
                <div class="form-group"><label>RAM:</label><input type="text" name="ram" value="${product.ram || ''}" required></div>
                <div class="form-group"><label>ROM:</label><input type="text" name="rom" value="${product.rom || ''}" required></div>
                <div class="form-group"><label>Condition:</label><select name="condition" required>
                    <option value="Used" ${product.condition === 'Used' ? 'selected' : ''}>Used</option>
                    <option value="Like New" ${product.condition === 'Like New' ? 'selected' : ''}>Like New</option>
                    <option value="Refurbished" ${product.condition === 'Refurbished' ? 'selected' : ''}>Refurbished</option>
                </select></div>
            `;
        } else if (product.type === 'laptops') {
            formHTML += `
                <div class="form-group"><label>Series:</label><input type="text" name="series" value="${product.series || ''}" required></div>
                <div class="form-group"><label>Processor Name:</label><input type="text" name="processor_name" value="${product.processor.name || ''}" required></div>
                <div class="form-group"><label>Processor Generation:</label><input type="text" name="processor_generation" value="${product.processor.generation || ''}" required></div>
                <div class="form-group"><label>RAM:</label><input type="text" name="ram" value="${product.memory.ram || ''}" required></div>
                <div class="form-group"><label>Storage Type:</label><input type="text" name="storage_type" value="${product.memory.storage.type || ''}" required></div>
                <div class="form-group"><label>Storage Capacity:</label><input type="text" name="storage_capacity" value="${product.memory.storage.capacity || ''}" required></div>
                <div class="form-group"><label>Display Size:</label><input type="number" name="display_size" value="${product.displaysize || ''}" step="0.1" required></div>
                <div class="form-group"><label>Weight:</label><input type="number" name="weight" value="${product.weight || ''}" step="0.1" required></div>
                <div class="form-group"><label>Condition:</label><select name="condition" required>
                    <option value="Used" ${product.condition === 'Used' ? 'selected' : ''}>Used</option>
                    <option value="Like New" ${product.condition === 'Like New' ? 'selected' : ''}>Like New</option>
                    <option value="Refurbished" ${product.condition === 'Refurbished' ? 'selected' : ''}>Refurbished</option>
                </select></div>
                <div class="form-group"><label>OS:</label><input type="text" name="os" value="${product.os || ''}" required></div>
            `;
        } else if (product.type === 'earphones') {
            formHTML += `
                <div class="form-group"><label>Title:</label><input type="text" name="title" value="${product.title || ''}" required></div>
                <div class="form-group"><label>Design:</label><input type="text" name="design" value="${product.design || ''}" required></div>
                <div class="form-group"><label>Battery Life:</label><input type="text" name="battery_life" value="${product.batteryLife || ''}" required></div>
            `;
        } else if (product.type === 'chargers') {
            formHTML += `
                <div class="form-group"><label>Title:</label><input type="text" name="title" value="${product.title || ''}" required></div>
                <div class="form-group"><label>Wattage:</label><input type="text" name="wattage" value="${product.wattage || ''}" required></div>
                <div class="form-group"><label>Type:</label><input type="text" name="type" value="${product.type || ''}" required></div>
                <div class="form-group"><label>Output Current:</label><input type="text" name="output_current" value="${product.outputCurrent || ''}" required></div>
            `;
        } else if (product.type === 'mouses') {
            formHTML += `
                <div class="form-group"><label>Title:</label><input type="text" name="title" value="${product.title || ''}" required></div>
                <div class="form-group"><label>Type:</label><input type="text" name="type" value="${product.type || ''}" required></div>
                <div class="form-group"><label>Connectivity:</label><input type="text" name="connectivity" value="${product.connectivity || ''}" required></div>
                <div class="form-group"><label>Resolution:</label><input type="text" name="resolution" value="${product.resolution || ''}" required></div>
            `;
        } else if (product.type === 'smartwatches') {
            formHTML += `
                <div class="form-group"><label>Title:</label><input type="text" name="title" value="${product.title || ''}" required></div>
                <div class="form-group"><label>Display Size:</label><input type="text" name="display_size" value="${product.displaySize || ''}" required></div>
                <div class="form-group"><label>Display Type:</label><input type="text" name="display_type" value="${product.displayType || ''}" required></div>
                <div class="form-group"><label>Battery Runtime:</label><input type="text" name="battery_runtime" value="${product.batteryRuntime || ''}" required></div>
            `;
        }
        formHTML += `</form>`;
        productDetails.innerHTML = formHTML;
        actionButtons.innerHTML = `
            <button id="updateBtn" class="btn update"><i class="fas fa-save"></i> Update</button>
            <button id="deleteBtn" class="btn delete"><i class="fas fa-trash"></i> Delete</button>
        `;
        document.getElementById('updateBtn').addEventListener('click', () => updateProduct());
        document.getElementById('deleteBtn').addEventListener('click', () => deleteProduct());
        modal.style.display = 'flex';
    }

    // Create new inventory item
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = new FormData(createForm);
        const itemType = formData.get('itemType').toLowerCase();
        const data = {
            type: itemType,
            id: formData.get('id'),
            brand: formData.get('brand'),
            pricing: {
                originalPrice: parseFloat(formData.get('price')),
                discount: parseFloat(formData.get('discount') || '0')
            },
            image: formData.get('image')
        };

        if (itemType === 'phone') {
            Object.assign(data, {
                model: formData.get('model'),
                color: formData.get('color'),
                processor: formData.get('processor'),
                display: formData.get('display'),
                battery: parseInt(formData.get('battery')),
                camera: formData.get('camera'),
                os: formData.get('os'),
                network: formData.get('network'),
                weight: formData.get('weight'),
                ram: formData.get('ram'),
                rom: formData.get('rom'),
                condition: formData.get('condition')
            });
        } else if (itemType === 'laptop') {
            Object.assign(data, {
                series: formData.get('series'),
                processor_name: formData.get('processor_name'),
                processor_generation: formData.get('processor_generation'),
                ram: formData.get('ram'),
                storage_type: formData.get('storage_type'),
                storage_capacity: formData.get('storage_capacity'),
                display_size: parseFloat(formData.get('display_size')),
                weight: parseFloat(formData.get('weight')),
                condition: formData.get('condition'),
                os: formData.get('os')
            });
        } else if (itemType === 'earphones') {
            Object.assign(data, {
                title: formData.get('title'),
                design: formData.get('design'),
                battery_life: formData.get('battery_life')
            });
        } else if (itemType === 'chargers') {
            Object.assign(data, {
                title: formData.get('title'),
                wattage: formData.get('wattage'),
                Pin_type: formData.get('type'),
                output_current: formData.get('output_current')
            });
        } else if (itemType === 'mouses') {
            Object.assign(data, {
                title: formData.get('title'),
                wire_type: formData.get('type'),
                connectivity: formData.get('connectivity'),
                resolution: formData.get('resolution')
            });
        } else if (itemType === 'smartwatches') {
            Object.assign(data, {
                title: formData.get('title'),
                display_size: formData.get('display_size'),
                display_type: formData.get('display_type'),
                battery_runtime: formData.get('battery_runtime')
            });
        }

        try {
            console.log('Sending data:', data);
            console.log('item type:',itemType);
            const response = await fetch('/api/supervisor/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Response:', result);
            if (result.success) {
                createMessage.textContent = 'Item added successfully!';
                createMessage.className = 'message success';
                createForm.reset();
                dynamicFields.innerHTML = fieldTemplates[itemTypeSelect.value];
                fetchInventory();
            } else {
                createMessage.textContent = result.message || 'Failed to add item.';
                createMessage.className = 'message error';
            }
        } catch (error) {
            console.error('Error adding item:', error);
            createMessage.textContent = 'Error adding item.';
            createMessage.className = 'message error';
        }
    });

    // Update product
    async function updateProduct() {
        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        console.log(formData);
        const data = {
            type: currentProduct.type,
            brand: formData.get('brand'),
            pricing: {
                originalPrice: parseFloat(formData.get('price')),
                discount: parseFloat(formData.get('discount') || '0')
            },
            image: formData.get('image')
        };

        if (currentProduct.type === 'phones') {
            Object.assign(data, {
                model: formData.get('model'),
                color: formData.get('color'),
                processor: formData.get('processor'),
                display: formData.get('display'),
                battery: parseInt(formData.get('battery')),
                camera: formData.get('camera'),
                os: formData.get('os'),
                network: formData.get('network'),
                weight: formData.get('weight'),
                ram: formData.get('ram'),
                rom: formData.get('rom'),
                condition: formData.get('condition')
            });
        } else if (currentProduct.type === 'laptops') {
            Object.assign(data, {
                series: formData.get('series'),
                processor_name: formData.get('processor_name'),
                processor_generation: formData.get('processor_generation'),
                ram: formData.get('ram'),
                storage_type: formData.get('storage_type'),
                storage_capacity: formData.get('storage_capacity'),
                display_size: parseFloat(formData.get('display_size')),
                weight: parseFloat(formData.get('weight')),
                condition: formData.get('condition'),
                os: formData.get('os')
            });
        } else if (currentProduct.type === 'earphones') {
            Object.assign(data, {
                title: formData.get('title'),
                design: formData.get('design'),
                battery_life: formData.get('battery_life')
            });
        } else if (currentProduct.type === 'chargers') {
            Object.assign(data, {
                title: formData.get('title'),
                wattage: formData.get('wattage'),
                type: formData.get('type'),
                output_current: formData.get('output_current')
            });
        } else if (currentProduct.type === 'mouses') {
            Object.assign(data, {
                title: formData.get('title'),
                type: formData.get('type'),
                connectivity: formData.get('connectivity'),
                resolution: formData.get('resolution')
            });
        } else if (currentProduct.type === 'smartwatches') {
            Object.assign(data, {
                title: formData.get('title'),
                display_size: formData.get('display_size'),
                display_type: formData.get('display_type'),
                battery_runtime: formData.get('battery_runtime')
            });
        }

        try {
            const response = await fetch(`/api/supervisor/inventory/${currentProduct.type}/${currentProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert('Item updated successfully!');
                modal.style.display = 'none';
                fetchInventory();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item.');
        }
    }

    // Delete product
    async function deleteProduct() {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`/api/supervisor/inventory/${currentProduct.type}/${currentProduct.id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                alert('Item deleted successfully!');
                modal.style.display = 'none';
                fetchInventory();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item.');
        }
    }

    // Filter products
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            let filteredProducts = allProducts;
            if (filter !== 'all') {
                filteredProducts = allProducts.filter(product => product.type === filter);
            }
            displayProducts(filteredProducts);
        });
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        currentProduct = null;
    });

    // Initial fetch
    fetchInventory();
});