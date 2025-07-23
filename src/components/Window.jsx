'use client';

import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import useWindowStore from '../utils/windowStore';
import BrowserApp from './apps/BrowserApp';
import MusicPlayerApp from './apps/MusicPlayerApp';

export default function Window({ id, title, z, minimized }) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const nodeRef = useRef(null);
  const [size, setSize] = useState({ width: 700, height: 500 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [hasMoved, setHasMoved] = useState(false);
  const [hasResized, setHasResized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updateDefaultLayout = () => {
      let width = isMobile ? window.innerWidth : 700;
      let height = isMobile ? window.innerHeight - 64 : 500; // subtract taskbar (h-16 = 64px)

     if (!isMobile) {
  if (id === 'browser') {
    width = Math.min(window.innerWidth * 0.8, 1280);
    height = Math.min(window.innerHeight * 0.8, 900);
  } else if (id === 'music') {
    width = 360;
    height = 500;
  }
}


      const newX = isMobile ? 0 : Math.max(0, Math.min(position.x, window.innerWidth - width));
      const newY = isMobile ? 0 : Math.max(0, Math.min(position.y, window.innerHeight - height));

      setSize((prev) => {
        if (!hasResized || isMobile) {
          return { width, height };
        }
        return prev;
      });

      setPosition((prev) => {
        if (!hasMoved || isMobile) {
          return { x: newX, y: newY };
        }
        return prev;
      });
    };

    updateDefaultLayout();
    window.addEventListener('resize', updateDefaultLayout);
    return () => window.removeEventListener('resize', updateDefaultLayout);
  }, [id, hasMoved, hasResized, isMobile]);

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

  const renderWindowContent = () => (
    <motion.div
      initial={false}
      animate={{
        opacity: minimized ? 0 : 1,
        scale: minimized ? 0.95 : 1,
        pointerEvents: minimized ? 'none' : 'auto',
      }}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
      className={`w-full h-full ${
        id === 'music'
          ? ''
          : isMobile
            ? 'bg-white flex flex-col'
            : 'bg-white rounded shadow-lg flex flex-col overflow-hidden'
      }`}
    >
      {/* Header */}
      {id !== 'music' && (
        <div
          className={`window-header bg-blue-600 text-white px-4 py-2 flex justify-between items-center ${
            isMobile ? '' : 'cursor-move'
          }`}
        >
          <span className="font-semibold">{title}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => minimizeWindow(id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
              aria-label="Minimize"
            >
              <span className="text-white text-xs font-bold -mt-[2px]">_</span>
            </button>
            <button
              onClick={() => closeWindow(id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* App Content */}
      {id === 'music'
        ? renderAppContent()
        : <div className="flex-1">{renderAppContent()}</div>}
    </motion.div>
  );

  const renderResizableContent = () => {
    return isMobile ? (
      renderWindowContent()
    ) : (
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[300, 200]}
        onResizeStop={(e, data) => {
          setSize({ width: data.size.width, height: data.size.height });
          setHasResized(true);
          updateWindowSize(id, {
            width: data.size.width,
            height: data.size.height,
          });
        }}
      >
        {renderWindowContent()}
      </ResizableBox>
    );
  };

  return isMobile ? (
    <div
      ref={nodeRef}
      className="absolute"
      style={{
        zIndex: z,
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 64px)',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      {renderResizableContent()}
    </div>
  ) : (
    <Draggable
      handle={id === 'music' ? null : '.window-header'}
      bounds="parent"
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        setHasMoved(true);
        updateWindowPosition(id, { x: data.x, y: data.y });
      }}
      onStart={() => focusWindow(id)}
    >
      <div
        ref={nodeRef}
        className="absolute"
        style={{ zIndex: z }}
        onMouseDown={() => focusWindow(id)}
      >
        {renderResizableContent()}
      </div>
    </Draggable>
  );
}
