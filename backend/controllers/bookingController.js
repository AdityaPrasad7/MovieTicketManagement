const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { sendBookingConfirmation } = require('../utils/email');

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title posterUrl ticketPrice')
      .populate('showtime', 'time')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { movieId, showtimeId, seats } = req.body;

    // Check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if seats are available
    const availableSeats = showtime.availableSeats;
    const requestedSeats = Array.isArray(seats) ? seats : String(seats).split(',');

    for (const seat of requestedSeats) {
      if (!availableSeats.includes(seat)) {
        return res.status(400).json({ message: `Seat ${seat} is not available` });
      }
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      showtime: showtimeId,
      seats: requestedSeats,
      status: 'confirmed'
    });

    await booking.save();

    // Update available seats
    showtime.availableSeats = availableSeats.filter(seat => !requestedSeats.includes(seat));
    await showtime.save();

    // Send booking confirmation email (non-blocking)
    (async () => {
      try {
        const user = await User.findById(req.user.id);
        const movie = await Movie.findById(movieId);
        const showtimeObj = await Showtime.findById(showtimeId);
        await sendBookingConfirmation(
          user.email,
          user.name,
          movie.title,
          showtimeObj.time ? new Date(showtimeObj.time).toLocaleString() : '',
          requestedSeats
        );
      } catch (e) {
        console.error('Failed to send booking confirmation email:', e);
      }
    })();

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Return seats to available seats
    const showtime = await Showtime.findById(booking.showtime);
    showtime.availableSeats = [...showtime.availableSeats, ...booking.seats];
    await showtime.save();

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 