// getKeyRoutes.js

const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { auth, SPREADSHEET_ID } = require("./authHelper");
const { getAuthorizedKeys } = require("./authRoutes");

router.post("/", async (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required." });
    }

    try {
        const sheets = google.sheets({ version: "v4", auth });

        // Get authorized keys
        const authorizedKeys = await getAuthorizedKeys(employee_id);

        // Fetch checked out keys
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Checked Out Keys!A2:D",
        });

        const checkedOutRows = response.data.values || [];
        const checkedOutKeys = checkedOutRows.filter(row => row[1] === employee_id).map(row => row[2]);

        // Get available keys (authorized but not checked out)
        const availableKeys = authorizedKeys.filter(key => !checkedOutKeys.includes(key));

        res.status(200).json({ availableKeys, checkedOutKeys });
    } catch (error) {
        console.error("Error fetching keys:", error);
        res.status(500).json({ message: "Error fetching keys." });
    }
});

module.exports = router;
