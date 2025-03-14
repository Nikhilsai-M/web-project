document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        window.location.href = "/login"; // Redirect non-logged-in users
        return;
    }

    let userId = session.userId; // Get logged-in user's ID
    let userCartKey = `cart_${userId}`; // Unique cart for each user

    // Get cart items from localStorage using the user-specific key
    const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    
    // Display cart items
    displayCartItems(cart);
    
    // Set up event listeners for the cart page
    setupCartEventListeners();
    
    // Update cart summary
    updateCartSummary(cart);
    
    // Add event listener for continue shopping button with improved navigation
    document.querySelector(".continue-shopping").addEventListener("click", function() {
        // Check if there's a previous page in the browser history
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            // Navigate back to the previous page if it's from the same origin
            window.history.back();
        } else {
            // Fallback to the home page if there's no previous page or it's from a different origin
            window.location.href = "/";
        }
    });
    
    // Add event listener for checkout button
    document.querySelector(".checkout-btn").addEventListener("click", function() {
        // You can implement checkout functionality here
        alert("Proceeding to checkout...");
        // Redirect to checkout page
        // window.location.href = "/checkout";
    });
});

// Function to display cart items
function displayCartItems(cart) {
    const cartItemsContainer = document.getElementById("cart-items");
    
    // Clear the container
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        // Display message if cart is empty
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
            </div>
        `;
        return;
    }
    
    // Add each item to the cart container
    cart.forEach((item, index) => {
        // Determine item type based on attributes
        const isPhone = item.hasOwnProperty('model') && item.hasOwnProperty('ram') && item.hasOwnProperty('rom');
        const isCharger = item.hasOwnProperty('title') && item.hasOwnProperty('wattage') && item.hasOwnProperty('outputCurrent');
        const isEarphone = item.hasOwnProperty('design') && item.hasOwnProperty('batteryLife');
        const isSmartwatch = item.hasOwnProperty('displaySize') && item.hasOwnProperty('displayType') && item.hasOwnProperty('batteryRuntime');
        const isMouse = item.hasOwnProperty('resolution') && item.hasOwnProperty('connectivity') && item.hasOwnProperty('type');
        const isLaptop = item.hasOwnProperty('series') && item.hasOwnProperty('processor') && item.hasOwnProperty('memory');
        
        // Calculate correct price based on item type
        let discountedPrice = 0;
        if (isPhone) {
            discountedPrice = calculateDiscountedPrice(item.price, item.discount);
        } else if (isCharger || isEarphone || isMouse || isSmartwatch ) {
            discountedPrice = calculateDiscountedPrice(item.originalPrice, item.discount);
        }else if(isLaptop){
            discountedPrice = calculateDiscountedPrice(item.price, item.discount);
        }
        
        const itemTotal = discountedPrice * item.quantity;
        
        // Display item based on type
        if (isPhone) {
            // Display phone item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.brand} ${item.model}">
                    <div class="item-details">
                        <h3>${item.brand} ${item.model}</h3>
                        <p>${item.ram} RAM | ${item.rom} Storage</p>
                        <p>Condition: ${item.condition}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        } else if (isCharger) {
            // Display charger item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>Brand: ${item.brand}</p>
                        <p>Wattage: ${item.wattage}W</p>
                        <p>Output Current: ${item.outputCurrent}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        } else if (isEarphone) {
            // Display earphone item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.brand} ${item.model}">
                    <div class="item-details">
                        <h3>${item.brand}</h3>
                        <p>Design: ${item.design}</p>
                        <p>Battery Life: ${item.batteryLife}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        } else if (isSmartwatch) {
            // Display smartwatch item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.brand} ${item.model}">
                    <div class="item-details">
                        <h3>${item.brand}</h3>
                        <p>Display Size: ${item.displaySize}</p>
                        <p>Display Type: ${item.displayType}</p>
                        <p>Battery Runtime: ${item.batteryRuntime}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        } else if (isMouse) {
            // Display mouse item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.brand} ${item.model}">
                    <div class="item-details">
                        <h3>${item.brand}</h3>
                        <p>Resolution: ${item.resolution}</p>
                        <p>Connectivity: ${item.connectivity}</p>
                        <p>Type: ${item.type}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        } else if (isLaptop) {
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.brand} ${item.series}">
                    <div class="item-details">
                        <h3>${item.brand} ${item.series}</h3>
                        <p>Processor: ${item.processor.name || ''} ${item.processor.generation || ''}</p>
                        <p>Memory: ${item.memory.ram || ''} RAM | ${item.memory.storage && item.memory.storage.type ? item.memory.storage.type : ''} ${item.memory.storage && item.memory.storage.capacity ? item.memory.storage.capacity : ''}</p>
                        <p>Display: ${item.displaysize || ''}${item.displaysize ? '"' : ''} ${item.os ? '| OS: ' + item.os : ''}</p>
                        <p>Condition: ${item.condition || ''}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button class="remove-btn" data-index="${index}">✖</button>
                </div>
            `;
        }
    });
}

// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    // Ensure price and discount are treated as numbers
    price = parseFloat(price);
    discount = parseFloat(discount);
    return price - (price * discount / 100);
}

// Function to set up event listeners for cart interactions
function setupCartEventListeners() {
    const cartItemsContainer = document.getElementById("cart-items");
    
    // Event delegation for cart item events
    cartItemsContainer.addEventListener("click", function(e) {
        // Handle remove button click
        if (e.target.classList.contains("remove-btn")) {
            const index = parseInt(e.target.dataset.index);
            removeCartItem(index);
        }
        
        // Handle quantity decrease button
        if (e.target.classList.contains("minus")) {
            const index = parseInt(e.target.dataset.index);
            updateCartItemQuantity(index, "decrease");
        }
        
        // Handle quantity increase button
        if (e.target.classList.contains("plus")) {
            const index = parseInt(e.target.dataset.index);
            updateCartItemQuantity(index, "increase");
        }
    });
    
    // Handle quantity input changes
    cartItemsContainer.addEventListener("change", function(e) {
        if (e.target.type === "number") {
            const index = parseInt(e.target.dataset.index);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                updateCartItemQuantity(index, "set", newQuantity);
            } else {
                // If quantity is 0 or negative, set it back to 1
                e.target.value = 1;
                updateCartItemQuantity(index, "set", 1);
            }
        }
    });
}

// Function to remove an item from cart
function removeCartItem(index) {
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        window.location.href = "/login"; // Redirect non-logged-in users
        return;
    }

    let userId = session.userId;
    let userCartKey = `cart_${userId}`; // Ensure we modify the correct user's cart
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Remove only the selected item
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Save updated cart

    displayCartItems(cart);  // Refresh the cart display
    updateCartSummary(cart); // Update subtotal and total
}

// Function to update an item's quantity
function updateCartItemQuantity(index, action, newQuantity) {
    // Get user session
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        window.location.href = "/login"; // Redirect non-logged-in users
        return;
    }

    let userId = session.userId;
    let userCartKey = `cart_${userId}`; // Ensure we modify the correct user's cart
    
    // Get current cart using the user-specific key
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    
    // Get the current item
    const item = cart[index];
    
    if (!item) return;
    
    // Update quantity based on action
    if (action === "increase") {
        item.quantity += 1;
    } else if (action === "decrease") {
        if (item.quantity > 1) {
            item.quantity -= 1;
        }
    } else if (action === "set") {
        item.quantity = newQuantity;
    }
    
    // Save updated cart back to localStorage with the user-specific key
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    
    // Update the cart display
    displayCartItems(cart);
    
    // Update the cart summary
    updateCartSummary(cart);
    
}

// Function to update cart summary (subtotal, shipping, total)
function updateCartSummary(cart) {
    // Calculate totals
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => {
        // Check if item is a phone, earphone, smartwatch, mouse, or laptop
        const isPhone = item.hasOwnProperty('model') && item.hasOwnProperty('ram') && item.hasOwnProperty('rom');
        const isCharger = item.hasOwnProperty('title') && item.hasOwnProperty('wattage') && item.hasOwnProperty('outputCurrent');
        const isEarphone = item.hasOwnProperty('design') && item.hasOwnProperty('batteryLife');
        const isSmartwatch = item.hasOwnProperty('displaySize') && item.hasOwnProperty('displayType') && item.hasOwnProperty('batteryRuntime');
        const isMouse = item.hasOwnProperty('resolution') && item.hasOwnProperty('connectivity') && item.hasOwnProperty('type');
        const isLaptop = item.hasOwnProperty('series') && item.hasOwnProperty('processor') && item.hasOwnProperty('memory');
        
        let itemPrice = 0;
        if (isPhone) {
            itemPrice = calculateDiscountedPrice(item.price, item.discount);
        } else if (isCharger || isEarphone || isSmartwatch || isMouse ) {
            itemPrice = calculateDiscountedPrice(item.originalPrice, item.discount);
        }else if(isLaptop){
            itemPrice = calculateDiscountedPrice(item.price, item.discount);
        }
        
        return total + (itemPrice * item.quantity);
    }, 0);
    
    // Calculate shipping (free for orders over ₹10,000, otherwise ₹99)
    const shipping = subtotal > 10000 ? 0 : 99;
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update DOM elements
    document.getElementById("items-count").textContent = itemsCount;
    document.getElementById("subtotal").textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById("shipping").textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    document.getElementById("total").textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Disable checkout button if cart is empty
    document.querySelector(".checkout-btn").disabled = cart.length === 0;
}