import React from 'react';
import { Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const ActivityDonutChart = ({ summary }) => {
  const data = summary.studyDistribution || [];
  
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-bg-surface border border-border p-2.5 rounded-xl shadow-2xl text-left select-none pointer-events-none min-w-[120px]">
          <div className="flex justify-between items-center gap-3">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pData.color }}></div>
                <span className="text-[10px] font-black text-text-primary uppercase">{pData.name}</span>
             </div>
             <span className="text-[10px] font-bold text-text-muted">{pData.value}m</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-bg-surface border border-border p-5 rounded-2xl flex flex-col h-full relative">
      <h3 className="text-sm font-black text-text-primary flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-primary" />
        Distribution
      </h3>
      
      {!summary.hasDistributionData && summary.hasLifetimeSessions && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg-surface/90 backdrop-blur-sm rounded-2xl border border-border text-center p-6">
           <Target className="w-6 h-6 text-primary mb-2 opacity-50" />
           <p className="text-xs font-bold text-text-primary mb-1">No distribution data.</p>
           <p className="text-[10px] text-text-muted">Complete a few sessions to see how your time is distributed.</p>
        </div>
      )}
      
      <div className="flex-1 min-h-[220px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summary.hasDistributionData ? data : [{name:'No Data', value:1, color:'var(--color-border)'}]}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {(summary.hasDistributionData ? data : [{name:'No Data', value:1, color:'var(--color-border)'}]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <span className="text-2xl font-black text-text-primary">{summary.todayMinutes}</span>
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Today Mins</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {data.slice(0, 4).map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 w-[45%]">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
            <span className="text-[9px] font-bold text-text-secondary truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
