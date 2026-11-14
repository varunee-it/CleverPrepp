import React, { useState, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronDown } from 'lucide-react';

export const PremiumHeatmap = ({ summary }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  
  const fullData = summary.heatmap || [];
  
  // Create Weeks Array
  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];
    
    fullData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) w.push(currentWeek);
    return w;
  }, [fullData]);

  // Months labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date + 'T00:00:00Z').getMonth();
      if (month !== lastMonth) {
        labels.push({ label: new Date(firstDay.date + 'T00:00:00Z').toLocaleString('default', { month: 'short' }), weekIndex });
        lastMonth = month;
      }
    });
    
    // Filter labels that are too close
    return labels.filter((m, i, arr) => {
      if (i === 0) return true;
      return m.weekIndex - arr[i-1].weekIndex > 2;
    });
  }, [weeks]);

  // Color logic
  const getCellClass = (level, isToday, isCurrentStreak) => {
    let base = "w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] rounded-[3px] transition-all cursor-pointer relative hover:ring-2 hover:ring-primary/50 hover:z-10";
    
    if (isToday) base += " ring-2 ring-primary ring-offset-1 ring-offset-bg-surface";
    if (isCurrentStreak) base += " shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.6)]";
    
    switch(level) {
      case 1: return `${base} bg-primary/20`; // Light lavender
      case 2: return `${base} bg-primary/40`; // Purple 300
      case 3: return `${base} bg-primary/70`; // Purple 500
      case 4: return `${base} bg-primary`;    // Primary Purple
      case 5: return `${base} bg-gradient-to-br from-primary to-accent`; // Gradient
      default: return `${base} bg-bg-base border border-border/50 hover:border-text-muted/30`;
    }
  };

  return (
    <div className="bg-bg-surface border border-border p-5 rounded-2xl mb-6 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
         <div>
            <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
               <CalendarIcon className="w-4 h-4 text-primary" />
               Contribution Calendar
            </h3>
            <p className="text-[10px] font-bold text-text-muted mt-1">{summary.totalSessions} study days in the last year</p>
         </div>
         
         {/* Year Selector */}
         <div className="relative inline-flex items-center">
            <button disabled className="flex items-center gap-2 px-3 py-1.5 bg-bg-base border border-border rounded-lg text-xs font-bold text-text-secondary opacity-70 cursor-not-allowed">
               2026
               <ChevronDown className="w-3 h-3" />
            </button>
         </div>
      </div>

      {/* Heatmap Grid Layout */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="inline-flex flex-col min-w-max">
          
          {/* Months Row */}
          <div className="flex text-[9px] font-bold text-text-muted mb-2 ml-8 relative h-4">
             {monthLabels.map((m, i) => (
                <div key={i} className="absolute" style={{ left: `${m.weekIndex * (14 + 4)}px` }}>
                   {m.label}
                </div>
             ))}
          </div>

          <div className="flex gap-1.5">
            {/* Days Column */}
            <div className="flex flex-col gap-1.5 pt-0.5 text-[9px] font-bold text-text-muted w-6 justify-between pr-2 text-right">
              <span className="invisible">Sun</span>
              <span>Mon</span>
              <span className="invisible">Tue</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
              <span className="invisible">Sat</span>
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div 
                      key={day.date}
                      onClick={() => setSelectedDay(day)}
                      className={getCellClass(day.intensityLevel, day.isToday, day.isCurrentStreak)}
                      title={`${new Date(day.date + 'T00:00:00Z').toLocaleDateString()} - ${day.points} XP`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel for Day Details */}
      {selectedDay && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-bg-surface border-l border-border z-[210] shadow-2xl animate-in slide-in-from-right-full duration-300 flex flex-col">
             
             <div className="p-5 border-b border-border flex justify-between items-center bg-bg-base/50">
                <h3 className="text-sm font-black text-text-primary">
                  {new Date(selectedDay.date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
                <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-bg-surface-hover rounded-lg text-text-muted transition-colors">
                   <X className="w-4 h-4" />
                </button>
             </div>

             <div className="p-5 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6 p-4 bg-bg-base rounded-xl border border-border">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-text-muted">Study Time</div>
                      <div className="text-xl font-black text-text-primary">{selectedDay.minutes}m</div>
                   </div>
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3">Activity Breakdown</h4>
                
                {(!selectedDay.activities || selectedDay.activities.length === 0) ? (
                   <div className="text-xs font-bold text-text-muted italic bg-bg-base/30 p-4 rounded-xl border border-border/50 text-center">
                      No activity recorded on this day.
                   </div>
                ) : (
                   <div className="space-y-2">
                      {/* Note: the backend currently only returns an array of string activityTypes, e.g. ['focus_session', 'flashcard_review'] */}
                      {selectedDay.activities.map((act, idx) => (
                         <div key={idx} className="flex justify-between items-center p-3 bg-bg-base rounded-xl border border-border">
                            <span className="text-xs font-bold text-text-primary capitalize">{act.replace(/_/g, ' ')}</span>
                            <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">Logged</span>
                         </div>
                      ))}
                   </div>
                )}
             </div>

             <div className="p-5 border-t border-border bg-bg-base/50">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-text-muted">Total XP Earned</span>
                   <span className="text-lg font-black text-accent">{selectedDay.points} XP</span>
                </div>
             </div>
          </div>
        </>
      )}

    </div>
  );
};
