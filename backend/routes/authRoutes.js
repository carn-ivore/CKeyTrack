// authRoutes.js

const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;

// Google Sheets document ID
const SPREADSHEET_ID = '1CjmUYw3eFfEvOJFqBQnMl-vEvhwT75Emjc5xfZoDaF4';

// Create a JWT client
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create a Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Route for entering PIN
router.post('/', async (req, res) => {
  const { pin } = req.body;

  try {
    // Read employee data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'employeeInfoSheet!A2:D', 
    });

    const rows = response.data.values;
    const user = rows.find(row => row[3] === pin); // I think row[3] means column D 
    
    if (user) {
      const authorizedKeys = await getAuthorizedKeys(user[0]);
      res.status(200).json({ user: { eID: user[0], name: user[1], authorizedKeys } });
    } else {
      res.status(401).json({ message: 'Invalid PIN'});
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Function to get authorized keys for a user
async function getAuthorizedKeys(eID) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'authorizedKeysSheet!A2:C', // Getting column C so we can later eliminate expired authorizations
        });
  
        const rows = response.data.values;
        const authorizedKeys = rows
            .filter(row => row[0] === eID) // Filter by eID
            .map(row => row[1]); // Get Key IDs
  
        return authorizedKeys;
    } catch (error) {
        console.error('Error fetching authorized keys:', error);
        return [];
    }
}

module.exports = router;