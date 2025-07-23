'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';


export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('New York');
const [inputCity, setInputCity] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch failed', err);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="text-white px-3 py-1 hover:bg-neutral-800 rounded cursor-pointer"
      >
        {weather?.current?.temp_c ?? '--'}°C
      </div>

      {open && weather && (
        <div className="absolute bottom-16 right-0 bg-[#1e1e1e] text-white rounded-lg shadow-lg w-64 p-4 z-50">
         <form onSubmit={handleSearch} className="mb-2 relative">
  <MagnifyingGlassIcon className="w-4 h-4 text-gray-300 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
  <input
    type="text"
    value={inputCity}
    onChange={(e) => setInputCity(e.target.value)}
    className="w-full pl-8 pr-2 py-1 bg-neutral-700 text-white rounded outline-none text-sm"
    placeholder="Search city / zipcode"
  />
</form>

          <div className="text-sm">
            <div className="font-semibold text-lg">{weather.location.name}</div>
            <div className="text-gray-400 text-xs mb-2">
              {weather.location.region}, {weather.location.country}
            </div>
            <div className="flex items-center gap-2">
              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="w-8 h-8"
              />
              <div>
                <div>{weather.current.condition.text}</div>
                <div className="text-xs text-gray-400">
                  Feels like {weather.current.feelslike_c}°C
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-300">
              Wind: {weather.current.wind_kph} kph {weather.current.wind_dir} <br />
              Humidity: {weather.current.humidity}% <br />
              UV: {weather.current.uv}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
