// @flow

// LoginPage.js

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./LoginPage.css"; // Import the CSS file

const API_URL =
    "https://script.google.com/macros/s/AKfycbzHzQXW0_1HA18-zk_oButvLr1Ynn8n3dLQjdOnVeVLaTfovQVaewGeHwTnmSH1uUb16Q/exec";

const LoginPage = ({ setUser, setView }) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const pinInputRef = useRef(null); // Create a ref for the input field

    const handleLogin = async () => {
        try {
            const response = await axios.post(API_URL, {
                action: "login",
                pin,
            });
            if (response.data.error) throw new Error(response.data.error);
            setUser(response.data); // Store full user data, including employee_id
            setView("KeySelect");
        } catch (error) {
            setError("Invalid PIN");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") handleLogin(); //Call handleLogin on Enter key press
    };

    useEffect(() => {
        pinInputRef.current.focus(); // Focus on the input field when the component mounts
    }, []);

    return (
        <div className="body">
            <div className="container">
                <h2>Key Checkout System</h2>
                <label htmlFor="pin">Enter PIN:</label>
                <input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={handleKeyDown} // Add key press event handler
                    ref={pinInputRef} // Attach the ref to the input
                    maxLength="4"
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
