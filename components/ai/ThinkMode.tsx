'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, Send, Brain, Network, BookOpen, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const templates = [
  { icon: Brain, label: 'Analyze', prompt: 'Analyze the following concept in depth:' },
  { icon: Network, label: 'Compare', prompt: 'Compare and contrast these two ideas:' },
  { icon: BookOpen, label: 'Summarize', prompt: 'Summarize the key points of:' },
  { icon: Zap, label: 'Flashcards', prompt: 'Generate 5 flashcards for studying:' },
];

const recentConversations = [
  { title: 'Analysis of momentum factor decay', time: '2h ago' },
  { title: 'Fed rate hiking cycles vs. equities', time: 'Yesterday' },
  { title: 'Morning routine optimization strategies', time: '3 days ago' },
];

function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
      ))}
      <span className="text-xs text-[var(--text-secondary)] ml-1">Thinking...</span>
    </div>
  );
}

const mockResponse = `## Structured Analysis

### Key Concepts Identified
1. **Primary concept** — Core mechanism and how it operates
2. **Related framework** — Supporting theory and evidence  
3. **Practical application** — Real-world implementations

### Connections to Existing Notes
- Links to: *Momentum Factor Research* (high relevance)
- Links to: *Fed Policy & Rate Cycles* (moderate relevance)

### Suggested Next Steps
- [ ] Research the empirical evidence
- [ ] Test the hypothesis with data
- [ ] Create a dedicated knowledge room

### Mind Map Structure
\`\`\`
Core Concept
├── Sub-concept A → implication
├── Sub-concept B → application  
└── Sub-concept C → open question
\`\`\`

> 💡 **Insight:** This connects to the broader theme of systematic thinking and evidence-based decision making.`;

export function ThinkMode() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState(false);

  const handleExpand = async () => {
    if (!input.trim()) return;
    setThinking(true);
    setResponse('');
    await new Promise((r) => setTimeout(r, 1800));
    setThinking(false);
    setResponse(mockResponse);
  };

  const applyTemplate = (prompt: string) => {
    setInput(prompt + ' ');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" /> AI Think Mode
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Expand your thinking, connect ideas, and build knowledge</p>
      </div>

      {/* Template Buttons */}
      <div className="flex flex-wrap gap-2">
        {templates.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            onClick={() => applyTemplate(prompt)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[var(--text-secondary)] hover:text-indigo-300 hover:border-indigo-500/30 transition-all"
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Input Area */}
        <div className="col-span-2 space-y-3">
          <GlassCard className="p-5">
            <p className="text-xs text-[var(--text-secondary)] mb-3 uppercase tracking-wider">What are you thinking about?</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a concept, question, or idea you want to explore..."
              className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-white/20 resize-none h-36 leading-relaxed"
            />
            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
              <button
                onClick={() => setRecording(!recording)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                  recording ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'glass text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <motion.div animate={recording ? { scale: [1, 1.3, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}>
                  <Mic className="w-3.5 h-3.5" />
                </motion.div>
                {recording ? 'Recording...' : 'Voice Input'}
              </button>
              <button
                onClick={handleExpand}
                disabled={!input.trim() || thinking}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Expand
              </button>
            </div>
          </GlassCard>

          {/* Response */}
          <AnimatePresence>
            {(thinking || response) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">AI Response</span>
                  </div>
                  {thinking ? (
                    <ThinkingAnimation />
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)]">
                      {response.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="text-[var(--text-primary)] font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                        if (line.startsWith('### ')) return <h3 key={i} className="text-indigo-300 font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-indigo-500 pl-3 italic">{line.replace('> ', '')}</blockquote>;
                        return <p key={i} className="my-1">{line}</p>;
                      })}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Conversations */}
        <div className="space-y-3">
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {recentConversations.map((conv, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 3 }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <p className="text-xs font-medium text-[var(--text-primary)] mb-1 group-hover:text-indigo-300 transition-colors">{conv.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{conv.time}</p>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
