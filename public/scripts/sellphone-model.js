import { showModelDetails, mobileCheckStep2, mobileCheckStep3, updateCurrentStep, showNextButton, hideNextButton,showFinalPrice } from "./mobile-check.js";
import mobileModels from "./mobile-data.js";

document.addEventListener("DOMContentLoaded", function () {
    const modelContainer = document.getElementById("modelContainer");
    const backButton = document.querySelector(".backButton");

    // Get URL parameters
    const urlParams = new URLSearchParams(location.search);
    let selectedBrand = urlParams.get("brand") || sessionStorage.getItem("selectedBrand");
    let selectedModel = urlParams.get("model") || sessionStorage.getItem("selectedModel");

    // Debugging: Log session storage values
    console.log("Selected Brand:", selectedBrand);
    console.log("Selected Model:", selectedModel);

    // Update session storage with latest selection
    if (selectedBrand) sessionStorage.setItem("selectedBrand", selectedBrand);
    if (selectedModel) sessionStorage.setItem("selectedModel", selectedModel);

    const brandHeading = document.querySelector(".brand-in-heading");

    // Check currentStep on page load
    let currentStep = parseInt(sessionStorage.getItem("currentStep")) || 1;

    // Debugging: Log currentStep
    console.log("Current Step:", currentStep);

    // Restore the correct step based on currentStep
    if (currentStep === 1) {
        if (selectedBrand && !selectedModel) {
            brandHeading.innerHTML = `<a>${selectedBrand}</a>`;
            showModels(selectedBrand); // Show models for selected brand
        } else if (selectedModel) {
            showModelDetails(selectedModel); // Show details of selected model
            showNextButton(); // Show Next button for Step 1
        } else {
            brandHeading.innerHTML = `<a>Choose a Brand</a>`; // Default heading
        }
    } else if (currentStep === 2) {
        mobileCheckStep2(); // Restore Step 2
        showNextButton(); // Show Next button for Step 2
    } else if (currentStep === 3) {
        mobileCheckStep3(); // Restore Step 3
        showNextButton(); // Show Next button for Step 3
    } else if (currentStep === 4) {
        showFinalPrice(); // Restore Final Step
        hideNextButton(); // Hide Next button for Final Step
    }

    function showModels(brand) {
        modelContainer.innerHTML = "";
    
        // ❗ Clear previously selected model
        sessionStorage.removeItem("selectedModel");
        sessionStorage.setItem("selectedBrand", brand); // ✅ Store new brand
    
        if (mobileModels[brand]) {
            mobileModels[brand].forEach(model => {
                const modelCard = document.createElement("div");
                modelCard.classList.add("model-card");
    
                modelCard.innerHTML = `
                    <img src="${model.image}" alt="${model.name}">
                    <p>${model.name}</p>
                `;
    
                modelCard.addEventListener("click", function () {
                    sessionStorage.setItem("selectedModel", model.name);
                    window.location.href = `/sell-phone-models?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model.name)}`;
                });
    
                modelContainer.appendChild(modelCard);
            });
        } else {
            modelContainer.innerHTML = "<p>No models available for this brand.</p>";
        }
    }
    

    window.addEventListener("popstate", function () {
        let currentStep = parseInt(sessionStorage.getItem("currentStep")) || 1;
    
        console.log("Popstate Event Triggered. Current Step:", currentStep);
    
        if (currentStep === 4) {
            updateCurrentStep(3);
            mobileCheckStep3();
            showNextButton();
        } else if (currentStep === 3) {
            updateCurrentStep(2);
            mobileCheckStep2();
            showNextButton();
        } else if (currentStep === 2) {
            updateCurrentStep(1);
            let selectedModel = sessionStorage.getItem("selectedModel");
            if (selectedModel) {
                showModelDetails(selectedModel);
                showNextButton();
            } else {
                let selectedBrand = sessionStorage.getItem("selectedBrand");
                showModels(selectedBrand);
            }
        } else {
            window.location.href = "/sell-phone"; // Redirect to brands page
        }
    });
    


    if (backButton) {
        backButton.addEventListener("click", function () {
            let currentStep = parseInt(sessionStorage.getItem("currentStep")) || 1;
            let selectedBrand = sessionStorage.getItem("selectedBrand");
            let selectedModel = sessionStorage.getItem("selectedModel");

            // If on the show models page (selectedBrand is present but selectedModel is not)
            if (selectedBrand && !selectedModel) {
                window.location.href = "/sell-phone"; // Go back to sell-phone route
            }
            // Step-based navigation
            else if (currentStep === 4) {
                updateCurrentStep(3);
                mobileCheckStep3(); // Go back to Step 3
                showNextButton(); // Show Next button for Step 3
            } else if (currentStep === 3) {
                updateCurrentStep(2);
                mobileCheckStep2(); // Go back to Step 2
                showNextButton(); // Show Next button for Step 2
            } else if (currentStep === 2) {
                updateCurrentStep(1);
                if (selectedModel) {
                    showModelDetails(selectedModel); // Correctly show model details
                    showNextButton(); // Show Next button for Step 1
                } else {
                    showModels(selectedBrand); // Show models of the brand
                    hideNextButton();
                }
            } else if (selectedBrand) {
                sessionStorage.removeItem("selectedModel"); // Clear selected model
                showModels(selectedBrand); // Go back to brand's models
                hideNextButton();

            } else {
                window.history.back(); // If no brand is selected, go back to the previous page
            }
        });
    }
});