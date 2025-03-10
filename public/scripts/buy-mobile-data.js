const mobilePhones = [
    {
        id: 1,
        brand: "Apple",
        model: "iPhone 14",
        baseImage: "iphone14.jpg",
        color: "Midnight",
        specs: {
            processor: "A15 Bionic",
            display: "6.1-inch Super Retina XDR",
            battery: "3279 mAh",
            camera: "12MP + 12MP | 12MP Front Camera",
            os: "iOS 16",
            network: "5G",
            weight: "172g"
        },
        variants: {
            "4GB/128GB": { price: { likeNew: 699, veryGood: 649, good: 599 } },
            "6GB/256GB": { price: { likeNew: 899, veryGood: 849, good: 799 } }
        }
    },
    {
        id: 2,
        brand: "Samsung",
        model: "Galaxy S22",
        baseImage: "galaxy_s22.jpg",
        color: "Phantom Black",
        specs: {
            processor: "Snapdragon 8 Gen 1",
            display: "6.1-inch Dynamic AMOLED",
            battery: "3700 mAh",
            camera: "50MP + 10MP + 12MP | 10MP Front Camera",
            os: "Android 12",
            network: "5G",
            weight: "167g"
        },
        variants: {
            "8GB/128GB": { price: { likeNew: 799, veryGood: 749, good: 699 } },
            "8GB/256GB": { price: { likeNew: 899, veryGood: 849, good: 799 } }
        }
    }
];
