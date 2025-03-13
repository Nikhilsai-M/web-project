const laptopModels = {
   "HP": [
        { name: "HP 14s", image: "/images/sell-laptop-models/hp/HP 14s.webp", basePrice: 45000 },
        { name: "HP 15", image: "/images/sell-laptop-models/hp/HP 15.webp", basePrice: 48000 },
        { name: "HP 15s", image: "/images/sell-laptop-models/hp/hp 15s.webp", basePrice: 49000 },
        { name: "HP ChromeBook", image: "/images/sell-laptop-models/hp/HP CHROMEBOOK X360.webp", basePrice: 42000 },
        { name: "HP EliteBook", image: "/images/sell-laptop-models/hp/HP ELITEBOOK 820 G4.webp", basePrice: 65000 },
        { name: "HP Envy", image: "/images/sell-laptop-models/hp/hp envy x360.webp", basePrice: 72000 },
        { name: "HP 250R G9", image: "/images/sell-laptop-models/hp/hp laptop 250R G9.webp", basePrice: 46000 },
        { name: "HP Pavilion", image: "/images/sell-laptop-models/hp/HP PAVILION.webp", basePrice: 60000 },
        { name: "HP ProBook", image: "/images/sell-laptop-models/hp/HP PROBOOK 640 G3.webp", basePrice: 58000 },
        { name: "HP Spectre", image: "/images/sell-laptop-models/hp/HP SPECTRE X360.webp", basePrice: 85000 },
        { name: "HP Victus", image: "/images/sell-laptop-models/hp/HP VICTUS.webp", basePrice: 75000 },
        { name: "HP ZBook Studio", image: "/images/sell-laptop-models/hp/HP ZBOOK STUDIO.webp", basePrice: 90000 },         
    ],
    "Acer":[
        { name: "ACER Aspire 3", image: "/images/sell-laptop-models/ACER/ACER ASPIRE 3.webp", basePrice: 42000 },
        { name: "ACER Aspire 5", image: "/images/sell-laptop-models/ACER/Acer Aspire 5.webp", basePrice: 48000 },
        { name: "ACER Aspire 7", image: "/images/sell-laptop-models/ACER/acer aspire 7.webp", basePrice: 58000 },
        { name: "ACER Aspire Lite", image: "/images/sell-laptop-models/ACER/acer aspire lite.webp", basePrice: 40000 },
        { name: "ACER Extensa", image: "/images/sell-laptop-models/ACER/Acer Extensa.webp", basePrice: 38000 },
        { name: "ACER Nitro V", image: "/images/sell-laptop-models/ACER/Acer Nitro V.webp", basePrice: 68000 },
        { name: "ACER ONE", image: "/images/sell-laptop-models/ACER/ACER ONE.webp", basePrice: 35000 },
        { name: "ACER Predator Helios Neo ", image: "/images/sell-laptop-models/ACER/Acer Predator Helios Neo 16.webp", basePrice: 85000 },
        { name: "ACER Swift Go 14 SNAPDRAGON X Plus", image: "/images/sell-laptop-models/ACER/ACER SWIFT GO 14 SNAPDRAGON X PLUS.webp", basePrice: 70000 },
        { name: "ACER Swift Go 14 Touch Screen", image: "/images/sell-laptop-models/ACER/ACER SWIFT GO 14 TOUCH SCREEN.webp", basePrice: 72000 },
        { name: "ACER Travelmate", image: "/images/sell-laptop-models/ACER/Acer Travelmate.webp", basePrice: 50000 },
    ],
    "Asus":[
        { name: "ASUS ChromeBook", image: "/images/sell-laptop-models/ASUS/ASUS CHROMEBOOK.webp", basePrice: 42000 },
        { name: "ASUS ExpertBook B14", image: "/images/sell-laptop-models/ASUS/ASUS EXPERTBOOK B14.webp", basePrice: 55000 },
        { name: "ASUS ROG Strix G16", image: "/images/sell-laptop-models/ASUS/ASUS ROG STRIX G16.webp", basePrice: 89000 },
        { name: "ASUS TUF Gaming A15", image: "/images/sell-laptop-models/ASUS/ASUS TUF GAMING A15.webp", basePrice: 72000 },
        { name: "ASUS TUF Gaming F15", image: "/images/sell-laptop-models/ASUS/ASUS TUF GAMING F15.webp", basePrice: 75000 },
        { name: "ASUS TUF Gaming F17", image: "/images/sell-laptop-models/ASUS/ASUS TUF GAMING F17.webp", basePrice: 78000 },
        { name: "ASUS VivoBook 15", image: "/images/sell-laptop-models/ASUS/ASUS VIVO BOOK 15.webp", basePrice: 52000 },
        { name: "ASUS VivoBook 16X", image: "/images/sell-laptop-models/ASUS/ASUS VIVO BOOK 16X.webp", basePrice: 60000 },
        { name: "ASUS VivoBook 15 GO", image: "/images/sell-laptop-models/ASUS/ASUS VIVOBOOK 15 GO.webp", basePrice: 45000 },
        { name: "ASUS VivoBook 15 Go OLED", image: "/images/sell-laptop-models/ASUS/ASUS VIVOBOOK GO 15 OLED.webp", basePrice: 58000 },
        { name: "ASUS ZenBook S14", image: "/images/sell-laptop-models/ASUS/ASUS Zenbook S14.webp", basePrice: 82000 },
    ],
    "Dell":[
        { name: "DELL 15", image: "/images/sell-laptop-models/dell/DELL 15.webp", basePrice: 50000 },
        { name: "DELL Insipiron 7741 Plus", image: "/images/sell-laptop-models/dell/DELL INSIPIRON 7741 PLUS.webp", basePrice: 62000 },
        { name: "DELL Intel Celeron Dual Core", image: "/images/sell-laptop-models/dell/DELL INTEL CELERON DUAL CORE.webp", basePrice: 38000 },
        { name: "DELL Intel Core", image: "/images/sell-laptop-models/dell/DELL INTEL CORE.webp", basePrice: 55000 },
        { name: "DELL Latitude 3440", image: "/images/sell-laptop-models/dell/DELL LATITUDE 3440.webp", basePrice: 65000 },
        { name: "DELL MSO'2021", image: "/images/sell-laptop-models/dell/DELL MSO'2021.webp", basePrice: 58000 },
        { name: "DELL Vostro 15 3520", image: "/images/sell-laptop-models/dell/DELL VOSTRO 15 3520 LAPTOP.webp", basePrice: 52000 },
        { name: "DELL G15-5530", image: "/images/sell-laptop-models/dell/dell{smartchoice} G15-5530.webp", basePrice: 80000 },
    ],
    "Lenovo":[
        { name: "Lenovo ChromeBook", image: "/images/sell-laptop-models/Lenovo/Lenovo Chromebook.webp", basePrice: 42000 },
        { name: "Lenovo IdeaPad 3", image: "/images/sell-laptop-models/Lenovo/Lenovo IdeaPad 3.webp", basePrice: 48000 },
        { name: "Lenovo IdeaPad Flex 5", image: "/images/sell-laptop-models/Lenovo/Lenovo IdeaPad Flex 5.webp", basePrice: 58000 },
        { name: "Lenovo IdeaPad pro 5", image: "/images/sell-laptop-models/Lenovo/Lenovo IdeaPad pro 5.webp", basePrice: 65000 },
        { name: "Lenovo IdeaPad Slim 1", image: "/images/sell-laptop-models/Lenovo/Lenovo IdeaPad Slim 1.webp", basePrice: 45000 },
        { name: "Lenovo IdeaPad Slim 5", image: "/images/sell-laptop-models/Lenovo/Lenovo IdeaPad Slim 5.webp", basePrice: 55000 },
        { name: "Lenovo Legion 5", image: "/images/sell-laptop-models/Lenovo/Lenovo Legion 5.webp", basePrice: 78000 },
        { name: "Lenovo LOQ", image: "/images/sell-laptop-models/Lenovo/Lenovo LOQ.webp", basePrice: 72000 },
        { name: "Lenovo ThinkPad E14", image: "/images/sell-laptop-models/Lenovo/Lenovo Thinkpad E14.webp", basePrice: 70000 },
        { name: "Lenovo V14", image: "/images/sell-laptop-models/Lenovo/Lenovo V14.webp", basePrice: 45000 },
        { name: "Lenovo V15 G3 IAP", image: "/images/sell-laptop-models/Lenovo/Lenovo V15 G3 IAP.webp", basePrice: 48000 },
        { name: "Lenovo Yoga Slim 6", image: "/images/sell-laptop-models/Lenovo/Lenovo Yoga Slim 6 WUXGA.webp", basePrice: 75000 },
        { name: "Lenovo Yoga Slim 7", image: "/images/sell-laptop-models/Lenovo/Lenovo Yoga Slim 7.webp", basePrice: 80000 },
    ],
    "Microsoft":[
        { name: "MICROSOFT Laptop Go 3", image: "/images/sell-laptop-models/microsoft/MICROSOFT Laptop Go 3.webp", basePrice: 65000 },
        { name: "MICROSOFT Surface Laptop 4", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface Laptop 4.webp", basePrice: 90000 },
        { name: "MICROSOFT Surface Laptop 5", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface Laptop 5.webp", basePrice: 105000 },
        { name: "MICROSOFT Surface Laptop", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface laptop.webp", basePrice: 80000 },
        { name: "MICROSOFT Surface Pro 7+", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface Pro 7+.webp", basePrice: 95000 },
        { name: "MICROSOFT Surface Pro 8", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface Pro 8.webp", basePrice: 110000 },
        { name: "MICROSOFT Surface Pro 9", image: "/images/sell-laptop-models/microsoft/MICROSOFT Surface Pro 9.webp", basePrice: 120000 },
    ],
    "MSI":[
        { name: "MSI Crosshair 16 HX", image: "/images/sell-laptop-models/MSI/MSI Crosshair 16 HX.webp", basePrice: 95000 },
        { name: "MSI Cyborg 15", image: "/images/sell-laptop-models/MSI/MSI Cyborg 15.webp", basePrice: 85000 },
        { name: "MSI GL Series", image: "/images/sell-laptop-models/MSI/MSI GL Series.webp", basePrice: 80000 },
        { name: "MSI GP66 Leopard", image: "/images/sell-laptop-models/MSI/MSI GP66 Leopard.webp", basePrice: 90000 },
        { name: "MSI Katana A15", image: "/images/sell-laptop-models/MSI/MSI Katana A15.webp", basePrice: 75000 },
        { name: "MSI Modern 14", image: "/images/sell-laptop-models/MSI/MSI Modern 14.webp", basePrice: 60000 },
        { name: "MSI Modern 15H", image: "/images/sell-laptop-models/MSI/MSI Modern 15H.webp", basePrice: 65000 },
        { name: "MSI Prestige 14", image: "/images/sell-laptop-models/MSI/MSI Prestige 14.webp", basePrice: 75000 },
        { name: "MSI Pulse GL66", image: "/images/sell-laptop-models/MSI/MSI Pulse GL66.webp", basePrice: 82000 },
        { name: "MSI Stealth 15", image: "/images/sell-laptop-models/MSI/MSI Stealth 15.webp", basePrice: 92000 },
        { name: "MSI Summit E14 FlipEvo", image: "/images/sell-laptop-models/MSI/MSI Summit E14 FlipEvo.webp", basePrice: 85000 },
        { name: "MSI Sword 16 HX", image: "/images/sell-laptop-models/MSI/MSI Sword 16 HX.webp", basePrice: 88000 },
        { name: "MSI Titan GT77", image: "/images/sell-laptop-models/MSI/MSI Titan GT77.webp", basePrice: 125000 },
    ],
    "Apple": [
        { name: "2022 Apple Mac Book AIR", image: "/images/sell-laptop-models/apple/2022 APPLE MAC BOOK AIR.webp", basePrice: 95000 },
        { name: "Apple 2020 MacBook Air Apple M1", image: "/images/sell-laptop-models/apple/Apple 2020 Macbook air apple M1.webp", basePrice: 85000 },
        { name: "Apple 2024 MacBook Air 15", image: "/images/sell-laptop-models/apple/Apple 2024 macbook air 15.webp", basePrice: 120000 },
        { name: "Apple MacBook M3", image: "/images/sell-laptop-models/apple/APPLE apple M3.webp", basePrice: 110000 },
        { name: "Apple MacBook Air M2", image: "/images/sell-laptop-models/apple/Apple MacBook Air Apple M2.webp", basePrice: 100000 },
        { name: "Apple MacBook Air M3", image: "/images/sell-laptop-models/apple/Apple MacBook Air Apple M3.webp", basePrice: 115000 },
        { name: "Apple MacBook M3 Pro", image: "/images/sell-laptop-models/apple/Apple MacBook pro Apple M3 pro.webp", basePrice: 140000 }
],

};

export default laptopModels;