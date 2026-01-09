
import React, { useState } from 'react';
import { SpeakerWaveIcon, MicrophoneIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface AudioCardProps {
  onSpeak: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  appState: string;
}

const AudioCard: React.FC<AudioCardProps> = ({ onSpeak, isListening, isSpeaking, appState }) => {
  const [tapped, setTapped] = useState(false);

  const handleClick = () => {
    setTapped(!tapped);
    onSpeak();
  };

  return (
    <div className={`h-full flex flex-col bg-[#0d0d0d] border rounded-3xl overflow-hidden transition-all duration-500 ${isSpeaking || isListening ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'border-white/5'}`}>
      <div className="px-6 py-4 border-b border-white/5 flex items-center space-x-2">
        <SpeakerWaveIcon className={`w-4 h-4 ${isSpeaking ? 'text-cyan-500' : 'text-white/40'}`} />
        <span className="text-[10px] mono font-black text-white/40 uppercase tracking-widest">Voice Lab</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8 relative overflow-hidden">
        {/* Pulsing Rings */}
        {(isSpeaking || isListening) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full border border-cyan-500/20 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full border border-cyan-500/10 animate-ping delay-700" />
          </div>
        )}

        <button 
          onClick={handleClick}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
            isListening ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/20' : 
            isSpeaking ? 'bg-cyan-500 text-black scale-110' : 
            'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isListening ? (
            <StopIcon className="w-10 h-10" />
          ) : isSpeaking ? (
            <SpeakerWaveIcon className="w-10 h-10 animate-pulse" />
          ) : appState === 'thinking' ? (
            <ArrowPathIcon className="w-10 h-10 animate-spin" />
          ) : (
            <MicrophoneIcon className="w-10 h-10" />
          )}
        </button>

        <div className="text-center space-y-1 relative z-10">
          <p className="text-sm font-bold text-white uppercase tracking-tight">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking' : 'Tap to Consult'}
          </p>
          <p className="text-[10px] mono text-white/20 uppercase tracking-widest">
            {isListening ? 'Awaiting prompt' : isSpeaking ? 'Guru Replying' : 'Manual Mic Mode'}
          </p>
        </div>
      </div>

      <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
          {isSpeaking ? 'Speak back to reply after completion' : 'Manual Toggle Required'}
        </p>
      </div>
    </div>
  );
};

export default AudioCard;
