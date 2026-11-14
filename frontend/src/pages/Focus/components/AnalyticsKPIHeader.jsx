import React from 'react';
import { Zap, Trophy, Star, Brain, CalendarDays, Clock } from 'lucide-react';

export const AnalyticsKPIHeader = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* Current Streak */}
      <div className="bg-bg-surface border border-primary/30 p-3.5 rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)] relative overflow-hidden group hover:-translate-y-0.5 transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Current Streak</span>
        </div>
        <div className="flex items-end gap-1.5 relative z-10">
          <span className="text-xl font-black text-text-primary leading-none">{summary.currentStreak}</span>
          <span className="text-xs font-bold text-text-muted mb-0.5">Days</span>
        </div>
        <div className="mt-1.5 text-[9px] font-bold text-primary relative z-10">
          +1 today 🔥
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-bg-surface border border-border p-3.5 rounded-xl hover:border-border-hover hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Longest Streak</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-xl font-black text-text-primary leading-none">{summary.longestStreak}</span>
          <span className="text-xs font-bold text-text-muted mb-0.5">Days</span>
        </div>
      </div>

      {/* Total XP */}
      <div className="bg-bg-surface border border-border p-3.5 rounded-xl hover:border-border-hover hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total XP</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-xl font-black text-text-primary leading-none">{summary.totalXP.toLocaleString()}</span>
        </div>
      </div>

      {/* Deep Focus Score */}
      <div className="bg-bg-surface border border-border p-3.5 rounded-xl hover:border-border-hover hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-pink-400" />
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Deep Focus</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-xl font-black text-text-primary leading-none">{summary.deepFocusScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Study Days */}
      <div className="bg-bg-surface border border-border p-3.5 rounded-xl hover:border-border-hover hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Study Days</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-xl font-black text-text-primary leading-none">{summary.totalSessions}</span>
          <span className="text-xs font-bold text-text-muted mb-0.5">Days</span>
        </div>
      </div>

      {/* Total Focus Time */}
      <div className="bg-bg-surface border border-border p-3.5 rounded-xl hover:border-border-hover hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Time</span>
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-xl font-black text-text-primary leading-none">{summary.totalHours}</span>
          <span className="text-xs font-bold text-text-muted mb-0.5">Hrs</span>
        </div>
      </div>

    </div>
  );
};
