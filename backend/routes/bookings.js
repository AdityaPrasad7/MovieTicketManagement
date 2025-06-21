const express = require('express')
const router = express.Router()
const { getUserBookings, createBooking, cancelBooking } = require('../controllers/bookingController')
const { auth } = require('../middleware/auth')

// Get user's bookings
router.get('/user', auth, getUserBookings)

// Create booking
router.post('/', auth, createBooking)

// Cancel booking
router.patch('/:id/cancel', auth, cancelBooking)

module.exports = router 