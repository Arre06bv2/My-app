'use client';
import { motion } from 'framer-motion';
import { 
  Brain, LayoutDashboard, FolderOpen, FileText, Network, 
  TrendingUp, Sparkles, CheckSquare, Zap, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ViewType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rooms', label: 'Rooms', icon: FolderOpen },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'graph', label: 'Knowledge Graph', icon: Network },
  { id: 'finance', label: 'Finance', icon: TrendingUp },
  { id: 'ai', label: 'AI Think Mode', icon: Sparkles },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export function Sidebar() {
  const { currentView, setCurrentView, isDeepWorkMode, toggleDeepWork } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative h-screen flex flex-col border-r border-white/[0.06] bg-[#0d0d14] flex-shrink-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Brain className="w-7 h-7 text-indigo-400 flex-shrink-0" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 font-bold text-lg gradient-text whitespace-nowrap"
          >
            NeuralSpace
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              whileHover={{ x: 2 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-indigo-400')} />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/[0.06] space-y-1">
        <motion.button
          onClick={toggleDeepWork}
          whileHover={{ x: 2 }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isDeepWorkMode
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
          )}
        >
          <Zap className={cn('w-4 h-4 flex-shrink-0', isDeepWorkMode && 'text-emerald-400')} />
          {!collapsed && <span className="whitespace-nowrap">Deep Work</span>}
        </motion.button>
        <motion.button
          whileHover={{ x: 2 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </motion.button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1a1a26] border border-white/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
