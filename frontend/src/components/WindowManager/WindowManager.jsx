import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Window from '../Window/Window.jsx';

export default function WindowManager({ windowDefs, children }) {
  const defaultOpenWindows = ['leaderboard', 'about'];

  const [windows, setWindows] = useState(() =>
    windowDefs.map(def => ({
      id: def.id,
      title: def.title,
      icon: def.icon,
      visible: defaultOpenWindows.includes(def.id),
      zIndex: defaultOpenWindows.includes(def.id) ? 2 : 1,
      style: def.style || {},
      component: def.component,
      inTaskbar: defaultOpenWindows.includes(def.id)
    }))
  );

  const [zCounter, setZCounter] = useState(defaultOpenWindows.length + 2);
  const contentRefs = useRef({});
  const mountedRefs = useRef({});

  const bringToFront = (id) => {
    setWindows(wins => wins.map(w => w.id === id ? { ...w, zIndex: zCounter } : w));
    setZCounter(z => z + 1);
  };

  const closeWindow = (id) => {
  setWindows(wins => wins.map(w => 
    w.id === id ? { ...w, visible: false, inTaskbar: false } : w
  ));
};

const openWindow = (id, config = {}) => {
  setWindows(prev => {
    const existing = prev.find(w => w.id === id);
    if (existing) {
      return prev.map(w => w.id === id ? { 
        ...w, 
        ...config,
        visible: true, 
        inTaskbar: true, 
        zIndex: zCounter 
      } : w);
    } else {
      return [
        ...prev,
        {
          id,
          visible: true,
          inTaskbar: true,
          zIndex: zCounter,
          style: config.style || {},
          component: config.component || (() => <div>Window</div>),
          title: config.title || id,
          icon: config.icon || 'favicon.png',
          onClose: config.onClose
        }
      ];
    }
  });
  setZCounter(z => z + 1);
};

  useEffect(() => {
    for (const def of windowDefs) {
      const id = def.id;
      const Comp = def.component;

      if (!mountedRefs.current[id]) {
        const container = document.createElement('div');
        contentRefs.current[id] = container;

        const tempRoot = document.createElement('div');
        tempRoot.style.display = 'none';
        document.body.appendChild(tempRoot);

        const root = createRoot(container);
        root.render(<Comp />);
        mountedRefs.current[id] = true;
      }
    }
  }, [windowDefs]);

  const handleWindowClick = (id, e) => {
    if (!e.target.closest('.title-bar-controls')) {
      bringToFront(id);
      setWindows(wins => wins.map(win =>
        win.id === id ? { ...win, inTaskbar: true } : win
      ));
    }
  };

  return (
    <>
      {children?.({
        windows: windows.map(w => ({
          ...w,
          title: w.title || windowDefs.find(d => d.id === w.id)?.title,
          icon: w.icon || windowDefs.find(d => d.id === w.id)?.icon,
          isActive: w.zIndex === Math.max(...windows.map(win => win.zIndex)),
        })),
        bringToFront,
        openWindow,
        closeWindow
      })}

      {windows.map(w => {
        const Component = w.component || (() => <div>Empty</div>);

        return w.visible && (
          <Window
            key={w.id}
            id={w.id}
            title={w.title}
            icon={`small_${w.icon}`}
            style={{
              zIndex: w.zIndex,
              ...w.style,
            }}
            isActive={w.zIndex === Math.max(...windows.map(win => win.zIndex))}
            onClick={(e) => handleWindowClick(w.id, e)}
            onClose={w.onClose || (() => closeWindow(w.id))}

          >
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
              onClick={(e) => handleWindowClick(w.id, e)}
            >
              <Component />
            </div>
          </Window>
        );
      })}
    </>
  );
}
