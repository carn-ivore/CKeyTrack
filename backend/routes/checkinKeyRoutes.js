// checkinKeyRoutes.js

const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { auth, SPREADSHEET_ID } = require("./authHelper");

router.post("/", async (req, res) => {
    const { employee_id, key_id } = req.body;

    if (!employee_id || !key_id) {
        return res.status(400).json({ message: "Employee ID and Key ID are required." });
    }

    try {
        const sheets = google.sheets({ version: "v4", auth });
        const currentTimestamp = new Date().toISOString();

        // Fetch Checked Out Keys data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Checked Out Keys!A2:D",
        });

        const rows = response.data.values || [];
        const checkOutEntry = rows.find(row => row[1] === employee_id && row[2] === key_id);

        if (!checkOutEntry) {
            return res.status(400).json({ message: "Key is not currently checked out." });
        }

        const transactionId = checkOutEntry[0];

        // Update Transaction sheet with check-in timestamp
        const transactionResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Transaction!A2:E",
        });

        const transactionRows = transactionResponse.data.values || [];
        const transactionIndex = transactionRows.findIndex(row => row[0] === transactionId);

        if (transactionIndex !== -1) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `Transaction!E${transactionIndex + 2}`,
                valueInputOption: "USER_ENTERED",
                resource: { values: [[currentTimestamp]] },
            });
        }

        // Remove entry from Checked Out Keys sheet
        const updatedCheckedOutKeys = rows.filter(row => row[0] !== transactionId);
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: "Checked Out Keys!A2:D",
            valueInputOption: "USER_ENTERED",
            resource: { values: updatedCheckedOutKeys },
        });

        res.json({ success: true, message: `Key ${key_id} checked in successfully.` });
    } catch (error) {
        console.error("Error checking in key:", error);
        res.status(500).json({ message: "Error checking in key." });
    }
});

module.exports = router;
