import React, {useState} from 'react';
import './TaskBar.css';

export default function TaskBar() {

  const clock = new Date().toLocaleTimeString().slice(0,-3);

  const [menuOpen, setMenuOpen] = useState(false);
const toggleMenu = () => setMenuOpen(prev => !prev);

return (
<footer className="taskbar">
  <div className={`start-menu ${menuOpen ? 'visible' : ''}`}>

  </div>
  <button className="start-button" onClick={toggleMenu}>
    <img src="assets/windows.png" alt="Start" />
    <span>Start</span>
  </button>

  <div className="taskbar-space">
    {/* Running windows or fake buttons go here */}
  </div>

  <div className="taskbar-clock">{clock}</div>
</footer>

    );
}
