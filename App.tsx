import React, { useState, useEffect, useRef } from 'react';
import { AppState, Message, ViewMode, User, VisualHighlight, Node3D, Link3D, DiagnosticSession } from './types';
import { guruService } from './services/geminiService';
import { liveService } from './services/liveService';
import { firebaseService } from './services/firebaseService';
import { watcherService } from './services/watcherService';
import { guruBackendConnector } from './services/guruBackendConnector';
import CinemaSubtitles from './components/CinemaSubtitles';
import Sidebar from './components/Sidebar';
import GroundingPanel from './components/GroundingPanel';
import ImageSlideshow from './components/ImageSlideshow';
import AudioCard from './components/AudioCard';
import ChatInput from './components/ChatInput';
import AgentStatusCards from './components/AgentStatusCards';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import SocialView from './components/SocialView';
import AdminView from './components/AdminView';
import ChangelogView from './components/ChangelogView';
import MetaDocs from './components/MetaDocs';
import SpacialFlow from './components/SpacialFlow';
import { 
  ArrowPathIcon,
  CheckBadgeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  BoltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [liveActive, setLiveActive] = useState(false);
  const [lastSpeech, setLastSpeech] = useState('');
  const [lastEnglishSubtitle, setLastEnglishSubtitle] = useState('');
  const [activeSources, setActiveSources] = useState<any[]>([]);
  const [activeImages, setActiveImages] = useState<any[]>([]);
  const [activeRole, setActiveRoleState] = useState('Listener');
  const [spacialData, setSpacialData] = useState<{nodes: Node3D[], links: Link3D[]}>({nodes: [], links: []});
  
  // DIAGNOSTIC MODE (NEW) - wired to guru-backend
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const [diagnosticSession, setDiagnosticSession] = useState<DiagnosticSession | null>(null);
  const [diagnosticDomain, setDiagnosticDomain] = useState('car_repair');
  
  const [genSettings, setGenSettings] = useState({
    aspectRatio: '16:9',
    imageSize: '1K',
    mode: 'chat' as 'chat' | 'image' | 'video' | 'edit' | 'maps' | 'fast'
  });

  const resultsEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    async function init() {
      const user = await firebaseService.getCurrentUser();
      setCurrentUser(user);
    }
    init();
  }, []);

  // DIAGNOSTIC MODE HANDLERS (NEW - wired to guru-backend)
  const startDiagnosticSession = async (domain: string, problemDescription: string) => {
    if (!currentUser) return;
    try {
      const session = await guruBackendConnector.createSession({
        userId: currentUser.uid,
        domain,
        problemDescription
      });
      setDiagnosticSession(session as any);
      setDiagnosticMode(true);
      setAppState(AppState.THINKING);
      setActiveRoleState('Thinker');
    } catch (error) {
      console.error('Failed to start diagnostic session:', error);
      setAppState(AppState.IDLE);
    }
  };

  const recordDiagnosticObservation = async (observation: string) => {
    if (!diagnosticSession) return;
    try {
      const response = await guruBackendConnector.recordObservation({
        sessionId: diagnosticSession.sessionId,
        observation
      });
      // Add to messages as assistant response
      const msg: Message = {
        role: 'assistant',
        content: `Observation recorded. Next: ${response.nextPrompt}`,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isGrounded: true
      };
      setMessages(p => [...p, msg]);
      setAppState(AppState.IDLE);
    } catch (error) {
      console.error('Failed to record observation:', error);
      setAppState(AppState.IDLE);
    }
  };

  const recordDiagnosticBaseline = async (whatWorks: string, constraints: string) => {
    if (!diagnosticSession) return;
    try {
      const response = await guruBackendConnector.recordBaseline({
        sessionId: diagnosticSession.sessionId,
        baseline: { whatWorks, constraints, affectedAreas: [] }
      });
      const msg: Message = {
        role: 'assistant',
        content: `Baseline established. Diagnostic questions coming next...`,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isGrounded: true
      };
      setMessages(p => [...p, msg]);
      setAppState(AppState.IDLE);
    } catch (error) {
      console.error('Failed to record baseline:', error);
      setAppState(AppState.IDLE);
    }
  };

  const endDiagnosticMode = () => {
    setDiagnosticMode(false);
    setDiagnosticSession(null);
  };

  const handleQuery = async (queryText: string, files?: { base64: string, type: string }[]) => {
    if (!queryText.trim() && (!files || files.length === 0)) return;
    if (appState !== AppState.IDLE || !currentUser) return;
    
    // Watcher monitor
    watcherService.monitorQuery(currentUser.uid, queryText);

    // MANDATORY API Key selection check for High-Intelligence/Video models
    if (genSettings.mode === 'image' || genSettings.mode === 'video') {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
    }

    setAppState(AppState.THINKING);
    setActiveRoleState('Thinker');
    
    try {
      let result: any;
      const mediaParts = files?.map(f => ({ inlineData: { data: f.base64, mimeType: f.type } })) || [];

      if (genSettings.mode === 'fast') {
        const text = await guruService.fastChat(queryText);
        result = { content: text, visualHighlights: [] };
      } else if (genSettings.mode === 'image') {
        const url = await guruService.generateImage(queryText, genSettings.aspectRatio, genSettings.imageSize);
        result = { content: "Visual synthesized.", visualHighlights: [{ type: 'image', data: url, keyword: 'Result' }] };
      } else if (genSettings.mode === 'video') {
        const url = await guruService.generateVideo(queryText, files?.[0]?.base64);
        result = { content: "Video generated.", visualHighlights: [{ type: 'simulation', data: url, keyword: 'Veo' }] };
      } else if (genSettings.mode === 'edit' && files?.[0]) {
        const url = await guruService.editImage(files[0].base64, queryText);
        result = { content: "Edit applied.", visualHighlights: [{ type: 'image', data: url, keyword: 'Edited' }] };
      } else if (genSettings.mode === 'maps') {
        const res = await guruService.mapsSearch(queryText);
        result = { content: res.text, sources: res.sources };
      } else {
        result = await guruService.process(queryText, currentUser.uid, mediaParts);
      }

      const assistantMsg: Message = { 
        role: 'assistant', 
        content: result.content, 
        englishSubtitle: result.englishSubtitle || result.content,
        visualHighlights: result.visualHighlights,
        id: Date.now().toString(), 
        timestamp: Date.now(), 
        sources: result.sources,
        isGrounded: true,
        thinkerNotes: result.thinkerNotes
      };
      
      setMessages(p => [...p, { role: 'user', content: queryText, id: 'u-'+Date.now(), timestamp: Date.now() }, assistantMsg]);
      if (result.sources) setActiveSources(result.sources);
      if (result.visualHighlights) {
        setActiveImages(result.visualHighlights
          .filter((h: any) => h.type === 'image' || h.type === 'simulation')
          .map((h: any) => ({ url: h.data, title: h.keyword })));
      }

      // Sync Spacial Logic (TutorAI Visualization Gap)
      if (result.spacialData) {
        setSpacialData(result.spacialData);
      }

      setLastSpeech(result.content);
      setLastEnglishSubtitle(result.englishSubtitle || result.content);

      if (!isMuted && genSettings.mode !== 'fast') {
        setAppState(AppState.SPEAKING);
        setActiveRoleState('Speaker');
        const speech = await guruService.generateSpeech(result.content);
        if (speech) {
          if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
          const decodedBytes = decodeBase64(speech);
          const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.onended = () => {
            setAppState(AppState.IDLE);
            setActiveRoleState('Listener');
          };
          source.start();
        } else {
          setAppState(AppState.IDLE);
          setActiveRoleState('Listener');
        }
      } else {
        setAppState(AppState.IDLE);
        setActiveRoleState('Listener');
      }
    } catch (e: any) { 
      console.error(e); 
      if (e?.message?.includes("Requested entity was not found.") && typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
      }
      setAppState(AppState.IDLE);
      setActiveRoleState('Listener');
    } finally { 
      resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLive = async () => {
    if (liveActive) {
      liveService.disconnect();
      setLiveActive(false);
    } else {
      await liveService.connect(
        (text) => setLastEnglishSubtitle(text),
        (status) => setLiveActive(status === 'connected')
      );
    }
  };

  if (!hasEntered) return <LandingPage onStart={() => setHasEntered(true)} onNavigate={setViewMode} />;

  return (
    <div className="h-screen w-full bg-[#0d0d0d] text-white flex font-['Space_Grotesk'] overflow-hidden">
      <Sidebar viewMode={viewMode} setViewMode={setViewMode} isAdmin={currentUser?.role === 'admin'} />
      <AgentStatusCards appState={appState} activeRole={liveActive ? 'Live' : activeRole} />
      
      {/* 3D Neural Roadmap Renderer (Background) */}
      <SpacialFlow data={spacialData} />

      <div className="flex-1 flex flex-col ml-[72px] relative overflow-hidden">
        {viewMode === 'home' ? (
          <>
            <header className="px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[340px] bg-gradient-to-b from-black/80 to-transparent z-[150] shrink-0 border-b border-white/5 relative">
              <GroundingPanel sources={activeSources} />
              <ImageSlideshow images={activeImages} />
              <AudioCard onSpeak={toggleLive} isListening={false} isSpeaking={liveActive} appState={appState} />
            </header>

            <div className="px-12 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between z-[140]">
               <div className="flex items-center space-x-6">
                  {['chat', 'fast', 'image', 'video', 'edit', 'maps', 'diagnostic'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => {
                        if (m === 'diagnostic') {
                          setDiagnosticMode(!diagnosticMode);
                        } else {
                          setGenSettings({...genSettings, mode: m as any});
                        }
                      }}
                      className={`text-[10px] mono font-black uppercase tracking-widest transition-all ${
                        (m === 'diagnostic' && diagnosticMode) || (m !== 'diagnostic' && genSettings.mode === m) 
                          ? 'text-cyan-500 underline underline-offset-8' 
                          : 'text-white/20 hover:text-white/40'
                      }`}
                    >
                      {m === 'diagnostic' ? '🔍 Mentor' : `${m} Mode`}
                    </button>
                  ))}
               </div>
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full cursor-pointer hover:bg-cyan-500/20 transition-all" onClick={() => setViewMode('changelog')}>
                     <AcademicCapIcon className="w-3 h-3 text-cyan-400" />
                     <span className="text-[9px] mono font-bold uppercase text-cyan-400 tracking-tighter">
                       Academic Logic Active
                     </span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full cursor-pointer" onClick={() => setViewMode('changelog')}>
                     <BoltIcon className="w-3 h-3 text-purple-400" />
                     <span className="text-[9px] mono font-bold uppercase text-purple-400 tracking-tighter">
                       Tutor Orchestration
                     </span>
                  </div>
               </div>
            </div>

            <main className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10 scroll-smooth z-10 flex flex-col items-center relative">
              <div className="w-full max-w-4xl space-y-24 pb-60 pt-4">
                {messages.length === 0 ? (
                   <div className="h-[50vh] flex flex-col items-center justify-center space-y-12 opacity-30 text-center">
                      <SparklesIcon className="w-32 h-32 text-white/20" />
                      <div>
                        <p className="text-7xl font-black uppercase italic tracking-tighter text-white">Guru Hub</p>
                        <p className="text-xl font-medium italic opacity-60 uppercase tracking-[0.5em]">Academic Discovery</p>
                      </div>
                   </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`animate-result ${msg.role === 'assistant' ? 'space-y-10' : 'flex justify-end mb-6'}`}>
                       {msg.role === 'user' ? (
                          <div className="bg-[#1a1a1a] px-10 py-6 rounded-[32px] rounded-br-none max-w-[85%] text-2xl font-bold border border-white/10 shadow-2xl">
                             {msg.content}
                          </div>
                       ) : (
                          <div className="space-y-10 relative">
                             <div className="flex items-center space-x-3 text-xs mono font-black text-white/40 uppercase tracking-[0.4em]">
                                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center border border-white/10">
                                   <CheckBadgeIcon className="w-4 h-4 text-cyan-500" />
                                </div>
                                <span>Answer</span>
                             </div>
                             <div className="text-2xl md:text-3xl font-light leading-relaxed text-white/90">
                                {msg.content}
                             </div>
                             {msg.visualHighlights && (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {msg.visualHighlights.map((v, i) => (
                                     <div key={i} className="rounded-3xl border border-white/5 overflow-hidden bg-black/40">
                                        {v.type === 'image' ? <img src={v.data} className="w-full h-auto" /> : 
                                         v.type === 'simulation' ? <video src={v.data} controls className="w-full h-auto" /> : null}
                                        <div className="p-4 bg-[#111]">
                                           <p className="text-[10px] mono uppercase text-cyan-500 font-black">{v.keyword}</p>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                             )}
                          </div>
                       )}
                    </div>
                  ))
                )}
                <div ref={resultsEndRef} />
              </div>
            </main>

            <footer className="px-12 pb-12 pt-8 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent z-[200] shrink-0">
              <div className="max-w-5xl mx-auto space-y-12">
                 <CinemaSubtitles text={lastSpeech} englishSubtitle={lastEnglishSubtitle} active={appState === AppState.SPEAKING || liveActive} />
                 <ChatInput onSend={handleQuery} disabled={appState !== AppState.IDLE} />
              </div>
            </footer>
          </>
        ) : viewMode === 'changelog' ? (
          <ChangelogView />
        ) : viewMode === 'billing' ? (
          <PricingPage />
        ) : viewMode === 'docs' ? (
          <MetaDocs />
        ) : (
          <SocialView user={currentUser!} patches={[]} />
        )}
      </div>
    </div>
  );
};

export default App;