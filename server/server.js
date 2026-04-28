const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Initialize my express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connecting to my MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API works!' });
});

// My custom routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

// Setting up http server for websockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Websocket connection logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

app.set('io', io);

// Start listening
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
