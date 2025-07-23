'use client';

import React, { useRef, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import useWindowStore from '../../utils/windowStore';

export default function MusicPlayerApp() {
  const audioRef = useRef(null);
  const { closeWindow } = useWindowStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl =
    'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/starfall+-+intentions+(official+music+video).mp3';
  const coverUrl =
    'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/album-cover/starfall.jpg';

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <div className="bg-[#121212] text-white w-[360px] p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-4 relative">
        {/* Top Nav Bar */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => closeWindow('music')}
            className="text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Album Cover */}
        <img
          src={coverUrl}
          alt="Album Cover"
          draggable={false}
          className="w-48 h-48 rounded-lg object-cover shadow-md"
        />

        {/* Song Info */}
        <div className="text-center">
          <p className="text-sm font-medium truncate">
            starfall - intentions
          </p>
          <p className="text-xs text-gray-400">You</p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={audioUrl} preload="auto" onEnded={() => setIsPlaying(false)} />
      </div>
    </div>
  );
}
