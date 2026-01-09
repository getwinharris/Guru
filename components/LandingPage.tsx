import React from 'react';
import { SparklesIcon, BoltIcon, GlobeAltIcon, CpuChipIcon, ArrowRightIcon, BookOpenIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { ViewMode } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (mode: ViewMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-[#0d0d0d] overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Shaders */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
        </div>

        <div className="relative z-10 text-center space-y-12 max-w-5xl">
           <div className="flex justify-center">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center space-x-2 backdrop-blur-xl">
                 <BoltIcon className="w-4 h-4 text-cyan-500" />
                 <span className="text-[10px] mono font-black text-white/60 uppercase tracking-[0.3em]">Neural Mentorship v3.1.1</span>
              </div>
           </div>

           <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              Always <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Learning.</span><br/>
              Always On.
           </h1>

           <p className="text-xl md:text-2xl font-light text-white/40 max-w-2xl mx-auto leading-relaxed">
              Guru is a dual-node discovery engine that grounds every answer in 50+ real-time sources across the global neural web.
           </p>

           <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
              >
                 <span className="relative z-10 flex items-center space-x-3">
                    <span>Enter Knowledge Hub</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </span>
              </button>
              <button 
                onClick={() => onNavigate('docs')}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-white/10 transition-all"
              >
                 Core Docs
              </button>
           </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-12 bg-black/40 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
               { icon: GlobeAltIcon, title: "Deep Grounding", desc: "Unlike standard LLMs, our Thinker node scans Arxiv, GitHub, and Social Trends for every prompt." },
               { icon: CpuChipIcon, title: "Dual-Node Logic", desc: "Separating cold research (Thinker) from warm mentorship (Speaker) for absolute factual authority." },
               { icon: SparklesIcon, title: "Visual Synthesis", desc: "Real-time p5.js simulations and interactive 3D concept maps generated as you learn." }
            ].map((f, i) => (
               <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] space-y-6 hover:border-cyan-500/20 transition-all group">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <f.icon className="w-8 h-8 text-cyan-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase italic tracking-tight">{f.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Footer Menu */}
      <footer className="py-20 px-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="space-y-6">
              <div className="flex items-center space-x-3">
                 <BoltIcon className="w-6 h-6 text-cyan-500" />
                 <span className="text-2xl font-black uppercase italic tracking-tight">Guru.</span>
              </div>
              <p className="text-white/20 text-xs font-medium leading-relaxed uppercase tracking-widest">
                 The world's first agentic life mentor ecosystem. Grounded in reality. Powered by Gemini 3.
              </p>
           </div>
           
           <div className="space-y-4">
              <h4 className="text-[10px] mono font-black text-white/40 uppercase tracking-[0.4em]">Knowledge Base</h4>
              <ul className="space-y-2">
                 <li><button onClick={() => { onStart(); onNavigate('home'); }} className="text-xs text-white/60 hover:text-cyan-500 transition-colors uppercase tracking-widest font-black">Neural Index</button></li>
                 <li><button onClick={() => { onStart(); onNavigate('discover'); }} className="text-xs text-white/60 hover:text-cyan-500 transition-colors uppercase tracking-widest font-black">Source Signals</button></li>
                 <li><button onClick={() => { onStart(); onNavigate('docs'); }} className="text-xs text-white/60 hover:text-cyan-500 transition-colors uppercase tracking-widest font-black">Architecture Docs</button></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] mono font-black text-white/40 uppercase tracking-[0.4em]">Continuity</h4>
              <ul className="space-y-2">
                 <li><button onClick={() => { onStart(); onNavigate('changelog'); }} className="text-xs text-white/60 hover:text-cyan-500 transition-colors uppercase tracking-widest font-black flex items-center space-x-2">
                    <CommandLineIcon className="w-3 h-3" />
                    <span>System Changelog</span>
                 </button></li>
                 <li><button onClick={() => { onStart(); onNavigate('docs'); }} className="text-xs text-white/60 hover:text-cyan-500 transition-colors uppercase tracking-widest font-black">Operational Safety</button></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] mono font-black text-white/40 uppercase tracking-[0.4em]">Connect</h4>
              <div className="flex space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer">
                    <GlobeAltIcon className="w-5 h-5 text-white/40" />
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer">
                    <BookOpenIcon className="w-5 h-5 text-white/40" />
                 </div>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[9px] mono font-black text-white/10 uppercase tracking-[0.5em]">&copy; 2026 GURU NEURAL MENTORSHIP ECOSYSTEM</p>
           <div className="flex space-x-8">
              <span className="text-[9px] mono font-black text-cyan-500/40 uppercase tracking-widest">Latency: 240ms</span>
              <span className="text-[9px] mono font-black text-purple-500/40 uppercase tracking-widest">Grounding: 50+</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;