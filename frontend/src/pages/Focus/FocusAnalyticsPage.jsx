import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import focusStorage from "../../services/FocusStorage";
import { useFocusAnalytics } from "../../hooks/useFocusAnalytics";
import { useAnalytics } from "../../context/AnalyticsContext";
import { ArrowLeft, Zap } from "lucide-react";

// Import Components
import { AnalyticsKPIHeader } from "./components/AnalyticsKPIHeader";
import { PremiumHeatmap } from "./components/PremiumHeatmap";
import { StudyTrendChart } from "./components/StudyTrendChart";
import { ActivityDonutChart } from "./components/ActivityDonutChart";
import { AIInsightsPanel } from "./components/AIInsightsPanel";
import { AchievementShowcase } from "./components/AchievementShowcase";
import { RecentSessionsTimeline } from "./components/RecentSessionsTimeline";

export const FocusAnalyticsPage = () => {
  const navigate = useNavigate();
  const { analyticsData, loadingAnalytics, analyticsError } = useAnalytics();
  const summary = useFocusAnalytics(analyticsData, loadingAnalytics, analyticsError);
  
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setAchievements(focusStorage.loadAchievements());
  }, []);

  // Loading State
  if (summary.isLoading) {
    return (
      <div className="fixed inset-0 z-[150] bg-bg-base flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-text-muted">Loading Premium Analytics...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (summary.error) {
    return (
      <div className="fixed inset-0 z-[150] bg-bg-base flex flex-col items-center justify-center font-display p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-text-primary mb-2">Couldn't load your analytics.</h3>
        <p className="text-sm font-bold text-text-secondary mb-6 max-w-sm">
          Please refresh or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-bg-surface border border-border hover:border-text-muted text-text-primary rounded-xl font-bold transition-all"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-bg-base overflow-y-auto flex flex-col p-4 sm:p-6 font-display select-none text-text-primary">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-6 shrink-0 sticky top-0 bg-bg-base/80 backdrop-blur-md z-[100] pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 bg-bg-surface hover:bg-bg-surface-hover border border-border hover:border-border-hover text-text-secondary hover:text-text-primary rounded-lg transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col text-left">
            <h2 className="text-sm sm:text-base font-extrabold text-text-primary leading-tight flex items-center gap-2">
               🔥 Focus Analytics
            </h2>
            <p className="text-[10px] font-bold text-text-secondary tracking-wider uppercase mt-0.5">Premium Productivity Dashboard</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
         
         {/* 1. Hero KPI Cards */}
         <AnalyticsKPIHeader summary={summary} />

         {/* 2. Main Centerpiece: Contribution Calendar */}
         <PremiumHeatmap summary={summary} />

         {/* 3. Split Section: Trend & Distribution */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
               <StudyTrendChart summary={summary} />
            </div>
            <div>
               <ActivityDonutChart summary={summary} />
            </div>
         </div>

         {/* 4. AI Insights & Records */}
         <div className="mb-6">
            <AIInsightsPanel summary={summary} />
         </div>

         {/* 5. Achievements Showcase */}
         <AchievementShowcase summary={summary} achievements={achievements} />

         {/* 6. Timeline */}
         <RecentSessionsTimeline summary={summary} />

      </div>
    </div>
  );
};

export default FocusAnalyticsPage;
