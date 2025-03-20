// Function to calculate discounted price
function calculateDiscountedPrice(price, discount) {
    // Convert price and discount to numbers
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount);

    // Check if the conversion was successful
    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
        console.error("Invalid price or discount:", price, discount);
        return 0; // Return 0 or handle the error as needed
    }

    return numericPrice - (numericPrice * numericDiscount / 100);
}
// Function to display products
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
        
        // Add event listener to the inline clear button
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
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault(); // Prevent the anchor link from activating
            e.stopPropagation(); // Stop event from bubbling up
            
            const productId = this.getAttribute('data-product-id');
            const product = filteredProducts.find(p => p.id == productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Function to show "Added to Cart" message
function showAddedToCartMessage(productName) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "cart-message";
    messageDiv.innerHTML = `
        <p>${productName} added to cart! <a href="/cart">View Cart</a></p>
    `;
    document.body.appendChild(messageDiv);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 3000);
}

// Function to add a product to cart
function addToCart(product) {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));
    
    if (!session || !session.loggedIn) {
        // Redirect to login page if not logged in
        window.location.href = "/login";
        return;
    }

    let userId = session.userId; // Get logged-in user's ID
    let userCartKey = `cart_${userId}`; // Unique cart for each user

    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    // Check if product already exists in cart
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

    localStorage.setItem(userCartKey, JSON.stringify(cart)); // Store cart for specific user
    showAddedToCartMessage(`${product.brand} ${product.series}`);
}

// Function to get selected filters
function getSelectedFilters() {
    return {
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
}

// Function to store selected filters in localStorage
function storeFiltersToStorage() {
    localStorage.setItem("selectedLaptopFilters", JSON.stringify(getSelectedFilters()));
}

// Function to load filters from localStorage
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

    // Add price range filter tag if it's not at default values
    const minPrice = parseInt(document.getElementById("min-value").value) || 0;
    const maxPrice = parseInt(document.getElementById("max-value").value) || 200000;
    
    if (minPrice > 0 || maxPrice < 200000) {
        addFilterTag("price", "range", `₹${minPrice} - ₹${maxPrice}`);
    }

    // Display or hide the selected filters section
    document.querySelector(".selected-filters").style.display = hasActiveFilters ? "block" : "none";
}

// Function to remove a specific filter
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

// Function to update slider background
function updateSliderBackground() {
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const minValue = document.getElementById("min-value");
    const maxValue = document.getElementById("max-value");

    minValue.value = minSlider.value;
    maxValue.value = maxSlider.value;
}

// Function to fetch laptop data from the database
async function fetchLaptopData() {
    try {
        const response = await fetch('/api/laptops'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch laptop data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching laptop data:', error);
        return []; // Return an empty array in case of error
    }
}

// Function to filter products based on selected filters
async function filterProducts() {
    const selectedFilters = getSelectedFilters();
    console.log("Filtering with price range:", selectedFilters.minPrice, "to", selectedFilters.maxPrice);

    // Fetch laptop data from the database
    const laptopModels = await fetchLaptopData();

    // Check if any filters are active
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
            const discountedPrice = calculateDiscountedPrice(product.pricing.basePrice, product.pricing.discount);

            // Brand filter
            if (selectedFilters.brands.length > 0 && !selectedFilters.brands.includes(product.brand)) return false;
            
            // Price filter
            if (discountedPrice < selectedFilters.minPrice || discountedPrice > selectedFilters.maxPrice) return false;
            
            // Processor filter
            if (selectedFilters.processors.length > 0 && !selectedFilters.processors.includes(product.processor.name)) return false;
            
            // Generation filter
            if (selectedFilters.generations.length > 0 && !selectedFilters.generations.includes(product.processor.generation)) return false;
            
            // RAM filter
            const ramValue = parseInt(product.memory.ram);
            if (selectedFilters.rams.length > 0 && !selectedFilters.rams.includes(ramValue)) return false;
            
            // Storage type filter
            if (selectedFilters.storageTypes.length > 0 && !selectedFilters.storageTypes.includes(product.memory.storage.type)) return false;
            
            // Storage capacity filter
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
            
            // Display size filter
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
            
            // OS filter
            if (selectedFilters.oses.length > 0 && !selectedFilters.oses.includes(product.os)) return false;
            // Weight filter
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
            
            // Condition filter
            if (selectedFilters.conditions.length > 0 && !selectedFilters.conditions.includes(product.condition)) return false;
            
            // Discount filter
            if (selectedFilters.discounts.length > 0 && !selectedFilters.discounts.includes(product.pricing.discount)) return false;

            return true;
        });
    }

    displayProducts(filteredProducts);
    updateSelectedFilters();
    
    console.log(`Displaying ${filteredProducts.length} products`);
}

// Function to clear all filters
function clearAllFilters() {
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
    document.getElementById("min-price").value = 0;
    document.getElementById("max-price").value = 200000;
    document.getElementById("min-value").value = 0;
    document.getElementById("max-value").value = 200000;

    localStorage.removeItem("selectedLaptopFilters");
    updateSliderBackground();
    filterProducts();

    // Remove URL parameters and reset to `/filter-buy-laptop`
    window.history.replaceState(null, "", "/filter-buy-laptop");
}

// Load filters and set event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", async function () {
    // Check if user is logged in
    const session = JSON.parse(localStorage.getItem("currentSession"));

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");
    const maxPrice = urlParams.get("maxPrice");

    // If URL has parameters, apply them as filters
    if (selectedBrand || maxPrice) {
        localStorage.removeItem("selectedLaptopFilters"); // Clear any existing filters
        
        if (selectedBrand) {
            const brandCheckbox = document.querySelector(`.brand[value="${selectedBrand}"]`);
            if (brandCheckbox) {
                brandCheckbox.checked = true;
            }
        }

        if (maxPrice) {
            const maxPriceValue = parseInt(maxPrice);
            document.getElementById("max-price").value = maxPriceValue;
            document.getElementById("max-value").value = maxPriceValue;
        }
    } 

    else {
        // Only reset filters if NOT coming from a page reload
        if (performance.getEntriesByType("navigation")[0]?.type !== "reload") {
            localStorage.removeItem("selectedLaptopFilters");
        } else {
            loadFiltersFromStorage();
        }
    }

    // Add event listeners for price sliders
    const minPriceSlider = document.getElementById("min-price");
    const maxPriceSlider = document.getElementById("max-price");
    
    minPriceSlider.addEventListener("input", function() {
        updateSliderBackground();
    });
    
    maxPriceSlider.addEventListener("input", function() {
        updateSliderBackground();
    });
    
    minPriceSlider.addEventListener("change", updateFiltersAndStore);
    maxPriceSlider.addEventListener("change", updateFiltersAndStore);
    
    // Add event listeners for price input fields
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
    
    // Apply filters and display products
    await filterProducts(); // Wait for the data to be fetched before filtering
});