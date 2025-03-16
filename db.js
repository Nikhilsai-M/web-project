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
    
    // Check if we have any supervisors, if not add the test ones
    const count = await db.get('SELECT COUNT(*) as count FROM supervisors');
    
    if (count.count === 0) {
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