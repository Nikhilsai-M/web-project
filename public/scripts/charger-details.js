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
            const chargerId = this.dataset.id;
            addToCart(chargerId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            const chargerId = this.dataset.id;
            buyNow(chargerId);
        });
    }
});

// Function to add charger to cart
function addToCart(chargerId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get charger details from the server
    fetch(`/api/charger/${chargerId}`)
        .then((response) => response.json())
        .then((charger) => {
            if (charger) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

                // Check if charger already exists in cart
                const existingChargerIndex = cart.findIndex((item) => item.id === charger.id);

                if (existingChargerIndex !== -1) {
                    cart[existingChargerIndex].quantity += 1;
                } else {
                    // Add new charger to cart
                    cart.push({
                        id: charger.id,
                        brand: charger.brand,
                        title: charger.title,
                        wattage: charger.wattage,
                        type: charger.type,
                        outputCurrent: charger.outputCurrent,
                        image: charger.image,
                        price: charger.originalPrice,
                        discount: parseFloat(charger.discount),
                        quantity: 1,
                    });
                }

                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));

                // Update cart count in header
                updateCartCount(cart);

                // Show success message
                showAddedToCartMessage(`${charger.title}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching charger details:", error);
            // Fallback: Get charger details from the page
            const chargerTitle = document.querySelector(".product-title").textContent;
            const chargerImage = document.querySelector(".product-image img").src;
            const chargerPrice = parseFloat(
                document.querySelector(".discounted-price").textContent.replace("₹", "").replace(",", "")
            );

            showAddedToCartMessage(chargerTitle);
        });
}

// Function to buy now
function buyNow(chargerId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Add charger to cart first
    addToCart(chargerId);

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
function showAddedToCartMessage(chargerName) {
    // Remove any existing message
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${chargerName} added to cart! <a href="/cart">View Cart</a></p>
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