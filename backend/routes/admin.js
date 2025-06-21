const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { getDashboardStats, createShowtime, deleteShowtime, getShowtimesByMovie } = require('../controllers/adminController');

// Get admin profile
router.get('/profile', adminAuth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin data', error: error.message });
    }
});

// Get dashboard stats
router.get('/stats', adminAuth, getDashboardStats);

// Create showtime
router.post('/showtimes', adminAuth, createShowtime);

// Delete showtime
router.delete('/showtimes/:id', adminAuth, deleteShowtime);

// Get showtimes by movie
router.get('/showtimes', adminAuth, getShowtimesByMovie);

module.exports = router; 