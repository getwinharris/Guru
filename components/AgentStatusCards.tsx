
import React, { useEffect, useState } from 'react';
import { WatcherStatus } from '../types';
import { watcherService } from '../services/watcherService';
import { 
  CpuChipIcon, 
  BeakerIcon, 
  SpeakerWaveIcon, 
  EyeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AgentStatusCardsProps {
  appState: string;
  activeRole: string;
}

const AgentStatusCards: React.FC<AgentStatusCardsProps> = ({ appState, activeRole }) => {
  const [watcherStatus, setWatcherStatus] = useState<WatcherStatus>(watcherService.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setWatcherStatus(watcherService.getStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const agents = [
    {
      id: 'thinker',
      name: 'Thinker',
      role: 'Grounding Node',
      icon: CpuChipIcon,
      status: activeRole === 'Thinker' ? 'Researching' : 'Standby',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      id: 'researcher',
      name: 'Discoverer',
      role: 'Source Ranking',
      icon: BeakerIcon,
      status: activeRole === 'Thinker' ? 'Indexing' : 'Standby',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 'speaker',
      name: 'Speaker',
      role: 'Synthesis Node',
      icon: SpeakerWaveIcon,
      status: activeRole === 'Speaker' ? 'Mentoring' : 'Standby',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      id: 'watcher',
      name: 'Watcher',
      role: 'Global Context',
      icon: EyeIcon,
      status: watcherStatus.activeTasks.length > 0 ? 'Updating' : 'Watching',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      subtext: `Neural Sync: ${watcherStatus.systemHealth.toFixed(0)}%`
    }
  ];

  return (
    <div className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-6 z-[100] w-60">
      <div className="px-6 mb-2 flex items-center space-x-2">
         <SparklesIcon className="w-4 h-4 text-cyan-500" />
         <p className="text-[11px] mono font-black text-white/30 uppercase tracking-[0.4em]">Core Roles</p>
      </div>
      {agents.map((agent) => (
        <div 
          key={agent.id} 
          className={`p-5 bg-[#0d0d0d]/90 backdrop-blur-3xl border ${agent.borderColor} rounded-[40px] space-y-4 transition-all duration-700 ${agent.status !== 'Standby' && agent.status !== 'Watching' ? 'scale-110 shadow-2xl shadow-cyan-500/10 translate-x-[-10px]' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-80'}`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 ${agent.bgColor} rounded-2xl ${agent.color}`}>
              <agent.icon className="w-6 h-6" />
            </div>
            {agent.status !== 'Standby' && agent.status !== 'Watching' ? (
              <div className="relative">
                <div className={`absolute inset-0 ${agent.color} animate-ping opacity-20`} />
                <ArrowPathIcon className={`w-5 h-5 ${agent.color} animate-spin`} />
              </div>
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-white/10" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
               <h4 className="text-[15px] font-black text-white italic">{agent.name}</h4>
               <span className={`text-[9px] mono font-bold uppercase ${agent.color} px-2 py-0.5 bg-white/5 rounded-full tracking-widest`}>{agent.status}</span>
            </div>
            <p className="text-[11px] text-white/40 font-medium tracking-tight leading-none">{agent.role}</p>
            {agent.subtext && <p className="text-[10px] mono text-white/20 mt-2 uppercase tracking-widest font-black leading-none">{agent.subtext}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentStatusCards;
