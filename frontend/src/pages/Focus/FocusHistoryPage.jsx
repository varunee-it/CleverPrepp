import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import focusStorage from "../../services/FocusStorage";
import useStudySession from "../../hooks/useStudySession";
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  List,
  Trash2,
  Copy,
  FileSpreadsheet,
  FileText,
  Clock,
  Compass,
  Award,
  Music4,
  Activity,
  Zap,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAnalytics } from "../../context/AnalyticsContext";

/**
 * Shared utility for determining whether a session belongs to a calendar day.
 */
const matchesCalendarDate = (session, targetDateStr) => {
  // Fast path: normalized localDate
  if (session.localDate === targetDateStr) return true;
  if (session.localDate && session.localDate !== targetDateStr) return false;

  // Fallback path: extract local year/month/day from timestamp
  const timestamp = session.occurredAt || session.createdAt;
  if (!timestamp) return false;

  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return false;

  const [tYear, tMonth, tDay] = targetDateStr.split("-").map(Number);
  return d.getFullYear() === tYear && 
         d.getMonth() + 1 === tMonth && 
         d.getDate() === tDay;
};

const getSessionsForDate = (history, dateStr) => {
  return history.filter(item => matchesCalendarDate(item, dateStr));
};

export const FocusHistoryPage = () => {
  const navigate = useNavigate();
  const { createSession, globalHistory, isHistoryLoading } = useStudySession();
  const { user } = useAuth();
  const { analyticsData } = useAnalytics();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("calendar"); // "list", "timeline", "calendar"
  
  // Calendar navigation states
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use globalHistory from context (synced from API) instead of local storage
  const history = globalHistory || [];
  const stats = user?.studyStats || {};

  // Filter & Sort computation pipeline
  let filteredHistory = [...history];

  // 1. Date Filter
  if (selectedDate) {
    filteredHistory = getSessionsForDate(filteredHistory, selectedDate);
  }

  // 2. Status Filter
  if (statusFilter !== "all") {
    filteredHistory = filteredHistory.filter(item => 
      item.metadata?.completionReason?.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  // 3. Activity Filter
  if (activityFilter !== "all") {
    filteredHistory = filteredHistory.filter(item => 
      item.activityType?.toLowerCase() === activityFilter.toLowerCase()
    );
  }

  // 4. Search Filter
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filteredHistory = filteredHistory.filter(item => 
      item.metadata?.goal?.toLowerCase().includes(query) ||
      item.activityType?.toLowerCase().includes(query) ||
      (item.metadata?.notes && item.metadata?.notes.toLowerCase().includes(query))
    );
  }

  // 5. Sorting
  filteredHistory.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.occurredAt) - new Date(a.occurredAt);
      if (sortBy === "date-asc") return new Date(a.occurredAt) - new Date(b.occurredAt);
      if (sortBy === "duration-desc") return b.duration - a.duration;
      if (sortBy === "duration-asc") return a.duration - b.duration;
      if (sortBy === "completion-desc") {
        const rateA = Math.round((a.duration / (a.metadata?.plannedDuration / 60 || 1)) * 100);
        const rateB = Math.round((b.duration / (b.metadata?.plannedDuration / 60 || 1)) * 100);
        return rateB - rateA;
      }
      return 0;
    });

  // Unique activities for filter dropdown — use activityType (not activity which doesn't exist)
  const uniqueActivities = Array.from(
    new Set(history.map(item => item.activityType).filter(Boolean))
  );

  // Actions handlers
  const handleDuplicate = (item) => {
    createSession({
      mode: "quick",
      duration: (item.metadata?.plannedDuration || (item.duration * 60)),
      activityType: item.activityType,
      goal: item.metadata?.goal || "Study Session",
      selectedSound: item.metadata?.ambientMode || null
    });
    navigate("/focus");
  };

  // CSV Export
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ["Date", "Start Time", "Duration (mins)", "Activity", "Goal", "Environment", "Status", "Notes", "XP Earned"];
    const rows = history.map(item => {
      const startTime = new Date(item.occurredAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      return [
        item.localDate,
        startTime,
        item.duration,
        item.activityType,
        `"${(item.metadata?.goal || "").replace(/"/g, '""')}"`,
        item.metadata?.ambientMode || "Silence",
        item.metadata?.completionReason || "Unknown",
        item.metadata?.notes ? `"${item.metadata.notes.replace(/"/g, '""')}"` : '""',
        item.pointsEarned
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cleverprep_focus_history_${new Date().toLocaleDateString("en-CA")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Friendly PDF Export
  const handleExportPDF = () => {
    window.print();
  };

  // Core Statistics calculations
  const totalSessions = history.length;
  const totalHours = (history.reduce((acc, item) => acc + item.duration, 0) / 60).toFixed(1);
  const avgSession = history.length > 0 ? Math.round(history.reduce((acc, item) => acc + item.duration, 0) / history.length) : 0;
  const currentStreak = analyticsData?.overview?.currentStreak || 0;
  const longestStreak = analyticsData?.overview?.longestStreak || 0;
  const deepWorkHours = (history.filter(item => item.duration >= 25).reduce((acc, item) => acc + item.duration, 0) / 60).toFixed(1);

  // Helper: Find day with highest focus minutes
  const getBestDay = () => {
    if (history.length === 0) return "N/A";
    const dayMap = {};
    history.forEach(item => {
      dayMap[item.localDate] = (dayMap[item.localDate] || 0) + item.duration;
    });
    let bestDate = "N/A";
    let maxMin = 0;
    Object.keys(dayMap).forEach(d => {
      if (dayMap[d] > maxMin) {
        maxMin = dayMap[d];
        bestDate = d;
      }
    });
    if (bestDate === "N/A") return "N/A";
    const dateObj = new Date(bestDate);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ` (${maxMin}m)`;
  };

  // Helper: Get most used sound atmosphere
  const getMostUsedAtmosphere = () => {
    if (history.length === 0) return "Silence";
    const map = {};
    history.forEach(item => {
      const env = item.metadata?.ambientMode || "Silence";
      map[env] = (map[env] || 0) + 1;
    });
    let mode = "Silence";
    let max = 0;
    Object.keys(map).forEach(env => {
      if (map[env] > max) {
        max = map[env];
        mode = env;
      }
    });
    return mode;
  };

  const bestDay = getBestDay();
  const mostUsedEnv = getMostUsedAtmosphere();

  // Helper: Activity distribution list
  const getActivityDistribution = () => {
    if (history.length === 0) return [];
    const dist = {};
    history.forEach(item => {
      dist[item.activityType] = (dist[item.activityType] || 0) + 1;
    });
    return Object.keys(dist).map(act => ({
      activity: act.replace('_', ' '),
      count: dist[act],
      pct: Math.round((dist[act] / history.length) * 100)
    })).sort((a, b) => b.count - a.count).slice(0, 3);
  };

  // Helper: Format activity type or focus mode for display
  const formatActivity = (session) => {
    if (session.activityType === 'focus_session') {
      const mode = session.metadata?.focusMode || 'study_session';
      switch (mode) {
        case 'reading_pdf': return 'Reading PDF';
        case 'viewing_notes': return 'Viewing Notes';
        case 'reviewing_flashcards': return 'Reviewing Flashcards';
        case 'taking_quiz': return 'Taking Quiz';
        case 'listening_podcast': return 'Listening Podcast';
        case 'study_session':
        default: return 'Study Session';
      }
    }
    return session.activityType?.replace(/_/g, ' ') || 'Unknown';
  };
  // Helper: Get color schemes for different activities
  const getEventColor = (activityType = "") => {
    const act = activityType.toLowerCase();
    if (act.includes("focus_session") || act.includes("deep") || act.includes("study")) {
      return { icon: "🟣", text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
    }
    if (act.includes("quick")) {
      return { icon: "🟢", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    }
    if (act.includes("read") || act.includes("book")) {
      return { icon: "📘", text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    }
    if (act.includes("flash") || act.includes("card")) {
      return { icon: "⚡", text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" };
    }
    if (act.includes("quiz") || act.includes("test")) {
      return { icon: "🎯", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    }
    if (act.includes("podcast") || act.includes("audio")) {
      return { icon: "🎧", text: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" };
    }
    return { icon: "📝", text: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
  };

  // Calendar rendering logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Blank padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 bg-bg-base/10 border border-dashed border-border/20 rounded-lg opacity-25" />);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const daySessions = getSessionsForDate(history, dateStr);
      const isToday = new Date().toLocaleDateString("en-CA") === dateStr;

      const maxVisible = 2;
      const visibleSessions = daySessions.slice(0, maxVisible);
      const hiddenCount = daySessions.length - maxVisible;

      days.push(
        <div 
          key={`day-${day}`} 
          className={`min-h-[100px] p-2 border rounded-xl flex flex-col transition-all duration-200 hover:bg-bg-surface/90 hover:border-primary/40 hover:shadow-lg relative group cursor-pointer ${
            selectedDate === dateStr
                ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/50"
                : isToday 
                  ? "border-primary/50 bg-primary/[0.03] shadow-sm" 
                  : "border-border/40 bg-bg-surface/40"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (daySessions.length > 0) {
              if (selectedDate === dateStr) {
                setSelectedDate(null);
              } else {
                setSelectedDate(dateStr);
                setViewMode("list");
              }
            }
          }}
        >
          {/* Subtle grid background texture */}
          <div className="absolute inset-0 bg-linear-to-br from-white/[0.02] to-transparent pointer-events-none rounded-xl" />

          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-black leading-none ${isToday ? "text-primary" : "text-text-muted"}`}>{day}</span>
          </div>
          
          <div className="flex flex-col gap-1.5 overflow-hidden mt-1 relative z-10 h-full">
            {visibleSessions.map((session, idx) => {
              const isCompleted = session.metadata?.completionReason !== "cancelled";
              const style = getEventColor(session.activityType);
              
              // Only render full detailed card if it's the only session, otherwise a mini version
              if (daySessions.length === 1) {
                return (
                  <div key={session._id || idx} className={`flex flex-col gap-1 p-1.5 rounded-lg border ${style.bg} ${style.border}`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>{style.icon}</span>
                      <span className={`${style.text} capitalize`}>{formatActivity(session)}</span>
                    </div>
                    <div className="text-[10px] text-text-secondary font-semibold pl-1">
                      {session.duration} Minutes
                    </div>
                    <div className="text-[10px] text-text-secondary font-semibold pl-1">
                      +{session.pointsEarned} XP
                    </div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit ${isCompleted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {isCompleted ? 'Completed' : 'Cancelled'}
                    </div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={session._id || idx}
                  className={`flex items-center gap-1.5 text-[9px] truncate px-1.5 py-1 rounded-md font-extrabold cursor-pointer border ${style.bg} ${style.border}`}
                  title={`${session.metadata?.goal || 'Study Session'}`}
                >
                  <span>{style.icon}</span>
                  <span className={`${style.text} capitalize truncate`}>{formatActivity(session)}</span>
                </div>
              );
            })}
            
            {hiddenCount > 0 && (
              <div className="text-[9px] font-black text-primary text-center mt-auto py-0.5 cursor-pointer hover:underline tracking-wide">
                +{hiddenCount} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 animate-in fade-in duration-300 text-left">
        {/* Calendar Nav header */}
        <div className="flex items-center justify-between bg-bg-surface/50 border border-border/80 rounded-xl px-3 py-1.5">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="text-[9px] font-black text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border/80 rounded-lg px-2 py-1 cursor-pointer select-none transition-colors"
          >
            <ChevronLeft className="w-3 h-3 inline mr-0.5" /> Prev
          </button>
          
          <h4 className="text-[11px] font-extrabold text-text-primary tracking-tight select-none">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h4>
          
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="text-[9px] font-black text-text-secondary hover:text-text-primary hover:bg-bg-surface border border-border/80 rounded-lg px-2 py-1 cursor-pointer select-none transition-colors"
          >
            Next <ChevronRight className="w-3 h-3 inline ml-0.5" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center bg-bg-surface/20 border border-border/40 p-1 rounded-xl">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-[8px] font-black uppercase tracking-wider text-text-muted py-0.5">{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Timeline view rendering
  const renderTimeline = () => {
    if (filteredHistory.length === 0) {
      return (
        <div className="text-center py-20 text-text-muted text-xs font-semibold">
          No study sessions matched your filter criteria.
        </div>
      );
    }

    return (
      <div className="relative border-l border-border/60 ml-4 md:ml-8 pl-5 space-y-4 pb-12 text-left animate-in fade-in duration-300">
        {filteredHistory.map((item, idx) => {
          const isCompleted = item.metadata?.completionReason !== "cancelled";
          const rate = Math.round((item.duration / (item.metadata?.plannedDuration / 60 || 1)) * 100);
          
          const env = item.metadata?.ambientMode || "Silence";
          let envIcon = "🎧";
          if (env.includes("Forest")) envIcon = "🌲";
          else if (env.includes("Ocean") || env.includes("Rain")) envIcon = "🌊";
          else if (env.includes("Cafe")) envIcon = "☕";

          const startTime = new Date(item.occurredAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

          return (
            <div key={item._id || idx} className="relative group">
              <div className={`absolute -left-[29px] top-1 w-4.5 h-4.5 rounded-full border bg-bg-surface flex items-center justify-center text-[9px] shadow-theme-sm ${
                isCompleted ? "border-primary text-primary" : "border-rose-500/40 text-rose-500"
              }`}>
                {envIcon}
              </div>

              <div className="bg-bg-surface/30 border border-border/60 hover:border-border p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black text-text-muted font-mono uppercase tracking-wider">{item.localDate} • {startTime}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider border ${
                      isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-455"
                    }`}>
                      {isCompleted ? "Completed" : "Cancelled"}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-text-primary truncate">🎯 {item.metadata?.goal || "Study Session"}</h4>
                  <p className="text-[9px] font-bold text-text-muted mt-1 leading-none">
                    Activity: <span className="text-text-secondary capitalize">{formatActivity(item)}</span> • Atmosphere: <span className="text-text-secondary">{env}</span>
                  </p>
                </div>

                <div className="flex items-center gap-5 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-border/50 pt-2.5 md:pt-0">
                  <div className="text-right">
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block leading-none">Productivity</span>
                    <span className="text-xs font-mono font-bold text-text-primary mt-1 block leading-none">{rate}% Score</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="p-1 bg-bg-surface border border-border/80 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors cursor-pointer"
                      title="Quick Resume"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-[150] overflow-y-auto flex flex-col p-3 sm:p-5 pb-24 sm:pb-28 font-display select-none"
      style={{
        background: `linear-gradient(135deg, var(--color-bg-base) 0%, var(--color-bg-surface) 100%)`
      }}
    >
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-2.5 mb-4 shrink-0 gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/focus")}
            className="p-1 bg-bg-surface border border-border hover:border-border-hover text-text-secondary hover:text-text-primary rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="text-left">
            <h2 className="text-sm font-extrabold text-text-primary leading-tight">Focus Journal</h2>
            <p className="text-[9px] font-bold text-text-muted tracking-wider uppercase mt-0.5">Session Logs History</p>
          </div>
        </div>

        {/* Global Toolbar Controllers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Metrics display */}
          <div className="hidden sm:flex items-center gap-3 px-3 h-7 bg-bg-surface/40 border border-border/80 rounded-lg text-[9px] font-black text-text-secondary uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{totalHours} hrs</span>
            </div>
            <div className="w-px h-3 bg-border/60" />
            <div>{totalSessions} Sessions</div>
          </div>

          <button
            onClick={() => navigate("/focus")}
            className="px-2.5 py-1 bg-bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Workspace
          </button>
          <button
            onClick={() => navigate("/focus/analytics")}
            className="px-2.5 py-1 bg-bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Analytics
          </button>

          {/* List vs Timeline vs Calendar views */}
          <div className="flex items-center bg-bg-surface/50 border border-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                viewMode === "list" ? "bg-primary text-primary-text" : "text-text-secondary hover:text-text-primary"
              }`}
              title="List layout"
            >
              <List className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                viewMode === "timeline" ? "bg-primary text-primary-text" : "text-text-secondary hover:text-text-primary"
              }`}
              title="Timeline flow"
            >
              <Activity className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                viewMode === "calendar" ? "bg-primary text-primary-text" : "text-text-secondary hover:text-text-primary"
              }`}
              title="Calendar grid"
            >
              <Calendar className="w-3 h-3" />
            </button>
          </div>

          {/* Export items */}
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="px-2.5 py-1 bg-bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-20 cursor-pointer"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={history.length === 0}
            className="px-2.5 py-1 bg-bg-surface border border-border text-text-secondary hover:text-text-primary rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-20 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-teal-500" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block text-black text-center mb-6">
        <h1 className="text-xl font-bold">CleverPrep Study Sessions Report</h1>
        <p className="text-xs text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* 2. Global Filters row - Compact & Clean */}
      {(history.length > 0 || selectedDate) && (
        <div className="flex flex-col gap-2 mb-4 print:hidden">
          {selectedDate && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg">
              <span className="text-xs font-bold text-primary">Viewing Date: {selectedDate}</span>
              <button 
                onClick={() => setSelectedDate(null)}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Date
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-bg-surface/30 border border-border/60 p-2.5 rounded-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3 h-3 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search goals..."
              className="w-full pl-7.5 pr-2.5 py-1 bg-bg-surface border border-border rounded-lg text-[10px] placeholder-text-muted text-text-primary focus:outline-none focus:border-primary/50 transition-all font-semibold"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-2.5 top-2 w-3 h-3 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-7.5 pr-2 py-1 bg-bg-surface border border-border rounded-lg text-[10px] text-text-secondary focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <Compass className="absolute left-2.5 top-2 w-3 h-3 text-text-muted" />
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full pl-7.5 pr-2 py-1 bg-bg-surface border border-border rounded-lg text-[10px] text-text-secondary focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
            >
              <option value="all">All Activities</option>
              {uniqueActivities.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-2.5 top-2 w-3 h-3 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-7.5 pr-2 py-1 bg-bg-surface border border-border rounded-lg text-[10px] text-text-secondary focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="duration-desc">Longest Session</option>
              <option value="duration-asc">Shortest Session</option>
            </select>
          </div>
        </div>
        </div>
      )}

      {/* 3. Main SaaS Symmetrical Grid Layout */}
      {isHistoryLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300 max-w-sm mx-auto">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <h3 className="text-sm font-extrabold text-text-primary">Loading your history...</h3>
        </div>
      ) : history.length === 0 ? (
        /* Empty state block matching specs */
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300 max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border flex items-center justify-center mb-4">
            <Compass className="w-6 h-6 text-text-muted animate-pulse" />
          </div>
          <h3 className="text-sm font-extrabold text-text-primary">Your study journal is empty</h3>
          <p className="text-[11px] text-text-muted leading-relaxed font-semibold mt-1.5 mb-6">
            Complete focus sessions to record study metrics, milestones, and environment preferences.
          </p>
          <button
            onClick={() => navigate("/focus")}
            className="px-5 py-2 bg-primary hover:bg-primary-hover text-primary-text rounded-xl text-xs font-extrabold shadow-md cursor-pointer transition-all"
          >
            Start Focus Block
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start pb-8">
          
          {/* COLUMN 1: LEFT COMPACT SIDEBAR FILTERS (3 cols) */}
          {/* ========================================== */}
          <div className="flex flex-col gap-3.5 order-2 lg:order-1 lg:col-span-3 text-left">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-text-muted text-left px-1">Metrics Sidebar</h4>
            
            {/* Focus Hours Card */}
            <div className="bg-bg-surface/35 border border-border/60 hover:border-border/90 p-3 rounded-xl shadow-xs text-left transition-all duration-205 hover:-translate-y-px">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Focus Hours</span>
              </div>
              <h3 className="text-sm font-black text-text-primary mt-1 leading-none">{totalHours} hrs</h3>
              <p className="text-[8px] font-bold text-text-muted mt-1.5 leading-none">{totalSessions} Focus Blocks logged</p>
            </div>

            {/* Streak Card */}
            <div className="bg-bg-surface/35 border border-border/60 hover:border-border/90 p-3 rounded-xl shadow-xs text-left transition-all duration-205 hover:-translate-y-px">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Active Streak</span>
              </div>
              <h3 className="text-sm font-black text-text-primary mt-1 leading-none">{currentStreak} Days</h3>
              <p className="text-[8px] font-bold text-text-muted mt-1.5 leading-none">Personal Best: {longestStreak} Days</p>
            </div>

            {/* Deep Work Hours Card */}
            <div className="bg-bg-surface/35 border border-border/60 hover:border-border/90 p-3 rounded-xl shadow-xs text-left transition-all duration-205 hover:-translate-y-px">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Deep Work</span>
              </div>
              <h3 className="text-sm font-black text-text-primary mt-1 leading-none">{deepWorkHours} hrs</h3>
              <p className="text-[8px] font-bold text-text-muted mt-1.5 leading-none">Blocks longer than 25m</p>
            </div>

            {/* Acoustics Card */}
            <div className="bg-bg-surface/35 border border-border/60 hover:border-border/90 p-3 rounded-xl shadow-xs text-left transition-all duration-205 hover:-translate-y-px">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                  <Music4 className="w-3.5 h-3.5 text-fuchsia-400" />
                </div>
                <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Acoustics</span>
              </div>
              <h3 className="text-xs font-black text-text-primary mt-1 truncate leading-tight">{mostUsedEnv}</h3>
              <p className="text-[8px] font-bold text-text-muted mt-1.5 leading-none">Most frequently selected environment</p>
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMN 2: CENTER WIDE LEDGER VIEW (6 cols) */}
          {/* ========================================== */}
          <div className="order-1 lg:order-2 lg:col-span-6 border-b lg:border-none pb-6 lg:pb-0">
            {viewMode === "calendar" ? (
              renderCalendar()
            ) : viewMode === "timeline" ? (
              renderTimeline()
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-20 bg-bg-surface/30 border border-border/60 rounded-xl text-text-muted text-xs font-semibold">
                No study sessions matched your filter criteria.
              </div>
            ) : (
              /* Premium grid card layout (List view) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 animate-in fade-in duration-300 pb-8 text-left">
                {filteredHistory.map((item, idx) => {
                  const rate = Math.round((item.duration / (item.metadata?.plannedDuration / 60 || 1)) * 100);
                  const isCompleted = item.metadata?.completionReason !== "cancelled";
                  
                  const env = item.metadata?.ambientMode || "Silence";
                  let envIcon = "🎧";
                  if (env.includes("Forest")) envIcon = "🌲";
                  else if (env.includes("Ocean") || env.includes("Rain")) envIcon = "🌊";
                  else if (env.includes("Cafe")) envIcon = "☕";

                  const startTime = new Date(item.occurredAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

                  return (
                    <div 
                      key={item._id || idx}
                      className="bg-bg-surface/30 border border-border hover:border-primary/25 p-3 rounded-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-px"
                    >
                      <div>
                        {/* Header info */}
                        <div className="flex items-center justify-between mb-2.5 shrink-0">
                          <span className="text-[8px] font-black text-text-muted font-mono tracking-wider">{item.localDate} • {startTime}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider border ${
                            isCompleted 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                              : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-455"
                          }`}>
                            {isCompleted ? "Completed" : "Cancelled"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-2 shrink-0">
                          <span className="text-xs select-none">{envIcon}</span>
                          <h4 className="text-xs font-extrabold text-text-primary truncate max-w-[130px]" title={item.metadata?.goal || "Study Session"}>
                            {item.metadata?.goal || "Study Session"}
                          </h4>
                        </div>

                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-[8px] font-bold text-text-muted">
                            <span>Activity:</span>
                            <span className="text-text-secondary truncate max-w-[100px] capitalize">{formatActivity(item)}</span>
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-text-muted">
                            <span>Atmosphere:</span>
                            <span className="text-text-secondary truncate max-w-[100px]">{env}</span>
                          </div>
                          {item.metadata?.notes && (
                            <div className="text-[7.5px] text-text-muted mt-1.5 bg-bg-base/30 border border-border p-1.5 rounded-lg italic truncate">
                              "{item.metadata.notes}"
                            </div>
                          )}
                          {item.metadata?.checklist && item.metadata.checklist.length > 0 && (
                            <div className="mt-1.5">
                              <div className="flex justify-between text-[7px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                <span>Checklist</span>
                                <span>{item.metadata.completedTasks || 0} / {item.metadata.totalTasks || 0} ({item.metadata.completionPercentage || 0}%)</span>
                              </div>
                              <div className="w-full h-1 bg-bg-base/50 rounded-full overflow-hidden border border-border/40">
                                <div 
                                  className="h-full bg-primary/70 transition-all duration-300"
                                  style={{ width: `${item.metadata.completionPercentage || 0}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="text-left">
                            <span className="text-[7.5px] text-text-muted font-bold block leading-none">Duration</span>
                            <span className="text-[10px] font-mono font-black text-text-primary mt-1 block leading-none">
                              {item.duration}m / {Math.round(item.metadata?.plannedDuration / 60) || item.duration}m
                            </span>
                          </div>

                          {/* Mini circular progress ring */}
                          <div className="relative shrink-0 flex items-center justify-center" title={`${rate}% Completeness`}>
                            <svg className="w-7 h-7 transform -rotate-90 select-none" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="12" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
                              <circle cx="16" cy="16" r="12" fill="none" stroke={isCompleted ? "#10D28F" : "#ef4444"} strokeWidth="2.5" 
                                strokeDasharray={75.4} strokeDashoffset={75.4 - (75.4 * Math.min(100, rate)) / 100}
                                strokeLinecap="round" className="transition-all duration-300" />
                            </svg>
                            <span className="absolute text-[7.5px] font-mono font-black text-text-secondary">{rate}%</span>
                          </div>
                        </div>

                        {/* Actions panel */}
                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-border/40 print:hidden">
                          <button
                            onClick={() => handleDuplicate(item)}
                            className="px-2 py-0.5 bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                            title="Quick Resume"
                          >
                            <Copy className="w-2.5 h-2.5 text-text-muted" />
                            <span>Resume</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* COLUMN 3: RIGHT COMPACT SIDEBAR WIDGETS (3 cols) */}
          {/* ========================================== */}
          <div className="flex flex-col gap-3.5 order-3 lg:col-span-3 text-left">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-text-muted px-1">Widgets & Insights</h4>

            {/* Target Card */}
            <div className="bg-bg-surface/35 border border-border/60 p-3 rounded-xl shadow-xs">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5 leading-none">
                <Target className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Weekly Target</span>
              </span>
              <div className="flex items-center justify-between text-[9px] font-extrabold mt-2 leading-none text-text-primary">
                <span>Week Progress</span>
                <span className="font-mono">{totalHours} / 5.0h</span>
              </div>
              <div className="w-full rounded-full h-1 bg-bg-base border border-border/40 mt-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (parseFloat(totalHours) / 5) * 100)}%` }}
                />
              </div>
            </div>

            {/* Focus Distribution */}
            {getActivityDistribution().length > 0 && (
              <div className="bg-bg-surface/35 border border-border/60 p-3 rounded-xl shadow-xs flex flex-col gap-2">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Focus Area Distribution</span>
                <div className="space-y-1.5 mt-0.5">
                  {getActivityDistribution().map((dist, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[8px] font-bold text-text-secondary">
                        <span className="truncate max-w-[120px]">{dist.activity}</span>
                        <span className="font-mono">{dist.pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-bg-base border border-border/20 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${dist.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heatmap Legend */}
            <div className="bg-bg-surface/35 border border-border/60 p-3 rounded-xl shadow-xs">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">Study Rhythms</span>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-500/20" />
                  <span>Completed Sessions</span>
                </div>
                <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-rose-500 border border-rose-500/20" />
                  <span>Cancelled Sessions</span>
                </div>
                <p className="text-[7.5px] font-bold text-text-muted italic mt-1.5 border-t border-border/30 pt-1.5">
                  "Deep focus is the ultimate superpower."
                </p>
              </div>
            </div>

            {/* Best Record */}
            <div className="bg-bg-surface/35 border border-border/60 p-3 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-wider text-text-muted leading-none">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Personal Records</span>
              </div>
              <div className="space-y-1.5 mt-2.5">
                <div className="flex items-center justify-between text-[8.5px] font-bold text-text-secondary">
                  <span>Best Day:</span>
                  <span className="text-text-primary font-mono">{bestDay}</span>
                </div>
                <div className="flex items-center justify-between text-[8.5px] font-bold text-text-secondary">
                  <span>Avg Session:</span>
                  <span className="text-text-primary font-mono">{avgSession} mins</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default FocusHistoryPage;
