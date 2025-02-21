// @flow

// App.js

import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import KeySelect from "./components/KeySelect";
import ConfirmPage from "./components/ConfirmPage";

const App = () => {
    const [view, setView] = useState("LoginPage");
    const [user, setUser] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [action, setAction] = useState(null); // "checkout" or "checkin"

    return (
        <div>
            {view === "LoginPage" && (
                <LoginPage setUser={setUser} setView={setView} />
            )}
            {view === "KeySelect" && (
                <KeySelect
                    employee_id={user?.employee_id}
                    setView={setView}
                    setSelectedKey={setSelectedKey}
                    setAction={setAction}
                />
            )}
            {view === "ConfirmPage" && (
                <ConfirmPage
                    user={user}
                    selectedKey={selectedKey}
                    action={action}
                    setView={setView}
                />
            )}
        </div>
    );
};

export default App;
