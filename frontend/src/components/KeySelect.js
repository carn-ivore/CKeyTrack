// @flow

// KeySelect.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KeySelect.css"; // Import the CSS file

const API_URL =
    "https://script.google.com/macros/s/AKfycbzHzQXW0_1HA18-zk_oButvLr1Ynn8n3dLQjdOnVeVLaTfovQVaewGeHwTnmSH1uUb16Q/exec";

const KeySelect = ({ employee_id, setView, setSelectedKey, setAction }) => {
    const [availableKeys, setAvailableKeys] = useState([]);
    const [myCheckedOutKeys, setMyCheckedOutKeys] = useState([]);
    const [unavailableKeys, setUnavailableKeys] = useState([]);

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await axios.post(API_URL, {
                    action: "getKeys",
                    employee_id,
                });
                setAvailableKeys(response.data.availableKeys || []); // Set the available keys from the response
                setMyCheckedOutKeys(response.data.myCheckedOutKeys || []);
                setUnavailableKeys(response.data.unavailableKeys || []);
            } catch (error) {
                console.error("Error fetching available keys:", error);
            }
        };
        if (employee_id) fetchKeys();
    }, [employee_id]);

    const handleKeyAction = async (key, actionType) => {
        const payload =
            actionType === "checkout"
                ? { action: "checkout", employee_id, key_id: key }
                : {
                      action: "checkin",
                      employee_id,
                      transaction_id: key.transaction_id,
                  };
        if (!navigator.onLine) {
            const pending = JSON.parse(localStorage.getItem("pending") || "[]");
            pending.push({ url: API_URL, data: payload });
            localStorage.setItem("pending", JSON.stringify(pending));
            navigator.serviceWorker.ready.then((reg) =>
                reg.sync.register("sync-keys")
            );
            setSelectedKey(actionType === "checkout" ? key : key.key_id);
            setAction(actionType);
            setView("ConfirmPage");
            return;
        }
        try {
            const response = await axios.post(API_URL, payload);
            if (response.data.error) throw new Error(response.data.error);
            setSelectedKey(actionType === "checkout" ? key : key.key_id);
            setAction(actionType);
            setView("ConfirmPage");
        } catch (error) {
            console.error("Error ${actionType} key:", error);
        }
    };

    return (
        <div className="container">
            <h2>Select a Key</h2>
            <h3>Available Keys</h3>
            <div className="key-container">
                {availableKeys.length > 0 ? (
                    availableKeys.map((key, index) => (
                        <div
                            key={index}
                            className="key available"
                            onClick={() => handleKeyAction(key, "checkout")}
                        >
                            {key}
                        </div>
                    ))
                ) : (
                    <p>No Keys Checked Out</p>
                )}
            </div>
            <h3> Your Checked Out Keys</h3>
            <div className="key-container">
                {myCheckedOutKeys.length > 0 ? (
                    myCheckedOutKeys.map((key, index) => (
                        <div
                            key={index}
                            className="key checked-out"
                            onClick={() => handleKeyAction(key, "checkin")}
                        >
                            {key.key_id}
                        </div>
                    ))
                ) : (
                    <p>No keys checked out</p>
                )}
            </div>
            <h3>Unavailable Keys</h3>
            <div className="key-container">
                {unavailableKeys.length > 0 ? (
                    unavailableKeys.map((key, index) => (
                        <div key={index} className="key unavailable">
                            {key}
                        </div>
                    ))
                ) : (
                    <p>No Available Keys</p>
                )}
            </div>
            <button onClick={() => setView("LoginPage")}>Logout</button>
        </div>
    );
};

export default KeySelect;
