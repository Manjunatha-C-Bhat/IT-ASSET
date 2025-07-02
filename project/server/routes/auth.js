import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login - Accept any username/password
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Skip validation - accept any credentials
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Create a mock user based on the username provided
  const mockUser = {
    id: 1,
    username: username,
    email: `${username}@company.com`,
    role: 'admin' // Give admin role to everyone for now
  };

  const token = jwt.sign(
    { id: mockUser.id, username: mockUser.username, role: mockUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: mockUser
  });
});

// Register - Accept any registration
router.post('/register', async (req, res) => {
  const { username, email, password, role = 'editor' } = req.body;

  // Skip validation - accept any registration
  res.status(201).json({ message: 'User created successfully' });
});

export default router;