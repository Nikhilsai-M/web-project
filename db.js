// db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize the database
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
    
    // Check if we have any supervisors, if not add the test ones
    const supervisorCount = await db.get('SELECT COUNT(*) as count FROM supervisors');
    
    if (supervisorCount.count === 0) {
      // Hash passwords
      const password1 = await bcrypt.hash('sv@123', 10);
      const password2 = await bcrypt.hash('sv@456', 10);
      
      // Insert test supervisors
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