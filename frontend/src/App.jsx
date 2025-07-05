import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import TaskBar from './components/Taskbar/TaskBar.jsx';
import IframeWindow from './components/Iframe/IframeWindow.jsx';
import Settings from './components/Settings/Settings.jsx';
import About from './components/About/About.jsx';
import Leaderboard from './components/Leaderboard/Leaderboard.jsx';
import DesktopIcon from './components/DesktopIcon/DesktopIcon.jsx';
import WindowManager from './components/WindowManager/WindowManager.jsx';

import './styles/App.css';
import './styles/crt.css'

export default function App() {
  const navigate = useNavigate();
  const windowDefs = [
    {
      id: 'settings',
      title: 'System Settings',
      icon: 'accessibility.png',
      component: Settings,
      style: {
        x: 100,
        y: 250,
        width: 160,
        height: 160
      }
    },
    {
      id: 'about',
      title: 'About',
      icon: 'notepad.png',
      component: About,
      style: {
        x: 800,
        y: 50,
        width: 250,
        height: 500
      }
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: 'leaderboard.png',
      component: Leaderboard,
      style: {
        x: 100,
        y: 50,
        width: 190,
        height: 240
      }
    },
  ];
  const iframeApps = [
    { id: 'paint', label: 'Paint', icon: 'paint.png' },
    { id: 'game', label: 'Game', icon: 'favicon.png' },

  ];
  return (
    <div className='desktop'>
      <WindowManager windowDefs={windowDefs}>
        {({ windows, openWindow, closeWindow, bringToFront }) => (
          <>
            <div className="desktop-icons">
              {/* Native windows */}
              {windows
                .filter(w => !w.id.startsWith('iframe-')) 
                .map(w => (
                  <DesktopIcon
                    key={w.id}
                    label={w.title}
                    icon={`assets/${w.icon}`}
                    onClick={() => openWindow(w.id)}
                  />
                ))}

              {/* iframe windows */}
              {iframeApps.map(app => (
                <DesktopIcon
                  key={`iframe-${app.id}`}
                  label={app.label}
                  icon={`assets/${app.icon}`} 
                  onClick={() => {
                    if (windows.some(w => w.id === `iframe-${app.id}` && w.visible)) {
                      bringToFront(`iframe-${app.id}`);
                    } else {
                      navigate(`/app/${app.id}`);
                    }
                  }}
                />
              ))}
            </div>

            <TaskBar
              windows={windows.filter(w => w.visible)}
              onClickWindow={bringToFront}
            />

            <Routes>

              <Route path="/" element={null} />
              <Route path="/app/:appId" element={
                <IframeWindow
                  openWindow={openWindow}
                  closeWindow={closeWindow}
                  windows={windows}
                  bringToFront={bringToFront}
                />
              } />
            </Routes>
          </>
        )}
      </WindowManager>


      <div className="container"><div className="screen"></div></div>
    </div>
  );
}
