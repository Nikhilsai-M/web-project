document.addEventListener("DOMContentLoaded", function () {
    const topBuyPhoneLinks = document.querySelectorAll(".top-buy-phone-dropdown");
    const topBuyLaptopLinks = document.querySelectorAll(".top-buy-laptop-dropdown");
    
    function goToPhoneFilterPage(brand) {
        window.location.href = `/filter-buy-phone?brand=${encodeURIComponent(brand)}`;
    }

    function goToLaptopFilterPage(brand) {
        window.location.href = `/filter-buy-laptop?brand=${encodeURIComponent(brand)}`;
    }

    // Attach event listeners to dropdown links
    topBuyPhoneLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedBrand = this.innerText.trim();
            goToPhoneFilterPage(selectedBrand);
        });
    });

    topBuyLaptopLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedBrand = this.innerText.trim();
            goToLaptopFilterPage(selectedBrand);
        });
    });

    async function fetchAndRenderLatestProducts() {
        try {
          const response = await fetch('/api/latest-phones');
          if (!response.ok) throw new Error('Failed to fetch latest products');
          const products = await response.json();
    
          const grid = document.getElementById('latest-products-grid');
          grid.innerHTML = ''; // Clear existing content
    
          // Edge Case 1: Handle no products
          if (products.length === 0) {
            grid.innerHTML = '<p>No new products available.</p>';
            return;
          }
    
          products.forEach(product => {
            const finalPrice = calculateFinalPrice(product);
            const originalPrice = product.basePrice;
    
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
              <a href="/product/${product.id}" style="text-decoration: none; color: #000;">
                <img src="${product.image}" alt="${product.brand} ${product.model}">
                <p class="best_in_value_phone_name">${product.brand} ${product.model} </p>
                <p class="price">₹${finalPrice.toLocaleString('en-IN')} <span class="old-price">₹${originalPrice.toLocaleString('en-IN')}</span></p>
                <p class="discount">${product.discount}% off</p>
                <p>Grade: ${product.condition}</p>
                <p>FREE 6 Months Warranty</p>
              </a>
            `;
            grid.appendChild(card);
          });
        } catch (error) {
          console.error('Error fetching latest products:', error);
          const grid = document.getElementById('latest-products-grid');
          grid.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
      }
    
      // Pricing calculation function
      function calculateFinalPrice(product) {
        const price = parseFloat(product.basePrice || 0);
        const discount = parseFloat(product.discount || 0);
        const finalPrice = Number((price - (price * discount / 100)).toFixed(2));
        return finalPrice;
      }
    
      fetchAndRenderLatestProducts();
      setInterval(fetchAndRenderLatestProducts, 30000);
      
    // Handle user login state
    function updateUserInterface() {
        // Get current session data
        const currentSession = localStorage.getItem("currentSession");
        const loginLink = document.getElementById("login-link");
        const profileLink = document.getElementById("profile-link");
        const userProfileContainer = document.querySelector(".user-profile-container");
        const icon = document.querySelector(".profile-icon");

        if (currentSession) {
            const userData = JSON.parse(currentSession);
            
            if (userData.loggedIn) {
                // Extract first name from full name
                const firstName = userData.name.split(' ')[0];
                
                // Update the display text to show user's first name
                loginLink.textContent = firstName;
                loginLink.classList.remove("signin-button");
                loginLink.classList.add("user-name");
                icon.classList.remove("profile-icon");
                // Update the link to profile instead of login page
                profileLink.href = "/profile";
                
                // Add a class to the container to enable hover functionality
                userProfileContainer.classList.add("dropdown-enabled");
                
                // Add logout functionality
                const logoutButton = document.getElementById("logout-button");
                if (logoutButton) {
                    logoutButton.addEventListener("click", async function(e) {
                        e.preventDefault();

                        try {
                            // Call the logout endpoint to destroy the server-side session
                            const response = await fetch('/api/customer/logout', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            const data = await response.json();

                            if (data.success) {
                                // Clear client-side session data
                                localStorage.removeItem("currentSession");

                                // Keep remember me if it exists
                                if (!localStorage.getItem("rememberUser")) {
                                    localStorage.removeItem("rememberUser");
                                }

                                // Redirect to the homepage
                                window.location.href = '/';
                            } else {
                                console.error('Logout failed:', data.message);
                                alert('Failed to log out. Please try again.');
                            }
                        } catch (error) {
                            console.error('Error during logout:', error);
                            alert('Error during logout. Please try again.');
                        }
                    });
                }
            } else {
                // Not logged in
                setupNotLoggedInState();
            }
        } else {
            // No session exists
            setupNotLoggedInState();
        }
    }
    
    function setupNotLoggedInState() {
        const loginLink = document.getElementById("login-link");
        const profileLink = document.getElementById("profile-link");
        const userProfileContainer = document.querySelector(".user-profile-container");
        const icon = document.querySelector(".profile-icon");
        
        // Update text back to Sign in
        loginLink.textContent = "Sign in";
        
        // Add button styling
        loginLink.classList.add("signin-button");
        loginLink.classList.remove("user-name");
        
        // Set link to login page
        profileLink.href = "/login";
        
        // Remove the class that enables hover functionality
        userProfileContainer.classList.remove("dropdown-enabled");

        // Ensure the profile icon is visible when not logged in
        if (icon) {
            icon.classList.add("profile-icon");
        }
    }
    
    // Initialize user interface based on login state
    updateUserInterface();

    const userProfileContainer = document.querySelector(".user-profile-container");
    const userDropdown = document.querySelector(".user-dropdown");
    let timeoutId;
    
    // Only add these event listeners if a user is logged in
    if (localStorage.getItem("currentSession") && JSON.parse(localStorage.getItem("currentSession")).loggedIn) {
        userProfileContainer.addEventListener("mouseenter", function() {
            clearTimeout(timeoutId);
            userDropdown.style.display = "block";
        });
        
        userProfileContainer.addEventListener("mouseleave", function() {
            timeoutId = setTimeout(function() {
                userDropdown.style.display = "none";
            }, 300); // 300ms delay gives you time to move to the dropdown
        });
        
        userDropdown.addEventListener("mouseenter", function() {
            clearTimeout(timeoutId);
        });
        
        userDropdown.addEventListener("mouseleave", function() {
            timeoutId = setTimeout(function() {
                userDropdown.style.display = "none";
            }, 300);
        });
    }
});