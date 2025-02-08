// ConfirmPage.js

import React from 'react';

const ConfirmPage = ({ user, selectedKey }) => {
    return (
        <div>
            <h2>Confirmation</h2>
            <p>Name: {user.name}</p>
            <p>Key: {selectedKey}</p>
        </div>
    );
};

export default ConfirmPage;