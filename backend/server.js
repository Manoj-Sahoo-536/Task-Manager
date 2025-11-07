require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://task-manager-three-lilac.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));
app.use('/api/import', require('./routes/importRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
