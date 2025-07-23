'use client';

import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import useWindowStore from '../../utils/windowStore';

export default function BrowserApp() {
  const { closeWindow } = useWindowStore();

  const defaultUrl = 'https://wikipedia.org';
  const [tabs, setTabs] = useState([
    {
      id: Date.now(),
      url: defaultUrl,
      urlInput: defaultUrl,
      loadError: false,
      favicon: `https://www.google.com/s2/favicons?domain=wikipedia.org`,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const iframeRefs = useRef({});

  const updateTab = (id, changes) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...changes } : tab))
    );
  };

  const handleKeyDown = (e, tabId) => {
    if (e.key === 'Enter') {
      let input = tabs.find((t) => t.id === tabId).urlInput.trim();

      const isProbablyURL = /^[^\s]+\.[^\s]{2,}$/.test(input);
      let finalUrl = input;

      if (isProbablyURL && !/^https?:\/\//i.test(input)) {
        finalUrl = 'https://' + input;
      }

      if (!isProbablyURL) {
        finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
      }

      const domain = new URL(finalUrl).hostname;
      updateTab(tabId, {
        url: finalUrl,
        loadError: false,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
      });

      setTimeout(() => {
        const iframe = iframeRefs.current[tabId];
        if (iframe && iframe.contentDocument?.body?.innerHTML === '') {
          updateTab(tabId, { loadError: true });
        }
      }, 2000);
    }
  };

  const addTab = () => {
    const newId = Date.now();
    const newTab = {
      id: newId,
      url: defaultUrl,
      urlInput: defaultUrl,
      loadError: false,
      favicon: `https://www.google.com/s2/favicons?domain=wikipedia.org`,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id) => {
    const remaining = tabs.filter((tab) => tab.id !== id);
    if (remaining.length === 0) {
      closeWindow('browser');
    } else {
      setTabs(remaining);
      if (activeTabId === id) {
        setActiveTabId(remaining[0].id);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Tab Bar */}
      <div className="flex items-center px-2 py-1 bg-[#2c2c2c] border-b border-neutral-700">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-t-md cursor-pointer mr-2 ${
              tab.id === activeTabId ? 'bg-[#3a3a3a]' : 'bg-[#1e1e1e] hover:bg-[#2c2c2c]'
            }`}
          >
            <img src={tab.favicon} alt="icon" className="w-4 h-4" />
            <span className="text-sm max-w-[120px] truncate">
              {tab.urlInput.replace(/^https?:\/\//, '')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="ml-1 hover:text-red-400"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="ml-2 text-gray-400 hover:text-white p-1"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Address Bar */}
      <div className="p-3 border-b border-neutral-700 bg-[#2c2c2c] shadow-sm">
        {tabs.map((tab) =>
          tab.id === activeTabId ? (
            <input
              key={tab.id}
              type="text"
              value={tab.urlInput}
              onChange={(e) => updateTab(tab.id, { urlInput: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              placeholder="Search or enter web address"
              className="w-full px-4 py-2 text-sm text-white bg-[#3a3a3a] rounded-full border border-neutral-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : null
        )}
      </div>

      {/* Web Views */}
      <div className="flex-1 bg-black relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-200 ${
              tab.id === activeTabId ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {tab.loadError ? (
              <div className="flex items-center justify-center h-full text-center p-10 text-gray-300">
                <div>
                  <p className="text-lg font-semibold">This website cannot be displayed.</p>
                  <p className="text-sm mt-2 text-gray-400">
                    It may have security settings that prevent embedding in an iframe.
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                ref={(el) => (iframeRefs.current[tab.id] = el)}
                src={tab.url}
                title={`Tab ${tab.id}`}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
