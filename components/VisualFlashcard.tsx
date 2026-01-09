
import React from 'react';
import { VisualHighlight } from '../types';
import { ShoppingBagIcon, SparklesIcon, AcademicCapIcon, BoltIcon, ArrowTopRightOnSquareIcon, BeakerIcon } from '@heroicons/react/24/outline';

interface VisualFlashcardProps {
  highlights: VisualHighlight[];
  active: boolean;
}

const VisualFlashcard: React.FC<VisualFlashcardProps> = ({ highlights, active }) => {
  if (!active || highlights.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {highlights.slice(0, 4).map((h, i) => (
        <div 
          key={h.conceptId || i} 
          className="group relative bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500"
        >
          {/* Card Media */}
          <div className="aspect-square relative bg-black/40 overflow-hidden">
             {h.type === 'shop' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                   <ShoppingBagIcon className="w-8 h-8 text-amber-400 mb-2" />
                   <p className="text-[10px] mono font-black text-white/20 uppercase tracking-widest">Resource</p>
                </div>
             ) : h.type === 'formula' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                   <code className="text-[10px] mono font-bold text-indigo-400 break-all">{h.data || h.keyword}</code>
                </div>
             ) : (
                <img 
                  src={`https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300&h=300&keyword=${encodeURIComponent(h.keyword)}`} 
                  alt={h.keyword} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3000ms]"
                />
             )}
             <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
                {h.type === 'flashcard' ? <AcademicCapIcon className="w-3 h-3 text-cyan-500" /> : <SparklesIcon className="w-3 h-3 text-cyan-500" />}
             </div>
          </div>

          {/* Card Info */}
          <div className="p-4 bg-[#111]/80 backdrop-blur-md">
             <div className="flex items-center space-x-1.5 mb-1 opacity-40">
                <span className="text-[8px] mono font-black text-white uppercase tracking-[0.2em]">{h.type}</span>
             </div>
             <h4 className="text-xs font-bold text-white/90 leading-tight truncate">{h.keyword}</h4>
             
             {h.externalLink && (
                <a href={h.externalLink} target="_blank" className="mt-3 flex items-center space-x-1 text-[9px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors">
                   <span>Link</span>
                   <ArrowTopRightOnSquareIcon className="w-2.5 h-2.5" />
                </a>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisualFlashcard;
