const express = require('express')
const router = express.Router()
const { getShowtimeById } = require('../controllers/adminController')

// Get showtime by ID
router.get('/:id', getShowtimeById)

module.exports = router 