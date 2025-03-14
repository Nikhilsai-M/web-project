// script.js  
import { accessoriesData } from './accessories-data.js';  

const productList = document.getElementById('product-list');  

// Access the chargers array from the imported object  
const chargers = accessoriesData.chargers;  

// Function to display chargers  
function displayChargers(filteredChargers) {  
    productList.innerHTML = ''; // Clear the product list  
    filteredChargers.forEach(charger => {  
        const discountPrice = (charger.originalPrice - (charger.originalPrice * parseFloat(charger.discount) / 100)).toFixed(2);  
        const productHTML = `  
            <div class="product">  
                <img src="${charger.image}" alt="${charger.title}">  
                <div class="product1">
                <h3>${charger.title}</h3>  
                
                <p class="discounted-price">₹${discountPrice}</p>
                     <span class="original-price">₹${charger.originalPrice}</span><br>
                     <span class="discount">${charger.discount} Off</span>
                <ul>
                <li>Brand: ${charger.brand}</li>  
                <li>Wattage: ${charger.wattage}W</li>  
                <li>Output Current: ${charger.outputCurrent}</li>  
                </ul>
                <button style="background-color:green ;color:white;padding:10px 10px 10px 10px;border:none; width:20%; border-radius:5px;margin-top:5px">Add to Cart</button>
                
            </div>
            </div>  
        `;  
        productList.innerHTML += productHTML;  
    });  
}  

// Function to filter chargers  
function filterChargers() {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedWattages = Array.from(document.querySelectorAll('.wattage-filter:checked')).map(checkbox => checkbox.value);
    const checkedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));

    const filteredChargers = chargers.filter(charger => {
        const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(charger.brand);
        const matchesWattage = checkedWattages.length === 0 || checkedWattages.includes(charger.wattage); 
        const matchesType = checkedTypes.length === 0 || checkedTypes.includes(charger.type);
        const discountValue = parseInt(charger.discount); 
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d); 

        return matchesBrand && matchesWattage && matchesType && matchesDiscount;
    });

    // Update the displayed chargers
    displayChargers(filteredChargers);
} 

 

// Initial display of all chargers  
document.addEventListener('DOMContentLoaded', () => {  
    displayChargers(chargers);  
});  

// Event listeners for filters  
document.querySelectorAll('.brand-filter, .wattage-filter, .type-filter, .discount-filter').forEach(checkbox => {  
    checkbox.addEventListener('change', filterChargers);  
});