// app.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to the Key Checkout App');
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});