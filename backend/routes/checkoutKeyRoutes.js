// checkoutKeyRoutes.js

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

        // Get existing transactions to determine the next transaction_id
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Transaction!A2:E",
        });

        const rows = response.data.values || [];
        const newTransactionId = rows.length > 0 ? rows.length + 1 : 1;

        // Add new checkout transaction
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Transaction!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[newTransactionId, employee_id, key_id, currentTimestamp, ""]],
            },
        });

        // Add to Checked Out Keys sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Checked Out Keys!A:D",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[newTransactionId, employee_id, key_id, currentTimestamp]],
            },
        });

        res.json({ success: true, message: `Key ${key_id} checked out successfully.` });
    } catch (error) {
        console.error("Error checking out key:", error);
        res.status(500).json({ message: "Error checking out key." });
    }
});

module.exports = router;
