import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const seatRows = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)); // A-J
const seatNumbers = Array.from({ length: 10 }, (_, i) => i + 1); // 1-10

const BookMovie = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null); // { showtime, movie }
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/api/movies`);
      const data = await res.json();
      if (res.ok) {
        // For each movie, fetch its showtimes
        const moviesWithShowtimes = await Promise.all(
          data.map(async (movie) => {
            const showRes = await fetch(`${config.apiUrl}/api/movies/showtimes?movieId=${movie._id}`);
            const showData = await showRes.json();
            return { ...movie, showtimes: showRes.ok ? showData : [] };
          })
        );
        // Only show movies with at least one showtime
        setMovies(moviesWithShowtimes.filter(m => m.showtimes && m.showtimes.length > 0));
      } else {
        setError(data.message || 'Failed to fetch movies');
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeClick = async (movie, showtime) => {
    setSelectedShowtime({ showtime, movie });
    setSelectedSeats([]);
    setSeatsLoading(true);
    setShowSeatModal(true);
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/api/showtimes/${showtime._id}`);
      const data = await res.json();
      if (res.ok) {
        setAvailableSeats(data.availableSeats || []);
      } else {
        setAvailableSeats([]);
        setError(data.message || 'Failed to fetch seats');
      }
    } catch (err) {
      setAvailableSeats([]);
      setError('Failed to fetch seats');
    } finally {
      setSeatsLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookSeats = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) return;
    setBookingLoading(true);
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          movieId: selectedShowtime.movie._id,
          showtimeId: selectedShowtime.showtime._id,
          seats: selectedSeats
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(true);
        setShowSeatModal(false);
        setSelectedShowtime(null);
        setSelectedSeats([]);
        // Optionally, navigate to dashboard or refresh bookings
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to book seats');
      }
    } catch (err) {
      setError('Failed to book seats');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Book New Movie</h1>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-500">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="text-center text-gray-400">No movies with showtimes available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="relative rounded-3xl shadow-lg overflow-hidden group border border-gray-200 min-h-[420px] flex"
                style={{ minHeight: '420px', height: '420px' }}
              >
                {/* Full-card Poster Image */}
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 z-0"
                />
                {/* Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                {/* Card Content Overlayed at Bottom */}
                <div className="absolute bottom-0 left-0 w-full z-20 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xl font-bold drop-shadow-lg truncate max-w-[180px]" title={movie.title}>{movie.title}</span>
                    <span className="inline-block bg-green-500/90 text-white text-xs font-semibold rounded-full px-3 py-1 shadow-lg ml-2">₹{movie.ticketPrice}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0A9 9 0 11.999 12 9 9 0 0121 12z" /></svg>
                      {movie.genre}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>
                      {movie.duration} min
                    </span>
                  </div>
                  <p className="text-gray-100 text-xs mb-3 line-clamp-2 min-h-[2.5em]">{movie.description}</p>
                  <div className="mt-2">
                    <span className="font-semibold text-gray-200">Showtimes:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {movie.showtimes.map((show) => (
                        <button
                          key={show._id}
                          onClick={() => handleShowtimeClick(movie, show)}
                          className="px-3 py-1 text-xs rounded transition bg-blue-600 text-white hover:bg-blue-700 shadow"
                        >
                          {new Date(show.time).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Seat Selection Modal */}
        {showSeatModal && selectedShowtime && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowSeatModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-xl font-bold mb-2">Select Seats for {selectedShowtime.movie.title}</h2>
              <div className="mb-2 text-gray-600 text-sm">Showtime: {new Date(selectedShowtime.showtime.time).toLocaleString()}</div>
              {seatsLoading ? (
                <div className="text-gray-500 text-sm">Loading seats...</div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-10 gap-2 mb-4">
                    {seatRows.map(row => (
                      seatNumbers.map(num => {
                        const seat = `${row}${num}`;
                        const isAvailable = availableSeats.includes(seat);
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <button
                            key={seat}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && handleSeatClick(seat)}
                            className={`w-10 h-10 rounded text-xs font-semibold border flex items-center justify-center
                              ${isAvailable ? (isSelected ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100') : 'bg-gray-300 text-gray-400 border-gray-200 cursor-not-allowed'}`}
                          >
                            {seat}
                          </button>
                        );
                      })
                    ))}
                  </div>
                </div>
              )}
              {selectedSeats.length > 0 && (
                <button
                  className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={handleBookSeats}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : `Book Selected Seats (${selectedSeats.length})`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMovie; 