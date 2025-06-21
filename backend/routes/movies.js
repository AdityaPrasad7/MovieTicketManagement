const express = require('express');
const router = express.Router();
const { getMovies, getMovie, createMovie, updateMovie, deleteMovie, getShowtimesByMoviePublic } = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');

// Get all movies
router.get('/', getMovies);

// Get showtimes for a movie
router.get('/showtimes', getShowtimesByMoviePublic);

// Get movie by ID with showtimes
router.get('/:id', getMovie);

// Create movie (admin only)
router.post('/', adminAuth, createMovie);

// Update movie (admin only)
router.put('/:id', adminAuth, updateMovie);

// Delete movie (admin only)
router.delete('/:id', adminAuth, deleteMovie);

module.exports = router; 