export interface Room {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  notes: string[];
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  roomId: string;
  tags: string[];
  links: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  roomId: string;
  noteId?: string;
  dueDate?: string;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'room' | 'note' | 'concept' | 'ticker';
  color: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export type ViewType = 'dashboard' | 'rooms' | 'notes' | 'graph' | 'finance' | 'ai' | 'tasks';

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
}

export interface AIResponse {
  topic: string;
  summary: string;
  analysis: string;
  keyTopics: string[];
  mindmap: MindMapNode;
  suggestions: string[];
  noteContent: string;
}

export type MascotMood = 'idle' | 'thinking' | 'celebrating' | 'encouraging';
