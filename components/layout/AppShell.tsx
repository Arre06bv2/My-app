'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Sidebar } from './Sidebar';
import { CommandBar } from './CommandBar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { RoomsView } from '@/components/rooms/RoomsView';
import { NoteList } from '@/components/notes/NoteList';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph';
import { FinancePanel } from '@/components/finance/FinancePanel';
import { ThinkMode } from '@/components/ai/ThinkMode';
import { TaskPanel } from '@/components/tasks/TaskPanel';
import { DeepWorkOverlay } from './DeepWorkOverlay';

const viewLabels: Record<string, string> = {
  dashboard: 'Command Center',
  rooms: 'Knowledge Rooms',
  notes: 'Notes',
  graph: 'Knowledge Graph',
  finance: 'Finance Dashboard',
  ai: 'AI Think Mode',
  tasks: 'Task Manager',
};

export function AppShell() {
  const { currentView, toggleCommandBar, isDeepWorkMode } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandBar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandBar]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-secondary)]">NeuralSpace</span>
            <span className="text-white/20">/</span>
            <span className="text-[var(--text-primary)] font-medium">{viewLabels[currentView] || currentView}</span>
          </div>
          <button
            onClick={toggleCommandBar}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-[var(--text-secondary)] hover:text-white transition-colors text-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="flex items-center gap-1 text-xs opacity-60">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'rooms' && <RoomsView />}
              {currentView === 'notes' && <NoteList />}
              {currentView === 'graph' && <KnowledgeGraph />}
              {currentView === 'finance' && <FinancePanel />}
              {currentView === 'ai' && <ThinkMode />}
              {currentView === 'tasks' && <TaskPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandBar />
      {isDeepWorkMode && <DeepWorkOverlay />}
    </div>
  );
}
