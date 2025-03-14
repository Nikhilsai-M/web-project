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
      id: "2",
      brand: "Apple",
      series: "MacBook Air",
      processor: {
        name: "Apple M1",
        generation: "1st Gen"
      },
      pricing: {
        basePrice: 99999,
        discount: 10
      },
      memory: {
        ram: "8GB",
        storage: {
          type: "SSD",
          capacity: "256GB"
        }
      },
      displaysize: "13.3",
      weight: 1.29,
      condition: "Good",
      os: "macOS Monterey",
      image: "/images/buy-laptops/macbook-air-m1.webp"
    },
    {
      id: "3",
      brand: "Apple",
      series: "MacBook Pro",
      processor: {
        name: "Apple M1 Pro",
        generation: "1st Gen"
      },
      pricing: {
        basePrice: 189999,
        discount: 12
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB"
        }
      },
      displaysize: "14.2",
      weight: 1.6,
      condition: "Very Good",
      os: "macOS Monterey",
      image: "/images/buy-laptops/macbook-pro-m1-pro.webp"
    },
    {
      id: "4",
      brand: "Apple",
      series: "MacBook Air",
      processor: {
        name: "Apple M2",
        generation: "2nd Gen"
      },
      pricing: {
        basePrice: 119999,
        discount: 8
      },
      memory: {
        ram: "8GB",
        storage: {
          type: "SSD",
          capacity: "256GB"
        }
      },
      displaysize: "13.6",
      weight: 1.24,
      condition: "Superb",
      os: "macOS Ventura",
      image: "/images/buy-laptops/macbook-air-m2.webp"
    },
    {
      id: "5",
      brand: "Apple",
      series: "MacBook Pro",
      processor: {
        name: "Apple M2 Pro",
        generation: "2nd Gen"
      },
      pricing: {
        basePrice: 209999,
        discount: 10
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB"
        }
      },
      displaysize: "16.2",
      weight: 2.1,
      condition: "Very Good",
      os: "macOS Ventura",
      image: "/images/buy-laptops/macbook-pro-m2-pro.webp"
    },
    {
      id: "6",
      brand: "Apple",
      series: "MacBook Pro",
      processor: {
        name: "Apple M3",
        generation: "3rd Gen"
      },
      pricing: {
        basePrice: 169999,
        discount: 7
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB"
        }
      },
      displaysize: "14.2",
      weight: 1.55,
      condition: "Superb",
      os: "macOS Sonoma",
      image: "/images/buy-laptops/macbook-pro-m3.webp"
    },
    {
      id: "7",
      brand: "Apple",
      series: "MacBook Air",
      processor: {
        name: "Apple M3",
        generation: "3rd Gen"
      },
      pricing: {
        basePrice: 129999,
        discount: 9
      },
      memory: {
        ram: "8GB",
        storage: {
          type: "SSD",
          capacity: "256GB"
        }
      },
      displaysize: "13.6",
      weight: 1.24,
      condition: "Very Good",
      os: "macOS Sonoma",
      image: "/images/buy-laptops/macbook-air-m3.webp"
    },
    {
      id: "8",
      brand: "Apple",
      series: "MacBook Pro",
      processor: {
        name: "Apple M3 Pro",
        generation: "3rd Gen"
      },
      pricing: {
        basePrice: 249999,
        discount: 10
      },
      memory: {
        ram: "32GB",
        storage: {
          type: "SSD",
          capacity: "1TB"
        }
      },
      displaysize: "16.2",
      weight: 2.15,
      condition: "Good",
      os: "macOS Sonoma",
      image: "/images/buy-laptops/macbook-pro-m3-32GB.webp"
    },
    {
      id: "9",
      brand: "Apple",
      series: "MacBook Air",
      processor: {
        name: "Apple M2",
        generation: "2nd Gen"
      },
      pricing: {
        basePrice: 134999,
        discount: 8
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB"
        }
      },
      displaysize: "15.3",
      weight: 1.51,
      condition: "Very Good",
      os: "macOS Ventura",
      image: "/images/buy-laptops/macbook-air-m2-15.webp"
    },
    {
      id: "10",
      brand: "Apple",
      series: "MacBook Pro",
      processor: {
        name: "Apple M3 Max",
        generation: "3rd Gen"
      },
      pricing: {
        basePrice: 299999,
        discount: 10
      },
      memory: {
        ram: "32GB",
        storage: {
          type: "SSD",
          capacity: "1TB"
        }
      },
      displaysize: "16.2",
      weight: 2.15,
      condition: "Very Good",
      os: "macOS Sonoma",
      image: "/images/buy-laptops/macbook-pro-m3-max.webp"
    },
    {
      id: "11",
      brand: "Apple",
      series: "MacBook Air",
      processor: {
        name: "Apple M3",
        generation: "3rd Gen"
      },
      pricing: {
        basePrice: 139999,
        discount: 8
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB"
        }
      },
      displaysize: "15.3",
      weight: 1.51,
      condition: "Superb",
      os: "macOS Sonoma",
      image: "/images/buy-laptops/macbook-air-m3-15.webp"
     }
  
  
];