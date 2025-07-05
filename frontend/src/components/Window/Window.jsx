import React from 'react';
import { Rnd } from 'react-rnd';
import './Window.css';

export default function Window({
  title = 'Window',
  icon,
  children,
  isActive = false,
  style = {},
  onClose,
  onClick
}) {
  return (
    <Rnd
      default={{
        x: style.x || 100,
        y: style.y || 100,
        width: style.width || 320,
        height: style.height || 240,
      }}
      minWidth={160}
      minHeight={180}
      bounds="window"
      enableResizing={{
        bottom: true,
        bottomRight: true,
        right: true,
      }}
      dragHandleClassName="title-bar"
      onDragStart={onClick}
      onResizeStart={onClick}
      style={{
        zIndex: style.zIndex || 1
      }}
      className={`window-wrapper ${isActive ? 'active' : ''}`}
    >
      <div className="window" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div
          className={`title-bar ${isActive ? '' : 'inactive'}`}
          onMouseDown={onClick}
        >
          {icon && <img src={`assets/${icon}`} alt="icon" />}
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onClose === 'function') {
                  onClose(); 
                }
              }}
            />
          </div>
        </div>
        <div className="window-body" style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto'
        }}>
          {children}
        </div>
      </div>
    </Rnd>
  );
}