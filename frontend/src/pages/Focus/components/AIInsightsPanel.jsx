import React from 'react';
import { Sparkles, Trophy, Target, Zap, Clock, Star } from 'lucide-react';

export const AIInsightsPanel = ({ summary }) => {
  const insights = summary.insights || [];
  const records = summary.records || {};

  return (
    <div className="flex flex-col gap-6">
      
      {/* AI Insights Generated Cards */}
      <div className="bg-bg-surface border border-border p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
        
        <h3 className="text-sm font-black text-text-primary flex items-center gap-2 mb-5 relative z-10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Insights
        </h3>
        
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm font-bold text-text-primary mb-1">You're building momentum.</p>
            <p className="text-xs font-medium text-text-muted">Complete a few more focus sessions to unlock deeper productivity trends.</p>
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 bg-bg-base/50 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-sm">{insight.icon}</span>
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-black text-text-primary leading-snug">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Records */}
      <div className="bg-bg-surface border border-border p-5 rounded-2xl">
        <h3 className="text-sm font-black text-text-primary flex items-center gap-2 mb-5">
          <Trophy className="w-4 h-4 text-primary" />
          Personal Records
        </h3>

        <div className="grid grid-cols-2 gap-3">
           <div className="p-3 bg-bg-base rounded-xl border border-border text-center flex flex-col justify-center min-h-[80px]">
              <div className="flex items-center justify-center gap-1.5 mb-1.5 text-text-muted">
                 <Clock className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Longest Session</span>
              </div>
              <span className="text-lg font-black text-text-primary leading-none">{records.longestSession}m</span>
           </div>

           <div className="p-3 bg-bg-base rounded-xl border border-border text-center flex flex-col justify-center min-h-[80px]">
              <div className="flex items-center justify-center gap-1.5 mb-1.5 text-text-muted">
                 <Star className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Highest XP Day</span>
              </div>
              <span className="text-lg font-black text-text-primary leading-none">{records.highestXpDay} XP</span>
           </div>

           <div className="p-3 bg-bg-base rounded-xl border border-border text-center flex flex-col justify-center min-h-[80px]">
              <div className="flex items-center justify-center gap-1.5 mb-1.5 text-text-muted">
                 <Zap className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Fastest Quiz</span>
              </div>
              <span className="text-lg font-black text-text-primary leading-none text-text-muted">{records.fastestQuiz}</span>
           </div>

           <div className="p-3 bg-bg-base rounded-xl border border-border text-center flex flex-col justify-center min-h-[80px]">
              <div className="flex items-center justify-center gap-1.5 mb-1.5 text-text-muted">
                 <Target className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Most Active Week</span>
              </div>
              <span className="text-lg font-black text-text-primary leading-none">{records.mostActiveWeekMin}m</span>
           </div>
        </div>
      </div>

    </div>
  );
};
