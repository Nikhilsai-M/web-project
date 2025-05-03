document.addEventListener("DOMContentLoaded", function () {
    const topBuyPhoneLinks = document.querySelectorAll(".top-buy-phone-dropdown");
    const topBuyLaptopLinks = document.querySelectorAll(".top-buy-laptop-dropdown");
  
    function goToPhoneFilterPage(brand) {
      window.location.href = `/filter-buy-phone?brand=${encodeURIComponent(brand.toUpperCase())}`;
    }
  
    function goToLaptopFilterPage(brand) {
      window.location.href = `/filter-buy-laptop?brand=${encodeURIComponent(brand.toUpperCase())}`;
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
        const currentSession = localStorage.getItem("currentSession");
        const loginLink = document.getElementById("login-link");
        const profileLink = document.getElementById("profile-link");
        const userProfileContainer = document.querySelector(".user-profile-container");
        const icon = document.querySelector(".profile-icon");

        if (currentSession) {
            const userData = JSON.parse(currentSession);
            
            if (userData.loggedIn) {
                const firstName = userData.name.split(' ')[0];
                loginLink.textContent = firstName;
                loginLink.classList.remove("signin-button");
                loginLink.classList.add("user-name");
                icon.classList.remove("profile-icon");
                profileLink.href = "/profile";
                userProfileContainer.classList.add("dropdown-enabled");
                
                const logoutButton = document.getElementById("logout-button");
                if (logoutButton) {
                    logoutButton.addEventListener("click", async function(e) {
                        e.preventDefault();
                        try {
                            const response = await fetch('/api/customer/logout', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            const data = await response.json();
                            if (data.success) {
                                localStorage.removeItem("currentSession");
                                if (!localStorage.getItem("rememberUser")) {
                                    localStorage.removeItem("rememberUser");
                                }
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
                setupNotLoggedInState();
            }
        } else {
            setupNotLoggedInState();
        }
    }
    
    function setupNotLoggedInState() {
        const loginLink = document.getElementById("login-link");
        const profileLink = document.getElementById("profile-link");
        const userProfileContainer = document.querySelector(".user-profile-container");
        const icon = document.querySelector(".profile-icon");
        
        loginLink.textContent = "Sign in";
        loginLink.classList.add("signin-button");
        loginLink.classList.remove("user-name");
        profileLink.href = "/login";
        userProfileContainer.classList.remove("dropdown-enabled");
        if (icon) {
            icon.classList.add("profile-icon");
        }
    }
    
    updateUserInterface();

    const userProfileContainer = document.querySelector(".user-profile-container");
    const userDropdown = document.querySelector(".user-dropdown");
    let timeoutId;
    
    if (localStorage.getItem("currentSession") && JSON.parse(localStorage.getItem("currentSession")).loggedIn) {
        userProfileContainer.addEventListener("mouseenter", function() {
            clearTimeout(timeoutId);
            userDropdown.style.display = "block";
        });
        
        userProfileContainer.addEventListener("mouseleave", function() {
            timeoutId = setTimeout(function() {
                userDropdown.style.display = "none";
            }, 300);
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