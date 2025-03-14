// script.js  
import { accessoriesData } from './accessories-data.js';  

const productList = document.getElementById('product-list');  

// Access the chargers array from the imported object  
const mouses = accessoriesData.mouses;  

// Function to display chargers  
function displaymouses(filteredmouses) {  
    productList.innerHTML = ''; // Clear the product list  
    filteredmouses.forEach(mouses => {  
        const discountPrice = (mouses.originalPrice - (mouses.originalPrice * parseFloat(mouses.discount) / 100)).toFixed(2);  
        const productHTML = `  
            <div class="product">  
                <img src="${mouses.image}"> 
                <div class="product1"> 
                <h3>${mouses.title}</h3>  
                 <p class="discounted-price">₹${discountPrice}</p>
                     <span class="original-price">₹${mouses.originalPrice}</span><br>
                     <span class="discount">${mouses.discount} Off</span>
                <ul>
                <li>Brand: ${mouses.brand}</li>  
                <li>Connectivity: ${mouses.connectivity}</li>  
                <li>Type: ${mouses.type}</li> 
                <li>Resolution: ${mouses.resolution} DPI</li> 
                </ul>
                <button style="background-color:green ;color:white;padding:10px 10px 10px 10px;border:none; width:20%; border-radius:5px;margin-top:5px">Add to Cart</button>
                </div>
            </div>  
        `;  
        productList.innerHTML += productHTML;  
    });  
}  

// Function to filter chargers  
function filterMouses() {
    const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(checkbox => checkbox.value);
    const checkedres = Array.from(document.querySelectorAll('.res-filter:checked')).map(checkbox => parseInt(checkbox.value));
    const checkedtype = Array.from(document.querySelectorAll('.type-filter:checked')).map(checkbox => checkbox.value);
    const checkedcon=Array.from(document.querySelectorAll('.connect-filter:checked')).map(checkbox => checkbox.value);
    const checkedDiscounts = Array.from(document.querySelectorAll('.discount-filter:checked')).map(checkbox => parseInt(checkbox.value));

    const filteredmouses = mouses.filter(mouses => {
        const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(mouses.brand);
        const matchedres=parseInt(mouses.resolution);
        const matchesres = checkedres.length === 0 || checkedres.some(e => matchedres >= e); 
        const matchestype = checkedtype.length === 0 || checkedtype.includes(mouses.type);
        const matchescon=checkedcon.length === 0 || checkedcon.includes(mouses.connectivity)
        const discountValue = parseInt(mouses.discount); 
        const matchesDiscount = checkedDiscounts.length === 0 || checkedDiscounts.some(d => discountValue >= d); 

        return matchesBrand && matchesres && matchestype && matchescon && matchesDiscount;
    });

    // Update the displayed chargers
    displaymouses(filteredmouses);
} 

 

// Initial display of all chargers  
document.addEventListener('DOMContentLoaded', () => {  
    displaymouses(mouses);  
});  

// Event listeners for filters  
document.querySelectorAll('.brand-filter, .res-filter, .type-filter, .connect-filter,.discount-filter').forEach(checkbox => {  
    checkbox.addEventListener('change', filterMouses);  
});