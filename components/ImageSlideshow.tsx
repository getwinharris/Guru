
import React, { useState, useEffect } from 'react';
import { PhotoIcon, SparklesIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ImageSlideshowProps {
  images: { url: string; title: string }[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-full bg-[#0d0d0d] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 space-y-4 opacity-10">
         <PhotoIcon className="w-12 h-12" />
         <p className="text-[10px] mono uppercase font-black tracking-widest text-center">Visual Lab<br/>Awaiting Analysis</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] border border-white/5 rounded-3xl overflow-hidden relative group">
      {/* Header Overlay */}
      <div className="absolute top-4 left-6 z-30 flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
        <SparklesIcon className="w-3 h-3 text-cyan-400" />
        <span className="text-[9px] mono font-black text-white/80 uppercase tracking-[0.2em]">Images</span>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {images.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
             <img 
               src={img.url} 
               alt={img.title} 
               className="w-full h-full object-cover transition-all duration-[5000ms] group-hover:scale-110" 
             />
             
             {/* Text Content */}
             <div className="absolute bottom-8 left-6 right-20 z-20">
                <div className="flex items-center space-x-3 mb-3">
                   <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center backdrop-blur-md border border-cyan-500/20">
                      <PlayIcon className="w-3 h-3 text-cyan-400" />
                   </div>
                   <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 animate-slide-progress" style={{ animationDuration: '5s' }} />
                   </div>
                </div>
                <h3 className="text-sm font-black text-white leading-tight uppercase tracking-tight italic line-clamp-2">
                   {img.title}
                </h3>
             </div>
          </div>
        ))}

        {/* The reference-specific "AUTO SCROLLING LOOPING" vertical track */}
        <div className="absolute right-0 top-0 bottom-0 w-16 z-30 flex flex-col items-center justify-between py-8 bg-black/40 backdrop-blur-sm border-l border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
           <div className="flex flex-col items-center space-y-4">
              <div className="w-px h-10 bg-gradient-to-t from-cyan-500 to-transparent" />
              <div className="text-[10px] mono font-black text-white uppercase whitespace-nowrap tracking-[0.4em] transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>AUTO SCROLLING</div>
           </div>
           
           <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
              <ArrowPathIcon className="w-4 h-4 text-cyan-500 animate-spin-slow" />
           </div>

           <div className="flex flex-col items-center space-y-4">
              <div className="text-[10px] mono font-black text-white uppercase whitespace-nowrap tracking-[0.4em]" style={{ writingMode: 'vertical-rl' }}>LOOPING</div>
              <div className="w-px h-10 bg-gradient-to-b from-cyan-500 to-transparent" />
           </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-progress {
           0% { width: 0%; }
           100% { width: 100%; }
        }
        .animate-slide-progress {
           animation: slide-progress linear infinite;
        }
        .animate-spin-slow {
           animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ImageSlideshow;
