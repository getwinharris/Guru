import React from 'react';
import { GroundingSource } from '../types';
import { GlobeAltIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface GroundingPanelProps {
  sources: GroundingSource[];
}

const GroundingPanel: React.FC<GroundingPanelProps> = ({ sources }) => {
  // Pad sources heavily to ensure a seamless infinite scroll loop even with few items
  const displaySources = sources.length > 0 
    ? Array(6).fill(sources).flat() 
    : [];

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] border border-white/5 rounded-3xl overflow-hidden group relative">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]/95 backdrop-blur-xl z-20">
        <div className="flex items-center space-x-2">
          <GlobeAltIcon className="w-4 h-4 text-cyan-500 animate-pulse" />
          <span className="text-[10px] mono font-black text-white/40 uppercase tracking-widest">Neural Citations</span>
        </div>
        <div className="flex items-center space-x-2">
           <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500/60" />
           <span className="text-[9px] mono text-cyan-500/60 font-black tracking-widest uppercase">{sources.length}+ Academic Citations</span>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden mask-fade-v">
        {displaySources.length > 0 ? (
          <div className="absolute inset-0 flex flex-col space-y-2 p-4 animate-source-scroll">
            {displaySources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl transition-all shrink-0 hover:bg-white/[0.05] hover:border-cyan-500/40 group/item"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                   <img 
                     src={`https://www.google.com/s2/favicons?domain=${new URL(source.uri).hostname}&sz=32`} 
                     className="w-4 h-4 opacity-50 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all" 
                     alt="" 
                     onError={(e) => (e.currentTarget.style.display = 'none')}
                   />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black text-white/80 truncate uppercase tracking-tight group-hover/item:text-cyan-400 transition-colors">{source.title}</h4>
                  <p className="text-[8px] text-white/20 mono truncate">{new URL(source.uri).hostname}</p>
                </div>
                <ArrowTopRightOnSquareIcon className="w-3 h-3 text-white/10 group-hover/item:text-cyan-500 transition-all" />
              </a>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 space-y-4 opacity-10 text-center">
             <GlobeAltIcon className="w-12 h-12" />
             <p className="text-[10px] mono font-black uppercase tracking-[0.5em]">Establishing Academic Grounding...</p>
          </div>
        )}
      </div>

      <style>{`
        .animate-source-scroll {
          animation: source-scroll 45s linear infinite;
        }
        @keyframes source-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .mask-fade-v {
          mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </div>
  );
};

export default GroundingPanel;