'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
} from '@heroicons/react/20/solid';
import useWindowStore from '../../utils/windowStore';

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

export default function MusicPlayerApp() {
  const audioRef = useRef(null);
  const { closeWindow, minimizeWindow } = useWindowStore();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const currentSong = songs[currentSongIndex];

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

  // Check if mobile (you can move this to a shared hook)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative w-full h-full select-none flex items-center justify-center">
      <div
        className={`${
          isMobile
            ? 'w-full h-full bg-[#121212] rounded-none shadow-none p-6'
            : 'w-[360px] bg-[#121212]/80 rounded-2xl shadow-2xl backdrop-blur-sm p-4'
        } flex flex-col items-center gap-4`}
      >
        {/* Top Bar with Minimize and Close */}
        <div className="w-full flex justify-end space-x-2">
          <button
            onClick={() => minimizeWindow('music')}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
            aria-label="Minimize"
          >
            <span className="text-white text-xs font-bold -mt-[2px]">_</span>
          </button>
          <button
            onClick={() => closeWindow('music')}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Album Cover */}
        <img
          src={currentSong.cover}
          alt="Album Cover"
          draggable={false}
          className="w-48 h-48 rounded-lg object-cover shadow-md"
        />

        {/* Song Info */}
        <div className="text-center">
          <p className="text-sm font-medium truncate">{currentSong.title}</p>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
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
            className="w-full appearance-none h-1 bg-white rounded cursor-pointer"
            style={{
              background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
            }}
          />
          {hoverTime && (
            <div
              className="absolute -top-6 text-xs bg-white text-black px-2 py-1 rounded shadow"
              style={{ left: hoverX, transform: 'translateX(-50%)' }}
            >
              {hoverTime}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-2">
          <button onClick={playPrevious} className="cursor-pointer">
            <BackwardIcon className="w-6 h-6 text-white hover:text-gray-300 transition" />
          </button>
          <button
            onClick={togglePlayback}
            className="cursor-pointer w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-black" />
            ) : (
              <PlayIcon className="w-6 h-6 text-black" />
            )}
          </button>
          <button onClick={playNext}>
            <ForwardIcon className="cursor-pointer w-6 h-6 text-white hover:text-gray-300 transition" />
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
    </div>
  );
}
