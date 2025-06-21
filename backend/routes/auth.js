const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Admin login
router.post('/admin/login', adminLogin);

// Get current user
router.get('/me', auth, getMe);

module.exports = router; 