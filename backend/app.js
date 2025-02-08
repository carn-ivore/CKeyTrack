// app.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Store some example users and keys in memory (for simplicity)
const users = [
  { pin: '1234', name: 'Brent', authorizedKeys: ['Key A', 'Key B'] },
  { pin: '2234', name: 'Aaron', authorizedKeys: ['Key B'] },
];

const keys = ['Key A', 'Key B'];

// Route for entering PIN
app.post('/login', (req, res) => {
  const { pin } = req.body;
  const user = users.find(user => user.pin === pin);

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(401).json({ message: 'Invalid PIN' });
  }
});

// Route for getting available keys
app.post('/available-keys', (req, res) => {
  const { pin } = req.body;
  const user = users.find(user => user.pin === pin);

  if (user) {
    const availableKeys = keys.filter(key => user.authorizedKeys.includes(key));
    res.status(200).json({ availableKeys });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
