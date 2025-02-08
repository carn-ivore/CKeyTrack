// KeySelect.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);

    useEffect(() => {
        const fetchAvailableKeys = async () => {
            const response = await axios.post('/available-keys', { pin: user.pin });
            setAvailableKeys(response.data.availableKeys);            
        };

        fetchAvailableKeys();
    }, [user.pin]);

    return (
        <div>
          <h2>Select a Key</h2>
          {availableKeys.map((key, index) => (
            <div key={index} onClick={() => { setSelectedKey(key); setView('ConfirmPage'); }}>
              {key}
            </div>
          ))}
        </div>
    );
};

export default KeySelect;