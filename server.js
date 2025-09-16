// server.js
require('dotenv').config(); // load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// ROUTES
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const authRoutes = require('./routes/authRoutes'); // authentication routes

app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/auth', authRoutes);

// Debug: check environment variables
console.log('DEBUG: MONGO_URI =', process.env.MONGO_URI);
console.log('DEBUG: JWT_SECRET =', process.env.JWT_SECRET);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => res.send('Event Registration System Backend is running 🚀'));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
