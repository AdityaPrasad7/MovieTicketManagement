# Movie Ticket Booking System

A full-stack web application for booking movie tickets, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (register, login)
- Admin authentication
- Browse movies
- Book movie tickets
- Select seats
- View booking history
- Admin dashboard
- Manage movies and bookings
- Real-time seat availability

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-ticket-booking
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- POST /api/auth/admin/login - Admin login
- GET /api/auth/me - Get current user

### Movies
- GET /api/movies - Get all movies
- GET /api/movies/:id - Get movie by ID
- POST /api/movies - Create movie (admin only)
- PUT /api/movies/:id - Update movie (admin only)
- DELETE /api/movies/:id - Delete movie (admin only)

### Bookings
- GET /api/bookings/user - Get user's bookings
- POST /api/bookings - Create booking
- PATCH /api/bookings/:id/cancel - Cancel booking

### Admin
- GET /api/admin/stats - Get dashboard stats
- GET /api/admin/bookings - Get all bookings
- PATCH /api/admin/bookings/:id - Update booking status
- POST /api/admin/showtimes - Create showtime
- DELETE /api/admin/showtimes/:id - Delete showtime

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 