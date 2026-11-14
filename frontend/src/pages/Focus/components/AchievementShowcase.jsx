import React from 'react';
import { Trophy } from 'lucide-react';

export const AchievementShowcase = ({ summary, achievements }) => {
  const criteria = [
    { id: "first_session", title: "🌱 First Session", desc: "Logged focus block", reward: "+50 FP", pct: summary.hasLifetimeSessions ? 100 : 0 },
    { id: "streak_3", title: "🔥 3 Day Streak", desc: "Build the habit", reward: "+50 Coins", pct: summary.currentStreak >= 3 ? 100 : Math.round((summary.currentStreak / 3) * 100) },
    { id: "streak_7", title: "🔥 7 Day Streak", desc: "Daily focus streak", reward: "+150 Coins", pct: summary.currentStreak >= 7 ? 100 : Math.round((summary.currentStreak / 7) * 100) },
    { id: "night_owl", title: "🦉 Night Owl", desc: "Studied after 12 AM", reward: "+80 Coins", pct: achievements.find(a => a.id === "night_owl") ? 100 : 0 }
  ];

  return (
    <div className="bg-bg-surface border border-border p-5 rounded-2xl mb-6 overflow-hidden">
      <h3 className="text-sm font-black text-text-primary flex items-center gap-2 mb-5">
        <Trophy className="w-4 h-4 text-primary" />
        Achievements Canopy
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {criteria.map((crit) => {
          const unlocked = crit.pct >= 100;
          const circ = 87.9; // r=14 -> 2*PI*14
          const offset = circ - (crit.pct / 100) * circ;

          return (
            <div 
              key={crit.id}
              className={`snap-start shrink-0 w-64 p-4 border rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${
                unlocked 
                  ? "bg-bg-base border-primary/30 shadow-[0_4px_20px_rgba(var(--color-primary-rgb),0.1)] text-text-primary" 
                  : "bg-bg-base/50 border-border text-text-muted opacity-60 grayscale hover:grayscale-0"
              }`}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-border)" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="14" fill="none" 
                    stroke={unlocked ? "var(--color-primary)" : "var(--color-text-muted)"} 
                    strokeWidth="3" 
                    strokeDasharray={circ} 
                    strokeDashoffset={offset}
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                {unlocked ? (
                   <span className="absolute text-lg">🏆</span>
                ) : (
                   <span className="absolute text-[9px] font-black">{crit.pct}%</span>
                )}
              </div>

              <div className="min-w-0 text-left flex flex-col justify-center">
                <h4 className="text-xs font-black leading-tight truncate text-text-primary">{crit.title}</h4>
                <span className="text-[10px] font-bold text-text-secondary block mt-0.5">{crit.desc}</span>
                <span className="text-[10px] font-black text-primary mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded-md w-fit">{crit.reward}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
