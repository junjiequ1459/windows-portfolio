'use client';

import React, { useEffect, useRef, useState } from 'react';
import useWindowStore from '../utils/windowStore';
import { appList } from '../constants/apps';

export default function StartMenu() {
  const {
    isStartMenuOpen,
    openWindow,
    closeStartMenu,
    triggerShutdownScreen,
  } = useWindowStore();

  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const startButton = document.getElementById('start-button');
      const clickedStartButton = startButton && startButton.contains(event.target);

      if (clickedStartButton) return; // Don't close if Start button was clicked

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeStartMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeStartMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeStartMenu]);

  if (!isStartMenuOpen) return null;

  const filteredApps = appList.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      ref={menuRef}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[420px] h-[500px] bg-neutral-800 text-white border border-neutral-700 shadow-2xl z-50 rounded-2xl overflow-hidden flex flex-col animate-fade-in"
    >
      {/* Search bar */}
      <div className="p-4 border-b border-neutral-700 bg-neutral-700">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm text-white bg-neutral-600 placeholder-gray-300 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* App List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="font-semibold text-sm mb-2">Pinned</div>
        <ul className="grid grid-cols-3 gap-2 text-sm mb-4">
          <li className="hover:bg-neutral-700 px-3 py-2 rounded cursor-pointer">
            <a href="https://www.linkedin.com/in/junjiequ" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6 mx-auto mb-1" />
              <span className="block text-center text-xs">LinkedIn</span>
            </a>
          </li>
          <li className="hover:bg-neutral-700 px-3 py-2 rounded cursor-pointer">
            <a href="https://drive.google.com/file/d/1w1C8yz8xHEUTSh7j7WHBAsntoEoSGV9u/view" target="_blank" rel="noopener noreferrer">
              <img src="/icons/resume.png" alt="Resume" className="w-6 h-6 mx-auto mb-1" />
              <span className="block text-center text-xs">Resume</span>
            </a>
          </li>
          <li className="hover:bg-neutral-700 px-3 py-2 rounded cursor-pointer">
            <a href="https://github.com/junjiequ1459" target="_blank" rel="noopener noreferrer">
              <img src="/icons/github.png" alt="GitHub" className="w-6 h-6 mx-auto mb-1" />
              <span className="block text-center text-xs">GitHub</span>
            </a>
          </li>
        </ul>

        {/* All Apps */}
        <div className="font-semibold text-sm mt-2 mb-2">All Apps</div>
        <ul className="grid grid-cols-3 gap-2 text-sm">
          {filteredApps.length === 0 ? (
            <li className="text-gray-400 col-span-3 text-center mt-10">No apps found</li>
          ) : (
            filteredApps.map((app) => (
              <li
                key={app.id}
                className="hover:bg-neutral-700 px-3 py-2 rounded cursor-pointer flex flex-col items-center"
                onClick={() => openWindow(app.id)}
              >
                <img src={app.icon} alt={app.name} className="w-8 h-8 mb-1" />
                <span className="text-xs text-center">{app.name}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Shutdown */}
      <div
        onClick={triggerShutdownScreen}
        className="border-t border-neutral-700 px-4 py-3 text-sm hover:bg-neutral-700 cursor-pointer text-center"
      >
        ⏻ Shutdown
      </div>
    </div>
  );
}
