import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Admin Dashboard</h1>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 w-full max-w-2xl">
            {/* Manage Movies Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Movies</h3>
                  <p className="text-gray-500 mb-6">
                    Add, edit, or remove movies from the system
                  </p>
                  <Link
                    to="/admin/movies"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                  >
                    Manage Movies
                  </Link>
                </div>
              </div>
            </div>

            {/* Manage Showtimes Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Showtimes</h3>
                  <p className="text-gray-500 mb-6">
                    Schedule and manage movie showtimes
                  </p>
                  <Link
                    to="/admin/showtimes"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                  >
                    Manage Showtimes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 