import { accessoriesData } from './accessories-data.js';

const productList = document.getElementById('product-list');
// Access the chargers array from the imported object
const chargers = accessoriesData.chargers;

// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

// Function to display chargers
function displayChargers(filteredChargers) {
    productList.innerHTML = ''; // Clear the product list
    
    if (filteredChargers.length === 0) {
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
    
    filteredChargers.forEach(charger => {
        const discountPrice = (charger.originalPrice - (charger.originalPrice * parseFloat(charger.discount) / 100)).toFixed(2);
        const productHTML = `
            <a href="/charger/${charger.id}" class="product-link"> 
            <div class="product" data-id="${charger.id}">
                <img src="${charger.image}" alt="${charger.title}">
                <div class="product1">
                    <h3>${charger.title}</h3>
                    <p class="discounted-price">₹${discountPrice}</p>
                    <span class="original-price">₹${charger.originalPrice}</span><br>
                    <span class="discount">${charger.discount} Off</span>
                    <ul>
                        <li>Brand: ${charger.brand}</li>
                        <li>Wattage: ${charger.wattage}W</li>
                        <li>Output Current: ${charger.outputCurrent}</li>
                    </ul>
                    </a>
                    <button class="add-to-cart-btn" style="background-color:green ;color:white;padding:10px 10px 10px 10px;border:none; width:20%; border-radius:5px;margin-top:5px">Add to Cart</button>
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
            const charger = filteredChargers.find(p => p.id == productId);
            
            if (charger) {
                addToCart(charger);
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
function addToCart(charger) {
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
    const existingProductIndex = cart.findIndex(item => item.id === charger.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: charger.id,
            title: charger.title,
            brand: charger.brand,
            wattage: charger.wattage,
            outputCurrent: charger.outputCurrent,
            image: charger.image,
            price: charger.originalPrice,
            discount: parseFloat(charger.discount), // Convert to number here
            quantity: 1
        });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Store cart for specific user
    updateCartCount(cart);
    showAddedToCartMessage(charger.title);
}

// Function to filter chargers
function filterChargers() {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedWattages = Array.from(document.querySelectorAll('.wattage-filter:checked')).map(checkbox => checkbox.value);
    const checkedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));
    
    const filteredChargers = chargers.filter(charger => {
        const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(charger.brand);
        const matchesWattage = checkedWattages.length === 0 || checkedWattages.includes(charger.wattage);
        const matchesType = checkedTypes.length === 0 || checkedTypes.includes(charger.type);
        const discountValue = parseInt(charger.discount);
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d);
        
        return matchesBrand && matchesWattage && matchesType && matchesDiscount;
    });
    
    // Update the displayed chargers
    displayChargers(filteredChargers);
}

// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll('.brand-filter, .wattage-filter, .type-filter, .discount-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Re-apply filters (which will now show all products)
    filterChargers();
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
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    // Initialize cart count on page load
    if (session && session.loggedIn) {
        let userId = session.userId;
        let userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        updateCartCount(cart);
    }
    
    // Display all chargers initially
    displayChargers(chargers);
    
    // Add event listeners for filters
    document.querySelectorAll('.brand-filter, .wattage-filter, .type-filter, .discount-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filterChargers);
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