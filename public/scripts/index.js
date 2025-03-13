document.addEventListener("DOMContentLoaded", function () {
    const phoneBrandCards = document.querySelectorAll(".sell-phone-brand");
    const topPhoneBrandLinks = document.querySelectorAll(".top-sell-phone-dropdown");
    const laptopBrandCards = document.querySelectorAll(".sell-laptop-brand");
    const topLaptopBrandLinks = document.querySelectorAll(".top-sell-laptop-dropdown");

    const topBuyPhoneLinks = document.querySelectorAll(".top-buy-phone-dropdown");
    
        function goToFilterPage(brand) {
            window.location.href = `/filter-buy-phone?brand=${encodeURIComponent(brand)}`;
        }
    
        // Attach event listeners to dropdown links
        topBuyPhoneLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const selectedBrand = this.innerText.trim();
                goToFilterPage(selectedBrand);
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
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("name");
    const loginLink = document.getElementById("login-link");
    const profileIcon = document.querySelector(".profile-icon");

    if (isLoggedIn === "true" && name) {
        loginLink.textContent = name;
        loginLink.href = "#";
    } else {
        loginLink.textContent = "Sign in";
        loginLink.href = "login.html";
    }
});