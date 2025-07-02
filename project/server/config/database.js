import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'editor',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Assets table
      db.run(`
        CREATE TABLE IF NOT EXISTS assets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_id TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          brand TEXT,
          model TEXT,
          serial_number TEXT,
          purchase_date DATE,
          purchase_price DECIMAL(10,2),
          warranty_end DATE,
          location TEXT,
          assigned_to TEXT,
          status TEXT NOT NULL DEFAULT 'available',
          condition_rating INTEGER DEFAULT 5,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Clear existing users and insert fresh admin user
      db.run('DELETE FROM users', (err) => {
        if (err) {
          console.error('Error clearing users:', err);
        }
        
        // Insert admin user with bcrypt hash for 'admin'
        db.run(`
          INSERT INTO users (username, email, password, role)
          VALUES ('admin', 'admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
        `, (err) => {
          if (err) {
            console.error('Error inserting admin user:', err);
          } else {
            console.log('Admin user created successfully');
          }
        });
      });

      // Insert sample assets
      const sampleAssets = [
        {
          asset_id: 'LAPTOP-001',
          name: 'MacBook Pro 16"',
          category: 'Laptop',
          brand: 'Apple',
          model: 'M2 Pro',
          serial_number: 'MPB16M2001',
          purchase_date: '2023-01-15',
          purchase_price: 2499.00,
          warranty_end: '2026-01-15',
          location: 'Office Floor 2',
          assigned_to: 'John Doe',
          status: 'in_use',
          condition_rating: 5,
          notes: 'Primary development machine'
        },
        {
          asset_id: 'DESKTOP-001',
          name: 'Dell OptiPlex 7090',
          category: 'Desktop',
          brand: 'Dell',
          model: 'OptiPlex 7090',
          serial_number: 'DOP7090001',
          purchase_date: '2023-03-20',
          purchase_price: 899.00,
          warranty_end: '2026-03-20',
          location: 'Office Floor 1',
          assigned_to: null,
          status: 'available',
          condition_rating: 5,
          notes: 'Available for assignment'
        },
        {
          asset_id: 'MONITOR-001',
          name: 'Dell UltraSharp U2720Q',
          category: 'Monitor',
          brand: 'Dell',
          model: 'U2720Q',
          serial_number: 'DU2720Q001',
          purchase_date: '2022-11-10',
          purchase_price: 549.00,
          warranty_end: '2025-11-10',
          location: 'Office Floor 2',
          assigned_to: 'Jane Smith',
          status: 'damaged',
          condition_rating: 2,
          notes: 'Display flickering issue'
        },
        {
          asset_id: 'PRINTER-001',
          name: 'HP LaserJet Pro M404n',
          category: 'Printer',
          brand: 'HP',
          model: 'LaserJet Pro M404n',
          serial_number: 'HPM404N001',
          purchase_date: '2021-05-15',
          purchase_price: 279.00,
          warranty_end: '2024-05-15',
          location: 'Office Floor 1',
          assigned_to: null,
          status: 'e_waste',
          condition_rating: 1,
          notes: 'Beyond repair, scheduled for e-waste disposal'
        }
      ];

      // Clear existing assets
      db.run('DELETE FROM assets', (err) => {
        if (err) {
          console.error('Error clearing assets:', err);
        }

        const insertAsset = db.prepare(`
          INSERT INTO assets (
            asset_id, name, category, brand, model, serial_number,
            purchase_date, purchase_price, warranty_end, location,
            assigned_to, status, condition_rating, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleAssets.forEach(asset => {
          insertAsset.run(
            asset.asset_id, asset.name, asset.category, asset.brand,
            asset.model, asset.serial_number, asset.purchase_date,
            asset.purchase_price, asset.warranty_end, asset.location,
            asset.assigned_to, asset.status, asset.condition_rating, asset.notes
          );
        });

        insertAsset.finalize();
        console.log('Sample assets inserted successfully');
        resolve();
      });
    });
  });
};

export default db;