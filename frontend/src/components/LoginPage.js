// LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setUser, setView }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        console.log('Entered PIN:', pin); // Log the entered PIN
        try {
            const response = await axios.post('http://localhost:5000/login', { pin });
            setUser(response.data.user);
            setView('KeySelect');            
        }   catch (error) {
            alert('Invalid PIN');
        }
    };
    
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

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    input: {
        fontSize: '18px',
        padding: '10px',
        margin: '10px',
        width: '200px',
    },
    button: {
        fontSize: '18px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default LoginPage;