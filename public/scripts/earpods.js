// script.js  
import { accessoriesData } from './accessories-data.js';  

const productList = document.getElementById('product-list');  

// Access the chargers array from the imported object  
const earphones = accessoriesData.earphones;  

// Function to display chargers  
function displayEarphones(filteredEarphones) {  
    productList.innerHTML = ''; // Clear the product list  
    filteredEarphones.forEach(earphones => {  
        const discountPrice = (earphones.originalPrice - (earphones.originalPrice * parseFloat(earphones.discount) / 100)).toFixed(2);  
        const productHTML = `  
            <div class="product">  
                <img src="${earphones.image}"> 
                <div class="product1"> 
                <h3>${earphones.title}</h3>  
                 <p class="discounted-price">₹${discountPrice}</p>
                     <span class="original-price">₹${earphones.originalPrice}</span><br>
                     <span class="discount">${earphones.discount} Off</span>
                <ul>
                <li>Brand: ${earphones.brand}</li>  
                <li>Battery Life: ${earphones.batteryLife} hours</li>  
                <li>Design: ${earphones.design}</li>  
                </ul>
                <button style="background-color:green ;color:white;padding:10px 10px 10px 10px;border:none; width:20%; border-radius:5px;margin-top:5px">Add to Cart</button>
                </div>
            </div>  
        `;  
        productList.innerHTML += productHTML;  
    });  
}  

// Function to filter chargers  
function filterEarphones() {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedbattery = Array.from(document.querySelectorAll('.battery-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkeddesign = Array.from(document.querySelectorAll('.design-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));

    const filteredEarphones = earphones.filter(earphones => {
        const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(earphones.brand);
        const batteryValue=parseInt(earphones.batteryLife);
        const matchesBattery = checkedbattery.length === 0 || checkedbattery.some(e => batteryValue >= e); 
        const matchesdesign = checkeddesign.length === 0 || checkeddesign.includes(earphones.design);
        const discountValue = parseInt(earphones.discount); 
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d); 

        return matchesBrand && matchesBattery && matchesdesign && matchesDiscount;
    });

    // Update the displayed chargers
    displayEarphones(filteredEarphones);
} 

 

// Initial display of all chargers  
document.addEventListener('DOMContentLoaded', () => {  
    displayEarphones(earphones);  
});  

// Event listeners for filters  
document.querySelectorAll('.brand-filter, .battery-filter, .design-filter, .discount-filter').forEach(checkbox => {  
    checkbox.addEventListener('change', filterEarphones);  
});