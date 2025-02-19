const mobileModels = {
    "Apple": [
        { name: "iPhone 12 Mini", image: "images/sellphone_models/Apple/Apple iPhone 12 Mini.webp" },
        { name: "iPhone 12 Pro Max", image: "images/sellphone_models/Apple/Apple iPhone 12 Pro Max.webp" },
        { name: "iPhone 12", image: "images/sellphone_models/Apple/Apple iPhone 12.webp" },
        { name: "iPhone 13 Mini", image: "images/sellphone_models/Apple/Apple iPhone 13 mini.webp" },
        { name: "iPhone 13 Pro Max", image: "images/sellphone_models/Apple/Apple iPhone 13 Pro Max.webp" },
        { name: "iPhone 13", image: "images/sellphone_models/Apple/Apple iPhone 13.webp" },
        { name: "iPhone 14 Plus", image: "images/sellphone_models/Apple/Apple iPhone 14 Plus.webp" },
        { name: "iPhone 14 Pro Max", image: "images/sellphone_models/Apple/Apple iPhone 14 Pro Max.webp" },
        { name: "iPhone 14", image: "images/sellphone_models/Apple/Apple iPhone 14.webp" },
        { name: "iPhone 15 Pro Max", image: "images/sellphone_models/Apple/Apple iPhone 15 Pro Max.webp" },
        { name: "iPhone 15", image: "images/sellphone_models/Apple/Apple iPhone 15.webp" },
        { name: "iPhone 16 Pro Max", image: "images/sellphone_models/Apple/Apple iPhone 16 Pro Max.webp" },
        { name: "iPhone 16 Plus", image: "images/sellphone_models/Apple/Apple iPhone 16 Plus.webp" },
        { name: "iPhone 16", image: "images/sellphone_models/Apple/Apple iPhone 16.webp" }
    ],
    "Google": [
        { name: "Pixel 7 Pro", image: "images/sellphone_models/Google/Google Pixel 7 Pro.webp" },
        { name: "Pixel 7", image: "images/sellphone_models/Google/Google Pixel 7.webp" },
        { name: "Pixel 7a", image: "images/sellphone_models/Google/Google Pixel 7a.webp" },
        { name: "Pixel 8 Pro", image: "images/sellphone_models/Google/Google Pixel 8 Pro.webp" },
        { name: "Pixel 8", image: "images/sellphone_models/Google/Google Pixel 8.webp" },
        { name: "Pixel 8A", image: "images/sellphone_models/Google/Google Pixel 8A.webp" },
        { name: "Pixel 9 Pro XL", image: "images/sellphone_models/Google/Google Pixel 9 Pro XL.webp" },
        { name: "Pixel 9", image: "images/sellphone_models/Google/Google Pixel 9.webp" },
        { name: "Pixel 9 Pro Fold", image: "images/sellphone_models/Google/Google Pixel 9Pro Fold.webp" }
    ],
    "Samsung": [
        { name: "Galaxy A05s", image: "images/sellphone_models/Samsung/galaxy a05 s.webp" },
        { name: "Galaxy A35 5G", image: "images/sellphone_models/Samsung/galaxy a35 5g.webp" },
        { name: "Galaxy A55 5G", image: "images/sellphone_models/Samsung/galaxy A55 5g.webp" },
        { name: "Galaxy F54 5G", image: "images/sellphone_models/Samsung/galaxy f54 5g.webp" },
        { name: "Galaxy M55 5G", image: "images/sellphone_models/Samsung/galaxy m55 5g.webp" },
        { name: "Galaxy S10 Lite", image: "images/sellphone_models/Samsung/galaxy s10 lite.webp" },
        { name: "Galaxy S21 Ultra 5G", image: "images/sellphone_models/Samsung/galaxy s21 ultra 5g.webp" },
        { name: "Galaxy S23 Plus 5G", image: "images/sellphone_models/Samsung/galaxy S23 plus 5g.webp" },
        { name: "Galaxy Z Flip6 5G", image: "images/sellphone_models/Samsung/galaxy z flip6 5g.webp" },
        { name: "Galaxy Z Fold5", image: "images/sellphone_models/Samsung/galaxy z fold5.webp" }
    ],
    "Vivo": [
        { name: "Vivo T1 5G", image: "images/sellphone_models/Vivo/t1 5g.webp" },
        { name: "Vivo V23 Pro 5G", image: "images/sellphone_models/Vivo/v23 pro 5g.webp" },
        { name: "Vivo V29e", image: "images/sellphone_models/Vivo/v29e.webp" },
        { name: "Vivo V40 Pro", image: "images/sellphone_models/Vivo/v40 pro.webp" },
        { name: "Vivo X60 Pro Plus", image: "images/sellphone_models/Vivo/x60 pro plus.webp" },
        { name: "Vivo X70 Pro", image: "images/sellphone_models/Vivo/x70 pro.webp" },
        { name: "Vivo X90 Pro", image: "images/sellphone_models/Vivo/x90 pro.webp" },
        { name: "Vivo Y56 5G", image: "images/sellphone_models/Vivo/y 56 5g.webp" },
        { name: "Vivo Y200 5G", image: "images/sellphone_models/Vivo/y 200 5g.webp" },
        { name: "Vivo Y28 5G", image: "images/sellphone_models/Vivo/y28 5g.webp" }
    ],
    "Xiaomi": [
        { name: "11i Hypercharge 5G", image: "images/sellphone_models/Xiaomi/11i hypercharge 5g.webp" },
        { name: "11T Pro 5G", image: "images/sellphone_models/Xiaomi/11t pro 5g.webp" },
        { name: "12 Pro 5G", image: "images/sellphone_models/Xiaomi/12 pro 5g.webp" },
        { name: "Mi 10i", image: "images/sellphone_models/Xiaomi/mi 10i.webp" },
        { name: "Redmi 9A", image: "images/sellphone_models/Xiaomi/redmi 9a.webp" },
        { name: "Redmi A3", image: "images/sellphone_models/Xiaomi/redmi a3.webp" },
        { name: "Redmi K50 5G", image: "images/sellphone_models/Xiaomi/redmi k50i 5g.webp" },
        { name: "Redmi Note 10", image: "images/sellphone_models/Xiaomi/redmi note 10.webp" },
        { name: "Redmi Note 11 Pro", image: "images/sellphone_models/Xiaomi/redmi note 11 pro.webp" },
        { name: "Redmi Note 13 Pro Plus", image: "images/sellphone_models/Xiaomi/redmi note 13 pro plus 5g.webp" }
    ],
    "Realme": [
        { name: "Realme 6 Pro", image: "images/sellphone_models/Realme/Realme 6 Pro.webp" },
        { name: "Realme 14 Pro 5G", image: "images/sellphone_models/Realme/Realme 14 Pro 5G.webp" },
        { name: "Realme C12", image: "images/sellphone_models/Realme/Realme C12.webp" },
        { name: "Realme C67 5G", image: "images/sellphone_models/Realme/Realme C67 5G.webp" },
        { name: "Realme GT Neo 2", image: "images/sellphone_models/Realme/Realme GT Neo 2.webp" },
        { name: "Realme Narzo 20", image: "images/sellphone_models/Realme/Realme Narzo 20.webp" },
        { name: "Realme Narzo 50A", image: "images/sellphone_models/Realme/Realme Narzo 50A.webp" },
        { name: "Realme Narzo 70 Pro 5G", image: "images/sellphone_models/Realme/Realme Narzo 70 Pro 5G.webp" },
        { name: "Realme P1 Speed 5G", image: "images/sellphone_models/Realme/Realme P1 Speed 5G.webp" },
        { name: "Realme X7 Pro", image: "images/sellphone_models/Realme/Realme X7 Pro.webp" }
    ],
  "Nothing": [
    {name: "Nothing Phone 1", image: "images/sellphone_models/Nothing/1.webp"},
    {name: "Nothing Phone 2", image: "images/sellphone_models/Nothing/2.webp"},
    {name: "Nothing Phone 2A 5G", image: "images/sellphone_models/Nothing/2a 5g.webp"},
    {name: "Nothing Phone 2A Plus", image: "images/sellphone_models/Nothing/2a 5g plus.webp"}
],

    "Lenovo": [
        { name: "Lenovo K10 Note", image: "images/sellphone_models/Lenovo/Lenovo K10 Note.webp" },
        { name: "Lenovo K10 Plus", image: "images/sellphone_models/Lenovo/Lenovo K10 Plus.webp" },
        { name: "Lenovo Z6 Pro", image: "images/sellphone_models/Lenovo/Lenovo Z6 Pro.webp" }
    ],
    "Motorola": [
        { name: "Motorola Moto Edge 50 Neo", image: "images/sellphone_models/Motorola/Motorola Moto Edge 50 Neo.webp" },
        { name: "Motorola Moto Edge 50", image: "images/sellphone_models/Motorola/Motorola Moto Edge 50.webp" },
        { name: "Motorola Moto G04 Plus", image: "images/sellphone_models/Motorola/Motorola Moto G8 Plus.webp" },
        { name: "Motorola Moto G13", image: "images/sellphone_models/Motorola/Motorola Moto G13.webp" },
        { name: "Motorola Moto G32", image: "images/sellphone_models/Motorola/Motorola Moto G32.webp" },
        { name: "Motorola Moto G54 5G", image: "images/sellphone_models/Motorola/Motorola Moto G35 5G.webp" },
        { name: "Motorola Moto G64 5G", image: "images/sellphone_models/Motorola/Motorola Moto G64 5G.webp" },
        { name: "Motorola Moto G72", image: "images/sellphone_models/Motorola/Motorola Moto G72.webp" },
        { name: "Motorola Moto G84 5G", image: "images/sellphone_models/Motorola/Motorola Moto G85 5G.webp" },
        { name: "Motorola Moto Razr 50", image: "images/sellphone_models/Motorola/Motorola Moto Razr 50.webp" }
    ],
    "OnePlus": [
        { name: "OnePlus 10 Pro 5G", image: "images/sellphone_models/OnePlus/OnePlus 10 Pro 5G.webp" },
        { name: "OnePlus 10", image: "images/sellphone_models/OnePlus/OnePlus 10R 5G.webp" },
        { name: "OnePlus 11", image: "images/sellphone_models/OnePlus/OnePlus 11 5G.webp" },
        { name: "OnePlus 11R", image: "images/sellphone_models/OnePlus/OnePlus 11R.webp" },
        { name: "OnePlus 12", image: "images/sellphone_models/OnePlus/OnePlus 12.webp" },
        { name: "OnePlus 12R", image: "images/sellphone_models/OnePlus/OnePlus 12R.webp" },
        { name: "OnePlus 13", image: "images/sellphone_models/OnePlus/OnePlus 13.webp" },
        { name: "OnePlus 13R", image: "images/sellphone_models/OnePlus/OnePlus 13R.webp" },
        { name: "OnePlus Nord 2 5G", image: "images/sellphone_models/OnePlus/OnePlus Nord 2 5G.webp" },
        { name: "OnePlus Nord 4", image: "images/sellphone_models/OnePlus/OnePlus Nord 4.webp" },
        { name: "OnePlus Nord CE 5G", image: "images/sellphone_models/OnePlus/OnePlus Nord CE 3 5G.webp" }
    ]
};
document.addEventListener("DOMContentLoaded", function () {
    const modelContainer = document.getElementById("modelContainer");
    const breadcrumb = document.querySelector(".breadcrumb");
    const heading = document.querySelector(".Select-brand");
    const backButton = document.querySelector(".backButton");

    const backButtonWrapper = document.createElement("div");
    backButtonWrapper.classList.add("back-button-wrapper");

    backButtonWrapper.appendChild(backButton);

    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get("brand");

    if (selectedBrand) {
        heading.textContent = "Select Model"; 
        breadcrumb.innerHTML = `Home > Sell Old Mobile Phone > ${selectedBrand}`; 
        showModels(selectedBrand);
    }

    function showModels(brand) {
        modelContainer.innerHTML = ""; 

        if (mobileModels[brand]) {
            mobileModels[brand].forEach(model => {
                const modelCard = document.createElement("div");
                modelCard.classList.add("model-card");

                const modelImage = document.createElement("img");
                modelImage.src = model.image;
                modelImage.alt = model.name;

                const modelName = document.createElement("p");
                modelName.innerText = model.name;

                modelCard.appendChild(modelImage);
                modelCard.appendChild(modelName);
                modelContainer.appendChild(modelCard);
            });
        } else {
            modelContainer.innerHTML = "<p>No models available for this brand.</p>";
        }
        modelContainer.appendChild(backButtonWrapper);
        backButton.style.display = "block";

    }

    backButton.addEventListener("click", function () {
        window.location.href = "sell_phone.html"; 
    });
});
