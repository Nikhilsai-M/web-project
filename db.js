import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

// Create and initialize the database
export async function initializeDatabase() {
  try {
    const db = await open({
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
    
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Get database connection
export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
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