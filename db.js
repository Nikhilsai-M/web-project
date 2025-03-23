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
      filename: ":memory:",
      driver: sqlite3.Database
    });
    
    // Create supervisors table with new schema
    await db.exec(`
          CREATE TABLE IF NOT EXISTS supervisors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);
    
    // Create supervisor_activity table (for tracking actions, as previously defined)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS supervisor_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supervisor_id TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create admins table
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
    
    // Create customers table
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
    // Add columns if they don't exist (for existing databases)
    await db.exec(`
      ALTER TABLE customers ADD COLUMN orders_count INTEGER DEFAULT 0;
    `).catch(() => {});
    await db.exec(`
      ALTER TABLE customers ADD COLUMN items_sold_count INTEGER DEFAULT 0;
    `).catch(() => {});
    await db.exec(`
      ALTER TABLE customers ADD COLUMN password_last_changed DATETIME DEFAULT CURRENT_TIMESTAMP;
    `).catch(() => {});
    
    // Create laptops table
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
    
    // Create phones table
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

    await db.exec(`
      CREATE TABLE IF NOT EXISTS phone_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        ram TEXT NOT NULL,
        rom TEXT NOT NULL,
        processor TEXT NOT NULL,
        network TEXT NOT NULL,
        size TEXT,
        weight TEXT,
        device_age TEXT NOT NULL,
        switching_on TEXT NOT NULL,
        phone_calls TEXT NOT NULL,
        cameras_working TEXT NOT NULL,
        battery_issues TEXT NOT NULL,
        physically_damaged TEXT NOT NULL,
        sound_issues TEXT NOT NULL,
        location TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        battery TEXT NOT NULL,          -- New column
        camera TEXT NOT NULL,           -- New column
        os TEXT NOT NULL,               -- New column
        image_path TEXT,
        status TEXT DEFAULT 'pending',
        rejection_reason TEXT,
        price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

// Update laptop_applications table
await db.exec(`
  CREATE TABLE IF NOT EXISTS laptop_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    ram TEXT NOT NULL,
    storage TEXT NOT NULL,
    processor TEXT NOT NULL,
    generation TEXT,
    display_size TEXT,
    weight TEXT,
    os TEXT,
    device_age TEXT,
    battery_issues TEXT,
    location TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    image_path TEXT,
    status TEXT DEFAULT 'pending',
    rejection_reason TEXT,
    price REAL,  -- New column for price
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
 
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS earphones (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        brand TEXT NOT NULL,
        original_price REAL NOT NULL,
        discount TEXT NOT NULL,
        design TEXT NOT NULL,
        battery_life TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS chargers (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          image TEXT NOT NULL,
          brand TEXT NOT NULL,
          wattage TEXT NOT NULL,
          type TEXT NOT NULL,
          originalPrice REAL NOT NULL,
          discount TEXT NOT NULL,
          outputCurrent TEXT NOT NULL
    )
      `);
  
      await db.exec(`
        CREATE TABLE IF NOT EXISTS mouses (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          image TEXT NOT NULL,
          brand TEXT NOT NULL,
          original_price REAL NOT NULL,
          discount TEXT NOT NULL,
          type TEXT NOT NULL,
          connectivity TEXT NOT NULL,
          resolution TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.exec(`
        CREATE TABLE IF NOT EXISTS smartwatches (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          image TEXT NOT NULL,
          brand TEXT NOT NULL,
          original_price REAL NOT NULL,
          discount TEXT NOT NULL,
          display_size TEXT NOT NULL,
          display_type TEXT NOT NULL,
          battery_runtime TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
   
    // Check if any supervisors exist, add test ones if not
    const supervisorCount = await db.get('SELECT COUNT(*) as count FROM supervisors');
    
    if (supervisorCount.count === 0) {
      // Hash passwords
      const password1 = await bcrypt.hash('Supervisor@123', 10);
      const password2 = await bcrypt.hash('Supervisor@456', 10);
      
      await db.run(
        'INSERT INTO supervisors (user_id, first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['supervisor_1', 'John', 'Smith', 'john.smith@ecommerce.com', '1234567890', 'jsmith', password1]
      );
      
      await db.run(
        'INSERT INTO supervisors (user_id, first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['supervisor_2', 'Emily', 'Johnson', 'emily.johnson@ecommerce.com', '0987654321', 'ejohnson', password2]
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
    


    const mouseCount = await db.get('SELECT COUNT(*) as count FROM mouses');

if (mouseCount.count === 0) {
  // Insert the sample mouse data
  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["logitech_m196_202", "Logitech M196 Wireless Optical Mouse with Bluetooth", "images/accessories/mouses/Logitech M196.webp", "Logitech", 1125, "20%", "Wireless", "Bluetooth & USB", "4600"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["logitech_g502_303", "Logitech G502 Hero / Hero 25K Sensor, Adj DPI Upto 25600, RGB, 11 Programmable Buttons Wired Optical Gaming Mouse", "images/accessories/mouses/Logotech G502 Hero.webp", "Logitech", 5495, "25%", "Wired", "USB", "5600"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["arctic_fox_breathing_404", "Arctic Fox Breathing Lights and DPI Upto 3600 Wired Optical Gaming Mouse", "images/accessories/mouses/Arctic Fox Breathing Lights.webp", "Arctic Fox", 599, "35%", "Wired", "USB", "3600"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["zebronics_jaguar_606", "ZEBRONICS Zeb-Jaguar Wireless Optical Mouse", "images/accessories/mouses/Zebronics Zeb Jaguar.webp", "ZEBRONICS", 1190, "39%", "Wireless", "USB", "1700"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["zebronics_rise_707", "ZEBRONICS ZEB-RISE Wired Optical Mouse", "images/accessories/mouses/Zebronics Zeb Rise.webp", "ZEBRONICS", 699, "19%", "Wired", "USB", "1200"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["zebronics_blanc_808", "ZEBRONICS Zeb-Blanc /Dual Mode,Type C rechargeable built-in battery,upto 1600 DPI Wireless Optical Mouse", "images/accessories/mouses/Zebronics Zeb Blanc.webp", "ZEBRONICS", 999, "15%", "Wireless", "Bluetooth & USB", "1600"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["dell_ms116_909", "DELL MS 116-BK Wired Optical Mouse", "images/accessories/mouses/Dell MS 116-BK.webp", "DELL", 650, "30%", "Wired", "USB", "1000"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["hp_m160_1010", "HP M160 Wired Optical Gaming Mouse", "images/accessories/mouses/HP M160.webp", "HP", 799, "40%", "Wired", "USB", "1000"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["hp_z3700_1111", "HP Z3700 /Slim form with USB receiver,16 month battery life, 1200DPI Wireless Optical Mouse", "images/accessories/mouses/HP Z3700.webp", "HP", 1499, "30%", "Wireless", "USB", "1200"]
  );

  await db.run(
    `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["logitech_b175_101", "Logitech B175 / Optical Tracking, 12-Months Battery Life, Ambidextrous Wireless Optical Mouse", "images/accessories/mouses/Logitech B175.webp", "Logitech", 995, "49%", "Wireless", "USB", "3000"]
  );
}
    // Check if any phones exist, add initial data if not
    const phoneCount = await db.get('SELECT COUNT(*) as count FROM phones');
    
    
    const chargercount=await db.get('SELECT COUNT(*) as count FROM chargers');
    if(chargercount.count===0){
      await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg001", "Apple 20W USB-C Power Adapter", "images/accessories/chargers/apple_20w.webp", "Apple", "20", "USB C", 1900, "10%", "3A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg002", "Samsung 25W Fast Charger", "images/accessories/chargers/samsung_25.webp", "Samsung", "25", "USB C", 1800, "15%", "2.5A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg003", "RoarX 33 W SuperVOOC 6 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)", "images/accessories/chargers/roar_33v.webp", "RoarX", "33", "USB C", 2999, "87%", "6A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg004", "EYNK 44 W Quick Charge 5 A Wall Charger for Mobile with Detachable Cable  (Supported All Flash Charge 2.0 devices, White, Cable Included)", "images/accessories/chargers/eynk_44.webp", "EYNK", "44", "USB C", 2999, "71%", "5A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg005", "Pacificdeals 44 W Supercharge 4 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)", "images/accessories/chargers/PACIFIC.webp", "Pacificdeals", "44", "USB C", 1999, "63%", "4A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg006", "SB 80 W SuperVOOC 7.3 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)", "images/accessories/chargers/sb_80.webp", "SB", "80", "USB C", 2499, "86%", "7.3A"]  
    );  
    
    await db.run(  
        `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
        ["chg007", "Apple Lightning Cable 2 m MW2R3ZM/A  (Compatible with Mobile, Tablet, White)", "images/accessories/chargers/apple_light.webp", "Apple", "20", "lightning", 2900, "0%", "3A"]  
    );  
    }

    const smartwatchCount = await db.get('SELECT COUNT(*) as count FROM smartwatches');

if (smartwatchCount.count === 0) {
  // Insert the sample smartwatch data
  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw1", "Apple Watch Series 8, 41mm GPS + Cellular ECG app, Temperature sensor, Crash Detection", "images/accessories/smartwatches/Apple Watch Series8.webp", "Apple", 55900, "5%", "41", "Retina Display", "18"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw2", "Apple Watch Series 10 GPS 46mm Silver Aluminium with Denim Sport Band", "images/accessories/smartwatches/Apple Watch Series10.webp", "Apple", 49900, "15%", "46", "Retina Display", "18"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw3", "Apple Watch Series 9 GPS 45mm Aluminium Case with Sport Band - S/M", "images/accessories/smartwatches/Apple Watch Series9.webp", "Apple", 59900, "18%", "45", "Retina Display", "18"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw8", "Fire-Boltt Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch", "images/accessories/smartwatches/Fire-Boltt Ninja.webp", "Fire-Boltt", 1999, "50%", "46.5", "HD Display", "5"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw9", "Fire-Boltt Hurricane 33.02mm (1.3) Curved Glass Display with BT Calling, 100+ Sports Modes Smartwatch", "images/accessories/smartwatches/Fire-Boltt Hurricane.webp", "Fire-Boltt", 8999, "86%", "33.02", "Retina HD Color Display", "15"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw12", "Fire-Boltt Blizzard 32.5mm (1.28) Luxury watch with BT Calling, Stainless Steel Body Smartwatch", "images/accessories/smartwatches/Fire-Boltt Blizzard.webp", "Fire-Boltt", 19999, "93%", "32.5", "circular 1.28 inch HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw13", "Fire-Boltt Gladiator 49.7mm Display, Stainless Steel, Bluetooth Call, 123 sports modes Smartwatch", "images/accessories/smartwatches/Fire-Boltt Gladiator.webp", "Fire-Boltt", 9999, "87%", "49.7", "HD display", "15"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw14", "Fire-Boltt Clickk 54.1mm (2.12 inch) AMOLED Display, Front Camera, Nano SIM Slot, 1000mAh Smartwatch", "images/accessories/smartwatches/Fire-Boltt Clickk.webp", "Fire-Boltt", 24999, "84%", "54.1", "AMOLED display", "5"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw16", "boAt Wave Fury with 1.83'' HD Display, Bluetooth Calling & Functional Crown Smartwatch", "images/accessories/smartwatches/boAt Wave Fury.webp", "boAt", 6999, "64%", "48", "HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw17", "boAt Storm Call 3 Plus w/ Turn by Turn Navigation, QR Tray, 4.97cm(1.96'') HD Display Smartwatch", "images/accessories/smartwatches/boAt Storm.webp", "boAt", 7499, "84%", "49", "HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw18", "boAt Lunar Discovery w/ Turn by Turn Navigation, 3.53 cm HD Display & BT Calling Smartwatch", "images/accessories/smartwatches/boAt Lunar Discovery.webp", "boAt", 8499, "83%", "35.3", "HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw23", "Noise Icon 2 1.8'' Display with Bluetooth Calling, Women's Edition, AI Voice Assistant Smartwatch", "images/accessories/smartwatches/Noise Icon2.webp", "Noise", 5999, "80%", "48", "HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw24", "Noise Colorfit Icon 2 1.8'' Display with Bluetooth Calling, AI Voice Assistant Smartwatch", "images/accessories/smartwatches/Noise Colorfit Icon2.webp", "Noise", 5999, "81%", "48", "HD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw25", "Noise Loop 1.85'' Display with Advanced Bluetooth Calling, 550 Nits Brightness Smartwatch", "images/accessories/smartwatches/Noise Loop.webp", "Noise", 6999, "85%", "49", "TFT LCD display", "7"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw31", "SAMSUNG Galaxy Fit3 | AMOLED Display & Aluminium Body | Upto 13Day Battery | 5ATM & IP68", "images/accessories/smartwatches/Samsung Galaxy Fit3.webp", "Samsung", 9999, "65%", "40.64", "AMOLED display", "13"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw32", "SAMSUNG Galaxy Watch FE, 40mm BT, Sapphire Crystal Display, Sleep Coach, Fall Detection", "images/accessories/smartwatches/Samsung Galaxy WatchFE.webp", "Samsung", 29999, "66%", "40", "Sapphire Crystal display", "40"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw33", "SAMSUNG Watch7 40mm BT", "images/accessories/smartwatches/Samsung Watch7.webp", "Samsung", 32999, "10%", "40", "AMOLED display", "20"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw34", "SAMSUNG Galaxy Watch6 Bluetooth", "images/accessories/smartwatches/Samsung Galaxy Watch6.webp", "Samsung", 36999, "56%", "44", "AMOLED display", "40"]
  );

  await db.run(
    `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ["sw35", "SAMSUNG Galaxy Watch Ultra LTE", "images/accessories/smartwatches/Samsung Galaxy Ultra.webp", "Samsung", 69999, "14%", "47", "AMOLED display", "20"]
  );
}
    const earphoneCount=await db.get('SELECT COUNT(*) as count FROM earphones');
    if(earphoneCount.count ===0) {
      

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'boat_airdopes_456',
          'boAt Airdopes 181 Pro w/ 100 HRS Playback, 4 Mics ENx Technology & ASAP Charge Bluetooth  (Frosted Mint, True Wireless)',
          'images/accessories/earphones/boat_airdopes.webp',
          'Boat',
          4990,
          '81%',
          'Earbuds',
          '100',
        ]
      );

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'boult_y1_789',
          'Boult Y1 with Zen ENC Mic, 50H Battery, Fast Charging, Pro+ Calling, Knurled Design Bluetooth  (Black, True Wireless)',
          'images/accessories/earphones/boult_y1.webp',
          'Boult',
          5499,
          '85%',
          'Earbuds',
          '50',
        ]
      );
      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'oneplus_bullet_404',
          'OnePlus Bullets Wireless Z2 Bluetooth 5.0 in Ear Earphones, Bombastic Bass E310A Bluetooth  (Blue, In the Ear)',
          'images/accessories/earphones/oneplus_bullet.webp',
          'OnePlus',
          2999,
          '10%',
          'behind the neck',
          '50',
        ]
      );

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'realme_neo_505',
          'realme Buds Air Neo Bluetooth  (White, True Wireless)',
          'images/accessories/earphones/realme_neo.webp',
          'realme',
          3999,
          '25%',
          'Earbuds',
          '17',
        ]
      );

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'realme_t110_606',
          'realme Buds T110 (RMA2306) with AI ENC for calls, 38 hours of Playback and Deep Bass Bluetooth  (Jazz Blue, True Wireless)',
          'images/accessories/earphones/realme_t110.webp',
          'realme',
          2999,
          '63%',
          'Earbuds',
          '38',
        ]
      );

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'realme_neckneo_707',
          'realme Buds Wireless 3 Neo with 13.4mm Driver, 32 hrs Playback, Dual Device Connection Bluetooth  (Black, In the Ear)',
          'images/accessories/earphones/realme_neckneo.webp',
          'realme',
          2499,
          '60%',
          'behind the neck',
          '32',
        ]
      );

      await db.run(
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'samsung_sm_808',
          'SAMSUNG SM-R400NZ Bluetooth  (Graphite, True Wireless)',
          'images/accessories/earphones/samsung_sm.webp',
          'SAMSUNG',
          12999,
          '52%',
          'Earbuds',
          '43',
        ]
      );
      await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'noise_vs_222',  
            'Noise Buds VS102 Plus with 70 Hrs Playtime, Environmental Noise Cancellation, Quad Mic Bluetooth  (Deep Wine, True Wireless)',  
            'images/accessories/earphones/noise_vs.webp',  
            'Noise',  
            3999,  
            '75%',  
            'Earbuds',  
            '70',  
        ]  
    );  
    
    await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'noise_airwave_333',  
            'Noise Airwave Pro with ANC, 60 Hrs of Playtime, Low latency(Up to 40ms), 3 EQ Modes Bluetooth  (Metallic Blue, In the Ear)',  
            'images/accessories/earphones/noise_airwave.webp',  
            'Noise',  
            3999,  
            '62%',  
            'behind the neck',  
            '60',  
        ]  
    );  
    
    await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'portronics_s16_444',  
            'Portronics Twins S16 in Ear Earbuds Bluetooth  (Green, In the Ear)',  
            'images/accessories/earphones/portronics_s16.webp',  
            'Portronics',  
            1999,  
            '62%',  
            'Earbuds',  
            '24',  
        ]  
    );  
    
    await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'portronics_s5_555',  
            'Portronics Harmonics Twins S5 Smart TWS Earbuds,15Hrs Playtime, LED Display, Game Mode,5.2v Bluetooth  (Black, In the Ear)',  
            'images/accessories/earphones/portronics_s5.webp',  
            'Portronics',  
            2999,  
            '82%',  
            'Earbuds',  
            '15',  
        ]  
    );  
    
    await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'jbl_beam_888',  
            'JBL Wave Beam TWS, 32Hr Playtime, IP54, Smart Ambient & TalkThru Mode, JBL App Bluetooth  (Beige, In the Ear)',  
            'images/accessories/earphones/jbl_beam.webp',  
            'JBL',  
            4999,  
            '50%',  
            'Earbuds',  
            '32',  
        ]  
    );  
    
    await db.run(  
        `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life)   
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,  
        [  
            'jbl_125bt_999',  
            'JBL Tune 125BT Flex Neckband with 16 Hour Playtime, Quick Charge, Multipoint Connect Bluetooth  (Grey, In the Ear)',  
            'images/accessories/earphones/jbl_125bt.webp',  
            'JBL',  
            2999,  
            '33%',  
            'behind the neck',  
            '16',  
        ]  
    );  

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

export async function authenticateSupervisor(username, password) {
  try {
    const db = await getDb();
    
    console.log(`Attempting to authenticate supervisor with username: ${username}`);
    
    const supervisor = await db.get('SELECT * FROM supervisors WHERE username = ?', [username]);
    
    if (!supervisor) {
      console.log(`No supervisor found with username: ${username}`);
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Supervisor found: ${JSON.stringify(supervisor)}`);
    
    const passwordMatch = await bcrypt.compare(password, supervisor.password);
    
    if (!passwordMatch) {
      console.log(`Password does not match for username: ${username}`);
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Authentication successful for username: ${username}`);
    const { password: _, ...supervisorData } = supervisor;
    return { success: true, supervisor: supervisorData };
  } catch (error) {
    console.error('Supervisor authentication error:', error);
    return { success: false, message: 'Authentication error' };
  }
}

// Supervisor password update function
export async function updateSupervisorPassword(userId, newPassword) {
  try {
    const db = await getDb();
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.run(
      'UPDATE supervisors SET password = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating supervisor password:', error);
    return { success: false, message: error.message };
  }
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
    let Base_Price=(laptopData.basePrice*1.2)/(1-(laptopData.discount/100));

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
              laptopData.processorName,
              laptopData.processorGeneration,
              Base_Price.toFixed(0),
              laptopData.discount,
              laptopData.ram,
              laptopData.storage_type,
              laptopData.storage_capacity,
              laptopData.display_size,
              laptopData.weight,
              laptopData.condition,
              laptopData.os,
              laptopData.image
          ]
      );
      console.log(' laptop added');
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
              phoneData.processor,
              phoneData.display,
              phoneData.battery,
              phoneData.camera,
              phoneData.os,
              phoneData.network,
              phoneData.weight,
              phoneData.ram,
              phoneData.rom,
              phoneData.basePrice,
              phoneData.discount,
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
        phoneData.processor,
        phoneData.display,
        phoneData.battery,
        phoneData.camera,
        phoneData.os,
        phoneData.network,
        phoneData.weight,
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
      'INSERT INTO customers (user_id, first_name, last_name, email, phone, password, orders_count, items_sold_count, password_last_changed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, firstName, lastName, email, phone, hashedPassword, 0, 0, new Date().toISOString()]
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
export async function createPhoneApplication(applicationData) {
  try {
    const db = await getDb();

    const result = await db.run(
      `INSERT INTO phone_applications (
        user_id, brand, model, ram, rom, processor, network, size, weight, 
        device_age, switching_on, phone_calls, cameras_working, battery_issues, 
        physically_damaged, sound_issues, location, email, phone, battery, camera, os, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationData.userId || null,
        applicationData.brand,
        applicationData.model,
        applicationData.ram,
        applicationData.rom,
        applicationData.processor,
        applicationData.network,
        applicationData.size || '',
        applicationData.weight || '',
        applicationData.deviceAge,
        applicationData.switchingOn,
        applicationData.phoneCalls,
        applicationData.camerasWorking,
        applicationData.batteryIssues,
        applicationData.physicallyDamaged,
        applicationData.soundIssues,
        applicationData.location,
        applicationData.email,
        applicationData.phone,
        applicationData.battery,        // New field
        applicationData.camera,         // New field
        applicationData.os,             // New field
        applicationData.imagepath || '',
      ]
    );

    return { success: true, id: result.lastID };
  } catch (error) {
    console.error('Error creating phone application:', error);
    return { success: false, message: error.message };
  }
}
export async function getAllPhoneApplications() {
  try {
    const db = await getDb();
    const applications = await db.all('SELECT * FROM phone_applications ORDER BY created_at DESC');
    return applications;
  } catch (error) {
    console.error('Error getting phone applications:', error);
    throw error;
  }
}

export async function getPhoneApplicationsByUserId(userId) {
  try {
    const db = await getDb();
    const applications = await db.all(
      'SELECT * FROM phone_applications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    console.log(`Fetched ${applications.length} phone applications for user ${userId}`);
    return applications;
  } catch (error) {
    console.error('Error getting user phone applications:', error.message, error.stack);
    throw error;
  }
}


export async function getPhoneApplicationById(id) {
  try {
    const db = await getDb();
    const application = await db.get('SELECT * FROM phone_applications WHERE id = ?', [id]);
    return application;
  } catch (error) {
    console.error('Error getting phone application by id:', error);
    throw error;
  }
}

export async function updatePhoneApplicationStatus(id, status, rejectionReason = null, price = null) {
  try {
    const db = await getDb();
    await db.run(
      'UPDATE phone_applications SET status = ?, rejection_reason = ?, price = ? WHERE id = ?',
      [status, rejectionReason, price, id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating phone application status:', error);
    return { success: false, message: error.message };
  }
}


export async function deletePhoneApplication(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM phone_applications WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting phone application:', error);
    return { success: false, message: error.message };
  }
}

export async function createLaptopApplication(applicationData) {
  try {
    const db = await getDb();

    const result = await db.run(
      `INSERT INTO laptop_applications (
        user_id, brand, model, ram, storage, processor, generation, display_size, 
        weight, os, device_age, battery_issues, location, name, email, phone, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationData.userId || null,
        applicationData.brand,
        applicationData.model,
        applicationData.ram,
        applicationData.storage,
        applicationData.processor,
        applicationData.generation || '',
        applicationData.displaySize || '',
        applicationData.weight || '',
        applicationData.os || '',
        applicationData.deviceAge || '',
        applicationData.batteryIssues || '',
        applicationData.location,
        applicationData.name,
        applicationData.email,
        applicationData.phone,
        applicationData.imagepath || '', // Cloudinary URL
      ]
    );

    return { success: true, id: result.lastID };
  } catch (error) {
    console.error('Error creating laptop application:', error);
    return { success: false, message: error.message };
  }
}

export async function getAllLaptopApplications() {
  try {
    const db = await getDb();
    const applications = await db.all('SELECT * FROM laptop_applications ORDER BY created_at DESC');
    return applications;
  } catch (error) {
    console.error('Error getting laptop applications:', error);
    throw error;
  }
}

export async function getLaptopApplicationsByUserId(userId) {
  try {
    const db = await getDb();
    const applications = await db.all(
      'SELECT * FROM laptop_applications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    console.log(`Fetched ${applications.length} laptop applications for user ${userId}`);
    return applications;
  } catch (error) {
    console.error('Error getting user laptop applications:', error.message, error.stack);
    throw error;
  }
}

export async function getLaptopApplicationById(id) {
  try {
    const db = await getDb();
    const application = await db.get('SELECT * FROM laptop_applications WHERE id = ?', [id]);
    return application;
  } catch (error) {
    console.error('Error getting laptop application by id:', error);
    throw error;
  }
}

export async function updateLaptopApplicationStatus(id, status, rejectionReason = null, price = null) {
  try {
    const db = await getDb();
    await db.run(
      'UPDATE laptop_applications SET status = ?, rejection_reason = ?, price = ? WHERE id = ?',
      [status, rejectionReason, price, id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating laptop application status:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteLaptopApplication(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM laptop_applications WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting laptop application:', error);
    return { success: false, message: error.message };
  }
}

// In db.js
export async function updateCustomer(userId, updates) {
  try {
    const db = await getDb();
    
    const { first_name, last_name, email, phone } = updates;
    
    await db.run(
      'UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?',
      [first_name, last_name, email, phone, userId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, message: error.message };
  }
}

export async function updateCustomerPassword(userId, newPassword) {
  try {
    const db = await getDb();
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.run(
      'UPDATE customers SET password = ?, password_last_changed = ? WHERE user_id = ?',
      [hashedPassword, new Date().toISOString(), userId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating customer password:', error);
    return { success: false, message: error.message };
  }
}
// Function to get all earphones
// Function to get all earphones
export async function getAllEarphones() {
  try {
    const db = await getDb();
    const earphones = await db.all('SELECT * FROM earphones'); // Fetch all rows from the earphones table

    // Transform the SQLite table data into an array of objects
    return earphones.map(earphone => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.original_price, // Map SQL column names to JavaScript object keys
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.battery_life,
    }));
  } catch (error) {
    console.error('Error getting earphones:', error);
    throw error;
  }
}

// Function to get earphones by ID
export async function getEarphonesById(id) {
  try {
    const db = await getDb();
    const earphone = await db.get('SELECT * FROM earphones WHERE id = ?', [id]);

    if (!earphone) {
      return null;
    }

    return {
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      pricing: {
        originalPrice: Number(earphone.original_price),
        discount: earphone.discount,
      },
      design: earphone.design,
      batteryLife: earphone.battery_life,
    };
  } catch (error) {
    console.error('Error getting earphones by ID:', error);
    throw error;
  }
}

// Function to add new earphones
export async function addEarphones(earphonesData) {
  try {
    const db = await getDb();
    const { id, title, image, brand, pricing, design, batteryLife } = earphonesData;

    await db.run(
      `INSERT INTO earphones (id, title, image, brand, original_price, discount, design, battery_life) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, image, brand, pricing.originalPrice, pricing.discount, design, batteryLife]
    );

    return { success: true, id };
  } catch (error) {
    console.error('Error adding earphones:', error);
    return { success: false, message: error.message };
  }
}

// Function to update earphones
export async function updateEarphones(id, earphonesData) {
  try {
    const db = await getDb();
    const { title, image, brand, pricing, design, battery_life } = earphonesData;

    await db.run(
      `UPDATE earphones SET 
        title = ?, 
        image = ?, 
        brand = ?, 
        original_price = ?, 
        discount = ?, 
        design = ?, 
        battery_life = ? 
       WHERE id = ?`,
      [title, image, brand, pricing.originalPrice, pricing.discount, design, battery_life, id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating earphones:', error);
    return { success: false, message: error.message };
  }
}

// Function to delete earphones
export async function deleteEarphones(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM earphones WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting earphones:', error);
    return { success: false, message: error.message };
  }
}

export async function getAllChargers() {
  try {
    const db = await getDb();
    const chargers = await db.all('SELECT * FROM chargers'); // Fetch all rows from the chargers table

    // Transform the SQLite table data into an array of objects
    return chargers.map(charger => ({
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      originalPrice: charger.originalPrice, // Map SQL column names to JavaScript object keys
      discount: charger.discount,
      outputCurrent: charger.outputCurrent,
    }));
  } catch (error) {
    console.error('Error getting chargers:', error);
    throw error;
  }
}

// Function to get a charger by ID
export async function getChargerById(id) {
  try {
    const db = await getDb();
    const charger = await db.get('SELECT * FROM chargers WHERE id = ?', [id]);

    if (!charger) {
      return null;
    }

    return {
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      pricing: {
        originalPrice: Number(charger.originalPrice),
        discount: charger.discount,
      },
      outputCurrent: charger.outputCurrent,
    };
  } catch (error) {
    console.error('Error getting charger by ID:', error);
    throw error;
  }
}

// Function to add a new charger
export async function addCharger(chargerData) {
  try {
    const db = await getDb();
    const { id, title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;

    await db.run(
      `INSERT INTO chargers (id, title, image, brand, wattage, type, originalPrice, discount, outputCurrent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, image, brand, wattage, type, pricing.originalPrice, pricing.discount, outputCurrent]
    );

    return { success: true, id };
  } catch (error) {
    console.error('Error adding charger:', error);
    return { success: false, message: error.message };
  }
}

// Function to update a charger
export async function updateCharger(id, chargerData) {
  try {
    const db = await getDb();
    const { title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;

    await db.run(
      `UPDATE chargers SET 
        title = ?, 
        image = ?, 
        brand = ?, 
        wattage = ?, 
        type = ?, 
        originalPrice = ?, 
        discount = ?, 
        outputCurrent = ? 
       WHERE id = ?`,
      [title, image, brand, wattage, type, pricing.originalPrice, pricing.discount, outputCurrent, id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating charger:', error);
    return { success: false, message: error.message };
  }
}

// Function to delete a charger
export async function deleteCharger(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM chargers WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting charger:', error);
    return { success: false, message: error.message };
  }
}



// Function to get all mouses
export async function getAllMouses() {
  try {
    const db = await getDb();
    const mouses = await db.all('SELECT * FROM mouses'); // Fetch all rows from the mouses table

    // Transform the SQLite table data into an array of objects
    return mouses.map(mouse => ({
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      originalPrice: mouse.original_price, // Map SQL column names to JavaScript object keys
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    }));
  } catch (error) {
    console.error('Error getting mouses:', error);
    throw error;
  }
}

// Function to get a mouse by ID
export async function getMouseById(id) {
  try {
    const db = await getDb();
    const mouse = await db.get('SELECT * FROM mouses WHERE id = ?', [id]);

    if (!mouse) {
      return null;
    }

    return {
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      pricing: {
        originalPrice: Number(mouse.original_price),
        discount: mouse.discount,
      },
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    };
  } catch (error) {
    console.error('Error getting mouse by ID:', error);
    throw error;
  }
}

// Function to add a new mouse
export async function addMouse(mouseData) {
  try {
    const db = await getDb();
    const { id, title, image, brand, pricing, type, connectivity, resolution } = mouseData;

    await db.run(
      `INSERT INTO mouses (id, title, image, brand, original_price, discount, type, connectivity, resolution) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, image, brand, pricing.originalPrice, pricing.discount, type, connectivity, resolution]
    );

    return { success: true, id };
  } catch (error) {
    console.error('Error adding mouse:', error);
    return { success: false, message: error.message };
  }
}

// Function to update a mouse
export async function updateMouse(id, mouseData) {
  try {
    const db = await getDb();
    const { title, image, brand, pricing, type, connectivity, resolution } = mouseData;

    await db.run(
      `UPDATE mouses SET 
        title = ?, 
        image = ?, 
        brand = ?, 
        original_price = ?, 
        discount = ?, 
        type = ?, 
        connectivity = ?, 
        resolution = ? 
       WHERE id = ?`,
      [title, image, brand, pricing.originalPrice, pricing.discount, type, connectivity, resolution, id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating mouse:', error);
    return { success: false, message: error.message };
  }
}

// Function to delete a mouse
export async function deleteMouse(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM mouses WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting mouse:', error);
    return { success: false, message: error.message };
  }
}

// Function to get all smartwatches
export async function getAllSmartwatches() {
  try {
    const db = await getDb();
    const smartwatches = await db.all('SELECT * FROM smartwatches'); // Fetch all rows from the smartwatches table

    // Transform the SQLite table data into an array of objects
    return smartwatches.map(smartwatch => ({
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      originalPrice: smartwatch.original_price, // Map SQL column names to JavaScript object keys
      discount: smartwatch.discount,
      displaySize: smartwatch.display_size,
      displayType: smartwatch.display_type,
      batteryRuntime: smartwatch.battery_runtime,
    }));
  } catch (error) {
    console.error('Error getting smartwatches:', error);
    throw error;
  }
}

// Function to get a smartwatch by ID
export async function getSmartwatchById(id) {
  try {
    const db = await getDb();
    const smartwatch = await db.get('SELECT * FROM smartwatches WHERE id = ?', [id]);

    if (!smartwatch) {
      return null;
    }

    return {
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      pricing: {
        originalPrice: Number(smartwatch.original_price),
        discount: smartwatch.discount,
      },
      displaySize: smartwatch.display_size,
      displayType: smartwatch.display_type,
      batteryRuntime: smartwatch.battery_runtime,
    };
  } catch (error) {
    console.error('Error getting smartwatch by ID:', error);
    throw error;
  }
}

// Function to add a new smartwatch
export async function addSmartwatch(smartwatchData) {
  try {
    const db = await getDb();
    const { id, title, image, brand, pricing, displaySize, displayType, batteryRuntime } = smartwatchData;

    await db.run(
      `INSERT INTO smartwatches (id, title, image, brand, original_price, discount, display_size, display_type, battery_runtime) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, image, brand, pricing.originalPrice, pricing.discount, displaySize, displayType, batteryRuntime]
    );

    return { success: true, id };
  } catch (error) {
    console.error('Error adding smartwatch:', error);
    return { success: false, message: error.message };
  }
}

// Function to update a smartwatch
export async function updateSmartwatch(id, { brand, pricing, image, title, display_size, display_type, battery_runtime }) {
  const db = await getDb();
  const safeDisplaySize = display_size !== null && display_size !== undefined ? display_size : 'N/A';
  const result = await db.run(
      `UPDATE smartwatches SET brand = ?, original_price = ?, image = ?, title = ?, display_size = ?, display_type = ?, battery_runtime = ? WHERE id = ?`,
      [brand, JSON.stringify(pricing), image, title, safeDisplaySize, display_type, battery_runtime, id]
  );
  return { success: result.changes > 0 };
}

// Function to delete a smartwatch
export async function deleteSmartwatch(id) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM smartwatches WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting smartwatch:', error);
    return { success: false, message: error.message };
  }
}