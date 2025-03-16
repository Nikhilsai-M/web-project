// public/scripts/laptop-details.js
document.addEventListener("DOMContentLoaded", function() {

    // Add to Cart button event listener
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function() {
            const laptopId = this.dataset.id;
            addToCart(laptopId);
        });
    }

    // Buy Now button event listener
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function() {
            const laptopId = this.dataset.id;
            buyNow(laptopId);
        });
    }
});

// Function to add laptop to cart
function addToCart(laptopId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    // Get laptop details from the server
    fetch(`/api/laptop/${laptopId}`)
        .then(response => response.json())
        .then(laptop => {
            if (laptop) {
                let userId = session.userId;
                let userCartKey = `cart_${userId}`;
                let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
                
                // Check if laptop already exists in cart
                const existingProductIndex = cart.findIndex(item => item.id === laptop.id);
                
                if (existingProductIndex !== -1) {
                    cart[existingProductIndex].quantity += 1;
                } else {
                    // Add new laptop to cart with the correct structure
                    cart.push({
                        id: laptop.id,
                        brand: laptop.brand,
                        series: laptop.series,
                        processor: `${laptop.processor.name} ${laptop.processor.generation}`,
                        memory: `${laptop.memory.ram}, ${laptop.memory.storage.type} ${laptop.memory.storage.capacity}`,
                        displaysize: laptop.displaysize,
                        os: laptop.os,
                        condition: laptop.condition,
                        image: laptop.image,
                        price: laptop.pricing.basePrice,
                        discount: laptop.pricing.discount,
                        quantity: 1,
                        weight: laptop.weight
                    });
                }
                
                // Save updated cart to localStorage
                localStorage.setItem(userCartKey, JSON.stringify(cart));
       
                // Show success message
                showAddedToCartMessage(`${laptop.brand} ${laptop.series}`);
            }
        })
        .catch(error => {
            console.error("Error fetching laptop details:", error);
            // Fallback: Get laptop details from the page
            const laptopTitle = document.querySelector(".product-title").textContent;
                   
            showAddedToCartMessage(laptopTitle);
        });
}

// Function to buy now
function buyNow(laptopId) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    setTimeout(() => {
        window.location.href = "/checkout";
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