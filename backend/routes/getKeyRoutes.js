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

        // Keys the current user has checked out
        const checkedOutKeys = checkedOutRows
            .filter((row) => row[1] === employee_id)
            .map((row) => row[2]);

        // Fetch employee data to get first names
        const employeeResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Employee!A2:B",
        });

        const employeeRows = employeeResponse.data.values || [];
        const employeeMap = {};
        employeeRows.forEach((row) => {
            const empId = row[0];
            const firstName = row[1];
            employeeMap[empId] = firstName;
        });

        // Keys that are checked out by other employees
        const unavailableKeys = checkedOutRows
            .filter((row) => row[1] !== employee_id)
            .map((row) => ({
                key_id: row[2],
                first_name: employeeMap[row[1]] || "Unknown", // Use the mapping to get the first name
            }));

        // Get available keys (authorized but not checked out)
        const availableKeys = authorizedKeys.filter(
            (key) =>
                !checkedOutKeys.includes(key) &&
                !unavailableKeys.some((u) => u.key_id === key)
        );
        console.log(
            "const availableKeys getKeyRoutes:62",
            response.availableKeys
        );

        res.status(200).json({
            availableKeys,
            checkedOutKeys,
            unavailableKeys,
        });
    } catch (error) {
        console.error("Error fetching keys:", error);
        res.status(500).json({ message: "Error fetching keys." });
    }
});

module.exports = router;
