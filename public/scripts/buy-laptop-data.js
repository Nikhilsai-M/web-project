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
  
];