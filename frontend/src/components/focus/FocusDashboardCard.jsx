import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudySession from "../../hooks/useStudySession";
import { useAnalytics } from "../../context/AnalyticsContext";
import focusStorage from "../../services/FocusStorage";
import { Play, Sparkles, Clock, Target, ArrowRight, Zap, Trophy, ShieldAlert } from "lucide-react";

export const FocusDashboardCard = () => {
  const navigate = useNavigate();
  const { session, createSession, startSession } = useStudySession();
  const { analyticsData } = useAnalytics();

  const [goals, setGoals] = useState({});

  useEffect(() => {
    setGoals(focusStorage.loadDailyGoals());
  }, [session]);

  const isSessionActive = session && ["created", "running", "paused"].includes(session.status);

  // Computations
  const focusPoints = analyticsData?.today?.focusPoints || 0;
  const focusCap = analyticsData?.today?.focusCap || 500;
  const capPct = Math.min(100, Math.round((focusPoints / focusCap) * 100));

  const todayMins = analyticsData?.today?.minutes || 0;

  const goalMinutes = goals.minutesTarget || 120;
  const pct = Math.min(100, Math.round((todayMins / goalMinutes) * 100));

  const handleStartFocus = () => {
    if (isSessionActive) {
      navigate("/focus");
      return;
    }
    createSession({
      mode: "quick",
      duration: 25 * 60,
      activityType: "study_session",
      goal: "Deep study block",
      source: "dashboard"
    });
    startSession();
    navigate("/focus");
  };

  const estCompletionTime = () => {
    const remaining = Math.max(0, goalMinutes - todayMins);
    if (remaining === 0) return "Goal achieved!";
    const now = new Date();
    now.setMinutes(now.getMinutes() + remaining);
    return `Est. goal completion: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const cardWrapperClass = "bg-bg-surface border border-border text-text-primary shadow-theme-sm";
  const clockBadgeClass = "bg-primary/10 text-primary border border-primary/20";
  const streakTextClass = "text-primary";
  const titleTextClass = "text-text-primary";
  const descTextClass = "text-text-secondary";
  const metaTextClass = "text-text-secondary";
  const boldValClass = "text-text-primary";
  const estCompletionClass = "text-primary";
  const ringBgTrack = "var(--color-border)";
  const pctTextClass = "text-text-primary";
  const actionBtnClass = "bg-primary hover:bg-primary-hover text-primary-text shadow-theme-md";

  return (
    <div className={`rounded-[18px] p-6 lg:p-7 shadow-xs relative overflow-hidden select-none text-left flex flex-col md:flex-row items-center justify-between gap-6 min-h-[185px] group ${cardWrapperClass}`}>
      {/* Decorative clean radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-teal-500/2 to-transparent pointer-events-none" />
      
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${clockBadgeClass}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Smart Focus Workspace</span>
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${streakTextClass}`}>
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>{analyticsData?.overview?.currentStreak || 0}d Streak</span>
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${focusPoints >= focusCap ? 'text-red-500' : 'text-emerald-500'}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>XP Cap: {focusPoints}/{focusCap}</span>
          </span>
        </div>

        <div>
          <h3 className={`text-base sm:text-lg font-extrabold leading-snug tracking-tight ${titleTextClass}`}>
            {isSessionActive 
              ? `Active: ${session.goal || "Deep study block"}` 
              : "Commit to focused blocks. quiet the mind, sharpen the focus."}
          </h3>
          <p className={`text-xs mt-1.5 leading-relaxed max-w-md ${descTextClass}`}>
            {isSessionActive
              ? "Your study session is active. Re-enter the focus cockpit to view ambient soundscapes and log minutes."
              : "Dedicate structured windows to PDF materials summaries. Generates active recall flashcards decks and mock assessments automatically."}
          </p>
        </div>

        <div className={`flex items-center gap-4 text-[10px] pt-1 font-semibold flex-wrap ${metaTextClass}`}>
          <span className="flex items-center gap-1">🎯 Today's Goal: <b className={boldValClass}>{goalMinutes} mins</b></span>
          <span className="flex items-center gap-1">⏱️ Remaining: <b className={boldValClass}>{Math.max(0, goalMinutes - todayMins)} mins</b></span>
          <span className={`font-bold ${estCompletionClass}`}>{estCompletionTime()}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 shrink-0">
        {/* Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90 filter drop-shadow-sm" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke={ringBgTrack} strokeWidth="2.5" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#10D28F" strokeWidth="2.5" 
              strokeDasharray={94.2} strokeDashoffset={94.2 - (94.2 * pct) / 100}
              strokeLinecap="round" className="transition-all duration-500" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-sm font-mono font-black leading-none ${pctTextClass}`}>{pct}%</span>
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">done</span>
          </div>
        </div>

        <button
          onClick={handleStartFocus}
          className={`w-full min-h-[48px] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 ${actionBtnClass}`}
        >
          <span>{isSessionActive ? "Continue Session" : "Start Focus Block"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FocusDashboardCard;
