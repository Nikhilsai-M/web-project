// public/scripts/myorders.js
document.addEventListener("DOMContentLoaded", function () {
    const ordersList = document.getElementById("orders-list");
    
    // Get orders from hidden input
    const ordersDataInput = document.getElementById("orders-data");
    let orders = ordersDataInput ? JSON.parse(ordersDataInput.value) : [];

    // Fallback to localStorage if no orders from server
    const localOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
    if (orders.length === 0 && localOrders.length > 0) {
        orders = localOrders;
    }

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders found.</p>";
        return;
    }

    ordersList.innerHTML = "";

    orders.forEach((order, index) => {
        // Use orderId from order data, fallback if missing
        const orderId = order.orderId || `ORD-${Date.now()}-${index}`;

        const orderElement = document.createElement("div");
        orderElement.className = "order-item";

        // Build items list
        let itemsHtml = "";
        if (order.items && order.items.length > 0) {
            itemsHtml = "<h4>Items:</h4><ul>";
            order.items.forEach(item => {
                const itemName = `${item.accessory.brand} ${item.accessory.title || item.accessory.model || item.accessory.series || 'Item'}`;
                itemsHtml += `
                    <li>
                        ${itemName}<br>
                        <strong>Qty:</strong> ${item.quantity}<br>
                        <strong>Amount:</strong> ₹${item.amount.toLocaleString('en-IN')}
                    </li>
                `;
            });
            itemsHtml += "</ul>";
        } else {
            itemsHtml = "<p>No item details available.</p>";
        }

        orderElement.innerHTML = `
            <h3>Order #${index + 1} - ${orderId}</h3>
            ${itemsHtml}
            <p><strong>Total Amount Paid:</strong> ₹${(order.totalAmount || 0).toLocaleString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
        `;
        ordersList.appendChild(orderElement);
    });
});