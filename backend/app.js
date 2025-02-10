// app.js

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Load the service account key JSON file from environment variable
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;

// Create a Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets document ID
// const SPREADSHEET_ID = '1CjmUYw3eFfEvOJFqBQnMl-vEvhwT75Emjc5xfZoDaF4';

// Route for getting available keys
app.post('/available-keys', async (req, res) => {
  const { pin } = req.body;

  try {
      // Read employee data from Google Sheets
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'employeeInfoSheet!A2:D', // Adjust the range as needed
      });

      const rows = response.data.values;
      const user = rows.find(row => row[3] === pin); // PIN is in fourth column

      if (user) {
          const authorizedKeys = await getAuthorizedKeys(user[0]); // eID is in the first column
          const availableKeys = await getAvailableKeys(authorizedKeys);
          res.status(200).json({ availableKeys });
      } else {
          res.status(401).json({ message: 'Unauthorized' });
      }
  } catch (error) {
      console.error('Error reading data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Function to get available keys based on authorized keys
async function getAvailableKeys(authorizedKeys) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'checkOutInSheet!A2:E',
    });

    const rows = response.data.values;
    const checkedOutKeys = rows
    .filter(row => row[2] && row[4] === '')
    .map(row => row[2]);

    // Filter out checked out keys from authorized keys
    return authorizedKeys.filter(key => !checkedOutKeys.includes(key));
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ message: 'Internal Server Error'});
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
