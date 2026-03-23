'use client';
import { motion } from 'framer-motion';
import { FileText, CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { TagBadge } from '@/components/ui/TagBadge';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const { notes, tasks, rooms, setCurrentView, setSelectedNote } = useStore();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const recentNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 5);

  const stats = [
    { label: 'Active Notes', value: notes.length, sub: '+3 this week', icon: FileText, color: '#6366f1' },
    { label: 'Tasks Today', value: `${completedTasks}/${totalTasks}`, sub: `${Math.round((completedTasks / totalTasks) * 100)}% complete`, icon: CheckSquare, color: '#10b981' },
    { label: 'Deep Work Hours', value: '6.5h', sub: 'this week', icon: Clock, color: '#f59e0b' },
  ];

  const habits = [
    { label: 'Meditation', done: true },
    { label: 'Exercise', done: true },
    { label: 'Reading', done: false },
    { label: 'Journaling', done: true },
    { label: 'Cold Shower', done: false },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Good morning 👋
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.sub}</p>
                </div>
                <div className="p-2.5 rounded-xl" style={{ background: `${stat.color}22` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Middle Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Today's Focus */}
        <motion.div variants={item} className="col-span-3 space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Today's Focus</h2>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {activeTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-sm text-[var(--text-primary)] flex-1">{task.title}</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {rooms.find((r) => r.id === task.roomId)?.name}
                  </span>
                </div>
              ))}
            </div>
            <textarea
              placeholder="Quick capture — press Enter to save..."
              className="w-full bg-white/5 rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder:text-white/20 outline-none resize-none h-20 border border-white/5 focus:border-indigo-500/30 transition-colors"
            />
          </GlassCard>
        </motion.div>

        {/* Active Rooms */}
        <motion.div variants={item} className="col-span-2 space-y-3">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Rooms</h2>
              <button
                onClick={() => setCurrentView('rooms')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {rooms.map((room) => (
                <motion.button
                  key={room.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setCurrentView('rooms')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${room.color}22` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: room.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{room.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{room.notes.length} notes · {room.tasks.length} tasks</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Notes */}
        <motion.div variants={item}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Notes</h2>
              <button
                onClick={() => setCurrentView('notes')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <motion.button
                  key={note.id}
                  whileHover={{ x: 3 }}
                  onClick={() => { setSelectedNote(note.id); setCurrentView('notes'); }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{note.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {note.tags.slice(0, 2).map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Habit Tracker */}
        <motion.div variants={item}>
          <GlassCard className="p-5">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Daily Habits</h2>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.label} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-primary)]">{habit.label}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    habit.done ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-white/10 text-transparent'
                  }`}>
                    {habit.done && <span className="text-xs">✓</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
                <span>Weekly streak</span>
                <span className="text-emerald-400 font-medium">7 days 🔥</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 5 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
