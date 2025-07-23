// src/components/Desktop.jsx
'use client';

import React, { useEffect } from 'react';
import useWindowStore from '../utils/windowStore';
import Taskbar from './Taskbar';
import Icon from './Icon';
import Window from './Window';
import StartMenu from './StartMenu';
import CityCanvas from './CityCanvas';
import ShutdownScreen from './ShutdownScreen';
import { appList } from '../constants/apps';

export default function Desktop() {
  const { windows, openWindow, deselectIcon, isShutdownScreenActive } = useWindowStore();

  useEffect(() => {
    const handleClickOutside = () => deselectIcon();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [deselectIcon]);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        <CityCanvas />

        {appList.map((app, index) => (
          <Icon
            key={app.id}
            id={app.id}
            label={app.name}
            iconSrc={app.icon}
            defaultPosition={{ x: 40, y: 40 + index * 120 }}
            onDoubleClick={() => openWindow(app.id)}
          />
        ))}

        {windows.map((win) => (
          <Window key={win.id} {...win} />
        ))}

        <StartMenu />
        <Taskbar />
      </div>

      {isShutdownScreenActive && <ShutdownScreen />}
    </>
  );
}
