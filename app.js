// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000;

// Import routes
const { router: authRouter } = require('./backend/routes/authRoutes');
const availableKeysRoute = require('./backend/routes/availableKeysRoutes');

const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allows requests from the frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON requests
app.use(express.json()); // This is essential for parsing JSON request bodies


console.log(authRouter); // Log the imported router for debugging

// Use routes
app.use('/login', authRouter);
app.use('/available-keys', availableKeysRoute);

// Optional: Middleware to log incoming requests (for debugging)
app.use((req, res, next) => {
  console.log('Request Body:', req.body); // Log the request body
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
