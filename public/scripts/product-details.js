
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in

    // Add to Cart button event listener
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function() {
            const productId = this.dataset.id;
            addToCart(productId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            const productId = this.dataset.id;
            buyNow(productId);
        });
    }
});

// Function to add product to cart
function addToCart(productId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get product details from the server
    fetch(`/api/product/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (product) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
                
                // Check if product already exists in cart
                const existingProductIndex = cart.findIndex(item => item.id === product.id);
                
                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity += 1;
                } else {
                    // Add new product to cart
                    cart.push({
                        id: product.id,
                        brand: product.brand,
                        model: product.model,
                        ram: product.ram,
                        rom: product.rom,
                        condition: product.condition,
                        image: product.image,
                        price: product.pricing.basePrice,
                        discount:parseFloat( product.pricing.discount),
                        quantity: 1
                    });
                }
                
                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));
                
                // Show success message
                showAddedToCartMessage(`${product.brand} ${product.model}`);
            }
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
            // Fallback: Get product details from the page
            const productTitle = document.querySelector(".product-title").textContent;         
            showAddedToCartMessage(productTitle);
        });
}

// Function to buy now
function buyNow(productId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    
    setTimeout(() => {
        window.location.href = "/orders";
    }, 500);
}



// Function to show "Added to Cart" message
function showAddedToCartMessage(productName) {
    // Remove any existing message
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }
    
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
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 500);
    }, 3000);
}