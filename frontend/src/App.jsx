import Leaderboard from './components/Leaderboard/Leaderboard.jsx';
import Window from './components/Window/Window.jsx';
import Settings from './components/Settings/Settings.jsx';
import DesktopIcon from './components/DesktopIcon/DesktopIcon.jsx';
import TaskBar from './components/TaskBar/TaskBar.jsx';
import React, { useState } from 'react';

import './styles/App.css'

export default function App() {
  const [gameUrl, setGameUrl] = useState('/new_site/game/index.html');
  const [showSettings, setShowSettings] = useState(false);
  const [showGame, setShowGame] = useState(true);
  const [showAbout, setShowAbout] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);


  const icons = [
    { label: 'new game', icon: 'assets/favicon.png', action: () => setShowGame(true) },
    { label: 'game config', icon: 'assets/accessibility.png', action: () => setShowSettings(true) },
    { label: 'about', icon: 'assets/notepad.png', action: () => setShowAbout(true) },
    { label: 'leaderboard', icon: 'assets/leaderboard.png', action: () => setShowLeaderboard(true) }
  ];


  // Gets the size of the game canvas  
  function getGameSize() {
    const params = new URLSearchParams(gameUrl.split('?')[1]);
    const scale = Number(params.get('scale')) || 2;
    return {
      width: 160 * scale,
      height: 160 * scale
    };
  }
  const { width, height } = getGameSize();

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {icons.map((i, index) => (
          <DesktopIcon key={index} {...i} onClick={i.action} />
        ))}
      </div>

      {showLeaderboard && (
        <Window title='leaderboard' onClose={() => setShowLeaderboard(false)} style={{ transform: 'translate(100px, 300px)' }}>
          <Leaderboard />
        </Window>
      )}


      {showGame && (
        <Window title='new_game' onClose={() => setShowGame(false)} style={{ transform: 'translate(300px, 50px)' }}>
          <iframe
            key={gameUrl}
            src={gameUrl}
            width={width}
            height={height}
            style={{
              border: 'none',
              ...(gameUrl.includes('filter=on') && {
                filter: 'contrast(130%) saturate(120%) brightness(0.95)',
              })
            }}
          />
        </Window>
      )}


      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          applySettings={(url) => {
            setGameUrl(url);
          }}
        />
      )}

      {showAbout && (
        <Window title='about' onClose={() => setShowAbout(false)} style={{ transform: 'translate(850px, 50px)' }}>
          <div className="contain">
            <img src='assets/pochitchi.webp'/>
          <p>This website was made using react. The leaderboard's database was made with mongodb atlas,
            with the backend hosted on railway.
            The game was made in Phaser! Most of the sprites were made by me
          </p>

            <div className='sunken-panel'>
              <table className='interactive' width={'100%'}>
                <thead>
                  <tr>
                    <th colSpan={2}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Arrow keys</td>
                    <td>Move</td>
                  </tr>
                  <tr>
                    <td>Z</td>
                    <td>Shoot/Confirm</td>
                  </tr>
                  <tr>
                    <td>Enter</td>
                    <td>Confirm</td>
                  </tr>
                  <tr>
                    <td>Shift</td>
                    <td>Slow move</td>
                  </tr>
                  <tr>
                    <td>ESC</td>
                    <td>Exit to menu</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>if you don't want to add your score to localstorage you can press ESC to skip the score submission</p>

            <p><strong>To-do</strong></p>
            <ul>
              <li>add music</li>
              <li>new enemies</li>
              <li>working game filters</li>
              <li>draggable windows</li>
              <li>add webpage</li>
              <li>guestbook??</li>
              <li>make leaderboard look better</li>
              <li>better  taskbar</li>
            </ul>

          <p>version 1 . 0</p>
          </div>

        </Window>
      )}

      <TaskBar />


    </div>
  );
}
