// public/scripts/orders.js
document.addEventListener("DOMContentLoaded", function () {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomNum}`;
    const orderIdElement = document.getElementById("order-id");
    orderIdElement.textContent = orderId;

    const orderDataInput = document.getElementById("order-data");
    const order = orderDataInput ? JSON.parse(orderDataInput.value) : {
        amount: "N/A",
        paymentMethod: "Unknown",
        timestamp: new Date().toLocaleString(),
        accessory: {}
    };

    const downloadBtn = document.getElementById("download-receipt");
    downloadBtn.addEventListener("click", function () {
        downloadReceipt(orderId, order);
    });
});

function downloadReceipt(orderId, order) {
    const itemDetails = (order.accessory && order.accessory.brand && order.accessory.title) 
        ? `${order.accessory.brand} ${order.accessory.title}` 
        : (order.type ? order.type.charAt(0).toUpperCase() + order.type.slice(1) : "Unknown Item");

    const receiptContent = `
Order Receipt
-------------
Order ID: ${orderId}
Item Details: ${itemDetails}
Amount Paid: ₹${order.amount.toLocaleString('en-IN')}
Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
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