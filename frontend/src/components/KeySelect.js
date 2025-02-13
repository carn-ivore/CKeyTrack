// KeySelect.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeySelect.css'; // Import the CSS file

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);

    useEffect(() => {
        const fetchAvailableKeys = async () => {
          try {  
          const response = await axios.post('http://localhost:5000/available-keys', { pin: user.pin });
            console.log('Sending PIN:', user.pin);
            console.log('Response:', response.data); // This logs the entire response from wherever it's getting the info  
          setAvailableKeys(response.data.availableKeys);
          console.log('Available Keys:', response.data.availableKeys); // This logs the response directly           
        } catch (error) {
            console.error('Error fetching available keys:', error);
        }
      };    
        fetchAvailableKeys();
    }, [user.pin]);
    useEffect(() => {
      console.log('Updated Available Keys:', availableKeys); // Log available keys whenever they change
    }, [availableKeys]);
    
    return (
        <div className="container">
          <h2>Select a Key</h2>
          {availableKeys.map((key, index) => (            
            <div
              key={index}
              className="key"
              onClick={() => {
                setSelectedKey(key);
                setView('ConfirmPage');
              }}
            >
              {key}
            </div>
          ))}
        </div>
    );
};

export default KeySelect;