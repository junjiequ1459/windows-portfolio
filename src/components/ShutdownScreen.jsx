'use client';

import React, { useEffect } from 'react';
import useWindowStore from '../utils/windowStore';

export default function ShutdownScreen() {
  const { deactivateShutdownScreen } = useWindowStore();

  useEffect(() => {
    const handleExit = () => {
      console.log('Shutdown exiting...');
      deactivateShutdownScreen();
    };

    // Add a delay before attaching event listeners
    // This prevents the click that triggered shutdown from immediately closing it
    const timeoutId = setTimeout(() => {
      console.log('Event listeners attached');
      window.addEventListener('click', handleExit);
      window.addEventListener('keydown', handleExit);
    }, 100); // 100ms delay

    // Cleanup function
    return () => {
      console.log('Shutdown unmounted');
      clearTimeout(timeoutId);
      window.removeEventListener('click', handleExit);
      window.removeEventListener('keydown', handleExit);
    };
  }, [deactivateShutdownScreen]);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log('Shutdown mounted');

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-[9999] animate-fade-in">
      <div className="text-6xl font-semibold tracking-widest">{currentTime}</div>
      <div className="text-sm mt-4 text-gray-400">Click anywhere to return</div>
    </div>
  );
}