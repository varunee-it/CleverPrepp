import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const StudyTrendChart = ({ summary }) => {
  const [range, setRange] = useState('30'); // '7', '30', '90', '365'
  const [metric, setMetric] = useState('minutes'); // 'minutes', 'points'

  const chartData = useMemo(() => {
    const rawData = summary.heatmap || [];
    const sliceCount = parseInt(range, 10);
    const sliced = rawData.slice(-sliceCount);
    
    return sliced.map(day => ({
      name: new Date(day.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: metric === 'minutes' ? day.minutes : day.points,
    }));
  }, [summary.heatmap, range, metric]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-border p-2.5 rounded-xl shadow-2xl text-left select-none pointer-events-none">
          <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 pb-1 border-b border-border">
            {data.name}
          </div>
          <div className="flex justify-between items-center gap-3">
             <span className="text-[10px] font-bold text-text-muted capitalize">{metric}</span>
             <span className="text-[10px] font-black text-text-primary">{data.value}{metric === 'minutes' ? 'm' : ' XP'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-bg-surface border border-border p-5 rounded-2xl flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
         <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Study Trend
         </h3>
         
         <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-bg-base border border-border rounded-lg p-0.5">
               {['minutes', 'points'].map(m => (
                 <button
                   key={m}
                   onClick={() => setMetric(m)}
                   className={`px-2.5 py-1 text-[9px] font-bold rounded-md capitalize transition-all ${metric === m ? 'bg-bg-surface text-primary shadow-sm border border-border/50' : 'text-text-muted hover:text-text-secondary'}`}
                 >
                   {m === 'points' ? 'XP' : m}
                 </button>
               ))}
            </div>

            <div className="flex bg-bg-base border border-border rounded-lg p-0.5">
               {[
                 { label: '7D', val: '7' },
                 { label: '30D', val: '30' },
                 { label: '90D', val: '90' },
                 { label: '1Y', val: '365' }
               ].map(r => (
                 <button
                   key={r.val}
                   onClick={() => setRange(r.val)}
                   className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${range === r.val ? 'bg-bg-surface text-text-primary shadow-sm border border-border/50' : 'text-text-muted hover:text-text-secondary'}`}
                 >
                   {r.label}
                 </button>
               ))}
            </div>
         </div>
      </div>
      
      <div className="flex-1 min-h-[220px] relative w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fill: 'var(--color-text-muted)', fontWeight: 700 }}
                 dy={10}
                 minTickGap={20}
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fill: 'var(--color-text-muted)', fontWeight: 700 }}
                 tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
               />
               <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
               <Area 
                 type="monotone" 
                 dataKey="value" 
                 stroke="var(--color-primary)" 
                 strokeWidth={2}
                 fillOpacity={1} 
                 fill="url(#colorValue)" 
                 activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }}
                 animationDuration={500}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};
