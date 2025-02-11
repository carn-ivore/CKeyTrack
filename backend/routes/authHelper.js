const { google } = require('googleapis');
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;
console.log('Using service account file:', SERVICE_ACCOUNT_FILE);

// Google Sheets document ID
const SPREADSHEET_ID = '1CjmUYw3eFfEvOJFqBQnMl-vEvhwT75Emjc5xfZoDaF4';

// Create a JWT client
const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

module.exports = { auth, SPREADSHEET_ID }; // Export both auth and SPREADSHEET_ID