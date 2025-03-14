import { shuffleArray } from "./buy-mobile-data.js";

const laptopSchema = [
  {
    id: 100,
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
    image: "images/buy-laptops/aspire3.webp"
  },
  {
    id: 101,
    brand: "Acer",
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
    image: "images/buy-laptops/aspire5.webp"
  },
  {
    id: 102,
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
    image: "images/buy-laptops/aspire7.webp"
  },
  {
    id: 103,
    brand: "Acer",
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
    image: "images/buy-laptops/aspirelite.webp"
  },
  {
    id: 104,
    brand: "Acer",
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
    image: "images/buy-laptops/extensa.webp"
  },
  {
    id: 105,
    brand: "Acer",
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
    image: "images/buy-laptops/nitrov.webp"
  },
  {
    id: 106,
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
    image: "images/buy-laptops/one.webp"
  },
  {
    id: 107,
    brand: "Acer",
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
    image: "images/buy-laptops/predatorheliosneo.webp"
  },
  {
    id: 108,
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
    image: "images/buy-laptops/swiftgo14snapdragonxplus.webp"
  },
  {
    id: 109,
    brand: "Acer",
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
    image: "images/buy-laptops/swiftgo14touchscreen.webp"
  },
  {
    id: 110,
    brand: "MSI",
    series: "Crosshair 16 HX",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 129999,
      discount: 15
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 16,
    weight: 2.3,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/crosshair16hx.webp"
  },
  {
    id: 111,
    brand: "MSI",
    series: "Cyborg 15",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 89999,
      discount: 10
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 2.0,
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/cyborg15.webp"
  },
  {
    id: 112,
    brand: "MSI",
    series: "GL Series",
    processor: {
      name: "Intel Core i7",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 79999,
      discount: 8
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 2.2,
    condition: "Excellent",
    os: "Windows 10",
    image: "images/buy-laptops/glseries.webp"
  },
  {
    id: 113,
    brand: "MSI",
    series: "GP66 Leopard",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 149999,
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
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/gp66leopard.webp"
  },
  {
    id: 114,
    brand: "MSI",
    series: "Katana A15",
    processor: {
      name: "AMD Ryzen 7",
      generation: "6000 Series"
    },
    pricing: {
      basePrice: 99999,
      discount: 10
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
    condition: "very good",
    os: "Windows 11",
    image: "images/buy-laptops/katanaa15.webp"
  },
  {
    id: 115,
    brand: "MSI",
    series: "Modern 14",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 74999,
      discount: 5
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 14,
    weight: 1.4,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/modern14.webp"
  },
  {
    id: 116,
    brand: "MSI",
    series: "Modern 15H",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 89999,
      discount: 8
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 1.6,
    condition: "Excellent",
    os: "Windows 11",
    image: "images/buy-laptops/modern15h.webp"
  },
  {
    id: 117,
    brand: "MSI",
    series: "Prestige 14",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 84999,
      discount: 7
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
    image: "images/buy-laptops/prestige14.webp"
  },
  {
    id: 118,
    brand: "MSI",
    series: "Pulse GL66",
    processor: {
      name: "Intel Core i7",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 119999,
      discount: 10
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 15.6,
    weight: 2.2,
    condition: "very good",
    os: "Windows 11",
    image: "images/buy-laptops/pulsegl66.webp"
  },
  {
    id: 119,
    brand: "MSI",
    series: "Stealth 15",
    processor: {
      name: "Intel Core i9",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 159999,
      discount: 12
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 15.6,
    weight: 1.8,
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/stealth15.webp"
  },
  {
    id: 120,
    brand: "MSI",
    series: "Summit E14",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 109999,
      discount: 9
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 14,
    weight: 1.2,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/summite14.webp"
  },
  {
    id: 121,
    brand: "MSI",
    series: "Sword 16 HX",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 139999,
      discount: 11
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
    condition: "very good",
    os: "Windows 11",
    image: "images/buy-laptops/sword16hx.webp"
  },
  {
    id: 122,
    brand: "MSI",
    series: "Titan GT77",
    processor: {
      name: "Intel Core i9",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 299999,
      discount: 10
    },
    memory: {
      ram: "64GB",
      storage: {
        type: "SSD",
        capacity: "2TB"
      }
    },
    displaysize: 17.3,
    weight: 3.3,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/titangt77.webp"
  },
  {
    id: 123,
    brand: "Lenovo",
    series: "ChromeBook",
    processor: {
      name: "Intel Celeron",
      generation: "N4020"
    },
    pricing: {
      basePrice: 25999,
      discount: 12
    },
    memory: {
      ram: "4GB",
      storage: {
        type: "eMMC",
        capacity: "64GB"
      }
    },
    displaysize: 11.6,
    weight: 1.2,
    condition: "good",
    os: "Chrome OS",
    image: "images/buy-laptops/chromebook.webp"
  },
  {
    id: 124,
    brand: "Lenovo",
    series: "IdeaPad 3",
    processor: {
      name: "Intel Core i3",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 45999,
      discount: 8
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 1.65,
    condition: "very good",
    os: "Windows 11",
    image: "images/buy-laptops/ideapad3.webp"
  },
  {
    id: 125,
    brand: "Lenovo",
    series: "IdeaPad Flex 5",
    processor: {
      name: "AMD Ryzen 5",
      generation: "5500U"
    },
    pricing: {
      basePrice: 62999,
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
    weight: 1.5,
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/ideapadflex5.webp"
  },
  {
    id: 126,
    brand: "Lenovo",
    series: "IdeaPad Pro 5",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 79999,
      discount: 7
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 16,
    weight: 1.8,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/ideapadpro5.webp"
  },
  {
    id: 127,
    brand: "Lenovo",
    series: "IdeaPad Slim 1",
    processor: {
      name: "AMD Ryzen 3",
      generation: "3250U"
    },
    pricing: {
      basePrice: 33999,
      discount: 15
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "256GB"
      }
    },
    displaysize: 14,
    weight: 1.4,
    condition: "excellent",
    os: "Windows 11",
    image: "images/buy-laptops/ideapadslim1.webp"
  },
  {
    id: 128,
    brand: "Lenovo",
    series: "IdeaPad Slim 5",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 58999,
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
    weight: 1.39,
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/ideapadslim5.webp"
  },
  {
    id: 129,
    brand: "Lenovo",
    series: "Legion 5",
    processor: {
      name: "AMD Ryzen 7",
      generation: "6800H"
    },
    pricing: {
      basePrice: 124999,
      discount: 5
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: 15.6,
    weight: 2.4,
    condition: "very good",
    os: "Windows 11",
    image: "images/buy-laptops/legion5.webp"
  },
  {
    id: 130,
    brand: "Lenovo",
    series: "LOQ",
    processor: {
      name: "Intel Core i5",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 87999,
      discount: 6
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 15.6,
    weight: 2.45,
    condition: "excellent",
    os: "Windows 11",
    image: "images/buy-laptops/loq.webp"
  },
  {
    id: 131,
    brand: "Lenovo",
    series: "ThinkPad E14",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 74999,
      discount: 9
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
    condition: "superb",
    os: "Windows 11",
    image: "images/buy-laptops/thinkpade14.webp"
  },
  {
    id: 132,
    brand: "Lenovo",
    series: "V14",
    processor: {
      name: "AMD Ryzen 5",
      generation: "5500U"
    },
    pricing: {
      basePrice: 42999,
      discount: 11
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: 14,
    weight: 1.6,
    condition: "good",
    os: "Windows 11",
    image: "images/buy-laptops/v14.webp"
  },
  {
    id: 133,
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
    image: "images/buy-laptops/macbook-air-m1.webp"
  },
  {
    id: 134,
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
    image: "images/buy-laptops/macbook-pro-m1-pro.webp"
  },
  {
    id: 135,
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
    image: "images/buy-laptops/macbook-air-m2.webp"
  },
  {
    id: 136,
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
    image: "images/buy-laptops/macbook-pro-m2-pro.webp"
  },
  {
    id: 137,
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
    image: "images/buy-laptops/macbook-pro-m3.webp"
  },
  {
    id: 138,
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
    image: "images/buy-laptops/macbook-air-m3.webp"
  },
  {
    id: 139,
    brand: "Apple",
    series: "MacBook Pro",
    processor: {
      name: "Apple M3 Pro",
      generation: "3rd Gen"
    },
    pricing: {
      basePrice: 190999,
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
    image: "images/buy-laptops/macbook-pro-m3-32GB.webp"
  },
  {
    id: 140,
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
    image: "images/buy-laptops/macbook-air-m2-15.webp"
  },
  {
    id: 141,
    brand: "Apple",
    series: "MacBook Pro",
    processor: {
      name: "Apple M3 Max",
      generation: "3rd Gen"
    },
    pricing: {
      basePrice: 199999,
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
    image: "images/buy-laptops/macbook-pro-m3-max.webp"
  },
  {
    id: 142,
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
    image: "images/buy-laptops/macbook-air-m3-15.webp"
  },
  {
    id: 143,
    brand: "Dell",
    series: "Vostro",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 68718,
      discount: 24
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.4,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/dell-vostro-i5-12thgen.webp"
  },
  {
    id: 144,
    brand: "Dell",
    series: "Inspiron",
    processor: {
      name: "Intel Core i5",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 68990,
      discount: 19
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "15.6",
    weight: 1.62,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-inspiron.webp"
  },
  {
    id: 145,
    brand: "Dell",
    series: "Vostro",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 49198,
      discount: 35
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.69,
    condition: "Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-vostro-i3.webp"
  },
  {
    id: 146,
    brand: "Dell",
    series: "Latitude 14",
    processor: {
      name: "Intel Core i5",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 85000,
      discount: 40
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "14",
    weight: 1.7,
    condition: "Superb",
    os: "Windows 10",
    image: "images/buy-laptops/dell-latitude14.webp"
  },
  {
    id: 147,
    brand: "Dell",
    series: "MSO 2021",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 58990,
      discount: 45
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.5",
    weight: 1.65,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-mso2021.webp"
  },
  {
    id: 148,
    brand: "Dell",
    series: "Vostro",
    processor: {
      name: "Intel Core i5",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 56722,
      discount: 23
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.83,
    condition: "Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-vostro-i5-11thgen.webp"
  },
  {
    id: 149,
    brand: "Dell",
    series: "G15",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 100259,
      discount: 33
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "14.9",
    weight: 2.57,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-g15.webp"
  },
  {
    id: 150,
    brand: "Dell",
    series: "Inspiron 3530",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 79990,
      discount: 17
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.67,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/dell-inspiron3530.webp"
  },
  {
    id: 151,
    brand: "Asus",
    series: "Chromebook Plus",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 55990,
      discount: 51
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "UFS",
        capacity: "128GB"
      }
    },
    displaysize: "14",
    weight: 1.44,
    condition: "Very Good",
    os: "Chrome",
    image: "images/buy-laptops/asus-chromebook-plus.webp"
  },
  {
    id: 152,
    brand: "Asus",
    series: "ExpertBook B14",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 50990,
      discount: 43
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "14",
    weight: 1.49,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/asus-expertbook-b14.webp"
  },
  {
    id: 153,
    brand: "Asus",
    series: "ROG Strix G16",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 143990,
      discount: 25
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "16",
    weight: 2.5,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/asus-rog-strix.webp"
  },
  {
    id: 154,
    brand: "Asus",
    series: "TUF Gaming F15",
    processor: {
      name: "Intel Core i5",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 75990,
      discount: 40
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 2.3,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/asus-tuf-f15.webp"
  },
  {
    id: 155,
    brand: "Asus",
    series: "TUF Gaming F17",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 147990,
      discount: 39
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "17.3",
    weight: 2.6,
    condition: "Good",
    os: "Windows 11",
    image: "images/buy-laptops/asus-tuf-f17.webp"
  },
  {
    id: 156,
    brand: "Asus",
    series: "Vivobook 15",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 69990,
      discount: 44
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.7,
    condition: "Good",
    os: "Windows 11",
    image: "images/buy-laptops/asus-vivobook15.webp"
  },
  {
    id: 157,
    brand: "Asus",
    series: "Vivobook 16x",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 86990,
      discount: 37
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "16",
    weight: 1.8,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/asus-vivobook16x.webp"
  },
  {
    id: 158,
    brand: "Asus",
    series: "Vivobook Go 15",
    processor: {
      name: "Ryzen 3 Quad core",
      generation: "No"
    },
    pricing: {
      basePrice: 50990,
      discount: 45
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.63,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/asus-vivobook-go15.webp"
  },
  {
    id: 159,
    brand: "Asus",
    series: "Vivobook Go 15 OLED",
    processor: {
      name: "Ryzen 3 Quad core",
      generation: "No"
    },
    pricing: {
      basePrice: 61990,
      discount: 29
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.63,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/asus-vivobook-go15oled.webp"
  },
  {
    id: 160,
    brand: "Asus",
    series: "Zenbook 14",
    processor: {
      name: "Intel Core i5",
      generation: "8th Gen"
    },
    pricing: {
      basePrice: 79999,
      discount: 36
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "14",
    weight: 1.19,
    condition: "Good",
    os: "Windows 10",
    image: "images/buy-laptops/asus-zenbook.webp"
  },
  {
    id: 161,
    brand: "HP",
    series: "14s",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 51265,
      discount: 31
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "14",
    weight: 1.41,
    condition: "Good",
    os: "Windows 11",
    image: "images/buy-laptops/hp-14s.webp"
  },
  {
    id: 162,
    brand: "HP",
    series: "15s",
    processor: {
      name: "Intel Core i3",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 51266,
      discount: 38
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.69,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/hp-15s.webp"
  },
  {
    id: 163,
    brand: "HP",
    series: "Chromebook",
    processor: {
      name: "Celeron Dual Core",
      generation: "No"
    },
    pricing: {
      basePrice: 32295,
      discount: 23
    },
    memory: {
      ram: "4GB",
      storage: {
        type: "EMMC",
        capacity: "64GB"
      }
    },
    displaysize: "14",
    weight: 1.49,
    condition: "Good",
    os: "Chrome",
    image: "images/buy-laptops/hp-chromebook.webp"
  },
  {
    id: 164,
    brand: "HP",
    series: "Elitebook",
    processor: {
      name: "Intel Core i5",
      generation: "8th Gen"
    },
    pricing: {
      basePrice: 124990,
      discount: 35
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "256GB"
      }
    },
    displaysize: "14",
    weight: 1.48,
    condition: "Very Good",
    os: "Windows 10",
    image: "images/buy-laptops/hp-elitebook.webp"
  },
  {
    id: 165,
    brand: "HP",
    series: "Envy",
    processor: {
      name: "Intel Core i7",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 132990,
      discount: 45
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "14",
    weight: 1.59,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/hp-envy.webp"
  },
  {
    id: 166,
    brand: "HP",
    series: "250R G9",
    processor: {
      name: "Intel Core i3",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 54999,
      discount: 41
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.57,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/hp-250r-g9.webp"
  },
  {
    id: 167,
    brand: "HP",
    series: "Pavilion",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 93261,
      discount: 25
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "14",
    weight: 1.41,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/hp-pavilion.webp"
  },
  {
    id: 168,
    brand: "HP",
    series: "Probook",
    processor: {
      name: "Intel Core i5",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 89990,
      discount: 25
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 1.75,
    condition: "Good",
    os: "DOS",
    image: "images/buy-laptops/hp-probook.webp"
  },
  {
    id: 169,
    brand: "HP",
    series: "Spectre",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 168000,
      discount: 15
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "13.5",
    weight: 1.34,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/hp-spectre.webp"
  },
  {
    id: 170,
    brand: "HP",
    series: "Victus",
    processor: {
      name: "Ryzen 5 Hexa Core",
      generation: "No"
    },
    pricing: {
      basePrice: 69999,
      discount: 34
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15.6",
    weight: 2.37,
    condition: "Very Good",
    os: "Windows 11",
    image: "images/buy-laptops/hp-victus.webp"
  },
  {
    id: 171,
    brand: "HP",
    series: "Zbook Studio",
    processor: {
      name: "Intel Core i9",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 51265,
      discount: 31
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "16",
    weight: 1.73,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/hp-zbook.webp"
  },
  {
    id: 172,
    brand: "Microsoft",
    series: "Surface Laptop 4",
    processor: {
      name: "Intel Core i5",
      generation: "11th Gen"
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
    displaysize: "13.5",
    weight: 1.31,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-4.webp"
  },
  {
    id: 173,
    brand: "Microsoft",
    series: "Surface Laptop 5",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 149999,
      discount: 12
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "15",
    weight: 1.56,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-5.webp"
  },
  {
    id: 174,
    brand: "Microsoft",
    series: "Surface Laptop Studio",
    processor: {
      name: "Intel Core i7",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 199999,
      discount: 15
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "14.4",
    weight: 1.82,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-studio.webp"
  },
  {
    id: 175,
    brand: "Microsoft",
    series: "Surface Pro 9",
    processor: {
      name: "Intel Core i7",
      generation: "12th Gen"
    },
    pricing: {
      basePrice: 179999,
      discount: 10
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "13",
    weight: 0.88,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-pro-9.webp"
  },
  {
    id: 176,
    brand: "Microsoft",
    series: "Surface Laptop Studio 2",
    processor: {
      name: "Intel Core i7",
      generation: "13th Gen"
    },
    pricing: {
      basePrice: 229999,
      discount: 10
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "14.4",
    weight: 1.89,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-studio-2.webp"
  },
  {
    id: 177,
    brand: "Microsoft",
    series: "Surface Laptop Go",
    processor: {
      name: "Intel Core i5",
      generation: "10th Gen"
    },
    pricing: {
      basePrice: 74999,
      discount: 8
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "128GB"
      }
    },
    displaysize: "12.4",
    weight: 1.11,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-go.webp"
  },
  {
    id: 178,
    brand: "Microsoft",
    series: "Surface Laptop Go 2",
    processor: {
      name: "Intel Core i5",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 84999,
      discount: 10
    },
    memory: {
      ram: "8GB",
      storage: {
        type: "SSD",
        capacity: "256GB"
      }
    },
    displaysize: "12.4",
    weight: 1.13,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-laptop-go-2.webp"
  },
  {
    id: 179,
    brand: "Microsoft",
    series: "Surface Pro 8",
    processor: {
      name: "Intel Core i7",
      generation: "11th Gen"
    },
    pricing: {
      basePrice: 164999,
      discount: 12
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "13",
    weight: 0.89,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-pro-8.webp"
  },
  {
    id: 180,
    brand: "Microsoft",
    series: "Surface Book 3",
    processor: {
      name: "Intel Core i7",
      generation: "10th Gen"
    },
    pricing: {
      basePrice: 189999,
      discount: 10
    },
    memory: {
      ram: "32GB",
      storage: {
        type: "SSD",
        capacity: "1TB"
      }
    },
    displaysize: "15",
    weight: 1.91,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-book-3.webp"
  },
  {
    id: 181,
    brand: "Microsoft",
    series: "Surface Pro X",
    processor: {
      name: "Microsoft SQ2",
      generation: "1st Gen"
    },
    pricing: {
      basePrice: 139999,
      discount: 10
    },
    memory: {
      ram: "16GB",
      storage: {
        type: "SSD",
        capacity: "512GB"
      }
    },
    displaysize: "13",
    weight: 0.77,
    condition: "Superb",
    os: "Windows 11",
    image: "images/buy-laptops/surface-pro-x.webp"
  }
];

const laptopModels = shuffleArray(laptopSchema);

export default laptopModels;