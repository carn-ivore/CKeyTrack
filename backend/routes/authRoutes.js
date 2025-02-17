// authRoutes.js

const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { auth, SPREADSHEET_ID } = require('./authHelper');

// Route for entering PIN
router.post('/', async (req, res) => {
  console.log('Received login request (authRoutes:10)');
    const { pin } = req.body;

  try {
    // Create a Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    // Read employee data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Employee!A2:D', 
    });

    const rows = response.data.values;
    const user = rows.find(row => row[3] === pin); // I think row[3] means column D 
    
    if (user) {
      const authorizedKeys = await getAuthorizedKeys(user[0]);
      res.status(200).json({ user: { employee_id: user[0], first_name: user[1], authorizedKeys } }); // This is what appears on Postman
    } else {
      res.status(401).json({ message: 'Invalid PIN'});
    }
  } catch (error) {
    console.error('(authRoutes:32) Error reading data:', error);
    res.status(500).json({ message: 'Internal Server Error authRoutes:33' });
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
async function getAuthorizedKeys(employee_id) {
    try {
        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Authorization!A2:D', // Getting column C so we can later eliminate expired authorizations
        });
  
        const rows = response.data.values || [];

        // Log the retrieved authorization rows
        console.log('Retrieved authorization rows:', rows);

        const authorizedKeys = rows
            .filter(row => row[1] === employee_id.toString() && new Date(row[3]) > new Date()) // Filter by employee_id and check authorization is not expired
            .map(row => row[2]); // Get Key IDs for authorized keys
        
        // Log the authorized keys
        console.log('Authorized keys for employee_id:', authorizedKeys);
          
        return authorizedKeys;
    } catch (error) {
        console.error('Error fetching authorized keys:', error);
        return [];
    }
}

module.exports = { router, getAuthorizedKeys };
