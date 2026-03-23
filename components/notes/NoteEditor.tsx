'use client';
import { useState, useCallback } from 'react';
import { Bold, Italic, Code, Hash, Link, Eye, EyeOff, Clock } from 'lucide-react';
import { Note } from '@/lib/types';
import { useStore } from '@/lib/store';
import { TagBadge } from '@/components/ui/TagBadge';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, rooms } = useStore();
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const room = rooms.find((r) => r.id === note.roomId);

  const wordCount = note.content.split(/\s+/).filter(Boolean).length;
  const lastEdited = new Date(note.updatedAt).toLocaleString();

  const handleContentChange = useCallback((value: string) => {
    updateNote(note.id, { content: value });
  }, [note.id, updateNote]);

  const handleTitleChange = useCallback((value: string) => {
    updateNote(note.id, { title: value });
  }, [note.id, updateNote]);

  const addTag = (tag: string) => {
    const cleaned = tag.replace(/^#/, '').trim();
    if (cleaned && !note.tags.includes(cleaned)) {
      updateNote(note.id, { tags: [...note.tags, cleaned] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tag) });
  };

  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = note.content.substring(start, end);
    const newContent = note.content.substring(0, start) + before + selected + after + note.content.substring(end);
    updateNote(note.id, { content: newContent });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: room?.color || '#6366f1' }} />
          <span className="text-xs text-[var(--text-secondary)]">{room?.name}</span>
        </div>
        <input
          value={note.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-2xl font-bold text-[var(--text-primary)] bg-transparent outline-none border-none placeholder:text-white/20"
          placeholder="Untitled"
        />
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {note.tags.map((tag) => (
            <button key={tag} onClick={() => removeTag(tag)}>
              <TagBadge tag={tag} color={room?.color} />
            </button>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
            }}
            placeholder="#add tag"
            className="text-xs bg-transparent outline-none text-indigo-400 placeholder:text-white/20 w-20"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-8 py-2 border-b border-white/[0.06]">
        <button onClick={() => insertAtCursor('**', '**')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => insertAtCursor('*', '*')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => insertAtCursor('`', '`')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors">
          <Code className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => insertAtCursor('$$', '$$')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors text-xs font-bold">
          Σ
        </button>
        <button onClick={() => insertAtCursor('## ')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors">
          <Hash className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => insertAtCursor('[', '](url)')} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-colors">
          <Link className="w-3.5 h-3.5" />
        </button>
        <div className="ml-auto flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lastEdited}
          </span>
          <span>{wordCount} words</span>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"
          >
            {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {preview ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {note.content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="note-content"
            value={note.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-white/20 resize-none font-mono leading-relaxed"
            placeholder="Start writing... Supports Markdown and LaTeX ($$equation$$)"
          />
        )}
      </div>
    </div>
  );
}
