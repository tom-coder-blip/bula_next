// src/pages/Settings.js
import React from "react";
import api from "../../services/api";
import "./Settings.css";

const Settings = () => {
    const handleDelete = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) {
            return;
        }
        try {
            await api.delete("/auth/delete");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            alert("Account deleted successfully");
            window.location.href = "/";
        } catch (err) {
            alert("Failed to delete account");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token")
        window.location.href = "/login";
    };

    const handleClearData = () => {
        localStorage.clear();
        alert("Local data cleared!");
    };

    return (
        <div className="settings-options">
            <div className="settings-card" onClick={handleLogout}>
                <h3>Logout</h3>
                <p>Sign out of your account safely.</p>
            </div>

            <div className="settings-card" onClick={handleClearData}>
                <h3>Clear Local Data</h3>
                <p>Remove cached app data from your browser.</p>
            </div>

            <div className="settings-card danger" onClick={handleDelete}>
                <h3>Delete Account</h3>
                <p>⚠️ Permanently remove your profile and data.</p>
            </div>
        </div>
    );
};

export default Settings;
