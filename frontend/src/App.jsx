import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/Dashboard';
import MovieDetails from './pages/MovieDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageShowtimes from './pages/admin/ManageShowtimes';
import BookMovie from './pages/BookMovie';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected User Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/movies/:id" element={
              <PrivateRoute>
                <Navbar />
                <MovieDetails />
              </PrivateRoute>
            } />
            <Route path="/book-movie" element={
              <PrivateRoute>
                <Navbar />
                <BookMovie />
              </PrivateRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Navbar />
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <Navbar />
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/movies" element={
              <AdminRoute>
                <Navbar />
                <ManageMovies />
              </AdminRoute>
            } />
            <Route path="/admin/showtimes" element={
              <AdminRoute>
                <Navbar />
                <ManageShowtimes />
              </AdminRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
