import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PureIframe from './PureIframe.jsx';

const iframeAppMap = {
  game: {
    title: 'Game',
    icon: 'favicon.png',
    src: '/new_site/game/index.html',
    width: 320,
    height: 320
  },
  paint: {
    title: 'Paint',
    icon: 'paint.png',
    src: 'https://jspaint.app/',
    width: 450,
    height: 400
  }
};

export default function IframeWindow({ openWindow, closeWindow, windows, bringToFront }) {
  const { appId } = useParams();
  const navigate = useNavigate();
  const windowId = `iframe-${appId}`;
  const app = iframeAppMap[appId] || iframeAppMap['game'];
  const isClosing = useRef(false);

  useEffect(() => {
    if (!appId || isClosing.current) return;
    
    const existingWindow = windows.find(w => w.id === windowId);
    if (!existingWindow || !existingWindow.visible) {
      openWindow(windowId, {
        title: app.title,
        icon: app.icon,
        style: {
          width: app.width + 24,
          height: app.height + 44
        },
        component: () => (
          <PureIframe
            src={app.src}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={app.title}
          />
        ),
        onClose: () => {
          isClosing.current = true;
          closeWindow(windowId);
          navigate('/', { replace: true });
          setTimeout(() => { isClosing.current = false }, 100);
        }
      });
      bringToFront(windowId);
    }
  }, [appId]);

  return null;
}