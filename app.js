// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Should specify where to go for CORS?
}));

// Middleware to parse JSON requests
app.use(express.json());

// Import routes
const { router: authRouter } = require('./backend/routes/authRoutes');
console.log(authRouter); // Log the imported value
const availableKeysRoute = require('./backend/routes/availableKeysRoutes');

// Use routes
app.use('/login', authRouter);
app.use('/available-keys', availableKeysRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
