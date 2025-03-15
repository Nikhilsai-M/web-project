document.addEventListener("DOMContentLoaded", function () {
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
        addToCartBtn.addEventListener("click", function () {
            const mouseId = this.dataset.id;
            addToCart(mouseId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            const mouseId = this.dataset.id;
            buyNow(mouseId);
        });
    }
});

// Function to add mouse to cart
function addToCart(mouseId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get mouse details from the server
    fetch(`/api/mouse/${mouseId}`)
        .then((response) => response.json())
        .then((mouse) => {
            if (mouse) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

                // Check if mouse already exists in cart
                const existingMouseIndex = cart.findIndex((item) => item.id === mouse.id);

                if (existingMouseIndex !== -1) {
                    cart[existingMouseIndex].quantity += 1;
                } else {
                    // Add new mouse to cart
                    cart.push({
                        id: mouse.id,
                        brand: mouse.brand,
                        title: mouse.title,
                        connectivity: mouse.connectivity,
                        resolution: mouse.resolution,
                        type: mouse.type,
                        image: mouse.image,
                        price: mouse.originalPrice,
                        discount: parseFloat(mouse.discount),
                        quantity: 1,
                    });
                }

                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));

                // Update cart count in header
                updateCartCount(cart);

                // Show success message
                showAddedToCartMessage(`${mouse.title}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching mouse details:", error);
            // Fallback: Get mouse details from the page
            const mouseTitle = document.querySelector(".product-title").textContent;
            const mouseImage = document.querySelector(".product-image img").src;
            const mousePrice = parseFloat(document.querySelector(".discounted-price").textContent.replace("₹", "").replace(",", ""));

            showAddedToCartMessage(mouseTitle);
        });
}

// Function to buy now
function buyNow(mouseId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Add mouse to cart first
    addToCart(mouseId);

    setTimeout(() => {
        window.location.href = "/checkout";
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
function showAddedToCartMessage(mouseName) {
    // Remove any existing message
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${mouseName} added to cart! <a href="/cart">View Cart</a></p>
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