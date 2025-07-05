import React, { useState, useEffect } from 'react';

export default function Settings() {
    const [filterEnabled, setFilterEnabled] = useState(true);

    // Initialize state from current DOM class
    useEffect(() => {
        const appContainer = document.getElementsByClassName('container')[0];
        setFilterEnabled(!appContainer.classList.contains('hidden'));
    }, []);

    const handleApply = () => {
        const appContainer = document.getElementsByClassName('container')[0];
        if (filterEnabled) {
            appContainer.classList.remove('hidden');
        } else {
            appContainer.classList.add('hidden');
        }
    };

    return (
        <div className="settings" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            padding: '8px'
        }}>
            <div className="field-row" style={{ alignItems: 'center' }}>
                <input
                    id="filter"
                    type="checkbox"
                    checked={filterEnabled}
                    onChange={(e) => setFilterEnabled(e.target.checked)}
                    style={{ marginRight: '8px' }}
                />
                <label htmlFor="filter">CRT Filter</label>
            </div>

            <div className="field-row" style={{ justifyContent: 'flex-end' }}>
                <button onClick={handleApply}>OK</button>
            </div>
        </div>
    );
}