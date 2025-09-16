document.addEventListener("DOMContentLoaded", async function () {
    const orderIdElement = document.getElementById("order-id");
    const orderDetailsElement = document.getElementById("order-details");
    const downloadBtn = document.getElementById("download-receipt");
  
    if (!orderIdElement) {
      console.error('Missing #order-id element');
      if (orderDetailsElement) {
        orderDetailsElement.innerHTML = '<p>Error: Page setup incomplete.</p>';
      }
      return;
    }
  
    let order = {};
    let orderId = '';
  
    // Try server-side order data
    const orderDataInput = document.getElementById("order-data");
    if (orderDataInput && orderDataInput.value) {
      try {
        order = JSON.parse(orderDataInput.value);
        orderId = order.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      } catch (error) {
        console.error('Error parsing order-data:', error);
      }
    }
  
    // Override with API if orderId in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('orderId')) {
      orderId = urlParams.get('orderId');
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          order = result.order;
          orderId = order.orderId;
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        if (orderDetailsElement) {
          orderDetailsElement.innerHTML = `<p>Error loading order: ${error.message}</p>`;
        }
        order = { totalAmount: 0, paymentMethod: 'Unknown', timestamp: new Date(), items: [] };
      }
    }
  
    // Update orderId
    orderIdElement.textContent = orderId || 'N/A';
  
    // Only attach download if button exists and order is valid
    if (downloadBtn && order.orderId) {
      downloadBtn.addEventListener("click", () => downloadReceipt(orderId, order));
    }
  });
  
  function downloadReceipt(orderId, order) {
    const itemDetails = order.items && order.items.length > 0
      ? order.items.map(item => `${item.accessory.brand || ''} ${item.accessory.title || item.accessory.model || item.accessory.series || 'Item'} (Qty: ${item.quantity || 1})`).join(', ')
      : 'No items';
  
    const receiptContent = `
  Order Receipt
  -------------
  Order ID: ${orderId}
  Item Details: ${itemDetails}
  Amount Paid: ₹${(order.totalAmount || 0).toLocaleString('en-IN')}
  Payment Method: ${(order.paymentMethod || 'Unknown').charAt(0).toUpperCase() + (order.paymentMethod || 'unknown').slice(1)}
  Date: ${order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()}
  -------------
  Thank you for shopping with us!
    `;
  
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${orderId}.txt`;
    link.click();
  }