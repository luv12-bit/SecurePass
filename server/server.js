const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================
// Parse incoming JSON requests and put data in req.body
app.use(express.json());
// Parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with this backend
app.use(cors());
// Log HTTP requests to the console for easier debugging
app.use(morgan('dev'));

// Serve static files from the 'uploads' directory (e.g. for generated PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// DATABASE CONNECTION
// ==========================================
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Exit the process with a failure code if DB fails
    process.exit(1);
  }
};

connectDB();

// ==========================================
// ROUTE REGISTRATION
// ==========================================
// Basic root route to verify the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Visitor Pass API is running...' });
});

// Import and use our customized route files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Custom Error Handler Middleware
app.use(require('./middleware/error'));

// ==========================================
// SERVER INITIALIZATION & WEBSOCKETS
// ==========================================
const PORT = process.env.PORT || 5000;

// Create an HTTP server from the Express app so we can attach Socket.io
const server = http.createServer(app);

// Initialize Socket.io with permissive CORS for local development
const io = new Server(server, {
  cors: {
    origin: '*', 
  }
});

// Listen for incoming socket connections
io.on('connection', (socket) => {
  console.log(`New WebSocket connection established: ${socket.id}`);
  
  // Allow an employee to join a specific room named after their ID
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} subscribed to their personal notification room.`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected from WebSocket: ${socket.id}`);
  });
});

// Attach the io instance to the express app so controllers can use it to emit events
app.set('io', io);

// Start listening for requests
server.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
