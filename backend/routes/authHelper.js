const { google } = require('googleapis');
require('dotenv').config(); // Load environment variables from .env file
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;
console.log('Using SERVICE_ACCOUNT_FILE', SERVICE_ACCOUNT_FILE);
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
console.log('Got to the SPREADSHEET_ID part');

// Create a JWT client
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

module.exports = { auth, SPREADSHEET_ID }; // Export both auth and SPREADSHEET_ID
