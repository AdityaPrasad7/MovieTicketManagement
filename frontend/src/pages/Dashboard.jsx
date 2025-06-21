import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import config from '../config'

const Dashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/bookings/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
        
        if (response.ok) {
          setBookings(data)
        } else {
          setError(data.message || 'Failed to fetch bookings')
        }
      } catch (err) {
        setError('Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const response = await fetch(`${config.apiUrl}/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <a
              href="/book-movie"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Book New Movie
            </a>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Welcome, {user?.name}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your movie booking history
              </p>
            </div>

            {loading ? (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-gray-500">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 gap-6 p-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className={`relative bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-md px-6 py-4 flex items-center gap-4 transition-opacity duration-300 ${booking.status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}
                      style={{ background: 'repeating-linear-gradient(90deg, #fff, #fff 10px, #f3f4f6 10px, #f3f4f6 20px)' }}
                    >
                      {/* Ticket Icon */}
                      <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3v2.25M8.25 3v2.25M3 7.5h18M4.5 21h15a1.5 1.5 0 001.5-1.5V7.5a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 7.5v12A1.5 1.5 0 004.5 21z" />
                        </svg>
                      </div>
                      {/* Ticket Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-blue-700 mb-1">{booking.movie.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-1">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6m-7 4h8m-8-8h8" /></svg>
                            {new Date(booking.showtime && booking.showtime.time).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Seats: <span className="font-semibold">{booking.seats.join(', ')}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z" /></svg>
                            Total: <span className="font-semibold">₹{booking.seats.length * (booking.movie.ticketPrice || 0)}</span>
                          </span>
                        </div>
                      </div>
                      {/* Status and Cancel */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="px-4 py-1 bg-red-500 text-white text-xs rounded shadow hover:bg-red-600 transition-colors border border-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 