'use client';

import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import useWindowStore from '../utils/windowStore';

import BrowserApp from './apps/BrowserApp';
import MusicPlayerApp from './apps/MusicPlayerApp';

export default function Window({ id, title, z }) {
  const { closeWindow, focusWindow } = useWindowStore();
  const nodeRef = useRef(null);

  const [size, setSize] = useState({ width: 700, height: 500 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [hasMoved, setHasMoved] = useState(false);
  const [hasResized, setHasResized] = useState(false);

  useEffect(() => {
    const updateDefaultLayout = () => {
      let width = 700;
      let height = 500;

      if (id === 'browser') {
        width = Math.min(window.innerWidth * 0.8, 1280);
        height = Math.min(window.innerHeight * 0.8, 900);
      } else if (id === 'music') {
        width = 350;
        height = 250;
      }

      const x = (window.innerWidth - width) / 2;
      const y = (window.innerHeight - height) / 2;

      if (!hasResized) setSize({ width, height });
      if (!hasMoved) setPosition({ x, y });
    };

    updateDefaultLayout();
    window.addEventListener('resize', updateDefaultLayout);
    return () => window.removeEventListener('resize', updateDefaultLayout);
  }, [id, hasMoved, hasResized]);

  const renderAppContent = () => {
    switch (id) {
      case 'browser':
        return <BrowserApp />;
      case 'music':
        return <MusicPlayerApp />;
      default:
        return <div className="text-center text-gray-500">Unknown App</div>;
    }
  };

  return (
    <Draggable
      handle={id === 'music' ? null : '.window-header'}
      bounds="parent"
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        setHasMoved(true);
      }}
      onStart={() => focusWindow(id)}
    >
      <div
        ref={nodeRef}
        className="absolute"
        style={{ zIndex: z }}
        onMouseDown={() => focusWindow(id)}
      >
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[300, 200]}
          onResizeStop={(e, data) => {
            setSize({ width: data.size.width, height: data.size.height });
            setHasResized(true);
          }}
        >
          <div
            className={`${
              id === 'music'
                ? 'bg-transparent'
                : 'w-full h-full bg-white rounded shadow-lg flex flex-col overflow-hidden'
            }`}
          >
            {id !== 'music' && (
              <div className="window-header bg-blue-600 text-white px-4 py-2 flex justify-between items-center cursor-move">
                <span className="font-semibold">{title}</span>
                <button
                  onClick={() => closeWindow(id)}
                  className="hover:text-red-300"
                >
                  ✖
                </button>
              </div>
            )}

            {id === 'music' ? renderAppContent() : <div className="flex-1">{renderAppContent()}</div>}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}
