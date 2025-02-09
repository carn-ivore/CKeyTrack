// ConfirmPage.js

import React, { useEffect } from 'react';
import './ConfirmPage.css'; // Import the CSS file

const ConfirmPage = ({ user, selectedKey }) => {
    useEffect(() => {
        // Set a timer to reset the view after 5 seconds
        const timer = setTimeout(() => {
            setView('LoginPage'); // Reset to LoginPage view
        }, 5000); // 5000 milliseconds = 5 seconds

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, [setView]);

    return (
        <div className="container">
            <h2>Confirmation</h2>
            <p>We've logged that you've checked out the key set: <strong>{selectedKey}</strong>.</p>
            <p>See you before 4:00 p.m. today when you check them back in.</p>
            <p>Name: {user.name}</p>
        </div>
    );
};

export default ConfirmPage;