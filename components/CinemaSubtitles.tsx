
import React, { useState, useEffect } from 'react';

interface CinemaSubtitlesProps {
  text: string;
  englishSubtitle?: string;
  active: boolean;
}

const CinemaSubtitles: React.FC<CinemaSubtitlesProps> = ({ text, englishSubtitle, active }) => {
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const content = englishSubtitle || text || "";
  const words = content.split(" ");

  useEffect(() => {
    if (active && words.length > 0) {
      setHighlightIndex(0);
      // Adaptive timing for word-by-word bolding
      const interval = setInterval(() => {
        setHighlightIndex(prev => {
          if (prev < words.length - 1) return prev + 1;
          return prev;
        });
      }, 240); // Standard speaking rate approx 240ms per word
      return () => clearInterval(interval);
    } else {
      setHighlightIndex(-1);
    }
  }, [active, content]);

  if (!active || words.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center pointer-events-none mb-10 z-[300]">
      <div className="relative flex flex-col items-center max-w-6xl text-center px-12">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute -inset-24 bg-cyan-500/5 blur-[120px] rounded-full opacity-30 animate-pulse" />
        
        {/* Dynamic Bolding Text */}
        <div className="relative text-white tracking-tight cinema-text text-3xl md:text-5xl font-light leading-tight transition-all duration-700">
          {words.map((word, i) => (
            <span 
              key={i} 
              className={`inline-block mr-[0.3em] transition-all duration-300 ${
                i === highlightIndex 
                ? 'text-white font-black scale-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]' 
                : i < highlightIndex 
                  ? 'text-white/40 font-medium' 
                  : 'text-white/20'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CinemaSubtitles;
