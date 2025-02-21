// @flow

// KeySelect.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KeySelect.css"; // Import the CSS file

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);
    const [checkedOutKeys, setCheckedOutKeys] = useState([]);
    const [unavailableKeys, setUnavailableKeys] = useState([]);
    console.log("User object:", user);

    useEffect(() => {
        const fetchAvailableKeys = async () => {
            try {
                console.log(
                    "Sending request to fetch keys available for this employee_id:",
                    user.employee_id
                ); // Log the employee_id being sent
                const response = await axios.post(
                    "http://localhost:5000/available-keys",
                    {
                        employee_id: user.employee_id,
                    }
                );

                console.log("Response from backend:", response.data); // This logs the entire response from wherever it's getting the info

                setAvailableKeys(response.data.data || []); // Set the available keys from the response
                setCheckedOutKeys(response.data.checkedOutKeys || []);
                setUnavailableKeys(response.data.unavailableKeys || []);
            } catch (error) {
                if (error.response && error.response.data) {
                    console.error(
                        "Error fetching available keys:",
                        error.response.data
                    );
                } else {
                    console.error(
                        "Error fetching available keys:",
                        error.message
                    );
                }
            }
        };

        // Only fetch available keys if user has an employee_id
        if (user?.employee_id) {
            fetchAvailableKeys();
        }
    }, [user]); // Dependency array includes user.employee_id to refetch if it changes

    return (
        <div className="container">
            <h2>Select a Key</h2>
            <div className="key-container">
                {availableKeys.length > 0 ? (
                    availableKeys.map((key, index) => (
                        <div
                            key={index}
                            className="key"
                            onClick={() => {
                                setSelectedKey(key);
                                setView("ConfirmPage");
                            }}
                        >
                            {key}
                        </div>
                    ))
                ) : (
                    <p>No available keys</p>
                )}
            </div>
            <button onClick={() => setView("LoginPage")}>Back</button>
        </div>
    );
};

export default KeySelect;
