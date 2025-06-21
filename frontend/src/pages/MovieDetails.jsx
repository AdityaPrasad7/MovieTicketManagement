import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import config from '../config'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [showtimes, setShowtimes] = useState([])
  const [selectedShowtime, setSelectedShowtime] = useState('')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/movies/${id}`)
        const data = await response.json()
        
        if (response.ok) {
          setMovie(data.movie)
          setShowtimes(data.showtimes)
        } else {
          setError(data.message || 'Failed to fetch movie details')
        }
      } catch (err) {
        setError('Failed to fetch movie details')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber)
      } else {
        return [...prev, seatNumber]
      }
    })
  }

  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      setError('Please select a showtime and at least one seat')
      return
    }

    setBookingLoading(true)
    setError('')

    try {
      const response = await fetch(`${config.apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          movieId: id,
          showtime: selectedShowtime,
          seats: selectedSeats
        })
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/dashboard')
      } else {
        setError(data.message || 'Failed to book tickets')
      }
    } catch (err) {
      setError('Failed to book tickets')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading movie details...</p>
      </div>
    )
  }

  if (error && !movie) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {movie.duration} min | {movie.genre}
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Book Tickets
                  </h2>

                  {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Showtime
                    </label>
                    <select
                      value={selectedShowtime}
                      onChange={(e) => setSelectedShowtime(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Choose a showtime</option>
                      {showtimes.map((showtime) => (
                        <option key={showtime._id} value={showtime._id}>
                          {new Date(showtime.time).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Seats
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 40 }, (_, i) => i + 1).map((seatNumber) => (
                        <button
                          key={seatNumber}
                          onClick={() => handleSeatClick(seatNumber)}
                          className={`p-2 text-sm rounded ${
                            selectedSeats.includes(seatNumber)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {seatNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {bookingLoading ? 'Booking...' : 'Book Tickets'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails 