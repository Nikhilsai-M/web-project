async function fetchSmartWatchData() {
    try {
        const response = await fetch('/api/smartwatches'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch smartwatch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching smartwatch data:', error);
        return []; // Return an empty array in case of error
    }
}
// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

// Function to display smartwatches  
function displayWatches(filteredWatches) {  
    const productList = document.getElementById('product-list');  
    productList.innerHTML = ''; // Clear the product list 
    
    if (filteredWatches.length === 0) {
        productList.innerHTML = `
            <div class="no-products">
                <h3>No products match your filters</h3>
                <p>Try adjusting your filter criteria or <button class="clear-all-inline">clear all filters</button></p>
            </div>
        `;
        
        // Add event listener to the inline clear button
        const clearInlineBtn = productList.querySelector(".clear-all-inline");
        if (clearInlineBtn) {
            clearInlineBtn.addEventListener("click", clearAllFilters);
        }
        return;
    }
     
    filteredWatches.forEach(smartwatch => {  
        const discountPrice = (smartwatch.originalPrice - (smartwatch.originalPrice * parseFloat(smartwatch.discount) / 100)).toFixed(2);  
        const productHTML = ` 
            <a href="/smartwatch/${smartwatch.id}" class="product-link">  
            
            <div class="product" data-id="${smartwatch.id}">  
                <img src="${smartwatch.image}" alt="${smartwatch.title}">
            
                <div class="product1">
                    <h3>${smartwatch.title}</h3>
                    <p class="discounted-price">₹${discountPrice}</p>
                    <span class="original-price">₹${smartwatch.originalPrice}</span><br>
                    <span class="discount">${smartwatch.discount} Off</span>
                    <ul>
                        <li>Brand: ${smartwatch.brand}</li>
                        <li>Display Type: ${smartwatch.display_type}</li>
                        <li>Display Size: ${smartwatch.display_size}mm</li>
                        <li>Battery Runtime: ${smartwatch.battery_runtime} days</li>
                    </ul>
                    </a>
                    <button class="add-to-cart-btn" style="background-color:green; color:white; padding:10px 10px 10px 10px; border:none; width:20%; border-radius:5px; margin-top:5px">Add to Cart</button>
                </div>
            </div>  
            
        `;  
        productList.innerHTML += productHTML;  
    });
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function(e) {
            const productDiv = e.target.closest(".product");
            const productId = productDiv.dataset.id;
            const smartwatch = filteredWatches.find(p => p.id == productId);
            
            if (smartwatch) {
                addToCart(smartwatch);
            }
        });
    });
}  

// Function to show "Added to Cart" message
function showAddedToCartMessage(productName) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${productName} added to cart! <a href="/cart">View Cart</a></p>
    `;
    document.body.appendChild(messageDiv);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 3000);
}

// Function to add a product to cart
function addToCart(smartwatch) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    let userId = session.userId; // Get logged-in user's ID
    let userCartKey = `cart_${userId}`; // Unique cart for each user

    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === smartwatch.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: smartwatch.id,
            title: smartwatch.title,
            brand: smartwatch.brand,
            displayType: smartwatch.display_type,
            displaySize: smartwatch.display_size,
            batteryRuntime: smartwatch.battery_runtime,
            image: smartwatch.image,
            price: smartwatch.originalPrice,
            discount: parseFloat(smartwatch.discount), // Convert to number to avoid NaN issues
            quantity: 1
        });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Store cart for specific user
    updateCartCount(cart);
    showAddedToCartMessage(smartwatch.title);
}

function filterWatches(smartwatches) {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedres = Array.from(document.querySelectorAll('.battery-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedtype = Array.from(document.querySelectorAll('.displaysize-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedcon = Array.from(document.querySelectorAll('.displaytype-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));
    
    // Predefined list of main brands (excluding "Others")
    const mainBrands = ["Apple", "Samsung", "Garmin", "Fitbit", "Xiaomi"]; // Adjust based on your actual smartwatch brands

    const filteredWatches = smartwatches.filter(smartwatch => {
        // Brand filter with corrected "Others" handling
        let matchesBrand = true;
        if (checkedBrands.length > 0) {
            const includesOthers = checkedBrands.includes("Others");
            const includesSpecificBrand = checkedBrands.includes(smartwatch.brand);
            const isOtherBrand = !mainBrands.includes(smartwatch.brand);

            if (!includesOthers) {
                matchesBrand = includesSpecificBrand;
            } else {
                matchesBrand = includesSpecificBrand || isOtherBrand;
            }
        }

        const matchedbattery = parseInt(smartwatch.battery_runtime);
        const matchesres = checkedres.length === 0 || checkedres.some(e => matchedbattery >= e);
        const matchedSize = parseInt(smartwatch.display_size);
        const matchesSize = checkedtype.length === 0 || checkedtype.some(f => matchedSize >= f);
        const matchescon = checkedcon.length === 0 || checkedcon.includes(smartwatch.display_type);
        const discountValue = parseInt(smartwatch.discount);
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d);
        
        return matchesBrand && matchesres && matchesSize && matchescon && matchesDiscount;
    });
    
    // Update the displayed smartwatches
    displayWatches(filteredWatches);
}

// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll('.brand-filter, .battery-filter, .displaysize-filter, .displaytype-filter, .discount-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Re-apply filters (which will now show all products)
    filterWatches();
}

// Function to update cart count in the header
function updateCartCount(cart) {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    }
}

// Initial setup when DOM is loaded
document.addEventListener('DOMContentLoaded', async() => {
    // Check if user is logged in
    const smartwatches=await fetchSmartWatchData();
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    // Initialize cart count on page load
    if (session && session.loggedIn) {
        let userId = session.userId;
        let userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        updateCartCount(cart);
    }
    
    // Display all smartwatches initially
    displayWatches(smartwatches);
    
    // Add event listeners for filters
    document.querySelectorAll('.brand-filter, .battery-filter, .displaysize-filter, .displaytype-filter, .discount-filter').forEach(checkbox => {
        checkbox.addEventListener('change', ()=> filterWatches(smartwatches));
    });
    
    // Add event listener for clear filters button if it exists
    const clearAllBtn = document.querySelector(".clear-all");
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", clearAllFilters);
    }
});

// Add CSS for the cart message
document.head.insertAdjacentHTML("beforeend", `
<style>
.cart-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
}

.cart-message a {
    color: white;
    font-weight: bold;
    text-decoration: underline;
}

.cart-message.fade-out {
    opacity: 0;
    transition: opacity 0.5s;
}

@keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.no-products {
    text-align: center;
    padding: 20px;
    margin: 20px 0;
    background-color: #f8f9fa;
    border-radius: 5px;
}

.clear-all-inline {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}
</style>
`);