'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
} from '@heroicons/react/20/solid';

const songs = [
  {
    title: 'Intentions',
    artist: 'starfall',
    audio:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/intentions.mp3',
    cover:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/album-cover/starfall.jpg',
  },
  {
    title: 'Odo',
    artist: 'Ado',
    audio:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/odo.mp3',
    cover:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/album-cover/odo-min.jpg',
  },
  {
    title: 'DtMF',
    artist: 'Bad Bunny',
    audio:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/mas+fotos.mp3',
    cover:
      'https://portfolio-junjiequ1459.s3.us-east-1.amazonaws.com/music/album-cover/mas-fotos.jpg',
  },
];

export default function MusicPlayerApp({ onSizeChange }) {
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const currentSong = songs[currentSongIndex];

  // Self-contained sizing logic
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        onSizeChange?.({ width: window.innerWidth, height: window.innerHeight - 64 });
      } else {
        // Desktop sizing - compact music player
        const width = Math.max(350, Math.min(400, window.innerWidth * 0.3));
        const height = Math.max(400, Math.min(600, window.innerHeight * 0.7));
        onSizeChange?.({ width, height });
      }
    };

    // Set initial size
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [onSizeChange]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setIsPlaying(false);
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const playPrevious = () => {
    setIsPlaying(false);
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const value = e.target.value;
    if (audio && audio.duration) {
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setProgress(0);

    const playAfterLoad = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    audio.addEventListener('loadedmetadata', playAfterLoad);
    return () => {
      audio.removeEventListener('loadedmetadata', playAfterLoad);
    };
  }, [currentSongIndex]);

  return (
<div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
<div className="bg-neutral-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col items-center gap-6">
        
        {/* Album Cover */}
        <div className="relative">
          <img
            src={currentSong.cover}
            alt="Album Cover"
            draggable={false}
            className="w-48 h-48 rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Song Info */}
        <div className="text-center w-full">
          <h3 className="text-lg font-semibold truncate mb-1">{currentSong.title}</h3>
          <p className="text-sm text-gray-400">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              const audio = audioRef.current;
              if (audio?.duration) {
                const time = percent * audio.duration;
                setHoverTime(formatTime(time));
                setHoverX(x);
              }
            }}
            onMouseLeave={() => setHoverTime(null)}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #1db954 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
            }}
          />
          {hoverTime && (
            <div
              className="absolute -top-8 text-xs bg-white text-black px-2 py-1 rounded shadow-lg pointer-events-none"
              style={{ left: hoverX, transform: 'translateX(-50%)' }}
            >
              {hoverTime}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 w-full">
          <button 
            onClick={playPrevious} 
            className="text-white hover:text-green-400 transition-colors duration-200"
          >
            <BackwardIcon className="w-8 h-8" />
          </button>
          
          <button
            onClick={togglePlayback}
            className="w-14 h-14 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-black ml-0" />
            ) : (
              <PlayIcon className="w-6 h-6 text-black ml-1" />
            )}
          </button>
          
          <button 
            onClick={playNext}
            className="text-white hover:text-green-400 transition-colors duration-200"
          >
            <ForwardIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          preload="auto"
          onEnded={playNext}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={currentSong.audio} type="audio/mpeg" />
        </audio>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}