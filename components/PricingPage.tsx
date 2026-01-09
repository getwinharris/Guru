
import React from 'react';
import { CheckIcon, SparklesIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const PricingPage: React.FC = () => {
  const tiers = [
    {
      name: "Free Student",
      price: "$0",
      desc: "Fundamental discovery for occasional research.",
      features: ["Standard Thinker Node", "5 Grounding Sources/Query", "Public Library Access", "Community Badges"],
      color: "text-white/40",
      border: "border-white/5"
    },
    {
      name: "Pro Mentor",
      price: "$20",
      desc: "High-priority reasoning for professional project-building.",
      features: ["High Thinking Budget (32k)", "50+ Grounding Sources", "Google Workspace Sync", "Private Spacial Labs", "Priority Speaker TTS"],
      color: "text-cyan-500",
      border: "border-cyan-500/30",
      popular: true
    },
    {
      name: "Elite Architect",
      price: "$49",
      desc: "The ultimate neural experience for teams and lead devs.",
      features: ["Max Thinking Budget", "Deep Arxiv/Github Indexing", "Custom Agent Personas", "Team Research Threads", "API Access"],
      color: "text-purple-500",
      border: "border-purple-500/30"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-16 animate-result">
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-cyan-500">Tier.</span></h2>
        <p className="text-white/40 text-xl font-light italic">Unlock advanced thinking budgets and deep neural grounding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {tiers.map((tier, i) => (
            <div key={i} className={`p-10 bg-[#111] border ${tier.border} rounded-[48px] space-y-8 relative overflow-hidden group hover:scale-[1.02] transition-all`}>
               {tier.popular && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-bl-3xl">
                     Most Popular
                  </div>
               )}
               
               <div className="space-y-2">
                  <h3 className={`text-xl font-black uppercase tracking-widest ${tier.color}`}>{tier.name}</h3>
                  <div className="flex items-baseline space-x-1">
                     <span className="text-5xl font-black">{tier.price}</span>
                     <span className="text-white/20 text-sm mono">/mo</span>
                  </div>
                  <p className="text-sm text-white/40 font-light">{tier.desc}</p>
               </div>

               <ul className="space-y-4 pt-6">
                  {tier.features.map((f, j) => (
                     <li key={j} className="flex items-start space-x-3">
                        <CheckIcon className={`w-5 h-5 shrink-0 ${tier.color}`} />
                        <span className="text-xs text-white/60 font-medium">{f}</span>
                     </li>
                  ))}
               </ul>

               <button className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all ${tier.popular ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                  Upgrade Now
               </button>
            </div>
         ))}
      </div>

      <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[64px] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2">
            <p className="text-cyan-500 mono font-black text-xs uppercase tracking-[0.4em]">Referral Boost</p>
            <h4 className="text-3xl font-black uppercase italic text-white">Share Guru. Earn XP.</h4>
            <p className="text-white/40 font-light">Get a $5 credit and unlock Elite Thinking mode for 1 month for every friend who joins.</p>
         </div>
         <button className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-all">
            Get Referral Link
         </button>
      </div>
    </div>
  );
};

export default PricingPage;
