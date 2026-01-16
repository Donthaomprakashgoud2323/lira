
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { LIRA_SYSTEM_INSTRUCTION } from '../constants';
import { decodePCM, decodeAudioData, encodePCM } from '../services/geminiService';

const LiraVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: LIRA_SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encodePCM(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = outputContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decodePCM(base64Audio),
                outCtx,
                24000,
                1
              );
              
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Voice Error:", e);
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start voice session:", err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 glass rounded-3xl space-y-6">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-indigo-100 scale-110 shadow-[0_0_50px_rgba(99,102,241,0.5)]' : 'bg-white'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-500' : 'bg-gray-200'}`}>
            <i className={`fa-solid ${isActive ? 'fa-microphone text-white text-3xl' : 'fa-microphone-slash text-gray-400 text-3xl'}`}></i>
          </div>
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-ping opacity-40 [animation-delay:1s]"></div>
            </>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-gray-800">
          {isActive ? "Lira is listening..." : isConnecting ? "Waking up Lira..." : "Talk to Lira"}
        </h3>
        <p className="text-gray-500 max-w-xs">
          {isActive 
            ? "Speak freely. Tell Lira about your day, your tasks, or how you're feeling." 
            : "Tap to start an empathetic conversation."}
        </p>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg active:scale-95 ${
          isActive 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
        }`}
      >
        {isActive ? "End Conversation" : isConnecting ? "Connecting..." : "Start Speaking"}
      </button>
    </div>
  );
};

export default LiraVoice;
