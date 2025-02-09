// KeySelect.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeySelect.css'; // Import the CSS file
import ConfirmPage from './ConfirmPage'; // Import ConfirmPage

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);

    useEffect(() => {
        const fetchAvailableKeys = async () => {
            const response = await axios.post('http://localhost:5000/available-keys', { pin: user.pin });
            setAvailableKeys(response.data.availableKeys);            
        };

        fetchAvailableKeys();
    }, [user.pin]);

    return (
        <div className="container">
          <h2>Select a Key</h2>
          {availableKeys.map((key, index) => (
            <div
              key={index}
              className="key"
              onClick={() => { setSelectedKey(key); setView('ConfirmPage'); }}
            >
              {key}
            </div>
          ))}
        </div>
    );
};

export default KeySelect;