import {mobileModels} from "./buy-mobile-data.js";

// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

function displayProducts(filteredProducts) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>No products match your filters</h3>
                <p>Try adjusting your filter criteria or <button class="clear-all-inline">clear all filters</button></p>
            </div>
        `;
        
        // Add event listener to the inline clear button
        const clearInlineBtn = container.querySelector(".clear-all-inline");
        if (clearInlineBtn) {
            clearInlineBtn.addEventListener("click", clearAllFilters);
        }
        return;
    }
    
    filteredProducts.forEach(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.dataset.id = product.id;
        
        productElement.innerHTML = `
            <a href="/product/${product.id}" class="product-link">
                <div class="product-container">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.brand} ${product.model}">
                    </div>
                    <div class="product-details">
                        <h4>${product.brand} ${product.model}</h4>
                        <p class="discounted-price">₹${discountedPrice}</p>
                        <span class="original-price">₹${product.price}</span>
                        <span class="discount">${product.discount}% Off</span>
                        <ul>
                            <li>${product.ram} RAM | ${product.rom} Storage</li>
                            <li>${product.specs.battery}mAh Battery</li>
                            <li>Condition: ${product.condition}</li>
                        </ul>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </a>
        `;
        
        container.appendChild(productElement);
    });
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault(); // Prevent navigating to product page when clicking Add to Cart
            const productDiv = e.target.closest(".product");
            const productId = productDiv.dataset.id;
            const product = filteredProducts.find(p => p.id == productId);
            
            if (product) {
                addToCart(product);
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
function addToCart(product) {
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
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            brand: product.brand,
            model: product.model,
            ram: product.ram,
            rom: product.rom,
            condition: product.condition,
            image: product.image,
            price: product.price,
            discount: product.discount,
            quantity: 1
        });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Store cart for specific user
    updateCartCount(cart);
    showAddedToCartMessage(`${product.brand} ${product.model}`);
}

// Function to get selected filters
function getSelectedFilters() {
    return {
        brands: Array.from(document.querySelectorAll(".brand:checked")).map(cb => cb.value),
        rams: Array.from(document.querySelectorAll(".ram:checked")).map(cb => parseInt(cb.value)), 
        roms: Array.from(document.querySelectorAll(".rom:checked")).map(cb => parseInt(cb.value)), 
        batteries: Array.from(document.querySelectorAll(".battery:checked")).map(cb => cb.value), 
        conditions: Array.from(document.querySelectorAll(".condition:checked")).map(cb => cb.value),
        discounts: Array.from(document.querySelectorAll(".discount:checked")).map(cb => parseInt(cb.value)), 
        minPrice: parseInt(document.getElementById("min-value").value) || 0,
        maxPrice: parseInt(document.getElementById("max-value").value) || 150000
    };
}

// Function to store selected filters in localStorage
function storeFiltersToStorage() {
    localStorage.setItem("selectedFilters", JSON.stringify(getSelectedFilters()));
}

// Function to load filters from localStorage
function loadFiltersFromStorage() {
    const storedFilters = JSON.parse(localStorage.getItem("selectedFilters"));
    if (!storedFilters) return false;

    document.querySelectorAll(".brand").forEach(cb => cb.checked = storedFilters.brands.includes(cb.value));
    document.querySelectorAll(".ram").forEach(cb => cb.checked = storedFilters.rams.includes(parseInt(cb.value)));
    document.querySelectorAll(".rom").forEach(cb => cb.checked = storedFilters.roms.includes(parseInt(cb.value)));
    document.querySelectorAll(".battery").forEach(cb => cb.checked = storedFilters.batteries.includes(cb.value));
    document.querySelectorAll(".condition").forEach(cb => cb.checked = storedFilters.conditions.includes(cb.value));
    document.querySelectorAll(".discount").forEach(cb => cb.checked = storedFilters.discounts.includes(parseInt(cb.value)));

    document.getElementById("min-value").value = storedFilters.minPrice;
    document.getElementById("max-value").value = storedFilters.maxPrice;
    document.getElementById("min-price").value = storedFilters.minPrice;
    document.getElementById("max-price").value = storedFilters.maxPrice;

    updateSliderBackground();
    return true;
}

// Function to update filters and store them
function updateFiltersAndStore() {
    storeFiltersToStorage();
    filterProducts();
}

// Function to update the selected filters display
function updateSelectedFilters() {
    const selectedFiltersList = document.getElementById("selected-filters-list");
    selectedFiltersList.innerHTML = "";

    const selectedFilters = getSelectedFilters();
    let hasActiveFilters = false;

    function addFilterTag(type, value, label) {
        hasActiveFilters = true;
        const tag = document.createElement("div");
        tag.classList.add("filter-tag");
        tag.setAttribute("data-type", type);
        tag.setAttribute("data-value", value);
        tag.innerHTML = `${label} ✖`;

        tag.addEventListener("click", function () {
            removeFilter(type, value);
        });

        selectedFiltersList.appendChild(tag);
    }

    selectedFilters.brands.forEach(brand => addFilterTag("brand", brand, brand));
    selectedFilters.rams.forEach(ram => addFilterTag("ram", ram, `${ram}GB RAM`));
    selectedFilters.roms.forEach(rom => addFilterTag("rom", rom, `${rom}GB Storage`));
    selectedFilters.batteries.forEach(battery => addFilterTag("battery", battery, `${battery}mAh Battery`));
    selectedFilters.conditions.forEach(condition => addFilterTag("condition", condition, condition));
    selectedFilters.discounts.forEach(discount => addFilterTag("discount", discount, `${discount}% off`));

    // Add price range filter tag if it's not at default values
    const minPrice = parseInt(document.getElementById("min-value").value) || 0;
    const maxPrice = parseInt(document.getElementById("max-value").value) || 150000;
    
    if (minPrice > 0 || maxPrice < 150000) {
        addFilterTag("price", "range", `₹${minPrice} - ₹${maxPrice}`);
    }

    // Display or hide the selected filters section
    document.querySelector(".selected-filters").style.display = hasActiveFilters ? "block" : "none";
}

// Function to remove a specific filter
function removeFilter(type, value) {
    if (type === "price") {
        document.getElementById("min-price").value = 0;
        document.getElementById("max-price").value = 150000;
        document.getElementById("min-value").value = 0;
        document.getElementById("max-value").value = 150000;
        updateSliderBackground();
    } else {
        const checkbox = document.querySelector(`.${type}[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    updateFiltersAndStore();
}

