'use client';

import React, { useState, useEffect, useRef } from 'react';
import useWindowStore from '../utils/windowStore';
import { appList } from '../constants/apps';
import CustomCalendar from './CustomCalendar'; // Import the custom calendar

export default function Taskbar() {
  const { windows, toggleStartMenu, focusedWindow, focusWindow } = useWindowStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const getAppIcon = (id) => {
    const app = appList.find((app) => app.id === id);
    return app?.icon || '/icons/default.png';
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close calendar when clicking outside
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
    // You can add any logic here for when a date is selected
    // For example, close the calendar after selection:
    // setShowCalendar(false);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-16 bg-neutral-900 border-t border-neutral-700 flex items-center justify-between z-40 px-4">
      {/* Centered Start Button */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/icons/windows.png"
          alt="Start"
          onClick={toggleStartMenu}
          className="w-10 h-10 hover:scale-125 transition-transform cursor-pointer"
        />
      </div>

      {/* Open Windows */}
      <div className="flex items-center space-x-2 ml-4">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => focusWindow(win.id)}
            className={`w-10 h-10 rounded-md flex items-center justify-center border ${
              focusedWindow === win.id
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

      {/* Clock + Calendar */}
      <div className="relative" ref={calendarRef}>
        <div
          onClick={() => setShowCalendar((prev) => !prev)}
          className="text-right text-white text-sm cursor-pointer px-3 py-1 hover:bg-neutral-800 rounded transition-colors"
        >
          <div className="font-medium">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-gray-300">
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {showCalendar && (
          <div className="absolute bottom-16 right-0 z-50">
            <CustomCalendar onDateSelect={handleDateSelect} />
          </div>
        )}
      </div>
    </div>
  );
}