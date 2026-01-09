
import React, { useEffect, useState } from 'react';
import { ChangelogEntry } from '../types';
import { watcherService } from '../services/watcherService';
import { 
  ArrowPathIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon,
  TagIcon,
  BoltIcon,
  CpuChipIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const ChangelogView: React.FC = () => {
  const [logs, setLogs] = useState<ChangelogEntry[]>([]);
  const [benchmarks, setBenchmarks] = useState(watcherService.getBenchmarks());

  useEffect(() => {
    setLogs(watcherService.getLogs());
    const interval = setInterval(() => {
      setLogs(watcherService.getLogs());
      setBenchmarks(watcherService.getBenchmarks());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <SparklesIcon className="w-4 h-4 text-cyan-500" />;
      case 'sync': return <ArrowPathIcon className="w-4 h-4 text-green-500" />;
      case 'security': return <ShieldCheckIcon className="w-4 h-4 text-purple-500" />;
      default: return <WrenchScrewdriverIcon className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 animate-result space-y-20">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-cyan-500">
           <ArrowPathIcon className="w-8 h-8" />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Autonomous <span className="text-white">Changelog</span></h2>
        </div>
        <p className="text-white/40 text-lg font-light italic">The Watcher agent identifies code updates and indexes trending knowledge automatically.</p>
      </div>

      {/* System Benchmark Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { icon: BoltIcon, label: "Thinking Budget", value: benchmarks.thinkingBudget, color: "text-cyan-500" },
           { icon: CpuChipIcon, label: "Mean Latency", value: benchmarks.latency, color: "text-purple-500" },
           { icon: GlobeAltIcon, label: "Grounding Depth", value: benchmarks.groundingDepth, color: "text-amber-500" },
           { icon: SparklesIcon, label: "Vibe Score", value: benchmarks.vibeScore, color: "text-green-500" }
         ].map((b, i) => (
           <div key={i} className="p-6 bg-[#111] border border-white/5 rounded-[32px] space-y-3 group hover:border-white/10 transition-all">
              <div className={`${b.color} w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center`}>
                 <b.icon className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-[9px] mono font-bold text-white/20 uppercase tracking-widest">{b.label}</p>
                 <p className="text-lg font-black text-white">{b.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-12">
        <h3 className="text-xl font-black uppercase italic tracking-tight text-white/20 px-10">Neural Pulse Log</h3>
        {logs.map((log) => (
          <div key={log.id} className="relative pl-10 border-l border-white/5 pb-12 last:pb-0">
             <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
             
             <div className="space-y-4">
                <div className="flex items-center space-x-4">
                   <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] mono font-bold text-white/40 uppercase tracking-widest">
                      {log.version}
                   </span>
                   <span className="text-xs text-white/20 mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>

                <div className="p-8 bg-[#111] border border-white/5 rounded-[40px] space-y-4 hover:border-cyan-500/20 transition-all">
                   <div className="flex items-center space-x-2">
                      {getTypeIcon(log.type)}
                      <h3 className="text-xl font-bold text-white">{log.title}</h3>
                   </div>
                   <p className="text-white/60 font-light leading-relaxed">{log.description}</p>
                   
                   <div className="pt-4 flex items-center space-x-2">
                      <TagIcon className="w-3 h-3 text-white/20" />
                      <span className="text-[9px] mono text-white/20 uppercase tracking-[0.2em]">{log.type} event synchronized</span>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangelogView;
