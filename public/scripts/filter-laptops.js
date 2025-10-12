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
            <a href="/laptop/${product.id}" class="product-link">
                <div class="product-container">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.brand} ${product.series}">
                    </div>
                    <div class="product-details">
                        <h4>${product.brand} ${product.series}</h4>
                        <p class="discounted-price">₹${discountedPrice.toFixed(0)}</p>
                        <span class="original-price">₹${product.pricing.basePrice}</span>
                        <span class="discount">${product.pricing.discount}% Off</span>
                        <ul>
                            <li>${product.processor.name} ${product.processor.generation}</li>
                            <li>${product.memory.ram} RAM | ${product.memory.storage.type} ${product.memory.storage.capacity}</li>
                            <li>${product.displaysize}" Display | ${product.os}</li>
                            <li>Condition: ${product.condition}</li>
                        </ul>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </a>`;
        container.appendChild(productElement);
    });
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
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
            series: product.series,
            processor: product.processor,
            memory: product.memory,
            displaysize: product.displaysize,
            os: product.os,
            condition: product.condition,
            image: product.image,
            price: product.pricing.basePrice,
            discount: product.pricing.discount,
            quantity: 1
        });
    }
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    showAddedToCartMessage(`${product.brand} ${product.series}`);
}

function getSelectedFilters(initialBrand = null) {
    const filters = {
        brands: Array.from(document.querySelectorAll(".brand:checked")).map(cb => cb.value),
        processors: Array.from(document.querySelectorAll(".processor:checked")).map(cb => cb.value),
        generations: Array.from(document.querySelectorAll(".generation:checked")).map(cb => cb.value),
        rams: Array.from(document.querySelectorAll(".ram:checked")).map(cb => parseInt(cb.value)),
        storageTypes: Array.from(document.querySelectorAll(".storage-type:checked")).map(cb => cb.value),
        storageCapacities: Array.from(document.querySelectorAll(".storage:checked")).map(cb => cb.value),
        displays: Array.from(document.querySelectorAll(".display:checked")).map(cb => cb.value),
        oses: Array.from(document.querySelectorAll(".os:checked")).map(cb => cb.value),
        weights: Array.from(document.querySelectorAll(".weight:checked")).map(cb => cb.value),
        conditions: Array.from(document.querySelectorAll(".condition:checked")).map(cb => cb.value),
        discounts: Array.from(document.querySelectorAll(".discount:checked")).map(cb => parseInt(cb.value)),
        minPrice: parseInt(document.getElementById("min-value").value) || 0,
        maxPrice: parseInt(document.getElementById("max-value").value) || 200000
    };
    if (initialBrand && !filters.brands.includes(initialBrand)) {
        filters.brands.push(initialBrand);
    }
    return filters;
}

function storeFiltersToStorage() {
    localStorage.setItem("selectedLaptopFilters", JSON.stringify(getSelectedFilters()));
}

function loadFiltersFromStorage() {
    const storedFilters = JSON.parse(localStorage.getItem("selectedLaptopFilters"));
    if (!storedFilters) return false;
    document.querySelectorAll(".brand").forEach(cb => cb.checked = storedFilters.brands.includes(cb.value));
    document.querySelectorAll(".processor").forEach(cb => cb.checked = storedFilters.processors.includes(cb.value));
    document.querySelectorAll(".generation").forEach(cb => cb.checked = storedFilters.generations.includes(cb.value));
    document.querySelectorAll(".ram").forEach(cb => cb.checked = storedFilters.rams.includes(parseInt(cb.value)));
    document.querySelectorAll(".storage-type").forEach(cb => cb.checked = storedFilters.storageTypes.includes(cb.value));
    document.querySelectorAll(".storage").forEach(cb => cb.checked = storedFilters.storageCapacities.includes(cb.value));
    document.querySelectorAll(".display").forEach(cb => cb.checked = storedFilters.displays.includes(cb.value));
    document.querySelectorAll(".os").forEach(cb => cb.checked = storedFilters.oses.includes(cb.value));
    document.querySelectorAll(".weight").forEach(cb => cb.checked = storedFilters.weights.includes(cb.value));
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
    selectedFilters.processors.forEach(processor => addFilterTag("processor", processor, processor));
    selectedFilters.generations.forEach(gen => addFilterTag("generation", gen, gen));
    selectedFilters.rams.forEach(ram => addFilterTag("ram", ram, `${ram}GB RAM`));
    selectedFilters.storageTypes.forEach(type => addFilterTag("storage-type", type, type));
    selectedFilters.storageCapacities.forEach(capacity => 
        addFilterTag("storage", capacity, `${capacity}${capacity > 2 ? "GB" : "TB"} Storage`));
    selectedFilters.displays.forEach(display => addFilterTag("display", display, `${display}" Display`));
    selectedFilters.oses.forEach(os => addFilterTag("os", os, os));
    selectedFilters.weights.forEach(weight => addFilterTag("weight", weight, `${weight} kg`));
    selectedFilters.conditions.forEach(condition => addFilterTag("condition", condition, condition));
    selectedFilters.discounts.forEach(discount => addFilterTag("discount", discount, `${discount}% off`));
    const minPrice = parseInt(document.getElementById("min-value").value) || 0;
    const maxPrice = parseInt(document.getElementById("max-value").value) || 200000;
    if (minPrice > 0 || maxPrice < 200000) {
        addFilterTag("price", "range", `₹${minPrice} - ₹${maxPrice}`);
    }
    document.querySelector(".selected-filters").style.display = hasActiveFilters ? "block" : "none";
}

