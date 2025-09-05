import React from "react";
import "./MatchPopup.css";

const MatchPopup = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="match-popup-overlay">
      <div className="match-popup-card">
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="match-popup-btn" onClick={onClose}>
          Got it ✅
        </button>
      </div>
    </div>
  );
};

export default MatchPopup;