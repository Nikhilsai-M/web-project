import mobileModels from "./buy-mobile-data.js";

// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

// Function to display products
function displayProducts(filteredProducts) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    filteredProducts.forEach(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
        
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.model}">
                <div class="product-details">
                    <h4>${product.brand} ${product.model}</h4>
                    <p class="discounted-price">₹${discountedPrice}</p>
                    <span class="original-price">₹${product.price}</span>
                    <span class="discount">${product.discount}% Off</span>
                    <ul>
                        <li>${product.ram} RAM | ${product.rom} Storage</li>
                        <li>${product.specs.battery}mAh Battery</li>
                        <li>Condition: ${product.condition}</li>
                    </ul>
                </div>
            </div>
        `;
    });
}

// Function to get selected filters
function getSelectedFilters() {
    return {
        brands: Array.from(document.querySelectorAll(".brand:checked")).map(cb => cb.value),
        rams: Array.from(document.querySelectorAll(".ram:checked")).map(cb => parseInt(cb.value)), // Ensure integer
        roms: Array.from(document.querySelectorAll(".rom:checked")).map(cb => parseInt(cb.value)), // Ensure integer
        batteries: Array.from(document.querySelectorAll(".battery:checked")).map(cb => cb.value), 
        conditions: Array.from(document.querySelectorAll(".condition:checked")).map(cb => cb.value),
        discounts: Array.from(document.querySelectorAll(".discount:checked")).map(cb => parseInt(cb.value)), 
        minPrice: parseInt(document.getElementById("min-price").value) || 0,
        maxPrice: parseInt(document.getElementById("max-price").value) || 150000
    };
}

// Function to store selected filters in localStorage
function storeFiltersToStorage() {
    localStorage.setItem("selectedFilters", JSON.stringify(getSelectedFilters()));
}

// Function to load filters from localStorage
function loadFiltersFromStorage() {
    const storedFilters = JSON.parse(localStorage.getItem("selectedFilters"));
    if (!storedFilters) return;

    // Restore checkboxes
    document.querySelectorAll(".brand").forEach(cb => cb.checked = storedFilters.brands.includes(cb.value));
    document.querySelectorAll(".ram").forEach(cb => cb.checked = storedFilters.rams.includes(parseInt(cb.value)));
    document.querySelectorAll(".rom").forEach(cb => cb.checked = storedFilters.roms.includes(parseInt(cb.value)));
    document.querySelectorAll(".battery").forEach(cb => cb.checked = storedFilters.batteries.includes(cb.value));
    document.querySelectorAll(".condition").forEach(cb => cb.checked = storedFilters.conditions.includes(cb.value));
    document.querySelectorAll(".discount").forEach(cb => cb.checked = storedFilters.discounts.includes(parseInt(cb.value)));

    // Restore price sliders
    document.getElementById("min-price").value = storedFilters.minPrice;
    document.getElementById("max-price").value = storedFilters.maxPrice;
    document.getElementById("min-value").value = storedFilters.minPrice;
    document.getElementById("max-value").value = storedFilters.maxPrice;

    updateSliderBackground();
}

// Function to update filters and store them
function updateFiltersAndStore() {
    storeFiltersToStorage();
    filterProducts();
}

// Function to update the selected filters display
function updateSelectedFilters() {
    const selectedFiltersList = document.getElementById("selected-filters-list");
    selectedFiltersList.innerHTML = "";

    const selectedFilters = getSelectedFilters();

    function addFilterTag(type, value, label) {
        const tag = document.createElement("div");
        tag.classList.add("filter-tag");
        tag.setAttribute("data-type", type);
        tag.setAttribute("data-value", value);
        tag.innerHTML = `${label} ✖`;

        tag.addEventListener("click", function () {
            removeFilter(type, value);
        });

        selectedFiltersList.appendChild(tag);
    }

    selectedFilters.brands.forEach(brand => addFilterTag("brand", brand, brand));
    selectedFilters.rams.forEach(ram => addFilterTag("ram", ram, `${ram}GB RAM`));
    selectedFilters.roms.forEach(rom => addFilterTag("rom", rom, `${rom}GB Storage`));
    selectedFilters.batteries.forEach(battery => addFilterTag("battery", battery, `${battery}mAh Battery`));
    selectedFilters.conditions.forEach(condition => addFilterTag("condition", condition, condition));
    selectedFilters.discounts.forEach(discount => addFilterTag("discount", discount, `${discount}% off`));

    document.querySelector(".selected-filters").style.display = selectedFiltersList.innerHTML ? "block" : "none";
}

// Function to remove a specific filter
function removeFilter(type, value) {
    const checkbox = document.querySelector(`.${type}[value="${value}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    updateFiltersAndStore();
}

// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
    document.getElementById("min-price").value = 0;
    document.getElementById("max-price").value = 150000;
    document.getElementById("min-value").value = 0;
    document.getElementById("max-value").value = 150000;

    localStorage.removeItem("selectedFilters");
    updateSliderBackground();
    filterProducts();
}

// Function to update slider background
function updateSliderBackground() {
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const slider = document.querySelector(".slider");

    const minPercent = (parseInt(minSlider.value) / minSlider.max) * 100;
    const maxPercent = (parseInt(maxSlider.value) / maxSlider.max) * 100;

    slider.style.left = `${minPercent}%`;
    slider.style.right = `${100 - maxPercent}%`;
}

// Function to filter products based on selected filters
function filterProducts() {
    const selectedFilters = getSelectedFilters();

    const filteredProducts = mobileModels.filter(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

        // Brand filter
        if (selectedFilters.brands.length > 0 && !selectedFilters.brands.includes(product.brand)) return false;

        // Price filter
        if (discountedPrice < selectedFilters.minPrice || discountedPrice > selectedFilters.maxPrice) return false;

        // RAM filter (convert product.ram to number)
        if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(parseInt(product.ram))) return false;

        // ROM filter (convert product.rom to number)
        if (selectedFilters.roms.length > 0 && !selectedFilters.roms.includes(parseInt(product.rom))) return false;

        // Battery filter
        if (selectedFilters.batteries.length > 0) {
            const batteryInRange = selectedFilters.batteries.some(range => {
                const [min, max] = range.split("-").map(Number);
                return product.specs.battery >= min && product.specs.battery <= max;
            });
            if (!batteryInRange) return false;
        }

        // Condition filter
        if (selectedFilters.conditions.length > 0 && !selectedFilters.conditions.includes(product.condition)) return false;

        // Discount filter
        if (selectedFilters.discounts.length > 0 && !selectedFilters.discounts.includes(product.discount)) return false;

        return true;
    });

    displayProducts(filteredProducts);
    updateSelectedFilters();
}

// Load filters and set event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    loadFiltersFromStorage();
    document.querySelector(".clear-all").addEventListener("click", clearAllFilters);
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => checkbox.addEventListener("change", updateFiltersAndStore));
    filterProducts();
});
