import React from 'react';

export default function Icon({ label, onDoubleClick }) {
  return (
    <div
      className="text-white text-center cursor-pointer m-2 select-none"
      onDoubleClick={onDoubleClick}
    >
      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-md"></div>
      <p className="text-sm mt-1">{label}</p>
    </div>
  );
}