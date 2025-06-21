const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalShowtimes = await Showtime.countDocuments();

    res.json({
      totalMovies,
      totalUsers,
      totalShowtimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create showtime
// @route   POST /api/admin/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res) => {
  try {
    const { movieId, time } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const showtime = new Showtime({
      movie: movieId,
      time
    });

    await showtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete showtime
// @route   DELETE /api/admin/showtimes/:id
// @access  Private/Admin
exports.deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    await Showtime.findByIdAndDelete(showtime._id);
    res.json({ message: 'Showtime removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get showtimes by movie
// @route   GET /api/admin/showtimes
// @access  Private/Admin
exports.getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.query;
    if (!movieId) return res.status(400).json({ message: 'movieId is required' });
    const showtimes = await Showtime.find({ movie: movieId });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get showtime by ID
// @route   GET /api/admin/showtimes/:id
// @access  Private/Admin
exports.getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 