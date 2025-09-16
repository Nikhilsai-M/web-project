// public/scripts/myorders.js
document.addEventListener("DOMContentLoaded", async function () {
    const ordersList = document.getElementById("orders-list");

    try {
        const response = await fetch('/api/myorders');
        const orders = await response.json();

        if (!orders || orders.length === 0) {
            ordersList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        ordersList.innerHTML = "";

        orders.forEach((order, index) => {
            const orderElement = document.createElement("div");
            orderElement.className = "order-item";

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
                <h3>Order #${index + 1} - ${order.orderId}</h3>
                ${itemsHtml}
                <p><strong>Total Amount Paid:</strong> ₹${(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}</p>
                <p><strong>Date:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()}</p>
            `;
            ordersList.appendChild(orderElement);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersList.innerHTML = "<p>Error loading orders.</p>";
    }
});