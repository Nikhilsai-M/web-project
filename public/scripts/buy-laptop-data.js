const laptopSchema = [
    {
    id: "1", // Unique identifier for each laptop
    brand: "Dell", // Brand name (Dell, HP, Lenovo, etc.)
    series : "Vostro", 
    processor: {
      name: "Intel Core i7", // Processor type/name
      generation: "11th Gen", // Processor generation
    },
    pricing: {
      basePrice: 89999, // Original price before discount
      discount: 15, // Discount percentage
    },
    memory: {
      ram: "16GB", // RAM capacity
      storage: {
        type: "SSD", // Storage type (SSD, HDD, Hybrid)
        capacity: "512GB" // Storage capacity
      }
    },
    displaysize: "13.3", // Display size in inches
     
    weight: 1.4,
    condition: "Superb", // Condition grade (Superb, VeryGood, Good)
    os: "Windows 11", // Operating system installed
    image: "/images/buy-laptops/image.png", // Path to laptop image
  },




  {
    id: 1,
    brand: "Acer",
    series: "Aspire 3",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 45999,
      discount: 10,
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 1.7,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/aspire3.webp"
  },
  {
    id: 2,
    brand:"Acer",
    series: "Aspire 5",
    processor: {
      name: "Intel Core i5",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 57999,
      discount: 12
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 14,
    weight: 1.6,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/aspire5.webp"
  },
  {
    id: 3,
    brand: "Acer",
    series: "Aspire 7",
    processor: {
      name: "AMD Ryzen 7",
      generation: "5000 Series"
    },
    pricing: {
      basePrice: 69999,
      discount: 15
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 2.1,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/aspire7.webp"
  },
  {
    id: 4,
    brand:"Acer",
    series: "Aspire Lite",
    processor: {
      name: "Intel Core i3",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 38999,
      discount: 8
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "256GB"
      }
    },
    displaysize: 14,
    weight: 1.5,
    condition: "VeryGood",
    os: "Windows 11",
    image: "/images/buy-laptops/aspirelite.webp"
  },
  {
    id: 5,
    brand:"Acer",
    series: "Extensa",
    processor: {
      name: "Intel Core i5",
      generation: "10th Gen"
    },
    pricing: {
      basePrice: 52999,
      discount: 10
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "HDD",
        capacity: "1TB"
      }
    },
    displaysize: 15.6,
    weight: 2.0,
    condition: "Good",
    os: "Windows 10",
    image: "/images/buy-laptops/extensa.webp"
  },
  {
    id: 6,
    brand:"Acer",
    series: "Nitro V",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 75999,
      discount: 12
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 15.6,
    weight: 2.3,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/nitrov.webp"
  },
  {
    id: 7,
    brand: "Acer",
    series: "ONE",
    processor: {
      name: "Intel Pentium Silver",
      generation: "N6000"
    },
    pricing: {
      basePrice: 29999,
      discount: 5
    },
    memory: {
      ram: "4GB",
      storage: {
        type: "SSD",
        capacity: "128GB"
      }
    },
    displaysize: 14,
    weight: 1.4,
    condition: "Good",
    os: "Windows 10",
    image: "/images/buy-laptops/one.webp"
  },
  {
    id: 8,
    brand:"Acer",
    series: "Predator Helios Neo",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 129999,
      discount: 18
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 16,
    weight: 2.5,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/predatorheliosneo.webp"
  },
  {
    id: 9,
    brand: "Acer",
    series: "Swift Go 14 SNAPDRAGON X Plus",
    processor: {
      name: "Snapdragon X Plus",
      generation: "1st Gen"
    },
    pricing: {
      basePrice: 84999,
      discount: 10
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 14,
    weight: 1.3,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/swiftgo14snapdragonxplus.webp"
  },
  {
    id: 10,
    brand:"Acer",
    series: "Swift Go 14 Touch Screen",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 89999,
      discount: 12
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 14,
    weight: 1.3,
    condition: "Superb",
    os: "Windows 11",
    image: "/images/buy-laptops/swiftgo14touchscreen.webp"
  }
];