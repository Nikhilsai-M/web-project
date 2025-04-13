document.addEventListener("DOMContentLoaded", function () {
    const topBuyPhoneLinks = document.querySelectorAll(".top-buy-phone-dropdown");
    const topBuyLaptopLinks = document.querySelectorAll(".top-buy-laptop-dropdown");
  
    function goToPhoneFilterPage(brand) {
      window.location.href = `/filter-buy-phone?brand=${encodeURIComponent(brand)}`;
    }
  
    function goToLaptopFilterPage(brand) {
      window.location.href = `/filter-buy-laptop?brand=${encodeURIComponent(brand)}`;
    }
  
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