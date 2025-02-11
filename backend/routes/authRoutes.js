// authRoutes.js

const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { auth, SPREADSHEET_ID } = require('./authHelper');

// Route for entering PIN
router.post('/', async (req, res) => {
  console.log('Received login request');
    const { pin } = req.body;

  try {
    // Create a Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
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

/* // Route for logging in with PIN
*router.post('/login', (req, res) => {
*    const { pin } = req.body;
*    // The logic for handling the login goes here, I don't know what that is going to be at the moment
*    // I'm guessing I'm going to need an app.use statement following the router.post thing
*})
*/
// Function to get authorized keys for a user
async function getAuthorizedKeys(eID) {
    try {
        const sheets = google.sheets({ version: 'v4', auth });
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
