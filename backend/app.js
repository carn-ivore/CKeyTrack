// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const availableKeysRoute = require('./routes/availableKeys');

// Use routes
app.use('/authRoutes', authRoutes);
app.use('/available-keys', availableKeysRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
