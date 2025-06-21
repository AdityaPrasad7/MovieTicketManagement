const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        default: 10.00
    },
    totalSeats: {
        type: Number,
        default: 100
    },
    availableSeats: {
        type: Number,
        default: 100
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie; 