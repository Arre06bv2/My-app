'use client';
import { motion } from 'framer-motion';
import { FileText, CheckSquare, ArrowRight } from 'lucide-react';
import { Room } from '@/lib/types';
import { useStore } from '@/lib/store';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { setSelectedRoom, setCurrentView, notes, tasks } = useStore();
  const roomNotes = notes.filter((n) => n.roomId === room.id);
  const roomTasks = tasks.filter((t) => t.roomId === room.id);
  const completedTasks = roomTasks.filter((t) => t.completed).length;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass p-6 cursor-pointer group"
      onClick={() => { setSelectedRoom(room.id); setCurrentView('notes'); }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${room.color}22`, border: `1px solid ${room.color}44` }}
        >
          <div className="w-5 h-5 rounded-full" style={{ background: room.color, boxShadow: `0 0 15px ${room.color}66` }} />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </div>

      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{room.name}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-5 line-clamp-2">{room.description}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <FileText className="w-3.5 h-3.5" />
          <span>{roomNotes.length} notes</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{completedTasks}/{roomTasks.length} tasks</span>
        </div>
      </div>

      {roomTasks.length > 0 && (
        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(completedTasks / roomTasks.length) * 100}%`, background: room.color }}
          />
        </div>
      )}
    </motion.div>
  );
}
