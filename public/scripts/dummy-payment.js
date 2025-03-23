// public/scripts/dummy-payment.js
document.addEventListener("DOMContentLoaded", function () {
    const paymentMethods = document.querySelectorAll(".payment-method");
    const paymentDetails = document.getElementById("payment-details");
    const payNowBtn = document.getElementById("pay-now");

    paymentMethods.forEach(method => {
        method.addEventListener("click", function () {
            paymentMethods.forEach(m => m.classList.remove("selected"));
            this.classList.add("selected");
            showPaymentDetails(this.dataset.method);
        });
    });

    payNowBtn.addEventListener("click", function () {
        processPayment();
    });
});

async function processPayment() {
    showMessage("Processing payment...", "info");

    const selectedMethod = document.querySelector(".payment-method.selected")?.dataset.method;
    if (!selectedMethod) {
        showMessage("Please select a payment method.", "error");
        return;
    }

    const amount = parseFloat(document.querySelector(".price").textContent.replace("₹", "").replace(",", ""));
    const orderType = document.getElementById("order-type").value || "unknown";
    const orderIdPrefix = document.getElementById("order-id").value || "unknown";
    const orderAccessory = JSON.parse(document.getElementById("order-accessory").value || "{}");

    const orderId = `${orderType.toUpperCase().slice(0, 3)}-${orderIdPrefix}-${Date.now()}`;
    const orderData = {
        orderId: orderId,
        items: [{
            type: orderType,
            id: orderIdPrefix,
            accessory: orderAccessory,
            quantity: 1,
            amount: amount
        }],
        totalAmount: amount,
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

        setTimeout(() => {
            showMessage("Payment successful!", "success");
            setTimeout(() => {
                console.log('Redirecting to:', `/orders?orderId=${result.orderId}`);
                window.location.href = `/orders?orderId=${result.orderId}`;
                setTimeout(() => {
                    window.location.href = '/myorders';
                }, 3000); // Redirect to /myorders after showing confirmation
            }, 2000);
        }, 1500);
    } catch (error) {
        console.error('Payment error:', error);
        showMessage("Payment failed: " + error.message, "error");
    }
}

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById("payment-details");
    let content = "";

    switch (method) {
        case "upi":
            content = `
                <h4>UPI Payment</h4>
                <input type="text" id="upi-id" placeholder="Enter UPI ID (e.g., yourname@upi)">
                <button class="verify-btn" onclick="verifyUpi()">Verify</button>
            `;
            break;
        case "card":
            content = `
                <h4>Card Details</h4>
                <input type="text" placeholder="Card Number">
                <div class="card-details">
                    <input type="text" placeholder="MM/YY">
                    <input type="text" placeholder="CVV">
                </div>
            `;
            break;
        case "netbanking":
            content = `
                <h4>Net Banking</h4>
                <select>
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                </select>
            `;
            break;
        case "cod":
            content = `
                <h4>Cash on Delivery</h4>
                <p>You'll pay ₹${document.querySelector(".price").textContent.replace("₹", "").replace(",", "")} in cash when your order is delivered.</p>
            `;
            break;
    }

    paymentDetails.innerHTML = content;
    document.getElementById("pay-now").disabled = false;
}

function verifyUpi() {
    const upiId = document.getElementById("upi-id").value;
    if (upiId && /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        showMessage("UPI ID verified successfully!", "success");
        document.getElementById("pay-now").disabled = false;
    } else {
        showMessage("Please enter a valid UPI ID", "error");
    }
}

function showMessage(message, type) {
    const existingMessage = document.querySelector(".payment-message");
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `payment-message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add("fade-out");
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 500);
    }, 3000);
}