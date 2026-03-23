'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CloudRain, Trees, Coffee, Play, Pause, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';

export function DeepWorkOverlay() {
  const { toggleDeepWork, tasks } = useStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambient, setAmbient] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) { setIsRunning(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const ambients = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'forest', label: 'Forest', icon: Trees },
    { id: 'cafe', label: 'Café', icon: Coffee },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(40px)', background: 'rgba(10,10,15,0.92)' }}
    >
      <button
        onClick={toggleDeepWork}
        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-2xl mx-auto px-6 space-y-8">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] text-sm mb-2">DEEP WORK SESSION</p>
          <h2 className="text-6xl font-bold font-mono text-white tracking-tight">
            {minutes}:{seconds}
          </h2>
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setTimeLeft(25 * 60); setIsRunning(false); }}
            className="flex items-center gap-2 px-4 py-3 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="glass p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-3">CURRENT FOCUS</p>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {task.title}
              </div>
            ))}
            {activeTasks.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)]">No active tasks — stay present</p>
            )}
          </div>
        </div>

        <div className="glass p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-3">SESSION NOTES</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Capture thoughts without leaving focus mode..."
            className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-white/20 resize-none h-20"
          />
        </div>

        <div className="flex items-center gap-3 justify-center">
          {ambients.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAmbient(ambient === id ? null : id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                ambient === id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-white/40 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
