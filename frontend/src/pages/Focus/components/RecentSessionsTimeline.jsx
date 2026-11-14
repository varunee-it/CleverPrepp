import React from 'react';
import { History, Clock, CheckCircle } from 'lucide-react';

export const RecentSessionsTimeline = ({ summary }) => {
  // Extract non-empty days from heatmap for the timeline, sorted most recent first
  const activeDays = [...(summary.heatmap || [])]
    .filter(day => day.minutes > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // show last 5 active days

  return (
    <div className="bg-bg-surface border border-border p-5 rounded-2xl">
      <h3 className="text-sm font-black text-text-primary flex items-center gap-2 mb-6">
        <History className="w-4 h-4 text-primary" />
        Recent Timeline
      </h3>

      {activeDays.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs font-bold text-text-muted">No recent study sessions.</p>
        </div>
      ) : (
        <div className="relative pl-3 border-l-2 border-border/50 space-y-6">
          {activeDays.map((day, idx) => (
            <div key={idx} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[23px] top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-bg-surface"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-text-primary">
                    {new Date(day.date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {day.activities && day.activities.length > 0 ? (
                      day.activities.map((act, i) => (
                        <span key={i} className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                          {act.replace(/_/g, ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] font-bold text-text-muted bg-bg-base px-2 py-0.5 rounded-full">Unknown Activity</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-bg-base/50 px-3 py-2 rounded-xl border border-border sm:w-auto w-full">
                   <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-black text-text-primary">{day.minutes}m</span>
                   </div>
                   <div className="w-px h-4 bg-border"></div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-accent">{day.points} XP</span>
                   </div>
                   <div className="w-px h-4 bg-border hidden sm:block"></div>
                   <div className="items-center gap-1.5 hidden sm:flex">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400">100%</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
