import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Calendar, Clock, Trophy, Target, Zap, X } from 'lucide-react';

const ContributionCalendar = ({ summary }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const fullData = summary?.heatmap || [];

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

  const isEmpty = !summary?.hasLifetimeSessions;

  const totalSessions = summary?.totalSessions || 0;
  const totalHours = summary?.totalHours || 0;
  const currentStreak = summary?.currentStreak || 0;
  const longestStreak = summary?.longestStreak || 0;

  const getCellClass = (level, isToday, isCurrentStreak) => {
    let base = "w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] md:w-[15px] md:h-[15px] rounded-[3px] transition-all cursor-pointer relative";
    
    let bg = "bg-primary/5 dark:bg-primary/10"; 
    if (level === 1) bg = "bg-primary/20";
    if (level === 2) bg = "bg-primary/40";
    if (level === 3) bg = "bg-primary/70";
    if (level === 4) bg = "bg-primary";
    if (level >= 5) bg = "bg-linear-to-r from-violet-500 to-fuchsia-500";

    let hover = "hover:scale-[1.15] hover:z-20 hover:shadow-[0_0_12px_rgba(168,85,247,0.6)] hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-bg-surface";
    
    let styles = [base, bg, hover];

    if (isCurrentStreak) {
      styles.push("shadow-[0_0_12px_rgba(168,85,247,0.7)] animate-pulse ring-1 ring-primary/50");
    }

    if (isToday) {
      styles.push("ring-2 ring-primary border-[0.5px] border-bg-surface shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 brightness-110");
    }

    return styles.join(' ');
  };

  return (
    <div className="w-full flex flex-col gap-6 font-display" onMouseMove={handleMouseMove}>
      <style>
        {`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.7); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-pop {
            animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
        `}
      </style>

      <div className="bg-bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 gap-4">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Activity Heatmap
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-text-muted">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-400" /> {totalSessions} Sessions</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {totalHours} Hours</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> 🔥 {currentStreak} Day Streak</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-purple-400" /> 🏆 {longestStreak} Longest</span>
          </div>
        </div>
        
        {isEmpty && isLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg-surface/50 backdrop-blur-[2px] rounded-2xl border border-border">
             <div className="flex flex-col items-center justify-center p-6 bg-bg-surface/90 border border-border rounded-xl shadow-xl max-w-sm text-center">
                <Zap className="w-8 h-8 text-amber-500 mb-3 opacity-80" />
                <h3 className="text-base font-black text-text-primary mb-2">No focus activity yet</h3>
                <p className="text-xs font-bold text-text-secondary leading-relaxed">
                  Complete your first Focus Session to begin building your consistency streak.
                </p>
             </div>
          </div>
        )}

        <div className="overflow-x-auto pb-4 custom-scrollbar relative z-10 flex gap-2">
          
          <div className="flex flex-col gap-[2px] text-[9px] font-bold text-text-muted mt-[20px] shrink-0 text-right pr-1 justify-between h-[95px] sm:h-[109px] md:h-[123px]">
            <div className="flex-1 flex items-center justify-end"></div>
            <div className="flex-1 flex items-center justify-end">Mon</div>
            <div className="flex-1 flex items-center justify-end"></div>
            <div className="flex-1 flex items-center justify-end">Wed</div>
            <div className="flex-1 flex items-center justify-end"></div>
            <div className="flex-1 flex items-center justify-end">Fri</div>
            <div className="flex-1 flex items-center justify-end"></div>
          </div>

          <div className="flex gap-[2px] shrink-0 min-w-max" onMouseLeave={() => setHoveredDay(null)}>
            {weeks.map((week, wIdx) => {
              const firstDay = new Date(week[0].date);
              const prevFirstDay = wIdx > 0 ? new Date(weeks[wIdx-1][0].date) : null;
              const needsMonthLabel = wIdx === 0 || (prevFirstDay && firstDay.getMonth() !== prevFirstDay.getMonth());

              return (
                <div key={wIdx} className="flex flex-col gap-[2px]">
                  <div className="h-5 relative">
                    {needsMonthLabel && (
                      <span className="absolute left-0 bottom-1 text-[10px] font-bold text-text-muted whitespace-nowrap">
                        {firstDay.toLocaleString('en-US', { month: 'short' })}
                      </span>
                    )}
                  </div>
                  
                  {week.map((day, dIdx) => {
                    const intensity = day.intensityLevel || 0;
                    const globalIdx = (wIdx * 7) + dIdx;
                    return (
                      <div
                        key={day.date}
                        onMouseEnter={() => setHoveredDay(day)}
                        onClick={() => setSelectedDay(day)}
                        className={`
                          ${getCellClass(intensity, day.isToday, day.isCurrentStreak)}
                          ${isLoaded && intensity > 0 ? 'animate-pop' : ''}
                        `}
                        style={{
                          animationDelay: isLoaded ? `${globalIdx * 1.5}ms` : '0ms' 
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 text-[9px] font-bold text-text-muted">
          <span>Less</span>
          <div className="flex gap-[2px]">
            <div className="w-3 h-3 rounded-[2px] bg-primary/5 dark:bg-primary/10"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary/20"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary/40"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary/70"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary"></div>
            <div className="w-3 h-3 rounded-[2px] bg-linear-to-r from-violet-500 to-fuchsia-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      {hoveredDay && (
         <div 
           className="fixed pointer-events-none z-[200] bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-xl shadow-2xl border border-slate-700/50 min-w-[200px] flex flex-col gap-2 transition-opacity duration-150"
           style={{
              top: mousePos.y - 10,
              left: mousePos.x + 15,
              transform: 'translateY(-100%)', 
           }}
         >
            <div className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-700/50 flex justify-between">
               <span>{moment(hoveredDay.date).format('MMMM D, YYYY')}</span>
            </div>
            {hoveredDay.intensityLevel > 0 || hoveredDay.minutes > 0 || hoveredDay.points > 0 ? (
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue-400"/> Study Time</span>
                  <span className="font-bold text-white">{hoveredDay.minutes || 0} mins</span>
                </span>
                <span className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-400"/> XP Earned</span>
                  <span className="font-bold text-white">{hoveredDay.points || 0} XP</span>
                </span>
                <span className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Target className="w-3 h-3 text-emerald-400"/> Sessions</span>
                  <span className="font-bold text-white">{hoveredDay.activities?.length || 0}</span>
                </span>
                {hoveredDay.activities?.length > 0 && (
                  <div className="mt-1 pt-1.5 border-t border-slate-700/50">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Activities</span>
                     <ul className="text-[10px] font-medium text-slate-300 space-y-0.5 ml-1">
                       {Array.from(new Set(hoveredDay.activities)).map((act, i) => (
                         <li key={i}>• {act.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</li>
                       ))}
                     </ul>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[11px] font-bold text-slate-400 mt-1">No activity</span>
            )}
         </div>
      )}

      {selectedDay && selectedDay.minutes > 0 && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in" onClick={() => setSelectedDay(null)}>
          <div className="bg-bg-surface border border-border p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
              <h3 className="text-sm font-black text-text-primary">{moment(selectedDay.date).format('MMMM D, YYYY')}</h3>
              <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-bg-surface-hover rounded-lg transition-colors">
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-bg-surface-hover rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Total Focus Time</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Accumulated</span>
                </div>
                <span className="text-sm font-black text-primary">{selectedDay.minutes} min</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-bg-surface-hover rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Total XP</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Points earned</span>
                </div>
                <span className="text-sm font-black text-amber-500">{selectedDay.points} XP</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-bg-surface-hover rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Sessions Completed</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Focus blocks</span>
                </div>
                <span className="text-sm font-black text-emerald-500">{selectedDay.activities?.length || 1}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionCalendar;
