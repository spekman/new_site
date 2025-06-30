import Window from '../Window/Window.jsx';
import React, { useState } from 'react';

export default function Settings({ onClose, applySettings }) {
    const [scale, setScale] = useState(1);
    const [filter, setFilter] = useState(false);

   const handleApply = () => {
    const query = new URLSearchParams({
      scale,
      filter: filter ? 'on' : 'off',
    }).toString();

    applySettings(`/game/index.html?${query}`);
    onClose(); // close the settings window
  };

    return (
        <Window title="settings" onClose={onClose} style={{transform: 'translate(100px, 100px)'}}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <fieldset value={scale} onChange={e => setScale(Number(e.target.value))}>
                    <legend>Scale</legend>
                    <div className="field-row">
                        <input value={1} id="1x" type="radio" name="scale" />
                        <label htmlFor="1x">1x (160x160)</label>
                    </div>
                    <div className="field-row">
                        <input value={2} id="2x" type="radio" name="scale" />
                        <label htmlFor="2x">2x (320x320)</label>
                    </div>
                    <div className="field-row">
                        <input value={3} id="3x" type="radio" name="scale" />
                        <label htmlFor="3x">3x (480x480)</label>
                    </div>
                </fieldset>
                

                
                    <input id="filter"
                        type="checkbox"
                        checked={filter}
                        onChange={e => setFilter(e.target.checked)}
                    />
                   <label htmlFor='filter'> Enable CRT Filter (To-do)
                </label>

                <button onClick={handleApply}>OK</button>
            </div>
        </Window>
    );
}
