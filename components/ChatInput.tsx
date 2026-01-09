
import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PaperClipIcon, 
  MicrophoneIcon, 
  ArrowUpIcon,
  GlobeAltIcon,
  XMarkIcon,
  VideoCameraIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { guruService } from '../services/geminiService';

interface ChatInputProps {
  onSend: (text: string, files?: { base64: string, type: string }[]) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<{ base64: string, type: string, preview: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (input.trim() || files.length > 0)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (disabled) return;
    onSend(input, files.map(f => ({ base64: f.base64, type: f.type })));
    setInput('');
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    (Array.from(selectedFiles) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFiles(prev => [...prev, { 
          base64, 
          type: file.type, 
          preview: URL.createObjectURL(file) 
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setTranscribing(true);
          try {
            const text = await guruService.transcribeAudio(base64Audio);
            setInput(prev => (prev ? `${prev} ${text}` : text));
          } catch (error) {
            console.error("Transcription failed", error);
          } finally {
            setTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-5xl mx-auto w-full relative z-[210]">
       <div className="relative bg-[#161616] border border-white/10 rounded-[28px] flex flex-col p-1.5 shadow-3xl transition-all focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/5">
          {/* File Previews */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 border-b border-white/5">
              {files.map((f, i) => (
                <div key={i} className="relative group/file w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                   {f.type.startsWith('image') ? <img src={f.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-white/5"><VideoCameraIcon className="w-8 h-8 text-white/20" /></div>}
                   <button 
                    onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover/file:opacity-100 transition-opacity"
                   >
                     <XMarkIcon className="w-3 h-3" />
                   </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={transcribing}
            placeholder={transcribing ? "Transcribing neural signals..." : "Ask Guru, analyze a video, or edit an image..."}
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 text-white px-6 py-5 text-lg font-medium resize-none custom-scrollbar placeholder:text-white/20"
          />
          
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
             <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2.5 px-4 py-2 bg-white/5 rounded-full text-white/40 border border-white/5">
                   <GlobeAltIcon className="w-4 h-4 text-cyan-500" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Grounding Active</span>
                </div>
             </div>

             <div className="flex items-center space-x-3 pr-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                  accept="image/*,video/*" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-white/20 hover:text-white transition-all hover:bg-white/5 rounded-full"
                >
                   <PaperClipIcon className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                   {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                </button>

                <button 
                  onClick={handleSubmit}
                  disabled={disabled || (!input.trim() && files.length === 0)}
                  className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                    (input.trim() || files.length > 0) ? 'bg-white text-black scale-105 shadow-lg shadow-white/10' : 'bg-white/5 text-white/10'
                  }`}
                >
                   <ArrowUpIcon className="w-5 h-5 stroke-[3]" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ChatInput;
