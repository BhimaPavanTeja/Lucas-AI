"use client";

import React, { useRef, useEffect, useState } from 'react';
import AIAvatar from './ai-avatar';

type Message = { role: 'user' | 'ai'; text: string };

export default function AICharacter() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [analysis, setAnalysis] = useState<{ attention?: string; emotion?: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi — I am Lucas, your virtual tutor. Say hello or start the camera to begin.' },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [choices, setChoices] = useState<string[] | null>(null);
  const messagesRef = useRef<Message[]>(messages);
  const isRecordingRef = useRef(false);
  const [input, setInput] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const sendTimerRef = useRef<number | null>(null);
  const captureIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);

        // capture frames every 2s
        captureIntervalRef.current = window.setInterval(() => captureAndAnalyze(), 2000);
      }
    } catch (err) {
      console.error('Camera start failed', err);
    }
  };

  const sendText = async (text: string) => {
    if (!text) return;
    // avoid duplicate user messages
    const last = messagesRef.current[messagesRef.current.length - 1];
    if (last?.role === 'user' && last.text === text) return;
    const userMsg: Message = { role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setChoices(null);

    // clear any pending auto-send countdown (from recognition)
    if (sendTimerRef.current) {
      clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
      setCountdown(0);
    }

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, analysis }),
      });
      const json = await res.json();
      const replyText = json?.reply ?? 'Sorry, I could not respond.';
      const reply: Message = { role: 'ai', text: replyText };
      setMessages((m) => [...m, reply]);
      setChoices(json?.choices ?? null);
      speak(replyText);
    } catch (err) {
      console.error('AI chat failed', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setStreaming(false);
  };

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const res = await fetch('/api/observe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const json = await res.json();
      setAnalysis(json);
    } catch (err) {
      console.error('Analyze failed', err);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    // avoid duplicate user messages (same text sent already)
    const last = messagesRef.current[messagesRef.current.length - 1];
    if (last?.role === 'user' && last.text === text) return;
    const userMsg: Message = { role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, analysis }),
      });
      const json = await res.json();
      const replyText = json?.reply ?? 'Sorry, I could not respond.';
      const reply: Message = { role: 'ai', text: replyText };
      setMessages((m) => [...m, reply]);
      speak(replyText);
    } catch (err) {
      console.error('AI chat failed', err);
    }
    // clear any auto-send countdown when message is sent manually or automatically
    if (sendTimerRef.current) {
      clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    setCountdown(0);
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // Speak a greeting when the component mounts (once per session)
  useEffect(() => {
    const initialGreeting = 'Hi — I am Lucas, your virtual tutor. Say hello or start the camera to begin.';
    try {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('lucas_ai_greeting_spoken')) {
        speak(initialGreeting);
        sessionStorage.setItem('lucas_ai_greeting_spoken', '1');
      }
    } catch (e) {
      // if storage isn't available, still attempt to speak
      speak(initialGreeting);
    }
  }, []);

  const startListening = () => {
    // Prefer browser SpeechRecognition (live STT) when available for accurate transcripts.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const hasMediaRecorder = typeof window !== 'undefined' && 'MediaRecorder' in window;

    if (SpeechRecognition) {
      // use live recognition (best UX and accuracy in supported browsers)
      startRecognition(SpeechRecognition);
    } else if (hasMediaRecorder) {
      // fallback to short recording + server-side transcription
      startRecording(5);
    } else {
      alert('No speech input available in this browser.');
    }
  };

  const startRecognition = (SpeechRecognition: any) => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);
    recognition.onerror = (ev: any) => {
      console.error('Recognition error', ev);
      setRecognizing(false);
    };
    recognition.onresult = (event: any) => {
      // ignore recognition results while MediaRecorder flow is active
      if (isRecordingRef.current) return;
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
      // start auto-send countdown (5s)
      startAutoSendCountdown();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start failed', e);
    }
  };

  const stopListening = () => {
    const r = recognitionRef.current;
    if (r) {
      try {
        r.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setRecognizing(false);
    // clear any pending auto-send timer
    if (sendTimerRef.current) {
      clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    setCountdown(0);
    // stop recording and upload
    stopRecordingAndUpload();
  };

  const startAutoSendCountdown = () => {
    if (sendTimerRef.current) {
      clearInterval(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    setCountdown(5);
    sendTimerRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (sendTimerRef.current) {
            clearInterval(sendTimerRef.current);
            sendTimerRef.current = null;
          }
          setCountdown(0);
          setTimeout(() => sendMessage(), 50);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const startRecording = async (seconds = 5) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      isRecordingRef.current = true;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        // upload and transcribe
        try {
          await uploadAudioBlob(blob);
        } finally {
          // ensure recording state cleared
          isRecordingRef.current = false;
          setRecognizing(false);
          // stop tracks
          stream.getTracks().forEach((t) => t.stop());
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      // auto-stop after seconds
      window.setTimeout(() => {
        try {
          mr.stop();
        } catch (e) {
          /* ignore */
        }
      }, seconds * 1000);
      setRecognizing(true);
    } catch (err) {
      console.error('Recording start failed', err);
    }
  };

  const stopRecordingAndUpload = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      try {
        mr.stop();
      } catch (e) {
        console.warn('stop recording', e);
      }
    }
    mediaRecorderRef.current = null;
  };

  const uploadAudioBlob = async (blob: Blob) => {
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: dataUrl }),
      });
      const json = await res.json();
      const transcript = json?.transcript ?? '';
      if (transcript) {
        setInput(transcript);
          // auto-send the transcribed text and clear recording state
          setTimeout(async () => {
            await sendText(transcript);
            setRecognizing(false);
          }, 50);
      }
    } catch (err) {
      console.error('Upload audio failed', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">AI Character — interactive tutor</h2>
        <div className="flex items-start gap-4">
          <AIAvatar speaking={isSpeaking} emotion={analysis?.emotion ?? 'neutral'} />
          <div className="flex-1">
            <div className="border rounded-md p-3 h-56 overflow-auto bg-background">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === 'ai' ? 'text-left' : 'text-right'}`}>
                  <div className={`inline-block px-3 py-2 rounded ${m.role === 'ai' ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            {choices && (
              <div className="mt-2 flex gap-2">
                {choices.map((c, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline"
                    onClick={() => {
                      sendText(c);
                      setChoices(null);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <form onSubmit={sendMessage} className="flex-1 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk to the AI character..."
              className="flex-1 input"
            />
            <button type="submit" className="btn">Send</button>
          </form>
          <button
            onClick={() => (recognizing ? stopListening() : startListening())}
            className={`h-10 px-3 rounded ${recognizing ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
            aria-pressed={recognizing}
          >
            {recognizing ? 'Stop' : 'Voice'}{countdown > 0 ? ` (${countdown}s)` : ''}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Observe student (video)</h2>
        <div className="border rounded-md p-3 bg-background">
          <div className="flex flex-col gap-2">
            <video ref={videoRef} className="w-full rounded bg-black" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              {!streaming ? (
                <button onClick={startCamera} className="btn">Start Camera</button>
              ) : (
                <button onClick={stopCamera} className="btn-ghost">Stop Camera</button>
              )}
              <button onClick={captureAndAnalyze} className="btn">Analyze Now</button>
            </div>
            <div className="mt-2">
              <p className="text-sm">Last analysis:</p>
              <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(analysis, null, 2)}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
