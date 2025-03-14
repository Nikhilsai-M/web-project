import { accessoriesData } from './accessories-data.js';  

const productList = document.getElementById('product-list');  

// Access the chargers array from the imported object  
const smartwatches = accessoriesData.smartwatches;  

// Function to display chargers  
function displaywatches(filteredwatches) {  
    productList.innerHTML = ''; // Clear the product list  
    filteredwatches.forEach(smartwatches => {  
        const discountPrice = (smartwatches.originalPrice - (smartwatches.originalPrice * parseFloat(smartwatches.discount) / 100)).toFixed(2);  
        const productHTML = `  
            <div class="product">  
                <img src="${smartwatches.image}"> 
                <div class="product1"> 
                <h3>${smartwatches.title}</h3>  
                 <p class="discounted-price">₹${discountPrice}</p>
                     <span class="original-price">₹${smartwatches.originalPrice}</span><br>
                     <span class="discount">${smartwatches.discount} Off</span>
                <ul>
                <li>Brand: ${smartwatches.brand}</li>  
                <li>DisplayType: ${smartwatches.displayType}</li>  
                <li>DisplaySize: ${smartwatches.displaySize}mm</li> 
                <li>BatteryRunTime: ${smartwatches.batteryRuntime} days</li> 
                </ul>
                <button style="background-color:green ;color:white;padding:10px 10px 10px 10px;border:none; width:20%; border-radius:5px;margin-top:5px">Add to Cart</button>
                </div>
            </div>  
        `;  
        productList.innerHTML += productHTML;  
    });  
}  

// Function to filter chargers  
function filterWatches() {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedres = Array.from(document.querySelectorAll('.battery-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedtype = Array.from(document.querySelectorAll('.displaysize-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedcon=Array.from(document.querySelectorAll('.displaytype-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));

    const filteredwatches = smartwatches.filter(smartwatches => {
        const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(smartwatches.brand);
        const matchedbattery=parseInt(smartwatches.batteryRuntime);
        const matchesres = checkedres.length === 0 || checkedres.some(e => matchedbattery >= e); 
        const matchedSize=parseInt(smartwatches.displaySize);
        const matchesSize= checkedtype.length === 0 || checkedtype.some(f => matchedSize >= f); 
        
        const matchescon=checkedcon.length === 0 || checkedcon.includes(smartwatches.displayType);
        const discountValue = parseInt(smartwatches.discount); 
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d); 

        return matchesBrand && matchesres && matchesSize && matchescon && matchesDiscount;
    });

    // Update the displayed chargers
    displaywatches(filteredwatches);
} 

 

// Initial display of all chargers  
document.addEventListener('DOMContentLoaded', () => {  
    displaywatches(smartwatches);  
});  

// Event listeners for filters  
document.querySelectorAll('.brand-filter, .battery-filter, .displaysize-filter, .displaytype-filter,.discount-filter').forEach(checkbox => {  
    checkbox.addEventListener('change', filterWatches);  
});