function removeFilter(type, value) {
    if (type === "price") {
        document.getElementById("min-price").value = 0;
        document.getElementById("max-price").value = 200000;
        document.getElementById("min-value").value = 0;
        document.getElementById("max-value").value = 200000;
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

async function fetchLaptopData() {
    try {
        const response = await fetch('/api/laptops');
        if (!response.ok) {
            throw new Error(`Failed to fetch laptop data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched laptop data:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching laptop data:', error);
        return [];
    }
}

async function filterProducts(initialBrand = null) {
    const selectedFilters = getSelectedFilters(initialBrand);
    console.log("Filtering with:", selectedFilters);
    const laptopModels = await fetchLaptopData();
    console.log('Laptop models:', laptopModels);
    const mainBrands = ["ACER", "DELL", "HP", "LENOVO", "APPLE", "ASUS", "MICROSOFT", "MSI"];
    const hasActiveFilters = 
        selectedFilters.brands.length > 0 || 
        selectedFilters.processors.length > 0 ||
        selectedFilters.generations.length > 0 ||
        selectedFilters.rams.length > 0 || 
        selectedFilters.storageTypes.length > 0 ||
        selectedFilters.storageCapacities.length > 0 ||
        selectedFilters.displays.length > 0 ||
        selectedFilters.oses.length > 0 ||
        selectedFilters.weights.length > 0 ||
        selectedFilters.conditions.length > 0 || 
        selectedFilters.discounts.length > 0 || 
        selectedFilters.minPrice > 0 || 
        selectedFilters.maxPrice < 200000;
    let filteredProducts = laptopModels;
    if (hasActiveFilters) {
        filteredProducts = laptopModels.filter(product => {
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
            if (selectedFilters.processors.length > 0 && !selectedFilters.processors.includes(product.processor.name)) return false;
            if (selectedFilters.generations.length > 0 && !selectedFilters.generations.includes(product.processor.generation)) return false;
            const ramValue = parseInt(product.memory.ram);
            if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(ramValue)) return false;
            if (selectedFilters.storageTypes.length > 0 && !selectedFilters.storageTypes.includes(product.memory.storage.type)) return false;
            const storageCapacity = product.memory.storage.capacity;
            if (selectedFilters.storageCapacities.length > 0) {
                let match = false;
                for (const filter of selectedFilters.storageCapacities) {
                    if (storageCapacity.includes(filter)) {
                        match = true;
                        break;
                    }
                }
                if (!match) return false;
            }
            if (selectedFilters.displays.length > 0) {
                let match = false;
                for (const filter of selectedFilters.displays) {
                    const [min, max] = filter.split('-').map(Number);
                    if (max) {
                        if (product.displaysize >= min && product.displaysize < max) {
                            match = true;
                            break;
                        }
                    } else {
                        if (product.displaysize >= min) {
                            match = true;
                            break;
                        }
                    }
                }
                if (!match) return false;
            }
            if (selectedFilters.oses.length > 0 && !selectedFilters.oses.includes(product.os)) return false;
            if (selectedFilters.weights.length > 0) {
                let match = false;
                for (const filter of selectedFilters.weights) {
                    const [min, max] = filter.split('-').map(Number);
                    if (max) {
                        if (product.weight >= min && product.weight < max) {
                            match = true;
                            break;
                        }
                    } else {
                        if (product.weight >= min) {
                            match = true;
                            break;
                        }
                    }
                }
                if (!match) return false;
            }
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
    document.getElementById("max-price").value = 200000;
    document.getElementById("min-value").value = 0;
    document.getElementById("max-value").value = 200000;
    localStorage.removeItem("selectedLaptopFilters");
    updateSliderBackground();
    filterProducts();
    window.history.replaceState(null, "", "/filter-buy-laptop");
}

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");
    const maxPrice = urlParams.get("maxPrice");
    if (selectedBrand || maxPrice) {
        localStorage.removeItem("selectedLaptopFilters");
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
        await filterProducts(selectedBrand);
    } else {
        if (performance.getEntriesByType("navigation")[0]?.type !== "reload") {
            localStorage.removeItem("selectedLaptopFilters");
        } else {
            loadFiltersFromStorage();
        }
        await filterProducts();
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