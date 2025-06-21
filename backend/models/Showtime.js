const mongoose = require('mongoose')

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  availableSeats: {
    type: [String],
    default: (() => {
      const seats = [];
      for (let row = 65; row < 75; row++) { // 'A' to 'J'
        for (let num = 1; num <= 10; num++) {
          seats.push(String.fromCharCode(row) + num);
        }
      }
      return seats;
    })()
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Showtime', showtimeSchema) 