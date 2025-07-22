// src/components/Desktop.jsx
import React from 'react';
import Taskbar from './Taskbar';
import Icon from './Icon';
import Window from './Window';
import useWindowStore from '../utils/windowStore';

export default function Desktop() {
  const { windows, openWindow } = useWindowStore();

  return (
    <div className="relative h-screen w-screen bg-blue-800 overflow-hidden">
      <div className="absolute top-4 left-4">
        <Icon label="File Explorer" onDoubleClick={() => openWindow('explorer')} />
        <Icon label="Music Player" onDoubleClick={() => openWindow('music')} />
      </div>

      {windows.map((win) => (
        <Window key={win.id} {...win} />
      ))}

      <Taskbar />
    </div>
  );
}