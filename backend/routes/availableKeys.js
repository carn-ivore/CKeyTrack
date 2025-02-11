// availableKeys.js

const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Route for getting available keys
router.post('/', async (req, res) => {
  console.log('Received availableKeys part');
  const { pin } = req.body;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'employeeInfoSheet!A2:D',
    });

    const rows = response.data.values;
    const user = rows.find(row => row[3] === pin);

    if (user) {
      const authorizedKeys = await getAuthorizedKeys(user[0]);
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

    return authorizedKeys.filter(key => !checkedOutKeys.includes(key));
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

module.exports = router;