// LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setUser, setView }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', { pin });
            setUser(response.data.user);
            setView('KeySelect');            
        }   catch (error) {
            alert('Invalid PIN');
        }
    };
    
    return (
        <div style={StyleSheet.container}>
            <h2>Enter PIN</h2>
            <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                style={StyleSheet.input}
            />
            <button onClick={handleLogin} style={StyleSheet.button}>
                Enter
            </button>
            {error && <p style={StyleSheet.error}>{error}</p>}
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