document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // If user is not logged in, we'll handle this in the addToCart function
    } else {
        // User is logged in, initialize cart count
        let userId = session.userId;
        let userCartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        updateCartCount(cart);
    }

    // Add to Cart button event listener
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function() {
            const earphoneId = this.dataset.id;
            addToCart(earphoneId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            const earphoneId = this.dataset.id;
            buyNow(earphoneId);
        });
    }
});

// Function to add earphone to cart
function addToCart(earphoneId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get earphone details from the server
    fetch(`/api/earphone/${earphoneId}`)
        .then(response => response.json())
        .then(earphone => {
            if (earphone) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
                
                // Check if earphone already exists in cart
                const existingEarphoneIndex = cart.findIndex(item => item.id === earphone.id);
                
                if (existingEarphoneIndex !== -1) {
                    cart[existingEarphoneIndex].quantity += 1;
                } else {
                    // Add new earphone to cart
                    // Line 50 of your code - modify this part:
                    cart.push({
                    id: earphone.id,
                    brand: earphone.brand,
                    title: earphone.title,
                    design: earphone.design,
                    batteryLife: earphone.batteryLife,
                    image: earphone.image,
                    price: earphone.originalPrice,
                    discount: parseFloat(earphone.discount),
                    quantity: 1
});
                }
                
                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));
                
                // Update cart count in header
                updateCartCount(cart);
                
                // Show success message
                showAddedToCartMessage(`${earphone.title}`);
            }
        })
        .catch(error => {
            console.error("Error fetching earphone details:", error);
            // Fallback: Get earphone details from the page
            const earphoneTitle = document.querySelector(".product-title").textContent;
            const earphoneImage = document.querySelector(".product-image img").src;
            const earphonePrice = parseFloat(document.querySelector(".discounted-price").textContent.replace("₹", "").replace(",", ""));
            
            showAddedToCartMessage(earphoneTitle);
        });
}

// Function to buy now
function buyNow(earphoneId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Add earphone to cart first
    addToCart(earphoneId);
    
    // Then redirect to checkout page
    setTimeout(() => {
        window.location.href = "/orders";
    }, 500);
}

// Function to update cart count in header
function updateCartCount(cart) {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    }
}

// Function to show "Added to Cart" message
function showAddedToCartMessage(earphoneName) {
    // Remove any existing message
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }
    
    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${earphoneName} added to cart! <a href="/cart">View Cart</a></p>
    `;
    document.body.appendChild(messageDiv);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add("fade-out");
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 500);
    }, 3000);
}