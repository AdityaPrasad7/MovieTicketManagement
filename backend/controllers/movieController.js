const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, poster, ticketPrice } = req.body;

    const movie = new Movie({
      title,
      description,
      duration,
      genre,
      poster,
      ticketPrice,
      createdBy: req.user._id
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, poster, ticketPrice } = req.body;

    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        duration,
        genre,
        poster,
        ticketPrice
      },
      { new: true }
    );

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Cascade delete: remove all showtimes and bookings related to this movie
    await Showtime.deleteMany({ movie: movie._id });
    await Booking.deleteMany({ movie: movie._id });

    await Movie.findByIdAndDelete(movie._id);
    res.json({ message: 'Movie and related showtimes/bookings removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get showtimes by movie (public access)
// @route   GET /api/movies/showtimes
// @access  Public
exports.getShowtimesByMoviePublic = async (req, res) => {
  try {
    const { movieId } = req.query;
    if (!movieId) return res.status(400).json({ message: 'movieId is required' });
    const showtimes = await Showtime.find({ movie: movieId });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 