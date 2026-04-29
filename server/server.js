const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// I load env variables first before anything else
// because other code below (like mongoose.connect) needs MONGO_URI from .env
dotenv.config();

// Initialize my express app
const app = express();

// Middleware setup - ORDER MATTERS here!
// 1. json() and urlencoded() must come FIRST so req.body is available in routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for form data from multer

// 2. cors() allows the React frontend (different port) to talk to this server
// without this, browser blocks the requests due to same-origin policy
app.use(cors());

// 3. morgan just logs requests to console, helpful for debugging
app.use(morgan('dev'));

// this lets the frontend access uploaded photos via URL like /uploads/visitor-123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// I connect to MongoDB here using the URI from my .env file
// process.exit(1) kills the server if DB fails - no point running without a database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1); // exit with failure code
  }
};

connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API works!' });
});

// Routes - each file handles a group of related endpoints
app.use('/api/auth', require('./routes/authRoutes'));       // login, register, getMe
app.use('/api/visitors', require('./routes/visitorRoutes')); // CRUD for visitors
app.use('/api/admin', require('./routes/adminRoutes'));       // admin stats endpoint

// Error handler goes LAST so it catches errors from all routes above
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

// I need http.createServer instead of app.listen because Socket.io
// needs a raw HTTP server to attach to. I learned this from the Socket.io docs.
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // allow any frontend to connect
});

// When a user connects via websocket:
// - they emit 'join_room' with their userId so they get their own private channel
// - then when a visitor registers for that host, I can emit to just that room
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // each employee joins a room with their user ID
  // so notifications only go to the right host
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

// storing io on the app so I can access it in controllers with req.app.get('io')
app.set('io', io);

// Start listening
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
