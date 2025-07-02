import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all assets with filters
router.get('/', authenticateToken, (req, res) => {
  const { category, status, search, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM assets WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (name LIKE ? OR asset_id LIKE ? OR brand LIKE ? OR model LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';
  
  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, assets) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM assets WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove LIMIT and OFFSET params

    if (category) countQuery += ' AND category = ?';
    if (status) countQuery += ' AND status = ?';
    if (search) countQuery += ' AND (name LIKE ? OR asset_id LIKE ? OR brand LIKE ? OR model LIKE ?)';

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        assets,
        pagination: {
          total: result.total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(result.total / limit)
        }
      });
    });
  });
});

// Get asset statistics
router.get('/stats', authenticateToken, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM assets',
    'SELECT COUNT(*) as in_use FROM assets WHERE status = "in_use"',
    'SELECT COUNT(*) as available FROM assets WHERE status = "available"',
    'SELECT COUNT(*) as damaged FROM assets WHERE status = "damaged"',
    'SELECT COUNT(*) as e_waste FROM assets WHERE status = "e_waste"',
    'SELECT SUM(purchase_price) as total_value FROM assets WHERE status != "e_waste"'
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.get(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  )).then(results => {
    res.json({
      total: results[0].total || 0,
      in_use: results[1].in_use || 0,
      available: results[2].available || 0,
      damaged: results[3].damaged || 0,
      e_waste: results[4].e_waste || 0,
      total_value: results[5].total_value || 0
    });
  }).catch(err => {
    res.status(500).json({ message: 'Database error' });
  });
});

// Get single asset
router.get('/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM assets WHERE id = ?', [req.params.id], (err, asset) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(asset);
  });
});

// Create new asset
router.post('/', authenticateToken, (req, res) => {
  const {
    asset_id, name, category, brand, model, serial_number,
    purchase_date, purchase_price, warranty_end, location,
    assigned_to, status, condition_rating, notes
  } = req.body;

  db.run(`
    INSERT INTO assets (
      asset_id, name, category, brand, model, serial_number,
      purchase_date, purchase_price, warranty_end, location,
      assigned_to, status, condition_rating, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    asset_id, name, category, brand, model, serial_number,
    purchase_date, purchase_price, warranty_end, location,
    assigned_to, status || 'available', condition_rating || 5, notes
  ], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Asset ID already exists' });
      }
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ id: this.lastID, message: 'Asset created successfully' });
  });
});

// Update asset
router.put('/:id', authenticateToken, (req, res) => {
  const {
    name, category, brand, model, serial_number,
    purchase_date, purchase_price, warranty_end, location,
    assigned_to, status, condition_rating, notes
  } = req.body;

  db.run(`
    UPDATE assets SET
      name = ?, category = ?, brand = ?, model = ?, serial_number = ?,
      purchase_date = ?, purchase_price = ?, warranty_end = ?, location = ?,
      assigned_to = ?, status = ?, condition_rating = ?, notes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    name, category, brand, model, serial_number,
    purchase_date, purchase_price, warranty_end, location,
    assigned_to, status, condition_rating, notes, req.params.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json({ message: 'Asset updated successfully' });
  });
});

// Delete asset (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  db.run('DELETE FROM assets WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  });
});

export default router;