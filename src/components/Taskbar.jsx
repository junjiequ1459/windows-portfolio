// src/components/Taskbar.jsx
import React from 'react';

export default function Taskbar() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-10 bg-black text-white flex items-center px-4">
      <p className="text-sm">Start</p>
      <div className="ml-auto text-sm">{new Date().toLocaleTimeString()}</div>
    </div>
  );
}