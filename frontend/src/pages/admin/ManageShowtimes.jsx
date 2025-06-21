import { useState, useEffect } from 'react';
import config from '../../config';

const ManageShowtimes = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimeDate, setShowtimeDate] = useState('');
  const [showtimeLoading, setShowtimeLoading] = useState(false);

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
            const showRes = await fetch(`${config.apiUrl}/api/admin/showtimes?movieId=${movie._id}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const showData = await showRes.json();
            return { ...movie, showtimes: showRes.ok ? showData : [] };
          })
        );
        setMovies(moviesWithShowtimes);
      } else {
        setError(data.message || 'Failed to fetch movies');
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const openAddShowtimeModal = (movie) => {
    setSelectedMovie(movie);
    setShowtimeDate('');
    setShowAddModal(true);
  };

  const handleAddShowtime = async (e) => {
    e.preventDefault();
    setShowtimeLoading(true);
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/api/admin/showtimes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          movieId: selectedMovie._id,
          time: showtimeDate
        })
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        fetchMovies();
      } else {
        setError(data.message || 'Failed to add showtime');
      }
    } catch (err) {
      setError('Failed to add showtime');
    } finally {
      setShowtimeLoading(false);
    }
  };

  const handleDeleteShowtime = async (showtimeId) => {
    if (!window.confirm('Delete this showtime?')) return;
    setError('');
    try {
      const res = await fetch(`${config.apiUrl}/api/admin/showtimes/${showtimeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchMovies();
      } else {
        setError(data.message || 'Failed to delete showtime');
      }
    } catch (err) {
      setError('Failed to delete showtime');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Manage Showtimes</h1>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-500">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <img src={movie.poster} alt={movie.title} className="w-16 h-16 object-cover rounded-lg shadow mr-4" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{movie.title}</h2>
                    <div className="text-xs text-gray-500">{movie.genre} | {movie.duration} min</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-sm text-gray-700 line-clamp-2">{movie.description}</div>
                  <div className="mb-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1">₹{movie.ticketPrice}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Showtimes:</span>
                    {movie.showtimes && movie.showtimes.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {movie.showtimes.map((show) => (
                          <li key={show._id} className="flex items-center justify-between bg-gray-100 rounded px-2 py-1">
                            <span className="text-xs text-gray-800">{new Date(show.time).toLocaleString()}</span>
                            <button
                              onClick={() => handleDeleteShowtime(show._id)}
                              className="ml-2 text-xs text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1">No showtimes</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => openAddShowtimeModal(movie)}
                  className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Showtime
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Showtime Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-xl font-bold mb-4">Add Showtime for {selectedMovie?.title}</h2>
              <form onSubmit={handleAddShowtime}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Showtime Date & Time</label>
                <input
                  type="datetime-local"
                  value={showtimeDate}
                  onChange={e => setShowtimeDate(e.target.value)}
                  required
                  className="mb-4 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={showtimeLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showtimeLoading ? 'Adding...' : 'Add Showtime'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageShowtimes; 