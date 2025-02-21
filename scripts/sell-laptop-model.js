document.addEventListener("DOMContentLoaded", function () {
    const modelContainer = document.getElementById("modelContainer");
    const backButton = document.querySelector(".backButton");

    // Check if laptopModels data is loaded
    if (!window.laptopModels) {
        console.error("Error: Laptop models data not loaded!");
        return;
    }

    // Get the selected brand from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");

    const brandheading = document.querySelector(".brand-in-heading");
    brandheading.innerHTML=`<a>${selectedBrand}</a>`;
    
    console.log(selectedBrand);
    if (selectedBrand) {
        showModels(selectedBrand);
    } else {
        console.error("No brand selected!");
    }

    // Function to display models for the selected brand
    function showModels(brand) {
        modelContainer.innerHTML = "";

        if (window.laptopModels[brand]) {
            window.laptopModels[brand].forEach(model => {
                const modelCard = document.createElement("div");
                modelCard.classList.add("model-card");

                modelCard.innerHTML = `
                    <img src="${model.image}" alt="${model.name}">
                    <p>${model.name}</p>
                `;

                modelCard.addEventListener("click", function () {
                    window.location.href = `sell-laptop-models.html?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model.name)}`;
                });

                modelContainer.appendChild(modelCard);
            });
        } else {
            modelContainer.innerHTML = "<p>No models available for this brand.</p>";
        }
    }

    // Back button functionality
    backButton.addEventListener("click", function () {
        window.location.href = "sell_laptop.html";
    });
});