document.addEventListener("DOMContentLoaded", function () {
    const phoneBrandCards = document.querySelectorAll(".sell-phone-brand");
    const topPhoneBrandLinks = document.querySelectorAll(".top-sell-phone-dropdown");
    const laptopBrandCards = document.querySelectorAll(".sell-laptop-brand");
    const topLaptopBrandLinks = document.querySelectorAll(".top-sell-laptop-dropdown");
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

    // Function to navigate to phone models page (Step 0)
    function goToPhoneModelsPage(brand) {
        sessionStorage.clear(); // Clear previous session data
        sessionStorage.setItem("selectedBrand", brand);
        sessionStorage.setItem("currentStep", 0); // Step 0: Show models
        window.location.href = `/sell-phone-models?brand=${encodeURIComponent(brand)}`;
    }

    // Function to navigate to laptop models page (Step 0)
    function goToLaptopModelsPage(brand) {
        sessionStorage.clear(); // Clear previous session data
        sessionStorage.setItem("selectedBrand", brand);
        sessionStorage.setItem("currentStep", 0); // Step 0: Show models
        window.location.href = `/sell-laptop-models?brand=${encodeURIComponent(brand)}`;
    }

    // Attach event listeners to brand cards
    function attachBrandCardListeners(cards, goToPageFunction) {
        cards.forEach(card => {
            card.addEventListener("click", function () {
                const selectedBrand = this.getAttribute("data-brand");
                goToPageFunction(selectedBrand);
            });
        });
    }

    // Attach event listeners to dropdown links
    function attachDropdownListeners(dropdownLinks, goToPageFunction) {
        dropdownLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default link behavior
                const selectedBrand = this.innerText.trim();
                goToPageFunction(selectedBrand);
            });
        });
    }

    // Attach listeners to brand cards
    attachBrandCardListeners(phoneBrandCards, goToPhoneModelsPage);
    attachBrandCardListeners(laptopBrandCards, goToLaptopModelsPage);

    // Attach listeners to dropdown links
    attachDropdownListeners(topPhoneBrandLinks, goToPhoneModelsPage);
    attachDropdownListeners(topLaptopBrandLinks, goToLaptopModelsPage);

    // Use MutationObserver to reattach listeners for dynamically loaded content
    const observer = new MutationObserver(() => {
        attachDropdownListeners(topPhoneBrandLinks, goToPhoneModelsPage);
        attachDropdownListeners(topLaptopBrandLinks, goToLaptopModelsPage);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Handle user login state
    function updateUserInterface() {
        // Get current session data
        const currentSession = localStorage.getItem("currentSession");
        const loginLink = document.getElementById("login-link");
        const profileLink = document.getElementById("profile-link");
        const userProfileContainer = document.querySelector(".user-profile-container");
        const icon=document.querySelector(".profile-icon");

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
                    logoutButton.addEventListener("click", function(e) {
                        e.preventDefault();
                        
                        // Clear session data
                        localStorage.removeItem("currentSession");
                        
                        // Keep remember me if it exists
                        if (!localStorage.getItem("rememberUser")) {
                            localStorage.removeItem("rememberUser");
                        }
                        
                        // Refresh the page
                        window.location.reload();
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
        
        // Update text back to Sign in
        loginLink.textContent = "Sign in";
        
        // Add button styling
        loginLink.classList.add("signin-button");
        loginLink.classList.remove("user-name");
        
        // Set link to login page
        profileLink.href = "/login";
        
        // Remove the class that enables hover functionality
        userProfileContainer.classList.remove("dropdown-enabled");
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
            }, 300); // 500ms delay gives you time to move to the dropdown
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
