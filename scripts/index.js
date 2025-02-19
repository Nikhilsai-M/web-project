document.addEventListener("DOMContentLoaded", function () {
    const brandCards = document.querySelectorAll(".brand-card");
    const topBrandLinks = document.querySelectorAll(".top-brands-dropdown"); // Navbar brands

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
});

