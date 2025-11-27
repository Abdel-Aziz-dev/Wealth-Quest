import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { Currency, LanguageCode } from '../types';
import { formatCurrency, formatCompactCurrency } from '../services/gameEngine';
import { t } from '../services/i18n';

interface HistoryPoint {
  month: number;
  value: number;
}

interface Props {
  history: HistoryPoint[];
  currency: Currency;
  lang: LanguageCode;
}

export const WealthChart: React.FC<Props> = ({ history, currency, lang }) => {
  const [range, setRange] = useState<'1Y' | '5Y' | 'ALL'>('ALL');

  const data = useMemo(() => {
    if (!history.length) return [];
    
    const lastMonth = history[history.length - 1].month;
    let filtered = history;

    if (range === '1Y') {
        filtered = history.filter(d => d.month > lastMonth - 12);
    } else if (range === '5Y') {
        filtered = history.filter(d => d.month > lastMonth - 60);
    }

    // Optimization: Downsample large datasets to max ~300 points for smooth rendering
    if (filtered.length > 300) {
        const step = Math.ceil(filtered.length / 300);
        return filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
    }
    return filtered;
  }, [history, range]);

  const gradientOffset = () => {
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    
    if (max <= 0) return 0;
    if (min >= 0) return 1;
    
    return max / (max - min);
  };

  const off = gradientOffset();

  const formatAxis = (val: number) => {
    return formatCompactCurrency(val, currency);
  };

  const formatTooltip = (val: number) => formatCurrency(val, currency);

  return (
    <div className="bg-game-card p-6 rounded-xl border border-slate-700 shadow-xl h-80 flex flex-col transition-all hover:border-slate-600">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
            <h3 className="text-slate-300 font-semibold">{t(lang, 'chart.title')}</h3>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {data.length > 0 ? `Month ${data[0].month} - Month ${data[data.length-1].month}` : t(lang, 'chart.noData')}
            </span>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            {(['1Y', '5Y', 'ALL'] as const).map(r => (
                <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                        range === r ? 'bg-slate-600 text-white shadow ring-1 ring-slate-500' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    {r}
                </button>
            ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset={off} stopColor="#ef4444" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="splitStroke" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#10b981" stopOpacity={1} />
                        <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                    dataKey="month" 
                    hide={true} 
                />
                <YAxis 
                    tickFormatter={formatAxis} 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    width={55}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                    formatter={(val: number) => [formatTooltip(val), t(lang, 'app.netWorth')]}
                    labelFormatter={(label) => `Game Month ${label}`}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="url(#splitStroke)" 
                    fill="url(#splitColor)" 
                    strokeWidth={2}
                    activeDot={{ r: 4, strokeWidth: 2, stroke:'#fff', fill: off > 0.5 ? '#10b981' : '#ef4444' }}
                    animationDuration={500}
                />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};