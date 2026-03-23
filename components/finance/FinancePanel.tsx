'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

const tickers = [
  { symbol: 'SPY', price: 447.82, change: 1.24, changeP: 0.28 },
  { symbol: 'QQQ', price: 378.15, change: -2.13, changeP: -0.56 },
  { symbol: 'BTC', price: 43250, change: 1250, changeP: 2.98 },
  { symbol: 'GLD', price: 185.42, change: 0.87, changeP: 0.47 },
  { symbol: 'TLT', price: 91.23, change: -0.43, changeP: -0.47 },
];

const macroData = [
  { label: 'Fed Rate', value: '5.25-5.50%', color: '#ef4444' },
  { label: 'DXY', value: '104.32', color: '#6366f1' },
  { label: 'VIX', value: '14.82', color: '#f59e0b' },
  { label: '10Y Yield', value: '4.45%', color: '#10b981' },
];

const strategies = [
  { name: 'SPY Iron Condor', type: 'Options', status: 'Active', pnl: '+$245', color: '#10b981' },
  { name: 'QQQ Momentum Long', type: 'Equity', status: 'Watching', pnl: '+$1,240', color: '#6366f1' },
  { name: 'TLT Rate Hedge', type: 'Bond', status: 'Active', pnl: '-$87', color: '#ef4444' },
];

function generatePortfolioData() {
  const data = [];
  let value = 100000;
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    value = value * (1 + (Math.random() - 0.45) * 0.012);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value),
    });
  }
  return data;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export function FinancePanel() {
  const [chartPeriod, setChartPeriod] = useState('30D');
  const [portfolioData] = useState(() => generatePortfolioData());

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finance Dashboard</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Market overview & strategy tracker</p>
      </motion.div>

      {/* Macro Row */}
      <motion.div variants={item} className="grid grid-cols-4 gap-3">
        {macroData.map((m) => (
          <GlassCard key={m.label} className="p-4">
            <p className="text-xs text-[var(--text-secondary)] mb-1">{m.label}</p>
            <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-5 gap-4">
        {/* Watchlist */}
        <motion.div variants={item} className="col-span-2">
          <GlassCard className="p-5 h-full">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Watchlist
            </h2>
            <div className="space-y-3">
              {tickers.map((t) => (
                <div key={t.symbol} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{t.symbol}</p>
                    <p className="text-xs text-[var(--text-secondary)]">${t.price.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${t.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {t.change >= 0 ? '+' : ''}{t.changeP.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Portfolio Chart */}
        <motion.div variants={item} className="col-span-3">
          <GlassCard className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Portfolio Performance
              </h2>
              <div className="flex gap-1">
                {['7D', '30D', '90D'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      chartPeriod === p ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#8888aa', fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#8888aa' }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Strategy Journal */}
      <motion.div variants={item}>
        <GlassCard className="p-5">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Strategy Journal</h2>
          <div className="grid grid-cols-3 gap-4">
            {strategies.map((s) => (
              <div key={s.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{s.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{s.status}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.name}</p>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.pnl}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
