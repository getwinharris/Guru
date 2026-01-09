
import React from 'react';
import { User, KnowledgePatch } from '../types';
import { SparklesIcon, TrophyIcon, UserGroupIcon, ShareIcon } from '@heroicons/react/24/outline';

interface SocialViewProps {
  user: User;
  patches: KnowledgePatch[];
}

const SocialView: React.FC<SocialViewProps> = ({ user, patches }) => {
  const leaderboard: User[] = [
    user,
    { ...user, uid: '2', name: 'Logic_Master', xp: 4500, level: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Logic' },
    { ...user, uid: '3', name: 'Grounding_Guru', xp: 3200, level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru2' },
  ].sort((a, b) => b.xp - a.xp);

  const communityPatches = patches.filter(p => p.type === 'concept' || p.type === 'artifact');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 animate-result">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Community Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Community <span className="text-cyan-500">Nodes</span></h2>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <UserGroupIcon className="w-4 h-4 text-cyan-500" />
               <span className="text-[10px] mono font-bold text-white/40 uppercase tracking-widest">Live Pulse</span>
            </div>
          </div>

          {communityPatches.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[48px]">
               <p className="text-white/20 italic">No shared research patches found in your network.</p>
            </div>
          ) : (
            communityPatches.map(patch => (
              <div key={patch.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-cyan-500/20 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-cyan-500" />
                     </div>
                     <div>
                        <p className="text-[10px] mono font-black text-white/20 uppercase tracking-widest">{patch.type}</p>
                        <p className="text-xs text-white/60">{new Date(patch.timestamp).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <button className="p-3 text-white/20 hover:text-cyan-500 transition-colors">
                     <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xl text-white/80 leading-relaxed font-light">{patch.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Global Leaderboard */}
        <div className="space-y-8">
          <div className="p-8 bg-[#111] border border-white/5 rounded-[48px] shadow-2xl">
            <div className="flex items-center space-x-3 mb-10">
              <TrophyIcon className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold tracking-tight uppercase">Leaderboard</h3>
            </div>
            <div className="space-y-6">
              {leaderboard.map((u, i) => (
                <div key={u.uid} className={`flex items-center justify-between p-4 rounded-3xl border ${u.uid === user.uid ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'bg-white/5 border-transparent'}`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm mono font-black text-white/20">0{i + 1}</span>
                    <img src={u.avatar} className="w-10 h-10 rounded-xl border border-white/10" alt="pfp" />
                    <div>
                      <p className="text-sm font-bold text-white/90">{u.name}</p>
                      <p className="text-[9px] mono text-white/30 uppercase">Lvl {u.level} • {u.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-cyan-500">{u.xp}</p>
                    <p className="text-[8px] mono text-white/20 uppercase tracking-widest">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Card */}
          <div className="p-8 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 rounded-[48px] relative overflow-hidden group">
             <div className="relative z-10 space-y-4">
                <p className="text-[10px] mono font-black text-cyan-500 uppercase tracking-widest">K-Factor Referral</p>
                <h4 className="text-2xl font-black text-white leading-tight">Invite a Friend to <span className="text-cyan-400">Joint Research.</span></h4>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between">
                   <span className="text-lg mono font-bold text-cyan-400">{user.referralCode}</span>
                   <button className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Copy Link</button>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">Earn 500 XP and unlock higher thinking budgets for every grounded referral.</p>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShareIcon className="w-24 h-24 text-white" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialView;
