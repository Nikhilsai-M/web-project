async function fetchEarphoneData() {
    try {
        const response = await fetch('/api/earbuds'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch earphone data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching earphone data:', error);
        return []; // Return an empty array in case of error
    }
}

// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

// Function to display earphones
function displayEarphones(filteredEarphones) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the product list

    if (filteredEarphones.length === 0) {
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

    filteredEarphones.forEach(earphone => {
        const discountPrice = calculateDiscountedPrice(earphone.originalPrice, parseFloat(earphone.discount)).toFixed(2);
        const productHTML = `
             <a href="/earphone/${earphone.id}" class="product-link"> 
            <div class="product" data-id="${earphone.id}">  
                <img src="${earphone.image}" alt="${earphone.title}"> 
                <div class="product1"> 
                <h3>${earphone.title}</h3>  
                 <p class="discounted-price">₹${discountPrice}</p>
                     <span class="original-price">₹${earphone.originalPrice}</span><br>
                     <span class="discount">${earphone.discount} Off</span>
                <ul>
                <li>Brand: ${earphone.brand}</li>  
                <li>Battery Life: ${earphone.batteryLife} hours</li>  
                <li>Design: ${earphone.design}</li>  
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
        button.addEventListener("click", function (e) {
            const productDiv = e.target.closest(".product");
            const productId = productDiv.dataset.id;
            const earphone = filteredEarphones.find(p => p.id === productId);

            if (earphone) {
                addToCart(earphone);
            }
        });
    });
}

// Function to add a product to cart
function addToCart(earphone) {
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
    const existingProductIndex = cart.findIndex(item => item.id === earphone.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: earphone.id,
            title: earphone.title,
            brand: earphone.brand,
            batteryLife: earphone.batteryLife,
            design: earphone.design,
            image: earphone.image,
            price: earphone.originalPrice,
            discount: parseFloat(earphone.discount), // Convert to number to avoid NaN issues
            quantity: 1
        });
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Store cart for specific user
    updateCartCount(cart);
    showAddedToCartMessage(earphone.title);
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

function filterEarphones(earphones) {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedBattery = Array.from(document.querySelectorAll('.battery-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedDesign = Array.from(document.querySelectorAll('.design-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));

    // Predefined list of main brands (excluding "Others")
    const mainBrands = ["Apple", "Samsung", "Sony", "JBL", "Boat"]; // Adjust based on your actual earphone brands

    const filteredEarphones = earphones.filter(earphone => {
        // Brand filter with corrected "Others" handling
        let matchesBrand = true;
        if (checkedBrands.length > 0) {
            const includesOthers = checkedBrands.includes("Others");
            const includesSpecificBrand = checkedBrands.includes(earphone.brand);
            const isOtherBrand = !mainBrands.includes(earphone.brand);

            if (!includesOthers) {
                matchesBrand = includesSpecificBrand;
            } else {
                matchesBrand = includesSpecificBrand || isOtherBrand;
            }
        }

        const batteryValue = parseInt(earphone.batteryLife);
        const matchesBattery = checkedBattery.length === 0 || checkedBattery.some(e => batteryValue >= e);
        const matchesDesign = checkedDesign.length === 0 || checkedDesign.includes(earphone.design);
        const discountValue = parseInt(earphone.discount);
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d);

        return matchesBrand && matchesBattery && matchesDesign && matchesDiscount;
    });

    // Update the displayed earphones
    displayEarphones(filteredEarphones);
}
// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll('.brand-filter, .battery-filter, .design-filter, .discount-filter').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Re-apply filters (which will now show all products)
    filterEarphones();
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

document.addEventListener('DOMContentLoaded', async () => {
    const earphones = await fetchEarphoneData(); // Wait for data to be fetched
    console.log("Earphones data:", earphones); // Log the data

    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    // Initialize cart count on page load
    if (session && session.loggedIn) {
        let userId = session.userId;
        let userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        updateCartCount(cart);
    }

    // Display all earphones initially
    displayEarphones(earphones);

    // Add event listeners for filters
    document.querySelectorAll('.brand-filter, .battery-filter, .design-filter, .discount-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => filterEarphones(earphones)); // Pass earphones to filter function
    });

    // Add event listener for clear filters button if it exists
    const clearAllBtn = document.querySelector(".clear-all");
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", clearAllFilters);
    }
});
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