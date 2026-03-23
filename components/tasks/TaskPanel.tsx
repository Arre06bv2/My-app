'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Flag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Task } from '@/lib/types';

const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const priorityLabels = { high: 'High', medium: 'Med', low: 'Low' };

function TaskItem({ task }: { task: Task }) {
  const { toggleTask, rooms } = useStore();
  const room = rooms.find((r) => r.id === task.roomId);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group ${task.completed ? 'opacity-50' : ''}`}
    >
      <button
        onClick={() => toggleTask(task.id)}
        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
          task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 hover:border-indigo-400'
        }`}
      >
        {task.completed && <span className="text-white text-xs">✓</span>}
      </button>
      <span className={`text-sm flex-1 ${task.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
        {task.title}
      </span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ color: priorityColors[task.priority], background: `${priorityColors[task.priority]}22` }}>
          {priorityLabels[task.priority]}
        </span>
        {room && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: room.color, background: `${room.color}22` }}>
            {room.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function TaskPanel() {
  const { tasks, rooms, addTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id || '');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('medium');
  const [filterRoom, setFilterRoom] = useState<string | null>(null);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle, completed: false, priority: selectedPriority, roomId: selectedRoom });
    setNewTaskTitle('');
  };

  const filtered = filterRoom ? tasks.filter((t) => t.roomId === filterRoom) : tasks;
  const active = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (totalCompleted / tasks.length) * 100 : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-indigo-400" /> Task Manager
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">{totalCompleted}/{tasks.length} tasks completed</p>
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Room Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterRoom(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !filterRoom ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'glass text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          All
        </button>
        {rooms.map((r) => (
          <button
            key={r.id}
            onClick={() => setFilterRoom(filterRoom === r.id ? null : r.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all glass"
            style={{
              color: filterRoom === r.id ? r.color : '#8888aa',
              borderColor: filterRoom === r.id ? `${r.color}44` : 'transparent',
              background: filterRoom === r.id ? `${r.color}15` : undefined,
            }}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Add Task */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-white/20"
          />
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[var(--text-secondary)] outline-none"
          >
            {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Task['priority'])}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[var(--text-secondary)] outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleAddTask}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </GlassCard>

      {/* Active Tasks */}
      {active.length > 0 && (
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 text-indigo-400" /> Active ({active.length})
          </h2>
          <div className="space-y-1">
            {active.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        </GlassCard>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Completed ({completed.length})</h2>
          <div className="space-y-1">
            {completed.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
