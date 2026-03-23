import { create } from 'zustand';
import { Room, Note, Task, ViewType } from './types';

interface AppState {
  rooms: Room[];
  notes: Note[];
  tasks: Task[];
  currentView: ViewType;
  selectedRoom: string | null;
  selectedNote: string | null;
  isDeepWorkMode: boolean;
  commandBarOpen: boolean;
  setCurrentView: (view: ViewType) => void;
  setSelectedRoom: (id: string | null) => void;
  setSelectedNote: (id: string | null) => void;
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'tasks'>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  toggleDeepWork: () => void;
  toggleCommandBar: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
}

const sampleNotes: Note[] = [
  {
    id: 'n1',
    title: 'Momentum Factor Research',
    content: '## Momentum Factor\n\nMomentum is one of the most robust factors in finance.\n\n### Key Findings\n- 12-1 month return predicts next month return\n- Works across asset classes\n- Crashes during market reversals\n\n$$\\text{Mom}_{t} = \\frac{P_{t-1}}{P_{t-12}} - 1$$\n\n### Tags\n#quant #momentum #factor',
    roomId: 'r1',
    tags: ['quant', 'momentum', 'factor'],
    links: ['n2'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n2',
    title: 'Mean Reversion Strategies',
    content: '## Mean Reversion\n\nPrices tend to revert to their mean over time.\n\n### Pairs Trading\nStatistical arbitrage using cointegrated pairs.\n\n```python\nfrom statsmodels.tsa.stattools import coint\nscores, pvalues, _ = coint(series_a, series_b)\n```\n\n#quant #mean-reversion #stat-arb',
    roomId: 'r1',
    tags: ['quant', 'mean-reversion', 'stat-arb'],
    links: ['n1'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Fed Policy & Rate Cycles',
    content: '## Federal Reserve Policy\n\n### Current Cycle Analysis\nThe Fed has been in a tightening cycle since 2022.\n\n### Historical Patterns\n- Rate hikes typically last 12-18 months\n- Inversion precedes recession by 6-18 months\n- Watch for pivot signals\n\n#macro #fed #rates',
    roomId: 'r2',
    tags: ['macro', 'fed', 'rates'],
    links: ['n4'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n4',
    title: 'Dollar Wrecking Ball Theory',
    content: '## DXY Strength Thesis\n\nStrong dollar creates cascading effects globally.\n\n### Mechanism\n1. EM debt denominated in USD becomes expensive\n2. Commodity prices fall (in USD terms)\n3. Global liquidity tightens\n\n#macro #dxy #em #commodities',
    roomId: 'r2',
    tags: ['macro', 'dxy', 'em'],
    links: ['n3'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'n5',
    title: 'Morning Routine Optimization',
    content: '## Optimal Morning Stack\n\n- [ ] 5:30 AM Wake up (no snooze)\n- [ ] Cold shower (3 min)\n- [ ] Meditation (20 min)\n- [ ] Exercise (45 min)\n- [ ] Deep work block (90 min)\n\n### Why This Works\nCortisol peak at ~30min after waking.\n\n#habits #routine #optimization',
    roomId: 'r3',
    tags: ['habits', 'routine', 'optimization'],
    links: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'n6',
    title: 'SPY Iron Condor Nov Expiry',
    content: '## Trade Setup\n\n**Ticker:** SPY\n**Strategy:** Iron Condor\n**Expiry:** Nov 15\n\n### Strikes\n- Sell 420C / Buy 430C\n- Sell 380P / Buy 370P\n\n**Premium Received:** $2.45\n**Max Loss:** $7.55\n**Probability of Profit:** 68%\n\n#trading #options #spy',
    roomId: 'r4',
    tags: ['trading', 'options', 'spy'],
    links: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const sampleTasks: Task[] = [
  { id: 't1', title: 'Backtest momentum strategy on futures', completed: false, priority: 'high', roomId: 'r1', createdAt: new Date().toISOString() },
  { id: 't2', title: 'Read Fama-French 5 factor paper', completed: true, priority: 'medium', roomId: 'r1', createdAt: new Date().toISOString() },
  { id: 't3', title: 'Update macro dashboard with latest CPI data', completed: false, priority: 'high', roomId: 'r2', createdAt: new Date().toISOString() },
  { id: 't4', title: 'Review Fed meeting minutes', completed: false, priority: 'medium', roomId: 'r2', createdAt: new Date().toISOString() },
  { id: 't5', title: 'Complete 10-day meditation streak', completed: false, priority: 'low', roomId: 'r3', createdAt: new Date().toISOString() },
  { id: 't6', title: 'Log trade results for October', completed: true, priority: 'high', roomId: 'r4', createdAt: new Date().toISOString() },
  { id: 't7', title: 'Set up options screener', completed: false, priority: 'medium', roomId: 'r4', createdAt: new Date().toISOString() },
];

const sampleRooms: Room[] = [
  {
    id: 'r1',
    name: 'Quant Research',
    description: 'Algorithmic strategies, factor models, and backtesting',
    color: '#6366f1',
    icon: 'Brain',
    notes: ['n1', 'n2'],
    tasks: ['t1', 't2'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'r2',
    name: 'Macro Economics',
    description: 'Global macro, central bank policy, and market cycles',
    color: '#06b6d4',
    icon: 'TrendingUp',
    notes: ['n3', 'n4'],
    tasks: ['t3', 't4'],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'r3',
    name: 'Personal Growth',
    description: 'Habits, health, learning, and life optimization',
    color: '#10b981',
    icon: 'Zap',
    notes: ['n5'],
    tasks: ['t5'],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'r4',
    name: 'Trading Journal',
    description: 'Trade logs, setups, and post-trade analysis',
    color: '#f59e0b',
    icon: 'FileText',
    notes: ['n6'],
    tasks: ['t6', 't7'],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const useStore = create<AppState>((set) => ({
  rooms: sampleRooms,
  notes: sampleNotes,
  tasks: sampleTasks,
  currentView: 'dashboard',
  selectedRoom: null,
  selectedNote: null,
  isDeepWorkMode: false,
  commandBarOpen: false,
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedRoom: (id) => set({ selectedRoom: id }),
  setSelectedNote: (id) => set({ selectedNote: id }),
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, {
      ...room,
      id: crypto.randomUUID(),
      notes: [],
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  addNote: (note) => set((state) => ({
    notes: [...state.notes, {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }],
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
  })),
  toggleDeepWork: () => set((state) => ({ isDeepWorkMode: !state.isDeepWorkMode })),
  toggleCommandBar: () => set((state) => ({ commandBarOpen: !state.commandBarOpen })),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map((n) => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n),
  })),
}));
