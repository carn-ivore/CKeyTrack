// availableKeysRoutes.js

const express = require('express');
const router = express.Router();
const { getAuthorizedKeys } = require('./authRoutes'); // Brings in the getAuthorizedKeys function
const { google } = require('googleapis');
const { auth, SPREADSHEET_ID } = require('./authHelper');

// Route for getting available keys
router.post('/', async (req, res) => {
  console.log('Received availableKeys part');
  const { pin } = req.body;
  console.log('availableKeysRoutes:13 Received PIN:', pin);
  try {
    // Create a Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Read employee data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'employeeInfoSheet!A2:D',
    });

    const rows = response.data.values;
      console.log('Rows from Google Sheets:', rows);
    
    // Handles empty rows
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const user = rows.find(row => row[3] === pin);
    
    if (user) {
      const authorizedKeys = await getAuthorizedKeys(user[0]);
      const availableKeys = await getAvailableKeys(authorizedKeys, sheets); // Adding sheets passes it to the function
      res.status(200).json({ availableKeys });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ message: 'Internal Server Error availableKeysRoutes:43' });
  }
});

// Function to get available keys based on authorized keys
async function getAvailableKeys(authorizedKeys, sheets) { // Accepts sheets as an argument
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'checkOutInSheet!A2:E',
    });

    const rows = response.data.values;
    const checkedOutKeys = rows
      .filter(row => row[2] && row[4] === '')
      .map(row => row[2]);

    return authorizedKeys.filter(key => !checkedOutKeys.includes(key));
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

module.exports = router;
