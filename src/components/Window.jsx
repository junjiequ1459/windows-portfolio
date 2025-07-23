'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

import useWindowStore from '../utils/windowStore';
import BrowserApp from './apps/BrowserApp';
import MusicPlayerApp from './apps/MusicPlayerApp';
import ChatGPTApp from './apps/ChatGPTApp';

export default function Window({ id, title, z, minimized, showHeader = true }) {
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
  const [maximized, setMaximized] = useState(false);

  const prevLayoutRef = useRef({ size: null, position: null });
  const TASKBAR_H = 64;

  // --- utils ---
  const getCanvasSize = useCallback(() => {
    const parent = nodeRef.current?.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: window.innerWidth, height: window.innerHeight - TASKBAR_H };
  }, [TASKBAR_H]);

  const noop = useCallback(() => {}, []);

  // --- media query (but keep ONE render tree) ---
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // keep window inside canvas (desktop, not maximized)
  useEffect(() => {
    if (isMobile || maximized) return;
    const adjust = () => {
      const canvas = getCanvasSize();
      if (!hasMoved && !hasResized) {
        const newX = Math.max(0, Math.min(100, canvas.width - size.width));
        const newY = Math.max(0, Math.min(100, canvas.height - size.height));
        setPosition({ x: newX, y: newY });
      } else {
        setPosition((p) => ({
          x: Math.max(0, Math.min(p.x, canvas.width - size.width)),
          y: Math.max(0, Math.min(p.y, canvas.height - size.height)),
        }));
      }
    };
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, [isMobile, maximized, hasMoved, hasResized, size.width, size.height, getCanvasSize]);

  // sync while maximized or mobile
  useEffect(() => {
    if (!(maximized || isMobile)) return;
    const sync = () => {
      const canvas = getCanvasSize();
      setSize(canvas);
      updateWindowSize(id, canvas);
      setPosition({ x: 0, y: 0 });
      updateWindowPosition(id, { x: 0, y: 0 });
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [maximized, isMobile, getCanvasSize, id, updateWindowPosition, updateWindowSize]);

  // child size change
  const handleSizeChange = useCallback(
    (next) => {
      if (maximized || isMobile) return;
      setSize(next);
      updateWindowSize(id, next);
    },
    [maximized, isMobile, id, updateWindowSize]
  );
  const safeSizeChange = maximized || isMobile ? noop : handleSizeChange;

  const toggleMaximize = () => {
    if (!maximized) {
      prevLayoutRef.current = { size, position };
      const canvas = getCanvasSize();
      setSize(canvas);
      setPosition({ x: 0, y: 0 });
      updateWindowSize(id, canvas);
      updateWindowPosition(id, { x: 0, y: 0 });
      setMaximized(true);
    } else {
      const { size: prevSize, position: prevPos } = prevLayoutRef.current;
      if (prevSize && prevPos) {
        setSize(prevSize);
        setPosition(prevPos);
        updateWindowSize(id, prevSize);
        updateWindowPosition(id, prevPos);
      }
      setMaximized(false);
    }
  };

  const renderAppContent = () => {
    switch (id) {
      case 'browser':
        return <BrowserApp onSizeChange={safeSizeChange} />;
      case 'music':
        return <MusicPlayerApp onSizeChange={safeSizeChange} />;
      case 'chatgpt':
        return <ChatGPTApp onSizeChange={safeSizeChange} />;
      default:
        return <div className="text-center text-gray-500">Unknown App</div>;
    }
  };

  const headerButtons = () => {
    if (isMobile) {
      return (
        <button
          onClick={() => closeWindow(id)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X size={16} className="text-white" />
        </button>
      );
    }
    return (
      <>
        <button
          onClick={() => minimizeWindow(id)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
          aria-label="Minimize"
        >
          <span className="text-white text-xs font-bold -mt-[2px]">_</span>
        </button>
        <button
          onClick={toggleMaximize}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
          aria-label={maximized ? 'Restore' : 'Maximize'}
        >
          {maximized ? <Minimize2 size={16} className="text-white" /> : <Maximize2 size={16} className="text-white" />}
        </button>
        <button
          onClick={() => closeWindow(id)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X size={16} className="text-white" />
        </button>
      </>
    );
  };

  const WindowShell = (
    <motion.div
      initial={false}
      animate={{
        opacity: minimized ? 0 : 1,
        scale: minimized ? 0.95 : 1,
        pointerEvents: minimized ? 'none' : 'auto',
      }}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
      className={`w-full h-full ${
        !showHeader
          ? ''
          : (isMobile || maximized)
              ? 'bg-white flex flex-col'
              : 'bg-white rounded shadow-lg flex flex-col overflow-hidden'
      }`}
    >
      {showHeader && (
        <div
          className={`window-header bg-blue-600 text-white px-4 py-2 flex justify-between items-center ${
            isMobile || maximized ? '' : 'cursor-move'
          }`}
          onDoubleClick={!isMobile ? toggleMaximize : undefined}
        >
          <span className="font-semibold">{title}</span>
          <div className="flex space-x-2">{headerButtons()}</div>
        </div>
      )}
      <div className="flex-1 min-h-0">{renderAppContent()}</div>
    </motion.div>
  );

  const full = maximized || isMobile;

  return (
    <Draggable
      handle={showHeader && !full ? '.window-header' : null}
      bounds="parent"
      nodeRef={nodeRef}
      position={position}
      disabled={full}
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
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[300, 200]}
          resizeHandles={full ? [] : ['se', 'e', 's']}
          onResizeStop={(e, data) => {
            if (full) return;
            const next = { width: data.size.width, height: data.size.height };
            setSize(next);
            setHasResized(true);
            updateWindowSize(id, next);
          }}
          handle={(h, ref) =>
            full ? null : (
              <span className={`react-resizable-handle react-resizable-handle-${h}`} ref={ref} />
            )
          }
        >
          {WindowShell}
        </ResizableBox>
      </div>
    </Draggable>
  );
}
