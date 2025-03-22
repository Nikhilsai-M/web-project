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
            const smartwatchId = this.dataset.id;
            addToCart(smartwatchId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            const smartwatchId = this.dataset.id;
            buyNow(smartwatchId);
        });
    }
});

// Function to add smartwatch to cart
function addToCart(smartwatchId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get smartwatch details from the server
    fetch(`/api/smartwatch/${smartwatchId}`)
        .then((response) => response.json())
        .then((smartwatch) => {
            if (smartwatch) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

                // Check if smartwatch already exists in cart
                const existingSmartwatchIndex = cart.findIndex((item) => item.id === smartwatch.id);

                if (existingSmartwatchIndex !== -1) {
                    cart[existingSmartwatchIndex].quantity += 1;
                } else {
                    // Add new smartwatch to cart
                    cart.push({
                        id: smartwatch.id,
                        brand: smartwatch.brand,
                        title: smartwatch.title,
                        displaySize: smartwatch.displaySize,
                        displayType: smartwatch.displayType,
                        batteryRuntime: smartwatch.batteryRuntime,
                        image: smartwatch.image,
                        price: smartwatch.pricing.originalPrice,
                        discount: parseFloat(smartwatch.pricing.discount),
                        quantity: 1,
                    });
                }

                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));

                // Update cart count in header
                updateCartCount(cart);

                // Show success message
                showAddedToCartMessage(`${smartwatch.title}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching smartwatch details:", error);
            // Fallback: Get smartwatch details from the page
            const smartwatchTitle = document.querySelector(".product-title").textContent;
            const smartwatchImage = document.querySelector(".product-image img").src;
            const smartwatchPrice = parseFloat(
                document.querySelector(".discounted-price").textContent.replace("₹", "").replace(",", "")
            );

            showAddedToCartMessage(smartwatchTitle);
        });
}

// Function to buy now
function buyNow(smartwatchId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Add smartwatch to cart first
    addToCart(smartwatchId);

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
function showAddedToCartMessage(smartwatchName) {
    // Remove any existing message
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${smartwatchName} added to cart! <a href="/cart">View Cart</a></p>
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