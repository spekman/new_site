// src/components/DesktopIcon.jsx
import React from 'react';
import './DesktopIcon.css'; // optional styles

export default function DesktopIcon({ label, icon, onClick }) {
  return (
    <div className="desktop-icon" onClick={onClick}>
      <img src={icon} alt={label} />
      <span>{label}</span>
    </div>
  );
}
  