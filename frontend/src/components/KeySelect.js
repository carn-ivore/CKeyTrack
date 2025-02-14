// KeySelect.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeySelect.css'; // Import the CSS file

const KeySelect = ({ user, setView, setSelectedKey }) => {
    const [availableKeys, setAvailableKeys] = useState([]);
    console.log('User object:', user);

    useEffect(() => {
        const fetchAvailableKeys = async () => {
          try {
            console.log('Sending request to fetch keys available for this employee_id:', user.employee_id); // Log the employee_id being sent          
            const response = await axios.post('http://localhost:5000/available-keys', { pin: user.pin });
            console.log('Response from backend:', response.data); // This logs the entire response from wherever it's getting the info  
            setAvailableKeys(response.data.availableKeys || []); // Set the available keys from the response
            console.log('Available Keys:', response.data.availableKeys); // This logs the response directly           
        } catch (error) {
            console.error('Error fetching available keys:', error.response ? error.response.data : error.message);
        }
      };
      
      // Only fetch available keys if user has a eID
      if (user?.pin) {
        fetchAvailableKeys();
      }
    }, [user]); // Dependency array includes user.eID to refetch if it changes

    return (
      <div className="container">
          <h2>Select a Key</h2>
          <ul>
            {availableKeys.length > 0 ? (
                availableKeys.map((key, index) => (
                    <li key={index} onClick={() => { setSelectedKey(key); setView('ConfirmPage'); }}>
                        {key}
                    </li>
                ))
              ) : (
                <p>No available keys</p>
              )}
          </ul>
          <button onClick={() => setView('LoginPage')}>Back</button>
      </div>
  );
};

export default KeySelect;