// src/components/Window.jsx
import React from 'react';
import Draggable from 'react-draggable';
import useWindowStore from '../utils/windowStore';
import FileExplorer from '../apps/FileExplorer';
import MusicPlayer from '../apps/MusicPlayer';

export default function Window({ id, type, position }) {
  const { closeWindow } = useWindowStore();

  const renderApp = () => {
    switch (type) {
      case 'explorer':
        return <FileExplorer />;
      case 'music':
        return <MusicPlayer />;
      default:
        return <div>Unknown App</div>;
    }
  };

  return (
    <Draggable defaultPosition={position} handle=".window-title">
      <div className="absolute w-80 h-60 bg-white shadow-lg border border-gray-500 rounded overflow-hidden">
        <div className="window-title bg-blue-900 text-white p-2 flex justify-between items-center cursor-move">
          <span>{type}</span>
          <button onClick={() => closeWindow(id)}>X</button>
        </div>
        <div className="p-2 h-full overflow-auto">{renderApp()}</div>
      </div>
    </Draggable>
  );
}