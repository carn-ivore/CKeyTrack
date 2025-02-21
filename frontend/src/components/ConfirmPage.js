// @flow

// ConfirmPage.js

import React, { useEffect } from "react";
import "./ConfirmPage.css"; // Import the CSS file

const ConfirmPage = ({ user, selectedKey, action, setView }) => {
    useEffect(() => {
        // Set a timer to reset the view after 5 seconds
        const timer = setTimeout(() => {
            setView("LoginPage"); // Reset to LoginPage view
        }, 5000); // 5000 milliseconds = 5 seconds

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, [setView]);

    return (
        <div className="container">
            <h2>Confirmation</h2>
            <p>
                {action === "checkout"
                    ? "Checked out key: ${selectedKey}"
                    : "Checked in key: ${selectedKey}"}
            </p>
            <p>
                Name: {user.first_name} {user.last_name}
            </p>
        </div>
    );
};

export default ConfirmPage;
