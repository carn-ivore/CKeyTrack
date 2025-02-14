// availableKeysRoutes.js

const express = require('express');
const router = express.Router();
const { getAuthorizedKeys } = require('./authRoutes'); // Brings in the getAuthorizedKeys function
const { google } = require('googleapis');
const { auth, SPREADSHEET_ID } = require('./authHelper');

// Route for getting available keys
router.post('/', async (req, res) => {
  console.log('Received availableKeys part availableKeysRoutes:11');
  const { pin } = req.body;

  // Check if pin is provided
  if (!pin) {
    return res.status(400).json({ message: 'PIN is required' });
  }

  try {
    // Create a Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Read employee data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Employee!A2:D',
    });

    const rows = response.data.values;
    console.log('Rows from Google Sheets:', rows);
    
    // Handles empty rows
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    // Find user by entered PIN    
    const user = rows.find(row => row[3] === pin); // Locates the row where the entered pin and stored pin match
    
    if (user) {
      const employee_id = user[0];
      console.log('availableKeysRoutes:37 This is the employee_id for the given pin:', employee_id);

      // Get authorized keys for this employeeID
      const authorizedKeys = await getAuthorizedKeys(employee_id);
      console.log('availableKeysRoutes:41 Authorized keys for employee_id:', authorizedKeys);

      // Get available keys that are not checked out
      const availableKeys = await getAvailableKeys(authorizedKeys, sheets); // Adding sheets passes it to the function
      console.log('Available keys:', availableKeys);

      res.status(200).json({ data: availableKeys });
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
      range: 'Transaction!A2:E',
    });

    const rows = response.data.values || []; // This will have it default to an empty array if undefined
    
    // Log the retrieved transaction rows
    console.log('Retrieved transaction rows:', rows);

    const checkedOutKeys = rows
      .filter(row => row[2] && row[4] === '') // Checks if key_id exists and that checkedin_timestamp is empty
      .map(row => row[2]); // Extracts the key_id of checked-out keys
    
    // Log the checked out keys
    console.log('Checked out keys:', checkedOutKeys);

    // Return authorized keys that are not checked out
    const availableKeys = authorizedKeys.filter(key => !checkedOutKeys.includes(key));

    // Log the available keys
    console.log('Available keys for checkout:', availableKeys);

    return availableKeys;
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

module.exports = router;
