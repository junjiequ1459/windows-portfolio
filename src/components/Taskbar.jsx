'use client';

import React, { useState, useEffect, useRef } from 'react';
import useWindowStore from '../utils/windowStore';
import { appList } from '../constants/apps';
import CustomCalendar from './CustomCalendar';
import WeatherWidget from './WeatherWidget';

export default function Taskbar() {
  const {
    windows,
    toggleStartMenu,
    focusedWindow,
    restoreWindow,
    minimizeWindow,
  } = useWindowStore();

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    console.log('Selected date:', date);
  };

  const getAppIcon = (id) => {
    const app = appList.find((a) => a.id === id);
    return app?.icon || '/icons/default.png';
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-40">
      <div className="h-16 bg-neutral-900 border-t border-neutral-700 px-4 relative flex items-center">
        {/* Start button + open windows */}
        <div
          className="
            flex flex-wrap items-center gap-2 py-1 max-w-[90vw]
            justify-start md:justify-center md:absolute md:left-1/2 md:-translate-x-1/2
          "
        >
          {/* ✅ Start Button with ID */}
          <button id="start-button" onClick={toggleStartMenu}>
            <img
              src="/icons/windows.png"
              alt="Start"
              className="w-10 h-10 hover:scale-125 transition-transform cursor-pointer"
            />
          </button>

          {/* Open Windows */}
          {windows
            .filter((win) => win.id !== 'start')
            .map((win) => (
              <button
                key={win.id}
                onClick={() => {
                  if (focusedWindow === win.id && !win.minimized) {
                    minimizeWindow(win.id);
                  } else {
                    restoreWindow(win.id);
                  }
                }}
                className={`w-10 h-10 rounded-md flex items-center justify-center border ${
                  focusedWindow === win.id && !win.minimized
                    ? 'border-blue-400 bg-neutral-800'
                    : 'border-transparent hover:bg-neutral-700'
                }`}
              >
                <img
                  src={getAppIcon(win.id)}
                  alt={win.id}
                  className="w-6 h-6 object-contain"
                />
              </button>
            ))}
        </div>

        {/* Weather + Clock */}
        <div className="ml-auto flex items-center space-x-4">
          <WeatherWidget />
          <div className="relative" ref={calendarRef}>
            <div
              onClick={() => setShowCalendar((prev) => !prev)}
              className="text-right text-white text-sm cursor-pointer px-3 py-1 hover:bg-neutral-800 rounded transition-colors"
            >
              <div className="font-medium">
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-gray-300">
                {currentTime.toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
            {showCalendar && (
              <div className="absolute bottom-16 right-0 z-50">
                <CustomCalendar onDateSelect={handleDateSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
