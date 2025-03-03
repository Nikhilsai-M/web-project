import mobileModels from "./mobile-data.js";

let priceRatios = {
    // Step 1: Basic details
    ramVariant: 1, // New property for RAM variant
    accessories: 1,

    // Step 2: Additional details
    deviceAge: 1,
    devicePower: 1,
    deviceCalls: 1,

    // Step 3: Device health checks
    camerasWorking: 1,
    batteryIssues: 1,
    buttonsDamaged: 1,
    connectivityIssues: 1,
    soundIssues: 1
};

function updateCurrentStep(step) {
    sessionStorage.setItem("currentStep", step);
    history.pushState({ step: step }, "", `#step${step}`); // Push step change to history
}


// Function to show the Next button
function showNextButton() {
    const nextButton = document.querySelector(".nextButton");
    if (nextButton) {
        nextButton.style.display = "block"; // Make the Next button visible
    }
}

// Function to hide the Next button
function hideNextButton() {
    const nextButton = document.querySelector(".nextButton");
    if (nextButton) {
        nextButton.style.display = "none"; // Hide the Next button
    }
}

// Function to hide the Back button
function hideBackButton() {
    const backButton = document.querySelector(".backButton");
    if (backButton) {
        backButton.style.display = "none"; // Hide the Back button
    }
}
function updateSideHeading(step) {
    const sideHeading = document.getElementById("sideHeading");
    if (sideHeading) {
        if(step=== 1){ 
             sideHeading.textContent = "Select Valid Specifications ";
            }else if(step === 4){
                sideHeading.style.display="none";
            }else{
                sideHeading.textContent="Select Valid Details "
            }
           // Update heading for Steps 1, 2, 3, and Final Step
    }
}


let currentStep = 1; // Start from Step 1

