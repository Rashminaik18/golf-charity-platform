// server.js — Main Express server entry point
const express = require('express');
//creates backend server
const cors = require('cors');
const dotenv = require('dotenv');
// to load secret values from .env file into program
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests from React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/charities', require('./routes/charityRoutes'));
app.use('/api/draw', require('./routes/drawRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root health-check endpoint
app.get('/', (req, res) => {
  res.json({ message: '⛳ Golf Charity API is running!' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