// Function to update slider background
function updateSliderBackground() {
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const minValue = document.getElementById("min-value");
    const maxValue = document.getElementById("max-value");

    minValue.value = minSlider.value;
    maxValue.value = maxSlider.value;
}

// Function to filter products based on selected filters
function filterProducts() {
    const selectedFilters = getSelectedFilters();
    console.log("Filtering with price range:", selectedFilters.minPrice, "to", selectedFilters.maxPrice);

    // Check if any filters are active
    const hasActiveFilters = 
        selectedFilters.brands.length > 0 || 
        selectedFilters.rams.length > 0 || 
        selectedFilters.roms.length > 0 || 
        selectedFilters.batteries.length > 0 || 
        selectedFilters.conditions.length > 0 || 
        selectedFilters.discounts.length > 0 || 
        selectedFilters.minPrice > 0 || 
        selectedFilters.maxPrice < 150000;

    let filteredProducts = mobileModels;
    
    if (hasActiveFilters) {
        filteredProducts = mobileModels.filter(product => {
            const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

            if (selectedFilters.brands.length > 0 && !selectedFilters.brands.includes(product.brand)) return false;
            if (discountedPrice < selectedFilters.minPrice || discountedPrice > selectedFilters.maxPrice) return false;
            if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(parseInt(product.ram))) return false;
            if (selectedFilters.roms.length > 0 && !selectedFilters.roms.includes(parseInt(product.rom))) return false;
            if (selectedFilters.batteries.length > 0 && !selectedFilters.batteries.includes(product.specs.battery.toString())) return false;
            if (selectedFilters.conditions.length > 0 && !selectedFilters.conditions.includes(product.condition)) return false;
            if (selectedFilters.discounts.length > 0 && !selectedFilters.discounts.includes(product.discount)) return false;

            return true;
        });
    }

    displayProducts(filteredProducts);
    updateSelectedFilters();
    
    console.log(`Displaying ${filteredProducts.length} products`);
}

// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
    document.getElementById("min-price").value = 0;
    document.getElementById("max-price").value = 150000;
    document.getElementById("min-value").value = 0;
    document.getElementById("max-value").value = 150000;

    localStorage.removeItem("selectedFilters");
    updateSliderBackground();
    filterProducts();

    // Remove URL parameters and reset to `/filter-buy-phone`
    window.history.replaceState(null, "", "/filter-buy-phone");
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

// Load filters and set event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    // Initialize cart count on page load
    if (session && session.loggedIn) {
        let userId = session.userId;
        let userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        updateCartCount(cart);
    }

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");
    const maxPrice = urlParams.get("maxPrice");

    // If URL has parameters, apply them as filters
    if (selectedBrand || maxPrice) {
        localStorage.removeItem("selectedFilters"); // Clear any existing filters
        
        if (selectedBrand) {
            const brandCheckbox = document.querySelector(`.brand[value="${selectedBrand}"]`);
            if (brandCheckbox) {
                brandCheckbox.checked = true;
            }
        }

        if (maxPrice) {
            const maxPriceValue = parseInt(maxPrice);
            document.getElementById("max-price").value = maxPriceValue;
            document.getElementById("max-value").value = maxPriceValue;
        }
    } 
    // If no URL parameters, try to load filters from localStorage
    else {
        // Only reset filters if NOT coming from a page reload
        if (!performance.navigation || performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
            localStorage.removeItem("selectedFilters");
        } else {
            loadFiltersFromStorage();
        }
    }

    // Add event listeners for price sliders
    const minPriceSlider = document.getElementById("min-price");
    const maxPriceSlider = document.getElementById("max-price");
    
    minPriceSlider.addEventListener("input", function() {
        updateSliderBackground();
    });
    
    maxPriceSlider.addEventListener("input", function() {
        updateSliderBackground();
    });
    
    minPriceSlider.addEventListener("change", updateFiltersAndStore);
    maxPriceSlider.addEventListener("change", updateFiltersAndStore);
    
    // Add event listeners for price input fields
    const minValueInput = document.getElementById("min-value");
    const maxValueInput = document.getElementById("max-value");
    
    minValueInput.addEventListener("change", function() {
        minPriceSlider.value = this.value;
        updateFiltersAndStore();
    });
    
    maxValueInput.addEventListener("change", function() {
        maxPriceSlider.value = this.value;
        updateFiltersAndStore();
    });

    document.querySelector(".clear-all").addEventListener("click", clearAllFilters);
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => 
        checkbox.addEventListener("change", updateFiltersAndStore)
    );
    
    // Apply filters and display products
    filterProducts();
});

// Add some basic CSS for the cart message
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
</style>
`);