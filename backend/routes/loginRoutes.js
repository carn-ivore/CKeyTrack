// loginRoutes.js

const express = require('express');
const router = express.Router();
const { auth, SPREADSHEET_ID } = require('./authHelper');

router.post('/login', async (req, res) => {
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
    const user = rows.find(row => row[3] === pin);

    if (user) {
      const authorizedKeys = await getAuthorizedKeys(user[0]);
      res.status(200).json({ user: { eID: user[0], name: user[1], authorizedKeys } });
    } else {
      res.status(401).json({ message: 'Invalid PIN' });
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
