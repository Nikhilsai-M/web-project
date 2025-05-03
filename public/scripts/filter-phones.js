function calculateDiscountedPrice(price, discount) {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount);
    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
        console.error("Invalid price or discount:", price, discount);
        return 0;
    }
    return numericPrice - (numericPrice * numericDiscount / 100);
}

function displayProducts(filteredProducts) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>No products match your filters</h3>
                <p>Try adjusting your filter criteria or <button class="clear-all-inline">clear all filters</button></p>
            </div>
        `;
        const clearInlineBtn = container.querySelector(".clear-all-inline");
        if (clearInlineBtn) {
            clearInlineBtn.addEventListener("click", clearAllFilters);
        }
        return;
    }
    
    filteredProducts.forEach(product => {
        const discountedPrice = calculateDiscountedPrice(product.pricing.basePrice, product.pricing.discount);
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.dataset.id = product.id;
        
        productElement.innerHTML = `
            <a href="/product/${product.id}" class="product-link">
                <div class="product-container">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.brand} ${product.model}">
                    </div>
                    <div class="product-details">
                        <h4>${product.brand} ${product.model}</h4>
                        <p class="discounted-price">₹${discountedPrice.toFixed(0)}</p>
                        <span class="original-price">₹${product.pricing.basePrice}</span>
                        <span class="discount">${product.pricing.discount}% Off</span>
                        <ul>
                            <li>${product.ram} RAM | ${product.rom} Storage</li>
                            <li>${product.specs.battery}mAh Battery</li>
                            <li>Condition: ${product.condition}</li>
                        </ul>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(productElement);
    });
    
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            const productDiv = e.target.closest(".product");
            const productId = productDiv.dataset.id;
            const product = filteredProducts.find(p => p.id == productId);
            if (product) {
                addToCart(product);
            }
        });
    });
}

function showAddedToCartMessage(productName) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${productName} added to cart! <a href="/cart">View Cart</a></p>
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 3000);
}

function addToCart(product) {
    const session = JSON.parse(localStorage.getItem("currentSession"));
    if (!session || !session.loggedIn) {
        window.location.href = "/login";
        return;
    }
    let userId = session.userId;
    let userCartKey = `cart_${userId}`;
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            brand: product.brand,
            model: product.model,
            ram: product.ram,
            rom: product.rom,
            condition: product.condition,
            image: product.image,
            price: product.pricing.basePrice,
            discount: parseFloat(product.pricing.discount),
            quantity: 1
        });
    }
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    showAddedToCartMessage(`${product.brand} ${product.model}`);
}

function getSelectedFilters(initialBrand = null) {
    const filters = {
        brands: Array.from(document.querySelectorAll(".brand:checked")).map(cb => cb.value),
        rams: Array.from(document.querySelectorAll(".ram:checked")).map(cb => parseInt(cb.value)),
        roms: Array.from(document.querySelectorAll(".rom:checked")).map(cb => parseInt(cb.value)),
        batteries: Array.from(document.querySelectorAll(".battery:checked")).map(cb => cb.value),
        conditions: Array.from(document.querySelectorAll(".condition:checked")).map(cb => cb.value),
        discounts: Array.from(document.querySelectorAll(".discount:checked")).map(cb => parseInt(cb.value)),
        minPrice: parseInt(document.getElementById("min-value").value) || 0,
        maxPrice: parseInt(document.getElementById("max-value").value) || 150000
    };
    if (initialBrand && !filters.brands.includes(initialBrand)) {
        filters.brands.push(initialBrand);
    }
    return filters;
}

function storeFiltersToStorage() {
    localStorage.setItem("selectedFilters", JSON.stringify(getSelectedFilters()));
}

function loadFiltersFromStorage() {
    const storedFilters = JSON.parse(localStorage.getItem("selectedFilters"));
    if (!storedFilters) return false;
    document.querySelectorAll(".brand").forEach(cb => cb.checked = storedFilters.brands.includes(cb.value));
    document.querySelectorAll(".ram").forEach(cb => cb.checked = storedFilters.rams.includes(parseInt(cb.value)));
    document.querySelectorAll(".rom").forEach(cb => cb.checked = storedFilters.roms.includes(parseInt(cb.value)));
    document.querySelectorAll(".battery").forEach(cb => cb.checked = storedFilters.batteries.includes(cb.value));
    document.querySelectorAll(".condition").forEach(cb => cb.checked = storedFilters.conditions.includes(cb.value));
    document.querySelectorAll(".discount").forEach(cb => cb.checked = storedFilters.discounts.includes(parseInt(cb.value)));
    document.getElementById("min-value").value = storedFilters.minPrice;
    document.getElementById("max-value").value = storedFilters.maxPrice;
    document.getElementById("min-price").value = storedFilters.minPrice;
    document.getElementById("max-price").value = storedFilters.maxPrice;
    updateSliderBackground();
    return true;
}

function updateFiltersAndStore() {
    storeFiltersToStorage();
    filterProducts();
}

