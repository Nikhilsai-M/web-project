import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

let db;

// Create and initialize the database
export async function initializeDatabase() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create supervisors table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS supervisors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create admins table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        security_token TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create customers table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create laptops table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS laptops (
        id INTEGER PRIMARY KEY,
        brand TEXT NOT NULL,
        series TEXT NOT NULL,
        processor_name TEXT NOT NULL,
        processor_generation TEXT NOT NULL,
        base_price REAL NOT NULL,
        discount INTEGER,
        ram TEXT NOT NULL,
        storage_type TEXT NOT NULL,
        storage_capacity TEXT NOT NULL,
        display_size REAL NOT NULL,
        weight REAL NOT NULL,
        condition TEXT NOT NULL,
        os TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create phones table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS phones (
        id INTEGER PRIMARY KEY,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        color TEXT NOT NULL,
        image TEXT NOT NULL,
        processor TEXT NOT NULL,
        display TEXT NOT NULL,
        battery INTEGER NOT NULL,
        camera TEXT NOT NULL,
        os TEXT NOT NULL,
        network TEXT NOT NULL,
        weight TEXT NOT NULL,
        ram TEXT NOT NULL,
        rom TEXT NOT NULL,
        base_price REAL NOT NULL,
        discount INTEGER,
        condition TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if any supervisors exist, add test ones if not
    const supervisorCount = await db.get('SELECT COUNT(*) as count FROM supervisors');
    
    if (supervisorCount.count === 0) {
      // Hash passwords
      const password1 = await bcrypt.hash('sv@123', 10);
      const password2 = await bcrypt.hash('sv@456', 10);
      
      await db.run(
        'INSERT INTO supervisors (employee_id, password, name) VALUES (?, ?, ?)',
        ['sv1', password1, 'test1']
      );
      
      await db.run(
        'INSERT INTO supervisors (employee_id, password, name) VALUES (?, ?, ?)',
        ['sv2', password2, 'test2']
      );
      
      console.log('Test supervisors added to database');
    }
    
    // Check if we have any admins, if not add the test ones
    const adminCount = await db.get('SELECT COUNT(*) as count FROM admins');
    
    if (adminCount.count === 0) {
      // Hash passwords
      const adminPassword1 = await bcrypt.hash('Admin@123', 10);
      const adminPassword2 = await bcrypt.hash('Admin@456', 10);
      
      // Insert test admins
      await db.run(
        'INSERT INTO admins (admin_id, password, security_token, name) VALUES (?, ?, ?, ?)',
        ['ADMIN001', adminPassword1, 'TOKEN001', 'admin1']
      );
      
      await db.run(
        'INSERT INTO admins (admin_id, password, security_token, name) VALUES (?, ?, ?, ?)',
        ['ADMIN002', adminPassword2, 'TOKEN002', 'admin2']
      );
      
      console.log('Test admins added to database');
    }
    
    // Check if any laptops exist, add initial data if not
    const laptopCount = await db.get('SELECT COUNT(*) as count FROM laptops');
    
    if (laptopCount.count === 0) {
      // Insert the sample laptop data
      await db.run(
        `INSERT INTO laptops (id, brand, series, processor_name, processor_generation, 
                             base_price, discount, ram, storage_type, storage_capacity, 
                             display_size, weight, condition, os, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [100, 'Acer', 'Aspire 3', 'Intel Core i3', '12th Gen', 45999, 10, '8GB', 
         'SSD', '512GB', 15.6, 1.7, 'Superb', 'Windows 11', 'images/buy-laptops/aspire3.webp']
      );
      
      await db.run(
        `INSERT INTO laptops (id, brand, series, processor_name, processor_generation, 
                             base_price, discount, ram, storage_type, storage_capacity, 
                             display_size, weight, condition, os, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [101, 'Acer', 'Aspire 5', 'Intel Core i5', '13th Gen', 57999, 12, '16GB', 
         'SSD', '512GB', 14, 1.6, 'Superb', 'Windows 11', 'images/buy-laptops/aspire5.webp']
      );
    }
    await db.run('DELETE FROM phones');
    // Check if any phones exist, add initial data if not
    const phoneCount = await db.get('SELECT COUNT(*) as count FROM phones');
    
    if (phoneCount.count === 0) {
      // Insert the sample phone data
      await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, 'OnePlus', 'Nord 2', 'Blue Haze', 'images/buy-page-phones/img11.webp', 'Snapdragon 8 Gen 1', 
         '6.43-inch Fluid AMOLED display', 4500, '48MP + 8MP + 50MP | 32MP Front Camera', 
         'Android 11', '5G', '200g', '12GB', '256GB', 27999, 50, 'Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [2, 'OnePlus', '8T 5G', 'Lunar Silver', 'images/buy-page-phones/img12.webp', 'Snapdragon 8 Gen 1', 
         '6.55-inch Fluid AMOLED display', 4500, '48MP + 8MP + 50MP | 32MP Front Camera', 
         'Android 11', '5G', '200g', '8GB', '128GB', 19999, 53, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [3, 'OnePlus', '10T 5G', 'Jade Green', 'images/buy-page-phones/img13.webp', 'Snapdragon 8 Gen 1', 
         '6.7-inch Fluid AMOLED display', 4800, '48MP + 8MP + 50MP | 32MP Front Camera', 
         'Android 12', '5G', '210g', '12GB', '256GB', 28999, 47, 'Superb']
    );
    

      await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [17, 'Google', 'Pixel 8', 'Hazel', 'images/buy-page-phones/img7.webp', 'Google Tensor G3', 
         '6.2-inch Full HD Plus display', 4575, '50MP + 8MP + 50MP | 10.5MP Front Camera', 
         'Android 14', '5G', '187g', '8GB', '256GB', 58999, 26, 'Superb']
      );
      await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [18, 'Google', 'Pixel 8', 'Mint', 'images/buy-page-phones/img8.webp', 'Google Tensor G3', 
         '6.2-inch Full HD Plus display', 4575, '50MP + 8MP + 50MP | 10.5MP Front Camera', 
         'Android 14', '5G', '187g', '8GB', '128GB', 52999, 45, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [19, 'Google', 'Pixel 8 Pro', 'Bay', 'images/buy-page-phones/img9.webp', 'Google Tensor G3', 
         '6.7-inch Full HD Plus display', 5050, '50MP + 8MP + 50MP | 10.5MP Front Camera', 
         'Android 14', '5G', '213g', '12GB', '128GB', 84999, 20, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [23, 'Apple', 'iPhone 13 (Green, 512 GB)', 'Green', 'images/buy-page-phones/i-13.webp', 'A15 Bionic Chip Processor', 
         '15.49 cm (6.1 inch) Super Retina XDR Display', 4200, '12MP + 12MP | 12MP Front Camera', 
         'iOS 15', '5G', '170g', '6GB', '512GB', 74999, 10, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [24, 'Apple', 'iPhone 15 Plus (Pink, 128 GB)', 'Pink', 'images/buy-page-phones/i-15plus.webp', 'A16 Bionic Chip,6 core Processor', 
         '17.02 cm (6.7 inch) Super Retina XDR OLED Display', 4700, '48MP + 12MP | 12MP Front Camera', 
         'iOS 17', '5G', '201g', '6GB', '128GB', 70999, 5, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [25, 'Apple', 'iPhone 15 Plus (Pink, 256 GB)', 'Pink', 'images/buy-page-phones/i-15plus.webp', 'A16 Bionic Chip,6 core Processor', 
         '17.02 cm (6.7 inch) Super Retina XDR OLED Display', 4700, '48MP + 12MP | 12MP Front Camera', 
         'iOS 17', '5G', '201g', '8GB', '256GB', 73999, 5, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [26, 'Apple', 'iPhone 15 Plus (Green, 128 GB)', 'Green', 'images/buy-page-phones/i-15plus-green.webp', 'A16 Bionic Chip,6 core Processor', 
         '17.02 cm (6.7 inch) Super Retina XDR OLED Display', 4700, '48MP + 12MP | 12MP Front Camera', 
         'iOS 17', '5G', '201g', '6GB', '128GB', 70999, 5, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [33, 'Lenovo', 'K8 Note (Venom Black, 64 GB)', 'Venom Black', 'images/buy-page-phones/l-k8.jpeg', 'Mediatek MTK X23', 
         '13.97 cm (5.5 inch) IPS Display', 4000, '13MP + 5MP | 13MP Front Camera', 
         'Android Nougat 7.1', '4G', '182g', '4GB', '64GB', 12999, 10, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [34, 'Lenovo', 'K8 Note (Gold, 32 GB)', 'Gold', 'images/buy-page-phones/l-k8-gold.webp', 'Mediatek MTK X23', 
         '13.97 cm (5.5 inch) IPS Display', 4000, '13MP + 5MP | 13MP Front Camera', 
         'Android Nougat 7.1', '4G', '182g', '3GB', '32GB', 7999, 10, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [35, 'Lenovo', 'A6 Note (Blue, 32 GB)', 'Blue', 'images/buy-page-phones/l-a6.webp', 'MediaTek P22 Octa Core Processor', 
         '15.5 cm (6.102 inch) HD+ Display', 4000, '13MP + 2MP | 5MP Front Camera', 
         'Android Pie 9.0', '4G', '182g', '3GB', '32GB', 9999, 10, 'Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [38, 'Xiaomi', '14 CIVI', 'Cruise Blue', 'images/buy-page-phones/Xiaomi 14CIVI.webp', 'Snapdragon 8s Gen3', 
         '6.55-inch Curved AMOLED Display', 4700, '32MP + 32MP | 32MP Front Camera', 
         'Android 14', '5G', '179.3g', '8GB', '256GB', 54999, 27, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [39, 'Xiaomi', '14 CIVI', 'Panda White', 'images/buy-page-phones/Xiaomi 14CIVI Panda White.webp', 'Snapdragon 8s Gen3', 
         '6.55-inch Curved AMOLED Display', 4700, '32MP + 32MP | 32MP Front Camera', 
         'Android 14', '5G', '179.3g', '12GB', '512GB', 59999, 25, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [40, 'Xiaomi', '11 Lite', 'Vinyl Black', 'images/buy-page-phones/Xiaomi 11Lite.webp', 'Snapdragon 732G', 
         '6.55-inch HD Display', 4250, '64MP + 8MP | 16MP Front Camera', 
         'Android 11', '4G', '157g', '8GB', '128GB', 25999, 7, 'Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [41, 'Xiaomi', '10T', 'Cosmic Black', 'images/buy-page-phones/Xiaomi 10T.webp', 'Snapdragon 865', 
         '6.67-inch Full HD Display', 5000, '64MP + 13MP | 20MP Front Camera', 
         'Android 10', '5G', '216g', '6GB', '128GB', 35999, 54, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [42, 'Xiaomi', '11i Hypercharge 5G', 'Purple Mist', 'images/buy-page-phones/Xiaomi 11i Hypercharge 5G.webp', 'Snapdragon 865', 
         '6.67-inch Full HD AMOLED Display', 4500, '108MP + 8MP | 16MP Front Camera', 
         'Android 11', '5G', '178g', '8GB', '128GB', 33999, 14, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [45, 'Vivo', 'V20 Pro', 'Midnight Jazz', 'images/buy-page-phones/vivo v20 pro.webp', 'Snapdragon 765G', 
         '6.44-inch Full HD + AMOLED Display', 4000, '64MP + 8MP + 2MP | 44MP Front Camera', 
         'Android 12', '5G', '176g', '8GB', '128GB', 34990, 66, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [46, 'Vivo', 'X50 Pro', 'Alpha Grey', 'images/buy-page-phones/vivo x50 pro.webp', 'Snapdragon 765G', 
         '6.56-inch Full HD + E3 AMOLED Display', 4315, '48MP + 13MP + 8MP | 32MP Front Camera', 
         'Android 14', '5G', '176g', '8GB', '256GB', 54990, 2, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [47, 'Vivo', 'T3 Pro 5G', 'Emerald Green', 'images/buy-page-phones/vivo t3 pro 5g emerald green.webp', 'Snapdragon 7 Gen3', 
         '6.77-inch Full HD + AMOLED Display', 5500, '50MP + 8MP | 16MP Front Camera', 
         'Android 14', '5G', '189g', '8GB', '128GB', 29999, 23, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [48, 'Vivo', 'T3 Pro 5G', 'Sandstone Orange', 'images/buy-page-phones/vivo t3 pro 5g sandstone orange.webp', 'Snapdragon 7 Gen3', 
         '6.77-inch Full HD + AMOLED Display', 5500, '50MP + 8MP | 16MP Front Camera', 
         'Android 14', '5G', '189g', '8GB', '128GB', 29999, 23, 'Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [56, 'Samsung', 'Galaxy S10 Lite', 'Prism White', 'images/buy-page-phones/galaxy s10 lite.webp', 'Exynos 9 9820', 
         '6.1-inch Dynamic AMOLED Display', 3400, '16MP + 12MP | 10MP Front Camera', 
         'Android Pie 9.0', '4G', '157g', '8GB', '512GB', 22800, 10, 'Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [57, 'Samsung', 'Galaxy Z Flip5', 'Cream', 'images/buy-page-phones/galaxy zflip5.webp', 'Snapdragon 8 Gen2', 
         '6.7-inch Dynamic AMOLED 2X Display', 3700, '12MP + 12MP | 10MP Front Camera', 
         'Android 13', '5G', '187g', '8GB', '512GB', 71999, 25, 'Very Good']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [58, 'Samsung', 'Galaxy S24 FE 5G', 'Blue', 'images/buy-page-phones/galaxy s24fe.webp', 'Exynos 2400e', 
         '6.7-inch Dynamic AMOLED 2X Display', 4700, '50MP + 12MP | 10MP Front Camera', 
         'Android 14', '5G', '213g', '8GB', '128GB', 49999, 33, 'Superb']
    );
    
    await db.run(
        `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [67, 'Realme', 'C61 (Marble Black, 128 GB)', 'Marble Black', 'images/buy-page-phones/realmec61.webp', 'T612 Octacore processor', 
         '17.13 cm (6.745 inch) HD+ Display', 5000, '32MP Rear Camera | 5MP Front Camera', 
         'Android 14', '4G', '187g', '6GB', '128GB', 10999, 25, 'Very Good']
    );
    await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [68, 'Realme', 'C63 (Leather Blue, 64 GB)', 'Leather Blue', 'images/buy-page-phones/realmec63.webp', 'T612 Octacore processor', 
       '17.13 cm (6.745 inch) HD+ Display', 5000, '50MP Rear Camera | 8MP Front Camera', 
       'Android 14', '5G', '191g', '4GB', '64GB', 9999, 15, 'Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [69, 'Realme', 'P2 Pro 5G (Parrot Green, 512 GB)', 'Parrot Green', 'images/buy-page-phones/realmep2pro.webp', 'Snapdragon 7s Gen2 processor', 
       '17.02 cm (6.7 inch) Full HD+ Display', 5200, '50MP + 8MP | 32MP Front Camera', 
       'Android 14', '5G', '180g', '12GB', '512GB', 30999, 25, 'Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [77, 'Motorola', 'G73 5G (Lucent White, 128 GB)', 'Lucent White', 'images/buy-page-phones/motog73.webp', 'MediaTek Dimensity 930 Processor', 
       '16.51 cm (6.5 inch) Full HD+ Display', 5000, '50MP + 8MP | 16MP Front Camera', 
       'Android 13', '5G', '181g', '8GB', '128GB', 18999, 20, 'Very Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [78, 'Motorola', 'G62 5G (Midnight Gray, 128 GB)', 'Midnight Gray', 'images/buy-page-phones/motog62.webp', 'Qualcomm Snapdragon 695 Processor', 
       '16.94 cm (6.67 inch) Full HD+ Display', 5000, '50MP + 8MP + 2MP | 16MP Front Camera', 
       'Android 12', '5G', '184g', '6GB', '128GB', 17999, 22, 'Superb']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [79, 'Motorola', 'G82 5G (Meteorite Gray, 128 GB)', 'Meteorite Gray', 'images/buy-page-phones/motog82.webp', 'Qualcomm Snapdragon 695 Processor', 
       '16.76 cm (6.6 inch) Full HD+ AMOLED Display', 5000, '50MP + 8MP + 2MP | 16MP Front Camera', 
       'Android 12', '5G', '173g', '6GB', '128GB', 21999, 18, 'Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [87, 'Nothing', 'Phone 2 (White, 256 GB)', 'White', 'images/buy-page-phones/nothingphone2.webp', 'Qualcomm Snapdragon 8+ Gen 1 Processor', 
       '17.02 cm (6.7 inch) Full HD+ LTPO OLED Display', 4700, '50MP + 50MP | 32MP Front Camera', 
       'Android 13', '5G', '201g', '12GB', '256GB', 44999, 15, 'Very Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [88, 'Nothing', 'Phone 1 (Black, 128 GB)', 'Black', 'images/buy-page-phones/nothingphone1.webp', 'Qualcomm Snapdragon 778G+ Processor', 
       '16.63 cm (6.55 inch) Full HD+ OLED Display', 4500, '50MP + 50MP | 16MP Front Camera', 
       'Android 12', '5G', '193.5g', '8GB', '128GB', 29999, 20, 'Good']
  );
  
  await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [89, 'Nothing', 'Phone 2 (Dark Gray, 512 GB)', 'Dark Gray', 'images/buy-page-phones/nothingphone2gray.webp', 'Qualcomm Snapdragon 8+ Gen 1 Processor', 
       '17.02 cm (6.7 inch) Full HD+ LTPO OLED Display', 4700, '50MP + 50MP | 32MP Front Camera', 
       'Android 13', '5G', '201g', '12GB', '512GB', 49999, 10, 'Good']
  );
      console.log('Initial phone data added to database');
    }
    
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Function to get the database connection
export async function getDb() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}

// Laptop data functions
export async function getAllLaptops() {
  try {
    const db = await getDb();
    const laptops = await db.all('SELECT * FROM laptops');
    
    // Transform the flat data structure back to the nested structure expected by the frontend
    return laptops.map(laptop => ({
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity
        }
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image
    }));
  } catch (error) {
    console.error('Error getting laptops:', error);
    throw error;
  }
}

export async function getLaptopById(id) {
  try {
    const db = await getDb();
    const laptop = await db.get('SELECT * FROM laptops WHERE id = ?', [id]);
    
    if (!laptop) {
      return null;
    }
    
    // Transform to the expected structure
    return {
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity
        }
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image
    };
  } catch (error) {
    console.error('Error getting laptop by id:', error);
    throw error;
  }
}

export async function addLaptop(laptopData) {
  try {
    const db = await getDb();
    
    const result = await db.run(
      `INSERT INTO laptops (id, brand, series, processor_name, processor_generation, 
                           base_price, discount, ram, storage_type, storage_capacity, 
                           display_size, weight, condition, os, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        laptopData.id,
        laptopData.brand,
        laptopData.series,
        laptopData.processor.name,
        laptopData.processor.generation,
        laptopData.pricing.basePrice,
        laptopData.pricing.discount,
        laptopData.memory.ram,
        laptopData.memory.storage.type,
        laptopData.memory.storage.capacity,
        laptopData.displaysize,
        laptopData.weight,
        laptopData.condition,
        laptopData.os,
        laptopData.image
      ]
    );
    
    return { success: true, id: laptopData.id };
  } catch (error) {
    console.error('Error adding laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function updateLaptop(id, laptopData) {
  try {
    const db = await getDb();
    
    await db.run(
      `UPDATE laptops SET 
        brand = ?, 
        series = ?, 
        processor_name = ?, 
        processor_generation = ?, 
        base_price = ?, 
        discount = ?, 
        ram = ?, 
        storage_type = ?, 
        storage_capacity = ?, 
        display_size = ?, 
        weight = ?, 
        condition = ?, 
        os = ?, 
        image = ? 
      WHERE id = ?`,
      [
        laptopData.brand,
        laptopData.series,
        laptopData.processor.name,
        laptopData.processor.generation,
        laptopData.pricing.basePrice,
        laptopData.pricing.discount,
        laptopData.memory.ram,
        laptopData.memory.storage.type,
        laptopData.memory.storage.capacity,
        laptopData.displaysize,
        laptopData.weight,
        laptopData.condition,
        laptopData.os,
        laptopData.image,
        id
      ]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteLaptop(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM laptops WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting laptop:', error);
    return { success: false, message: error.message };
  }
}

// Phone data functions
export async function getAllPhones() {
  try {
    const db = await getDb();
    const phones = await db.all('SELECT * FROM phones');
    
    return phones.map(phone => ({
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      color: phone.color,
      image: phone.image,
      specs: {
        processor: phone.processor,
        display: phone.display,
        battery: phone.battery,
        camera: phone.camera,
        os: phone.os,
        network: phone.network,
        weight: phone.weight
      },
      ram: phone.ram,
      rom: phone.rom,
      pricing: {
        basePrice: phone.base_price,
        discount: phone.discount
      },
      condition: phone.condition
    }));
  } catch (error) {
    console.error('Error getting phones:', error);
    throw error;
  }
}

export async function getPhoneById(id) {
  try {
    const db = await getDb();
    const phone = await db.get('SELECT * FROM phones WHERE id = ?', [id]);
    
    if (!phone) {
      return null;
    }
    
    return {
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      color: phone.color,
      image: phone.image,
      specs: {
        processor: phone.processor,
        display: phone.display,
        battery: phone.battery,
        camera: phone.camera,
        os: phone.os,
        network: phone.network,
        weight: phone.weight
      },
      ram: phone.ram,
      rom: phone.rom,
      pricing: {
        basePrice: phone.base_price,
        discount: phone.discount
      },
      condition: phone.condition
    };
  } catch (error) {
    console.error('Error getting phone by id:', error);
    throw error;
  }
}

export async function addPhone(phoneData) {
  try {
    const db = await getDb();
    
    const result = await db.run(
      `INSERT INTO phones (id, brand, model, color, image, processor, display, battery, camera, os, network, weight, ram, rom, base_price, discount, condition) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        phoneData.id,
        phoneData.brand,
        phoneData.model,
        phoneData.color,
        phoneData.image,
        phoneData.specs.processor,
        phoneData.specs.display,
        phoneData.specs.battery,
        phoneData.specs.camera,
        phoneData.specs.os,
        phoneData.specs.network,
        phoneData.specs.weight,
        phoneData.ram,
        phoneData.rom,
        phoneData.pricing.basePrice,
        phoneData.pricing.discount,
        phoneData.condition
      ]
    );
    
    return { success: true, id: phoneData.id };
  } catch (error) {
    console.error('Error adding phone:', error);
    return { success: false, message: error.message };
  }
}

export async function updatePhone(id, phoneData) {
  try {
    const db = await getDb();
    
    await db.run(
      `UPDATE phones SET 
        brand = ?, 
        model = ?, 
        color = ?, 
        image = ?, 
        processor = ?, 
        display = ?, 
        battery = ?, 
        camera = ?, 
        os = ?, 
        network = ?, 
        weight = ?, 
        ram = ?, 
        rom = ?, 
        base_price = ?, 
        discount = ?, 
        condition = ? 
      WHERE id = ?`,
      [
        phoneData.brand,
        phoneData.model,
        phoneData.color,
        phoneData.image,
        phoneData.specs.processor,
        phoneData.specs.display,
        phoneData.specs.battery,
        phoneData.specs.camera,
        phoneData.specs.os,
        phoneData.specs.network,
        phoneData.specs.weight,
        phoneData.ram,
        phoneData.rom,
        phoneData.pricing.basePrice,
        phoneData.pricing.discount,
        phoneData.condition,
        id
      ]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating phone:', error);
    return { success: false, message: error.message };
  }
}

export async function deletePhone(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM phones WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phone:', error);
    return { success: false, message: error.message };
  }
}

// Customer authentication functions
export async function createCustomer(firstName, lastName, email, phone, password) {
  try {
    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM customers WHERE email = ?', [email]);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Generate a unique user ID
    const userId = 'user_' + Date.now();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new customer
    await db.run(
      'INSERT INTO customers (user_id, first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, firstName, lastName, email, phone, hashedPassword]
    );
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, message: 'Database error' };
  }
}



export async function authenticateCustomer(email, password) {
  try {
    const db = await getDb();
    
    // Find the user by email
    const user = await db.get('SELECT * FROM customers WHERE email = ?', [email]);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }
    
    // Return user data without the password
    const { password: _, ...userData } = user;
    return { success: true, user: userData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication error' };
  }
}