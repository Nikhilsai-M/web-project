document.addEventListener("DOMContentLoaded", function () {
    // Existing code for brand navigation
    const brandCards = document.querySelectorAll(".sell-phone-brand");
    const topBrandLinks = document.querySelectorAll(".top-sell-phone-dropdown"); // Navbar brands

    // Create a hidden anchor element for navigation
    const link = document.createElement("a");
    link.style.display = "none"; // Hide the link
    document.body.appendChild(link); // Append to body

    // Function to navigate to models page
    function goToModelsPage(brand) {
        link.href = `sellphone-models.html?brand=${encodeURIComponent(brand)}`;
        link.click(); // Simulate a click event
    }

    // Event Listener for clicking a brand card on Sell Phone page
    brandCards.forEach(card => {
        card.addEventListener("click", function () {
            const selectedBrand = this.getAttribute("data-brand");
            goToModelsPage(selectedBrand);
        });
    });

    // Event Listener for clicking a brand in Top Brands dropdown (Navbar)
    topBrandLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            const selectedBrand = this.innerText.trim(); // Get brand name
            goToModelsPage(selectedBrand);
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
    let user = localStorage.getItem("loggedInUser");
    let profileMenu = document.getElementById("profile-menu");
    let welcomeMessage = document.getElementById("welcome-message");
    let logoutButton = document.getElementById("logout-button");

    if (user) {
        // User is logged in
        loginLink.style.display = "none";
        welcomeMessage.textContent = `Welcome, ${user}`;
        profileIcon.style.cursor = "pointer";

        profileIcon.addEventListener("click", function () {
            profileMenu.classList.toggle("active");
        });

        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            window.location.reload(); // Refresh to update UI
        });
    } else {
        profileIcon.style.display = "none"; // Hide profile icon if not logged in
    }
    
});