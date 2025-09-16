// public/scripts/laptop-details.js
document.addEventListener("DOMContentLoaded", function() {
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function() {
        const laptopId = this.dataset.id;
        addToCart(laptopId);
      });
    }
  
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function() {
        const laptopId = this.dataset.id;
        buyNow(laptopId);
      });
    }
  });
  
  function addToCart(laptopId) {
    const session = JSON.parse(localStorage.getItem("currentSession"));
    if (!session || !session.loggedIn) {
      window.location.href = "/login";
      return;
    }
  
    fetch(`/api/laptops/${laptopId}`)
      .then(response => response.json())
      .then(laptop => {
        if (laptop) {
          let userId = session.userId;
          let userCartKey = `cart_${userId}`;
          let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
          const existingProductIndex = cart.findIndex(item => item.id === laptop.id);
  
          if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
          } else {
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
              weight: laptop.weight,
              type: 'laptop' // Add type for order creation
            });
          }
  
          localStorage.setItem(userCartKey, JSON.stringify(cart));
          showAddedToCartMessage(`${laptop.brand} ${laptop.series}`);
        }
      })
      .catch(error => {
        console.error("Error fetching laptop details:", error);
        const laptopTitle = document.querySelector(".product-title").textContent;
        showAddedToCartMessage(laptopTitle);
      });
  }
  
  function buyNow(laptopId) {
    const session = JSON.parse(localStorage.getItem("currentSession"));
    if (!session || !session.loggedIn) {
      window.location.href = "/login";
      return;
    }
  
    // Fetch laptop details to get price and accessory info
    fetch(`/api/laptops/${laptopId}`)
      .then(response => response.json())
      .then(laptop => {
        if (laptop) {
          const finalPrice = laptop.pricing.basePrice - (laptop.pricing.basePrice * laptop.pricing.discount / 100);
          const orderData = {
            totalAmount: finalPrice,
            paymentMethod: 'card', // Adjust based on your payment page logic
            items: [
              {
                type: 'laptop',
                id: laptop.id,
                quantity: 1,
                amount: finalPrice,
                accessory: `${laptop.brand} ${laptop.series}`
              }
            ]
          };
  
          // Redirect to payment page with order data
          window.location.href = `/buy/laptop/${laptopId}?order=${encodeURIComponent(JSON.stringify(orderData))}`;
        }
      })
      .catch(error => {
        console.error("Error fetching laptop details:", error);
        window.location.href = "/cart";
      });
  }
  
  function showAddedToCartMessage(productName) {
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
  
    setTimeout(() => {
      messageDiv.classList.add("fade-out");
      setTimeout(() => {
        if (document.body.contains(messageDiv)) {
          document.body.removeChild(messageDiv);
        }
      }, 500);
    }, 3000);
  }