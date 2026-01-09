
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// Manual base64 decoding as required by guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual base64 encoding for raw audio bytes
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Recommended PCM audio decoding logic for raw streams
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

class LiveService {
  private session: any = null;
  private audioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private inputAudioContext: AudioContext | null = null;
  // FIX: Added property to store the status callback to avoid "Cannot find name" error in disconnect()
  private onStatusChangeCallback: ((status: string) => void) | null = null;

  async connect(onMessage: (text: string) => void, onStatusChange: (status: string) => void) {
    this.onStatusChangeCallback = onStatusChange;
    // Always create a fresh instance before connecting to use latest API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          this.onStatusChangeCallback?.('connected');
          const source = this.inputAudioContext!.createMediaStreamSource(stream);
          const scriptProcessor = this.inputAudioContext!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = this.createBlob(inputData);
            // CRITICAL: Initiate sendRealtimeInput after live.connect call resolves to prevent race conditions
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(this.inputAudioContext!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Process model audio output bytes
          const base64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64) {
            await this.playAudio(base64);
          }
          // Handle audio transcription
          if (message.serverContent?.outputTranscription) {
            onMessage(message.serverContent.outputTranscription.text);
          }
          // Handle model turn interruption
          if (message.serverContent?.interrupted) {
            this.stopAllAudio();
          }
        },
        onerror: (e) => console.error("Live Error", e),
        onclose: () => {
          this.onStatusChangeCallback?.('idle');
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: 'You are Guru, a wise and helpful life mentor. Speak naturally and concisely.',
        outputAudioTranscription: {}
      }
    });

    this.session = await sessionPromise;
  }

  private createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  private async playAudio(base64: string) {
    if (!this.audioContext) return;

    // Use a running timestamp to track the end of the audio playback queue for gapless playback
    this.nextStartTime = Math.max(
      this.nextStartTime,
      this.audioContext.currentTime,
    );

    const audioBuffer = await decodeAudioData(
      decode(base64),
      this.audioContext,
      24000,
      1,
    );

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.addEventListener('ended', () => {
      this.sources.delete(source);
    });

    source.start(this.nextStartTime);
    this.nextStartTime = this.nextStartTime + audioBuffer.duration;
    this.sources.add(source);
  }

  private stopAllAudio() {
    this.sources.forEach(s => {
      try {
        s.stop();
      } catch (e) {}
    });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    this.stopAllAudio();
    // FIX: Correctly call status callback using stored reference
    this.onStatusChangeCallback?.('idle');
  }
}

export const liveService = new LiveService();
