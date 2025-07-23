'use client';

import React, { useState } from 'react';

export default function BrowserApp() {
  const defaultUrl = 'https://wikipedia.org';
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [url, setUrl] = useState(defaultUrl);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      let input = urlInput.trim();

      const isProbablyURL = /^[^\s]+\.[^\s]{2,}$/.test(input);
      let finalUrl = input;

      if (isProbablyURL && !/^https?:\/\//i.test(input)) {
        finalUrl = 'https://' + input;
      }

      if (!isProbablyURL) {
        finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
      }

      setUrl(finalUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Dark Address Bar */}
      <div className="p-3 border-b border-neutral-700 bg-[#2c2c2c] shadow-sm">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter web address"
          className="w-full px-4 py-2 text-sm text-white bg-[#3a3a3a] rounded-full border border-neutral-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Web View */}
      <iframe
        src={url}
        title="Edge Dark Browser"
        className="flex-1 bg-black"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
