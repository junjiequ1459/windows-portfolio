'use client';

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import useWindowStore from '../utils/windowStore';

export default function Icon({ id, label, iconSrc, onDoubleClick, defaultPosition, isMobile }) {
  const nodeRef = useRef(null);
  const { selectedIcon, selectIcon } = useWindowStore();

  const isSelected = selectedIcon === id;

  const handleClick = (e) => {
    e.stopPropagation();
    selectIcon(id);

    // If mobile, open the window on single click
    if (isMobile) {
      onDoubleClick?.(); // same as openWindow(id)
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      defaultPosition={defaultPosition}
      disabled={isMobile}
    >
      <div
        ref={nodeRef}
        onClick={handleClick}
        onDoubleClick={!isMobile ? onDoubleClick : undefined}
        className="absolute flex flex-col items-center gap-1 cursor-pointer select-none"
      >
        <div
          className={`w-16 h-16 p-1 flex items-center justify-center ${
            isSelected ? 'border border-gray-300 rounded-md' : ''
          }`}
        >
          <img
            src={iconSrc}
            alt={label}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        <p
          className={`text-xs text-white px-1 rounded ${
            isSelected ? 'bg-blue-600/60' : ''
          }`}
        >
          {label}
        </p>
      </div>
    </Draggable>
  );
}
