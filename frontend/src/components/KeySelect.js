// @flow

// KeySelect.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KeySelect.css"; // Import the CSS file

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);
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
                console.log("Response from backend:", response); // This logs the entire response from wherever it's getting the info
                console.log(response.data);
                setAvailableKeys(response.data || []); // Set the available keys from the response
                console.log("Available Keys:", response.data.availableKeys); // This logs the response directly
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
            <ul>
                {availableKeys.length > 0 ? (
                    availableKeys.map((key, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setSelectedKey(key);
                                setView("ConfirmPage");
                            }}
                        >
                            {key}
                        </li>
                    ))
                ) : (
                    <p>No available keys</p>
                )}
            </ul>
            <button onClick={() => setView("LoginPage")}>Back</button>
        </div>
    );
};

export default KeySelect;
