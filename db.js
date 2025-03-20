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
    
    if (laptopCount.count ===0) {
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