function updateSelectedFilters() {
    const selectedFiltersList = document.getElementById("selected-filters-list");
    selectedFiltersList.innerHTML = "";
    const selectedFilters = getSelectedFilters();
    let hasActiveFilters = false;
    function addFilterTag(type, value, label) {
        hasActiveFilters = true;
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
    const minPrice = parseInt(document.getElementById("min-value").value) || 0;
    const maxPrice = parseInt(document.getElementById("max-value").value) || 150000;
    if (minPrice > 0 || maxPrice < 150000) {
        addFilterTag("price", "range", `₹${minPrice} - ₹${maxPrice}`);
    }
    document.querySelector(".selected-filters").style.display = hasActiveFilters ? "block" : "none";
}

function removeFilter(type, value) {
    if (type === "price") {
        document.getElementById("min-price").value = 0;
        document.getElementById("max-price").value = 150000;
        document.getElementById("min-value").value = 0;
        document.getElementById("max-value").value = 150000;
        updateSliderBackground();
    } else {
        const checkbox = document.querySelector(`.${type}[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    updateFiltersAndStore();
}

function updateSliderBackground() {
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const minValue = document.getElementById("min-value");
    const maxValue = document.getElementById("max-value");
    minValue.value = minSlider.value;
    maxValue.value = maxSlider.value;
}

async function fetchPhoneData() {
    try {
        const response = await fetch('/api/product');
        if (!response.ok) {
            throw new Error(`Failed to fetch phone data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched phone data:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching phone data:', error);
        return [];
    }
}

async function filterProducts(initialBrand = null) {
    const selectedFilters = getSelectedFilters(initialBrand);
    console.log("Filtering with:", selectedFilters);
    const mobileModels = await fetchPhoneData();
    console.log('Mobile models:', mobileModels);
    const mainBrands = ["APPLE", "SAMSUNG", "ONEPLUS", "GOOGLE", "REALME", "XIAOMI", "MOTOROLA", "VIVO", "LENOVO", "NOTHING"];
    const hasActiveFilters = 
        selectedFilters.brands.length > 0 || 
        selectedFilters.rams.length > 0 || 
        selectedFilters.roms.length > 0 || 
        selectedFilters.batteries.length > 0 || 
        selectedFilters.conditions.length > 0 || 
        selectedFilters.discounts.length > 0 || 
        selectedFilters.minPrice > 0 || 
        selectedFilters.maxPrice < 150000;
    let filteredProducts = mobileModels;
    if (hasActiveFilters) {
        filteredProducts = mobileModels.filter(product => {
            if (!product || !product.pricing || typeof product.pricing.basePrice === 'undefined' || typeof product.pricing.discount === 'undefined') {
                console.warn('Skipping invalid product:', product);
                return false;
            }
            const discountedPrice = calculateDiscountedPrice(product.pricing.basePrice, product.pricing.discount);
            if (selectedFilters.brands.length > 0) {
                const includesOthers = selectedFilters.brands.includes("Others");
                const includesSpecificBrand = selectedFilters.brands.some(brand => 
                    product.brand && brand.toUpperCase() === product.brand.toUpperCase()
                );
                const isOtherBrand = product.brand && !mainBrands.some(mainBrand => 
                    mainBrand.toUpperCase() === product.brand.toUpperCase()
                );
                if (!includesSpecificBrand && !(includesOthers && isOtherBrand)) {
                    return false;
                }
            }
            if (discountedPrice < selectedFilters.minPrice || discountedPrice > selectedFilters.maxPrice) return false;
            if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(parseInt(product.ram))) return false;
            if (selectedFilters.roms.length > 0 && !selectedFilters.roms.includes(parseInt(product.rom))) return false;
            if (selectedFilters.batteries.length > 0 && !selectedFilters.batteries.includes(product.specs.battery.toString())) return false;
            if (selectedFilters.conditions.length > 0 && !selectedFilters.conditions.includes(product.condition)) return false;
            if (selectedFilters.discounts.length > 0 && !selectedFilters.discounts.includes(product.pricing.discount)) return false;
            return true;
        });
    }
    displayProducts(filteredProducts);
    updateSelectedFilters();
    console.log(`Displaying ${filteredProducts.length} products`);
}

function clearAllFilters() {
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
    document.getElementById("min-price").value = 0;
    document.getElementById("max-price").value = 150000;
    document.getElementById("min-value").value = 0;
    document.getElementById("max-value").value = 150000;
    localStorage.removeItem("selectedFilters");
    updateSliderBackground();
    filterProducts();
    window.history.replaceState(null, "", "/filter-buy-phone");
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");
    const maxPrice = urlParams.get("maxPrice");
    
    if (selectedBrand || maxPrice) {
        localStorage.removeItem("selectedFilters");
        if (selectedBrand) {
            const brandCheckbox = document.querySelector(`.brand[value="${selectedBrand}"]`);
            if (brandCheckbox) {
                brandCheckbox.checked = true;
            } else {
                console.warn(`Brand checkbox not found for: ${selectedBrand}`);
            }
        }
        if (maxPrice) {
            const maxPriceValue = parseInt(maxPrice);
            document.getElementById("max-price").value = maxPriceValue;
            document.getElementById("max-value").value = maxPriceValue;
        }
        storeFiltersToStorage();
        filterProducts(selectedBrand);
    } else {
        if (performance.getEntriesByType("navigation")[0]?.typeSES !== "reload") {
            localStorage.removeItem("selectedFilters");
        } else {
            loadFiltersFromStorage();
        }
        filterProducts();
    }
    
    const minPriceSlider = document.getElementById("min-price");
    const maxPriceSlider = document.getElementById("max-price");
    minPriceSlider.addEventListener("input", updateSliderBackground);
    maxPriceSlider.addEventListener("input", updateSliderBackground);
    minPriceSlider.addEventListener("change", updateFiltersAndStore);
    maxPriceSlider.addEventListener("change", updateFiltersAndStore);
    
    const minValueInput = document.getElementById("min-value");
    const maxValueInput = document.getElementById("max-value");
    minValueInput.addEventListener("change", function() {
        minPriceSlider.value = this.value;
        updateFiltersAndStore();
    });
    maxValueInput.addEventListener("change", function() {
        maxPriceSlider.value = this.value;
        updateFiltersAndStore();
    });
    
    document.querySelector(".clear-all").addEventListener("click", clearAllFilters);
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => 
        checkbox.addEventListener("change", updateFiltersAndStore)
    );
});