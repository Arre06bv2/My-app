'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, FolderOpen, Network, TrendingUp, Sparkles, X } from 'lucide-react';
import { useStore } from '@/lib/store';

export function CommandBar() {
  const { commandBarOpen, toggleCommandBar, setCurrentView, notes } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandBar();
      }
      if (e.key === 'Escape' && commandBarOpen) {
        toggleCommandBar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandBarOpen, toggleCommandBar]);

  const commands: { label: string; icon: React.ElementType; action: () => void }[] = [
    { label: 'Go to Dashboard', icon: Search, action: () => { setCurrentView('dashboard'); toggleCommandBar(); } },
    { label: 'Open Knowledge Graph', icon: Network, action: () => { setCurrentView('graph'); toggleCommandBar(); } },
    { label: 'Open Finance Panel', icon: TrendingUp, action: () => { setCurrentView('finance'); toggleCommandBar(); } },
    { label: 'AI Think Mode', icon: Sparkles, action: () => { setCurrentView('ai'); toggleCommandBar(); } },
    { label: 'View All Rooms', icon: FolderOpen, action: () => { setCurrentView('rooms'); toggleCommandBar(); } },
  ];

  const filtered = [
    ...commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    ...notes
      .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((n) => ({
        label: n.title,
        icon: FileText,
        action: () => { setCurrentView('notes'); toggleCommandBar(); },
      })),
  ];

  return (
    <AnimatePresence>
      {commandBarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCommandBar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass-strong overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or jump to..."
                  className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm"
                />
                <button onClick={toggleCommandBar}>
                  <X className="w-4 h-4 text-[var(--text-secondary)] hover:text-white" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={i}
                      onClick={cmd.action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left transition-colors"
                    >
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm text-[var(--text-primary)]">{cmd.label}</span>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-[var(--text-secondary)] text-sm py-6">No results found</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
