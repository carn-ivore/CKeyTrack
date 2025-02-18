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

    return (
        <div>
            {view === "LoginPage" && (
                <LoginPage setUser={setUser} setView={setView} />
            )}
            {view === "KeySelect" && (
                <KeySelect
                    user={user}
                    setView={setView}
                    setSelectedKey={setSelectedKey}
                />
            )}
            {view === "ConfirmPage" && (
                <ConfirmPage
                    user={user}
                    selectedKey={selectedKey}
                    setView={setView}
                />
            )}
        </div>
    );
};

export default App;
