
import React from 'react';
import { CommandLineIcon, BoltIcon, BeakerIcon, CpuChipIcon, CloudIcon, ServerIcon } from '@heroicons/react/24/outline';

const MetaDocs: React.FC = () => {
  const techStack = [
    { title: 'Gemini 3 Pro', desc: 'Core reasoning engine with 1M context window and native multimodal synthesis.', icon: CpuChipIcon },
    { title: 'Thinking Budget', desc: 'Explicit 32k token allocation for complex architectural planning and cross-source grounding.', icon: BoltIcon },
    { title: 'Genkit Orchestration', desc: 'Typed AI flows managing the handoff between Thinker, Speaker, and Researcher nodes.', icon: CommandLineIcon },
    { title: 'Firebase Studio', desc: 'Scalable backend for stateful recall, identity management, and real-time social nodes.', icon: CloudIcon },
    { title: 'Workspace SDK', desc: 'Native automation for Google Sheets (Ledger), Calendar (Continuity), and Drive (NotebookLM).', icon: ServerIcon },
    { title: 'Simulation Labs', desc: 'Real-time p5.js execution environment for testing technical concepts on the fly.', icon: BeakerIcon }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 animate-result">
      <div className="space-y-4 mb-20 text-center">
        <h2 className="text-6xl font-black tracking-tighter uppercase italic">The Guru <span className="text-cyan-500">Core.</span></h2>
        <p className="text-white/40 text-xl font-light italic">Production-grade documentation of our technical nervous system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((item, i) => (
          <div key={i} className="p-8 bg-[#111] border border-white/5 rounded-[48px] hover:border-cyan-500/30 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
              <item.icon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-cyan-500/5 border border-cyan-500/10 rounded-[64px] space-y-6">
        <h3 className="text-2xl font-black text-white italic uppercase">Operational Guardrails</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-2">
              <p className="text-[10px] mono font-bold text-cyan-500 uppercase tracking-widest">Synthesis Policy</p>
              <p className="text-sm text-white/60">Every project indexes at least 50 global source signals. We prioritize Hugging Face and GitHub repositories for AI/ML mastery.</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] mono font-bold text-cyan-500 uppercase tracking-widest">Simulation Safety</p>
              <p className="text-sm text-white/60">Logic simulations are generated in sandboxed p5.js environments, allowing users to visualize complex data flows without side effects.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MetaDocs;
