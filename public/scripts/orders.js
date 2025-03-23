// public/scripts/orders.js
document.addEventListener("DOMContentLoaded", async function () {
    const orderIdElement = document.getElementById("order-id");
    let order = {};
    let orderId = '';

    // Get orderId from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('orderId')) {
        orderId = urlParams.get('orderId');
        try {
            // Fetch order details from the server
            const response = await fetch(`/api/orders/${orderId}`);
            const result = await response.json();
            if (result.success) {
                order = result.order;
            } else {
                console.error('Error fetching order:', result.message);
                order = { amount: "N/A", paymentMethod: "Unknown", timestamp: new Date().toLocaleString(), accessory: {} };
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            order = { amount: "N/A", paymentMethod: "Unknown", timestamp: new Date().toLocaleString(), accessory: {} };
        }
    } else {
        // Fallback for legacy query parameter
        const orderDataInput = document.getElementById("order-data");
        order = orderDataInput ? JSON.parse(orderDataInput.value) : {
            amount: "N/A",
            paymentMethod: "Unknown",
            timestamp: new Date().toLocaleString(),
            accessory: {}
        };
        orderId = order.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`; // Fallback if no orderId
    }

    orderIdElement.textContent = orderId;

    const downloadBtn = document.getElementById("download-receipt");
    downloadBtn.addEventListener("click", function () {
        downloadReceipt(orderId, order);
    });
});

function downloadReceipt(orderId, order) {
    const itemDetails = order.items && order.items.length > 0
        ? order.items.map(item => `${item.accessory.brand} ${item.accessory.title || item.accessory.model || 'Item'} (Qty: ${item.quantity})`).join(', ')
        : "Unknown Item";

    const receiptContent = `
Order Receipt
-------------
Order ID: ${orderId}
Item Details: ${itemDetails}
Amount Paid: ₹${(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}
Payment Method: ${(order.paymentMethod || 'Unknown').charAt(0).toUpperCase() + (order.paymentMethod || 'unknown').slice(1)}
Date: ${order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()}
-------------
Thank you for shopping with us!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${orderId}.txt`;
    link.click();
}