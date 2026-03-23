'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { NoteEditor } from './NoteEditor';
import { TagBadge } from '@/components/ui/TagBadge';

export function NoteList() {
  const { notes, rooms, selectedNote, setSelectedNote } = useStore();
  const [search, setSearch] = useState('');

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const activeNote = notes.find((n) => n.id === selectedNote) || filtered[0];

  return (
    <div className="flex h-full">
      {/* Note List */}
      <div className="w-72 border-r border-white/[0.06] flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
            />
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium hover:bg-indigo-500/30 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((note) => {
            const room = rooms.find((r) => r.id === note.roomId);
            const isActive = activeNote?.id === note.id;
            return (
              <motion.button
                key={note.id}
                onClick={() => setSelectedNote(note.id)}
                whileHover={{ x: 2 }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-500/15 border border-indigo-500/25' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 flex-shrink-0" style={{ color: room?.color || '#6366f1' }} />
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">{note.title}</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
                  {note.content.replace(/[#*`]/g, '').slice(0, 80)}...
                </p>
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map((tag) => (
                    <TagBadge key={tag} tag={tag} color={room?.color} />
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeNote ? (
          <NoteEditor note={activeNote} />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
