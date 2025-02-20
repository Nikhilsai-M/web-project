document.addEventListener("DOMContentLoaded", function () {
    const modelContainer = document.getElementById("modelContainer");
    const backButton = document.querySelector(".backButton");

    // Ensure mobileModels data is available
    if (!window.mobileModels) {
        console.error("Error: Mobile models data not loaded!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");
    const selectedModel = urlParams.get("model");

    if (selectedBrand && !selectedModel) {
        showModels(selectedBrand);
    } else if (selectedModel) {
        showModelDetails(selectedModel);
    }

    function showModels(brand) {
        modelContainer.innerHTML = "";

        if (window.mobileModels[brand]) {
            window.mobileModels[brand].forEach(model => {
                const modelCard = document.createElement("div");
                modelCard.classList.add("model-card");

                modelCard.innerHTML = `
                    <img src="${model.image}" alt="${model.name}">
                    <p>${model.name}</p>
                `;

                modelCard.addEventListener("click", function () {
                    window.location.href = `sellphone-models.html?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model.name)}`;
                });

                modelContainer.appendChild(modelCard);
            });
        } else {
            modelContainer.innerHTML = "<p>No models available for this brand.</p>";
        }
    }

    function showModelDetails(modelName) {
        modelContainer.innerHTML = "";
    
        let model;
        Object.values(window.mobileModels).forEach(brandModels => {
            const foundModel = brandModels.find(m => m.name === modelName);
            if (foundModel) model = foundModel;
        });
    
        if (!model) {
            modelContainer.innerHTML = "<p>Model not found.</p>";
            return;
        }
    
        const modelDetails = document.createElement("div");
        modelDetails.classList.add("model-details");
    
        modelDetails.innerHTML = `
            <div class="model-image-container">
                <img src="${model.image}" alt="${model.name}">
            </div>
            <div class="model-info-container">
                <h2>${model.name}</h2>
                <h3>Choose a variant</h3>
                <select id="variantSelect">
                    ${Object.keys(model.variants || {})
                        .map(variant => `<option value="${model.variants[variant]}">${variant}</option>`)
                        .join("")}
                </select>
                <h3>Phone Condition</h3>
                <select id="conditionSelect">
                    <option value="0.9">Like New</option>
                    <option value="0.8">Good</option>
                    <option value="0.6">Average</option>
                    <option value="0.4">Poor</option>
                </select>
                <h3>Accessories Included?</h3>
                <div class="checkbox-container">
                    <input type="checkbox" id="accessoriesCheckbox">
                    <label for="accessoriesCheckbox">Charger & Box Included</label>
                </div>
                <br><br>
                <button id="calculatePriceBtn">Get Estimated Price</button>
                <p id="estimatedPrice"></p>
            </div>
        `;

        modelContainer.appendChild(modelDetails);

        document.getElementById("calculatePriceBtn").addEventListener("click", function () {
            calculatePrice();
        });
    }

    function calculatePrice() {
        const basePrice = parseInt(document.getElementById("variantSelect").value);
        const conditionMultiplier = parseFloat(document.getElementById("conditionSelect").value);
        const hasAccessories = document.getElementById("accessoriesCheckbox").checked;

        let finalPrice = basePrice * conditionMultiplier;
        if (hasAccessories) finalPrice += 200;

        document.getElementById("estimatedPrice").innerHTML = `<h3>Estimated Price: ₹${finalPrice}</h3>`;
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "sell_phone.html";
        });
    }
});
