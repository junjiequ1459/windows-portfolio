'use client';

import React, { useState, useRef, useEffect } from 'react';
import useWindowStore from '../../utils/windowStore';
import { X } from 'lucide-react';

export default function ChatGPTApp({ onSizeChange }) {
  const { closeWindow } = useWindowStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // Self-contained sizing logic
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        onSizeChange?.({ width: window.innerWidth, height: window.innerHeight - 64 });
      } else {
        // Desktop sizing - responsive but with limits
        const width = Math.max(600, Math.min(1200, window.innerWidth * 0.8));
        const height = Math.max(500, Math.min(800, window.innerHeight * 0.8));
        onSizeChange?.({ width, height });
      }
    };

    // Set initial size
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [onSizeChange]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data?.assistantMessage?.content) {
        setMessages([...newMessages, data.assistantMessage]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: '⚠️ Something went wrong. Please try again.',
          },
        ]);
      }
    } catch (err) {
      console.error('ChatGPT error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Network error. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                msg.role === 'user' ? 'bg-[#3a3a3a]' : 'bg-[#2f2f2f] text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block px-4 py-2 rounded-lg bg-[#2f2f2f] text-gray-400 text-sm">
              ChatGPT is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-neutral-700 bg-[#2c2c2c]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-2 text-sm text-white bg-[#3a3a3a] rounded-full border border-neutral-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
}