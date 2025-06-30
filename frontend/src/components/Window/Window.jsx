import React from 'react';
import './Window.css'; // optional for extra custom styles

export default function Window({ title = 'Window', children, style = {}, onClose }) {
    return (

        <div className="window" style={style}>
            <div className="title-bar">
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={onClose}></button>
                </div>
            </div>
            <div className="window-body">
                {children}
            </div>
        </div>
    );
}
