// LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setUser, setView }) => {
    const [pin, setPin] = useState('');

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
        <div>
            <h2>Enter PIN</h2>
            <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
            />
            <button onClick={handleLogin}>Enter</button>
        </div>
    );
};

export default LoginPage;