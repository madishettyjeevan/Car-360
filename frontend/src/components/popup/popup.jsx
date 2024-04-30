import React from 'react';
import './popup.css';

const PopUp = ({ isOpen, close, text }) => {
    if (!isOpen) return null;

    return (
        <div className={`popup-overlay ${isOpen ? 'active' : ''}`}>
            <div className="popup-content">
                <button id="close-btn" onClick={close}>&times;</button>
                <p>{text}</p>
            </div>
        </div>

    );
};

export default PopUp;
