// LoginPage.js

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Import th CSS file

const LoginPage = ({ setUser, setView }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const pinInputRef = useRef(null); // Create a ref for the input field

    const handleLogin = async () => {
        console.log('Entered PIN:', pin); // Log the entered PIN
        try {
            const response = await axios.post('http://localhost:5000/authRoutes', { pin });
            setUser(response.data.user);
            setView('KeySelect');            
        } catch (error) {
            setError('Invalid PIN');
        }
    };
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin(); //Call handleLogin on Enter key press
        }
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
                    onChange={e => setPin(e.target.value)}
                    onKeyDown={handleKeyDown} // Add key press event handler
                    ref={pinInputRef} // Attach the ref to the input
                    maxLength="4"
                />
                <button onClick={handleLogin}>
                    Login
                </button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;