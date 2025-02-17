// availableKeysRoutes.js

const express = require('express');
const router = express.Router();
const { getAuthorizedKeys } = require('./authRoutes'); // Brings in the getAuthorizedKeys function
const { google } = require('googleapis');
const { auth, SPREADSHEET_ID } = require('./authHelper');

// Route for getting available keys
router.post('/', async (req, res) => {
  console.log('Received availableKeys part availableKeysRoutes:11');
  console.log('req.body:', req.body);
  const { employee_id, pin } = req.body;

  // Check if employee_id is provided
  if (!employee_id) {
    return res.status(400).json({ message: 'availkeysroutes:16 Employee ID is required' });
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
      console.log('User:', user);
      console.log('Authorization Expiration:', new Date(user[2]));

      // Get authorized keys for this employeeID
      const authorizedKeys = await getAuthorizedKeys(parseInt(user[0]));
      console.log('availableKeysRoutes:41 Authorized keys for employee_id:', authorizedKeys);

      res.status(200).json({ data: authorizedKeys });
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
      .filter(row => row[1] && !row[4]) // Checks if key_id exists and that checkedin_timestamp is empty
      .map(row => parseInt(row[1])) // Extracts the key_id of checked-out keys
      .filter(employee_id => employee_id !== NaN) // Filter out NaN values
      .map(employee_id => employee_id.toString()) // Convert back to string
      .filter(row => !checkedOutKeys.includes(row)); // Extracts the key_id of checked-out keys

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
