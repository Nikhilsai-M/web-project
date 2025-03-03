document.addEventListener("DOMContentLoaded", function () {
    // Existing code for brand navigation
    const phone_brandCards = document.querySelectorAll(".sell-phone-brand");
    const top_phoneBrandLinks = document.querySelectorAll(".top-sell-phone-dropdown"); // Navbar brands

    const laptop_brandCards = document.querySelectorAll(".sell-laptop-brand");
    const top_laptop_BrandLinks = document.querySelectorAll(".top-sell-laptop-dropdown");
    // Create a hidden anchor element for navigation

    const link = document.createElement("a");
    link.style.display = "none"; // Hide the link
    document.body.appendChild(link); // Append to body

    // Function to navigate to models page
    function goTo_phoneModelsPage(brand) {
        link.href = `/sell-phone-models?brand=${encodeURIComponent(brand)}`;
        link.click(); // Simulate a click event
    }
    function goTo_laptopModelsPage(brand) {
        link.href = `/sell-laptop-models?brand=${encodeURIComponent(brand)}`;
        link.click(); // Simulate a click event
    }

    // Event Listener for clicking a brand card on Sell Phone page
    phone_brandCards.forEach(card => {
        card.addEventListener("click", function () {
            const selectedBrand = this.getAttribute("data-brand");
            goTo_phoneModelsPage(selectedBrand);
        });
    });

    // Event Listener for clicking a brand in Top Brands dropdown (Navbar)
    top_phoneBrandLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const selectedBrand = this.innerText.trim(); // Get brand name
            goTo_phoneModelsPage(selectedBrand);
        });
    });

    laptop_brandCards.forEach(card => {
        card.addEventListener("click", function () {
            const selectedBrand = this.getAttribute("data-brand");
            goTo_laptopModelsPage(selectedBrand);
        });
    });

    // Event Listener for clicking a brand in Top Brands dropdown (Navbar)
    top_laptop_BrandLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const selectedBrand = this.innerText.trim(); // Get brand name
            goTo_laptopModelsPage(selectedBrand);
        });
    });

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("name");
    const loginLink = document.getElementById("login-link");
    const profileIcon = document.querySelector(".profile-icon");

    if (isLoggedIn === "true" && name) {
        // User is logged in
        loginLink.textContent = name; // Replace "Sign in" with the user's name
        loginLink.href = "#"; // Remove the link to the login page
    } else {
        // User is not logged in
        loginLink.textContent = "Sign in";
        loginLink.href = "login.html";
    }
});