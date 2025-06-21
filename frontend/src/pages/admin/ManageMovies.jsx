import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'

const ManageMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    poster: '',
    ticketPrice: ''
  })

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/movies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setMovies(data)
      } else {
        setError(data.message || 'Failed to fetch movies')
      }
    } catch (err) {
      setError('Failed to fetch movies')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddMovie = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${config.apiUrl}/api/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowAddModal(false)
        setFormData({
          title: '',
          description: '',
          duration: '',
          genre: '',
          poster: '',
          ticketPrice: ''
        })
        fetchMovies()
      } else {
        setError(data.message || 'Failed to add movie')
      }
    } catch (err) {
      setError('Failed to add movie')
    }
  }

  const handleEditMovie = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${config.apiUrl}/api/movies/${selectedMovie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowEditModal(false)
        setSelectedMovie(null)
        setFormData({
          title: '',
          description: '',
          duration: '',
          genre: '',
          poster: '',
          ticketPrice: ''
        })
        fetchMovies()
      } else {
        setError(data.message || 'Failed to update movie')
      }
    } catch (err) {
      setError('Failed to update movie')
    }
  }

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        fetchMovies()
      } else {
        setError(data.message || 'Failed to delete movie')
      }
    } catch (err) {
      setError('Failed to delete movie')
    }
  }

  const openEditModal = (movie) => {
    setSelectedMovie(movie)
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre,
      poster: movie.poster,
      ticketPrice: movie.ticketPrice
    })
    setShowEditModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Movies</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Movie
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="text-center">
              <p className="text-gray-500">Loading movies...</p>
            </div>
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
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEditModal(movie)}
                        className="p-2 rounded-full bg-white/80 hover:bg-blue-100 shadow transition"
                        title="Edit"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a2.121 2.121 0 00-3-3L3 17.25z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie._id)}
                        className="p-2 rounded-full bg-white/80 hover:bg-red-100 shadow transition"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
              <form onSubmit={handleAddMovie}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Add New Movie</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                      <input
                        type="text"
                        name="genre"
                        id="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Poster URL</label>
                      <input
                        type="url"
                        name="poster"
                        id="poster"
                        value={formData.poster}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Ticket Price</label>
                      <input
                        type="number"
                        name="ticketPrice"
                        id="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
              <form onSubmit={handleEditMovie}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Edit Movie</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                      <input
                        type="text"
                        name="genre"
                        id="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Poster URL</label>
                      <input
                        type="url"
                        name="poster"
                        id="poster"
                        value={formData.poster}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Ticket Price</label>
                      <input
                        type="number"
                        name="ticketPrice"
                        id="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageMovies 