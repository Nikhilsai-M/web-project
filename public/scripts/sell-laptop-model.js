import laptopModels from "./laptop-data.js";

document.addEventListener("DOMContentLoaded", function () {
    const modelContainer = document.getElementById("modelContainer");
    const backButton = document.querySelector(".backButton");
    const selectBrandHeading = document.querySelector(".Select-brand");

    // Function to hide the Back button
    function hideBackButton() {
        if (backButton) {
            backButton.style.display = "none"; // Hide the Back button
        }
    }

    // Get selected brand and model from sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    let selectedBrand = urlParams.get("brand") || sessionStorage.getItem("selectedBrand");
    let selectedModel = urlParams.get("model") || sessionStorage.getItem("selectedModel");

    if (selectedBrand) {
        sessionStorage.setItem("selectedBrand", selectedBrand);
        const brandHeading = document.querySelector(".brand-in-heading");
        if (brandHeading) {
            brandHeading.textContent = selectedBrand;
        }
    }

    if (selectedModel) {
        sessionStorage.setItem("selectedModel", selectedModel);
        // Change heading to "Provide Laptop Details" when a model is selected
        if (selectBrandHeading) {
            selectBrandHeading.textContent = `Provide your Laptop Details`;
        }
        showLaptopForm(selectedBrand, selectedModel);
    } else if (selectedBrand) {
        // Keep heading as "Select Model" when showing models
        if (selectBrandHeading) {
            selectBrandHeading.textContent = "Select Model";
        }
        showModels(selectedBrand);
    }

    function showModels(brand) {
        modelContainer.innerHTML = "";

        if (laptopModels[brand]) {
            laptopModels[brand].forEach(model => {
                const modelCard = document.createElement("div");
                modelCard.classList.add("model-card");

                modelCard.innerHTML = `
                    <img src="${model.image}" alt="${model.name}">
                    <p>${model.name}</p>
                `;

                modelCard.addEventListener("click", function () {
                    sessionStorage.setItem("selectedModel", model.name);
                    // Update heading when a model is clicked
                    if (selectBrandHeading) {
                        selectBrandHeading.textContent = "Provide Your Laptop Details";
                    }
                    showLaptopForm(brand, model.name);
                });

                modelContainer.appendChild(modelCard);
            });
        } else {
            modelContainer.innerHTML = "<p>No models available for this brand.</p>";
        }
    }

    function showLaptopForm(brand, model) {
        // Clear the container first
        modelContainer.innerHTML = "";

        // Add the form
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <form id="laptopForm">
                <label for="processor">Processor:</label>
                <select id="processor" required>
                    <option value="i3">Intel i3</option>
                    <option value="i5">Intel i5</option>
                    <option value="i7">Intel i7</option>
                    <option value="ryzen3">AMD Ryzen 3</option>
                    <option value="ryzen5">AMD Ryzen 5</option>
                    <option value="ryzen7">AMD Ryzen 7</option>
                    ${brand === "Apple" ? '<option value="m1">Apple M1</option>' : ''}
                    ${brand === "Apple" ? '<option value="m2">Apple M2</option>' : ''}
                    ${brand === "Apple" ? '<option value="m3">Apple M3</option>' : ''}
                </select>

                <label for="ram">RAM:</label>
                <select id="ram" required>
                    <option value="4">4GB</option>
                    <option value="8">8GB</option>
                    <option value="16">16GB</option>
                    <option value="32">32GB</option>
                </select>

                <label for="storage">Storage:</label>
                <select id="storage" required>
                    <option value="256">256GB SSD</option>
                    <option value="512">512GB SSD</option>
                    <option value="1TB">1TB SSD</option>
                </select>

                <label for="condition">Condition:</label>
                <select id="condition" required>
                    <option value="new">Like New</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                </select>

                <div class="battery-checkbox">
                    <input type="checkbox" id="batteryIssues" name="batteryIssues">
                    <label for="batteryIssues">Battery Issues</label>
                </div>

                <label for="year">Year of Purchase:</label>
                <input type="number" id="year" min="2000" max="2024" value="2022" required>

                <button type="submit">Get Estimate</button>
            </form>
        `;

        modelContainer.appendChild(formContainer);

        // Add form submission handler
        const form = document.getElementById("laptopForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Get all the form values
            const processor = document.getElementById("processor").value;
            const ram = document.getElementById("ram").value;
            const storage = document.getElementById("storage").value;
            const condition = document.getElementById("condition").value;
            const batteryIssues = document.getElementById("batteryIssues").checked;
            const year = document.getElementById("year").value;

            // Calculate and display the estimated price
            calculateEstimatedPrice(brand, model, processor, ram, storage, condition, batteryIssues, year);
        });
    }

    // Back button handler
    backButton.addEventListener("click", function () {
        const selectedModel = sessionStorage.getItem("selectedModel");

        if (!selectedModel) {
            // If no model is selected, go back to the sell-laptop page
            window.location.href = "/sell-laptop";
        } else {
            // If a model is selected, show the models for the selected brand
            const selectedBrand = sessionStorage.getItem("selectedBrand");
            if (selectBrandHeading) {
                selectBrandHeading.textContent = "Select Model";
            }
            showModels(selectedBrand);

            // Remove the selected model from session storage
            sessionStorage.removeItem("selectedModel");
        }
    });

    function calculateEstimatedPrice(brand, model, processor, ram, storage, condition, batteryIssues, year) {
        // Find the selected model's base price from the laptopModels object
        let basePrice = 0;
        let selectedModelData = null;
        
        if (laptopModels[brand]) {
            selectedModelData = laptopModels[brand].find(m => m.name === model);
            if (selectedModelData && selectedModelData.basePrice) {
                basePrice = selectedModelData.basePrice;
            } else {
                // Fallback base price if model not found or has no basePrice
                console.warn(`Base price not found for ${brand} ${model}, using default value`);
                switch (brand) {
                    case "Apple": basePrice = 80000; break;
                    case "Microsoft": basePrice = 65000; break;
                    case "Dell": basePrice = 55000; break;
                    case "HP": basePrice = 50000; break;
                    case "Lenovo": basePrice = 45000; break;
                    case "Asus": basePrice = 40000; break;
                    case "Acer": basePrice = 35000; break;
                    case "MSI": basePrice = 50000; break;
                    default: basePrice = 30000;
                }
            }
        }

        // Processor adjustment
        if (processor.includes("i7") || processor.includes("ryzen7") || processor.includes("m3")) {
            basePrice *= 1.3;
        } else if (processor.includes("i5") || processor.includes("ryzen5") || processor.includes("m2")) {
            basePrice *= 1.15;
        }

        // RAM adjustment
        if (ram === "32") {
            basePrice *= 1.3;
        } else if (ram === "16") {
            basePrice *= 1.2;
        } else if (ram === "8") {
            basePrice *= 1.1;
        }

        // Storage adjustment
        if (storage === "1TB") {
            basePrice *= 1.25;
        } else if (storage === "512") {
            basePrice *= 1.1;
        }

        // Condition adjustment
        switch (condition) {
            case "new": basePrice *= 1.0; break;
            case "good": basePrice *= 0.8; break;
            case "average": basePrice *= 0.6; break;
            case "poor": basePrice *= 0.4; break;
        }

        // Battery health adjustment
        if (batteryIssues) {
            basePrice *= 0.8; // 20% reduction for battery issues
        }

        // Age adjustment
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(year);
        basePrice *= Math.max(0.5, 1 - (age * 0.1));

        // Display the estimated price
        const estimatedPrice = Math.round(basePrice);

        // Update the heading for the results page
        if (selectBrandHeading) {
            selectBrandHeading.textContent = "Estimated Value";
        }

        // Hide back button on the estimated price page
        hideBackButton();

        modelContainer.innerHTML = `
            <h2>₹${estimatedPrice}</h2>
            <p>For your ${model} with:</p>
            <ul>
                <li>Processor: ${processor}</li>
                <li>RAM: ${ram}GB</li>
                <li>Storage: ${storage}</li>
                <li>Condition: ${condition}</li>
                <li>Battery Issues: ${batteryIssues ? 'Yes' : 'No'}</li>
                <li>Year: ${year}</li>
            </ul>
            <button id="proceedButton">Proceed to Sell</button>
            <button id="backToSpecsButton">Change Specifications</button>
        `;

        // Add button handlers
        document.getElementById("proceedButton").addEventListener("click", function () {
            // Save these details and redirect to the checkout/confirmation page
            sessionStorage.setItem("laptopDetails", JSON.stringify({
                brand, model, processor, ram, storage, condition, batteryIssues, year, estimatedPrice
            }));
            window.location.href = "/sell-laptop-checkout";
        });

        document.getElementById("backToSpecsButton").addEventListener("click", function () {
            // Show back button again when going back to specs
            if (backButton) {
                backButton.style.display = ""; // Reset to default display
            }

            // When going back to the specs form, keep the "Provide Laptop Details" heading
            if (selectBrandHeading) {
                selectBrandHeading.textContent = "Provide Your Laptop Details";
            }
            showLaptopForm(brand, model);
        });
    }
});