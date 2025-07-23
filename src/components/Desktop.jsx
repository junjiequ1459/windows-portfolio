// src/components/Desktop.jsx
'use client';

import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            isMobile={isMobile} // 👈 pass down
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
