document.addEventListener("DOMContentLoaded", function() {
    const userId = document.getElementById("user-id").value;
    const userCartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
    
    console.log('Fetched cart on load:', cart); // Debug log
    
    displayOrderItems(cart);
    updateSummary(cart);
    setupPaymentListeners();
});

function displayOrderItems(cart) {
    const orderItemsContainer = document.getElementById("order-items");
    orderItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<p>No items in cart.</p>";
        return;
    }

    cart.forEach(item => {
        const isPhone = item.model && item.ram && item.rom;
        const isCharger = item.wattage && item.outputCurrent;
        const isEarphone = item.design && item.batteryLife;
        const isSmartwatch = item.displaySize && item.displayType && item.batteryRuntime;
        const isMouse = item.resolution && item.connectivity && item.type;
        const isLaptop = item.series && item.processor && item.memory;

        const price = parseFloat(item.price || item.pricing?.originalPrice || 0);
        const discount = parseFloat(item.discount || item.pricing?.discount?.replace("%", "") || 0);
        const discountedPrice = price - (price * discount / 100);
        const itemTotal = discountedPrice * (item.quantity || 1);

        let details = "";
        if (isPhone) {
            details = `${item.brand} ${item.model}<br>${item.ram} RAM | ${item.rom} Storage`;
        } else if (isCharger) {
            details = `${item.title}<br>${item.wattage}W`;
        } else if (isEarphone) {
            details = `${item.title}<br>${item.design}`;
        } else if (isSmartwatch) {
            details = `${item.title}<br>${item.displaySize}"`;
        } else if (isMouse) {
            details = `${item.title}<br>${item.type}`;
        } else if (isLaptop) {
            details = `${item.brand} ${item.series}<br>${item.memory.ram} RAM`;
        }

        orderItemsContainer.innerHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.title || item.model || item.brand}">
                <div class="item-details">
                    <h3>${details}</h3>
                    <p>Qty: ${item.quantity || 1}</p>
                </div>
                <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
            </div>
        `;
    });
}

function updateSummary(cart) {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price || item.pricing?.originalPrice || 0);
        const discount = parseFloat(item.discount || item.pricing?.discount?.replace("%", "") || 0);
        const discountedPrice = price - (price * discount / 100);
        return total + (discountedPrice * (item.quantity || 1));
    }, 0);
    const shipping = subtotal > 10000 ? 0 : 99;
    const total = subtotal + shipping;

    document.getElementById("subtotal").textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById("shipping").textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    document.getElementById("total").textContent = `₹${total.toLocaleString('en-IN')}`;
}

function setupPaymentListeners() {
    const paymentMethods = document.querySelectorAll(".payment-method");
    const payBtn = document.getElementById("pay-btn");
    const messageDiv = document.getElementById("message");

    const userId = document.getElementById("user-id").value;
    const userCartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");

    paymentMethods.forEach(method => {
        method.addEventListener("click", function() {
            paymentMethods.forEach(m => m.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    payBtn.addEventListener("click", async function() {
        const selectedMethod = document.querySelector(".payment-method.selected")?.dataset.method;
        if (!selectedMethod) {
            showMessage("Please select a payment method.", "error");
            return;
        }

        showMessage("Processing payment...", "info");

        const orderId = `ORD-${Date.now()}`;
        const orderData = {
            orderId: orderId,
            items: cart.map(item => ({
                type: determineItemType(item),
                id: item.id,
                accessory: sanitizeAccessory(item),
                quantity: item.quantity || 1,
                amount: calculateItemTotal(item)
            })),
            totalAmount: parseFloat(document.getElementById("total").textContent.replace("₹", "").replace(",", "")),
            paymentMethod: selectedMethod,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to save order');
            }

            localStorage.setItem(userCartKey, JSON.stringify([]));

            showMessage("Payment successful!", "success");
            setTimeout(() => {
                const orderQuery = encodeURIComponent(JSON.stringify(orderData));
                console.log('Redirecting to:', `/orders?order=${orderQuery}`);
                window.location.href = `/orders?order=${orderQuery}`;
            }, 2000);
        } catch (error) {
            console.error('Payment error:', error);
            showMessage("Payment failed: " + error.message, "error");
        }
    });
}
function determineItemType(item) {
    if (item.model && item.ram && item.rom) return "phone";
    if (item.wattage && item.outputCurrent) return "charger";
    if (item.design && item.batteryLife) return "earphone";
    if (item.displaySize && item.displayType && item.batteryRuntime) return "smartwatch";
    if (item.resolution && item.connectivity && item.type) return "mouse";
    if (item.series && item.processor && item.memory) return "laptop";
    return "unknown";
}

function sanitizeAccessory(item) {
    const accessory = { ...item };
    delete accessory.quantity;
    delete accessory.price;
    delete accessory.discount;
    return accessory;
}

function calculateItemTotal(item) {
    const price = parseFloat(item.price || item.pricing?.originalPrice || 0);
    const discount = parseFloat(item.discount || item.pricing?.discount?.replace("%", "") || 0);
    return (price - (price * discount / 100)) * (item.quantity || 1);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}