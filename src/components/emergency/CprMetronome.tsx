import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Play, Square, Activity, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export const CprMetronome: React.FC = () => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [compressions, setCompressions] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [isBeating, setIsBeating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // 110 BPM = 545.45 ms interval (optimal zone within 100-120 BPM)
  const bpm = 110;
  const intervalMs = (60 / bpm) * 1000;

  const playClick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioContextRef.current.currentTime); // 880 Hz crisp clinical tone
      gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);
      osc.start();
      osc.stop(audioContextRef.current.currentTime + 0.08);
    } catch {
      // AudioContext could be blocked by autoplay policies
    }
  };

  const startMetronome = () => {
    setIsPlaying(true);
    playClick();
    setIsBeating(true);
    setTimeout(() => setIsBeating(false), 120);

    setCompressions((prev) => {
      const next = prev + 1;
      if (next >= 30) {
        setCycle((c) => c + 1);
        return 0;
      }
      return next;
    });

    intervalRef.current = window.setInterval(() => {
      playClick();
      setIsBeating(true);
      setTimeout(() => setIsBeating(false), 120);

      setCompressions((prev) => {
        const next = prev + 1;
        if (next >= 30) {
          setCycle((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, intervalMs);
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetCounter = () => {
    stopMetronome();
    setCompressions(0);
    setCycle(1);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, []);

  const isAr = language === 'ar';

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="font-bold text-sm text-slate-100">
            {isAr ? 'ميترونوم الإنعاش القلبي (110 ضغطة/د)' : 'CPR Chest Compression Metronome (110 BPM)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Tone' : 'Enable Tone'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={resetCounter}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Reset Counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Pulsing Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">{t.compressionCount}</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {compressions} <span className="text-xs text-slate-500 font-sans">/ 30</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">{t.cycleCount}</div>
          <div className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
            #{cycle}
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-400 mb-1">{isAr ? 'الإيقاع' : 'Cadence'}</div>
          <div
            className={`w-6 h-6 rounded-full transition-transform duration-100 flex items-center justify-center ${
              isBeating ? 'bg-rose-500 scale-125 shadow-lg shadow-rose-500/50' : 'bg-slate-800 scale-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-400 mb-1">{isAr ? 'بروتوكول الدورة' : 'Cycle Rule'}</div>
          <div className="text-xs font-semibold text-rose-300">
            {isAr ? '30 ضغطة : نَفَسين' : '30:2 Compressions'}
          </div>
        </div>
      </div>

      {/* Control Action Button */}
      <div className="flex items-center gap-3">
        {isPlaying ? (
          <button
            onClick={stopMetronome}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>{t.stopCprMetronome}</span>
          </button>
        ) : (
          <button
            onClick={startMetronome}
            className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t.startCprMetronome}</span>
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-400 text-center">
        {isAr
          ? 'وفق إرشادات AHA 2026: استمر بالضغطات بعمق 5-6 سم مع السماح بالارتداد الكامل للصدر.'
          : 'AHA 2026 Guidelines: Compress 5-6 cm deep and ensure complete chest recoil between strokes.'}
      </p>
    </div>
  );
};