// Step 1: Basic details
function showModelDetails(modelName) {
    updateSideHeading();
    const modelContainer = document.getElementById("modelContainer");
    modelContainer.innerHTML = "";

    let model;
    Object.values(mobileModels).forEach(brandModels => {
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
            <h3>RAM Variant</h3>
            <select id="ramVariantSelect">
                <option value="4">4GB</option>
                <option value="6">6GB</option>
                <option value="8">8GB</option>
                <option value="12">12GB</option>
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

    // Store the base price in sessionStorage when the variant is selected
    const variantSelect = document.getElementById("variantSelect");
    variantSelect.addEventListener("change", function () {
        sessionStorage.setItem("basePrice", variantSelect.value);
    });

    // Initialize sessionStorage with the default selected variant's price
    sessionStorage.setItem("basePrice", variantSelect.value);

    // Show the Next button
    showNextButton();

    document.getElementById("calculatePriceBtn").addEventListener("click", function () {
        calculatePrice();
    });

    // Add event listener to the Next button
    const nextButton = document.querySelector(".nextButton");
    if (nextButton) {
        // Remove any previous event listeners
        nextButton.replaceWith(nextButton.cloneNode(true));
        const newNextButton = document.querySelector(".nextButton");

        newNextButton.addEventListener("click", function () {
            mobileCheckStep2();
        });
    }
}

function calculatePrice() {
    const basePrice = parseInt(document.getElementById("variantSelect").value);
    const ramVariant = parseInt(document.getElementById("ramVariantSelect").value);
    const hasAccessories = document.getElementById("accessoriesCheckbox").checked;

    // Adjust price based on RAM variant
    let ramMultiplier = 1;
    if (ramVariant === 4) {
        ramMultiplier = 0.9; // 4GB RAM
    } else if (ramVariant === 6) {
        ramMultiplier = 1; // 6GB RAM
    } else if (ramVariant === 8) {
        ramMultiplier = 1.1; // 8GB RAM
    } else if (ramVariant === 12) {
        ramMultiplier = 1.2; // 12GB RAM
    }

    priceRatios.ramVariant = ramMultiplier;
    priceRatios.accessories = hasAccessories ? 1.1 : 1;

    let finalPrice = basePrice * ramMultiplier;
    if (hasAccessories) finalPrice += 200; // Add extra for accessories

    document.getElementById("estimatedPrice").innerHTML = `<h3>Estimated Price: ₹${finalPrice}</h3>`;
}

// Step 2: Additional details
function mobileCheckStep2() {
    updateSideHeading();
    currentStep = 2;
    updateCurrentStep(2); // Update current step
    const modelContainer = document.getElementById("modelContainer");
    modelContainer.innerHTML = "";

    const step2Details = document.createElement("div");
    step2Details.classList.add("step2-details");

    step2Details.innerHTML = `
            <div class="question">
            <h3>1. How old is the device?</h3>
            <label><input type="radio" name="deviceAge" value="1"> Less than 1 year</label>
            <label><input type="radio" name="deviceAge" value="0.9"> 1-2 years</label>
            <label><input type="radio" name="deviceAge" value="0.8"> More than 2 years</label>
        </div>
        <div class="question">
            <h3>2. Is the device switching on?</h3>
            <label><input type="radio" name="devicePower" value="1"> Yes</label>
            <label><input type="radio" name="devicePower" value="0.5"> No</label>
        </div>
        <div class="question">
            <h3>3. Can the device make/receive calls?</h3>
            <label><input type="radio" name="deviceCalls" value="1"> Yes</label>
            <label><input type="radio" name="deviceCalls" value="0.7"> No</label>
        </div>
    `;

    modelContainer.appendChild(step2Details);

    // Select the Next button
    const nextButton = document.querySelector(".nextButton");

    if (nextButton) {
        // Remove any previous event listeners to prevent duplicate calls
        nextButton.replaceWith(nextButton.cloneNode(true));
        const newNextButton = document.querySelector(".nextButton");

        newNextButton.addEventListener("click", function () {
            collectStep2Details();
        });
    }
}

function collectStep2Details() {
    const deviceAge = document.querySelector('input[name="deviceAge"]:checked');
    const devicePower = document.querySelector('input[name="devicePower"]:checked');
    const deviceCalls = document.querySelector('input[name="deviceCalls"]:checked');

    if (!deviceAge || !devicePower || !deviceCalls) {
        alert("Please answer all questions.");
        return;
    }

    priceRatios.deviceAge = parseFloat(deviceAge.value);
    priceRatios.devicePower = parseFloat(devicePower.value);
    priceRatios.deviceCalls = parseFloat(deviceCalls.value);

    // Proceed to Step 3
    mobileCheckStep3();
}

// Step 3: Device health checks
// Step 3: Device health checks
function mobileCheckStep3() {
    updateSideHeading(3); // Update side heading for Step 3
    updateCurrentStep(3); // Ensure step is updated
    const modelContainer = document.getElementById("modelContainer");
    modelContainer.innerHTML = `
        <div class="question">
            <h3>1. Are the cameras working?</h3>
            <label><input type="checkbox" id="camerasWorking"> Yes</label>
        </div>
        <div class="question">
            <h3>2. Are there any battery issues?</h3>
            <label><input type="checkbox" id="batteryIssues"> Yes</label>
        </div>
        <div class="question">
            <h3>3. Are the buttons damaged?</h3>
            <label><input type="checkbox" id="buttonsDamaged"> Yes</label>
        </div>
        <div class="question">
            <h3>4. Are there any connectivity issues?</h3>
            <label><input type="checkbox" id="connectivityIssues"> Yes</label>
        </div>
        <div class="question">
            <h3>5. Are there any sound issues?</h3>
            <label><input type="checkbox" id="soundIssues"> Yes</label>
        </div>
    `;

    const nextButton = document.querySelector(".nextButton");

    if (nextButton) {
        nextButton.replaceWith(nextButton.cloneNode(true)); // Remove previous listeners
        const newNextButton = document.querySelector(".nextButton");

        // Change the button text to "Submit"
        newNextButton.textContent = "Submit";

        newNextButton.addEventListener("click", function () {
            collectStep3Details();
        });
    }
}

function collectStep3Details() {
    priceRatios.camerasWorking = document.getElementById("camerasWorking").checked ? 1 : 0.8;
    priceRatios.batteryIssues = document.getElementById("batteryIssues").checked ? 0.7 : 1;
    priceRatios.buttonsDamaged = document.getElementById("buttonsDamaged").checked ? 0.8 : 1;
    priceRatios.connectivityIssues = document.getElementById("connectivityIssues").checked ? 0.7 : 1;
    priceRatios.soundIssues = document.getElementById("soundIssues").checked ? 0.8 : 1;

    updateCurrentStep(4); // Update step before moving to final price
    showFinalPrice();
}

// Final step: Display the final price
// Final step: Display the final price
function showFinalPrice() {
    updateSideHeading(4); // Update side heading for Final Step
    const modelContainer = document.getElementById("modelContainer");
    modelContainer.innerHTML = "";

    const finalPriceSection = document.createElement("div");
    finalPriceSection.classList.add("final-price-section");

    // Calculate the final price immediately
    const finalPrice = calculateFinalPrice();

    finalPriceSection.innerHTML = `
        <h2>Final Price Calculation</h2>
        <p>Based on your inputs, here's the final price:</p>
        <h3>Final Price: ₹${finalPrice.toFixed(2)}</h3>
        <button id="confirmExchangeBtn">Confirm Exchange</button>
    `;

    modelContainer.appendChild(finalPriceSection);

    // Hide the Next button in the final step
    hideNextButton();

    hideBackButton();
    // Add event listener to the Confirm Exchange button
    const confirmExchangeBtn = document.getElementById("confirmExchangeBtn");
    if (confirmExchangeBtn) {
        confirmExchangeBtn.addEventListener("click", function () {
            confirmExchange();
        });
    }
}

// Function to handle Confirm Exchange
function confirmExchange() {
    alert("Exchange confirmed! Thank you for using our service.");
    // You can add additional logic here, such as redirecting to a thank-you page or clearing session storage.
}

function calculateFinalPrice() {
    // Retrieve the base price from sessionStorage
    const basePrice = parseFloat(sessionStorage.getItem("basePrice"));

    if (!basePrice) {
        console.error("Base price not found in sessionStorage.");
        return 0;
    }

    // Apply all ratios to the base price
    let finalPrice = basePrice;
    finalPrice *= priceRatios.ramVariant; // Use RAM variant multiplier
    finalPrice *= priceRatios.accessories;
    finalPrice *= priceRatios.deviceAge;
    finalPrice *= priceRatios.devicePower;
    finalPrice *= priceRatios.deviceCalls;
    finalPrice *= priceRatios.camerasWorking;
    finalPrice *= priceRatios.batteryIssues;
    finalPrice *= priceRatios.buttonsDamaged;
    finalPrice *= priceRatios.connectivityIssues;
    finalPrice *= priceRatios.soundIssues;

    return finalPrice; // Return calculated price
}

// Inside mobilecheck.js
export { showModelDetails, mobileCheckStep2, mobileCheckStep3, updateCurrentStep, showNextButton, hideNextButton,showFinalPrice };