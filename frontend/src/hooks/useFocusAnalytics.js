import { useMemo } from 'react';
import { ANALYTICS_CONSTANTS } from '../constants/AnalyticsConstants';

export const useFocusAnalytics = (analyticsData, isLoading = false, error = null) => {
  return useMemo(() => {
    // 1. Safe extraction
    const rawHeatmap = analyticsData?.heatmap || [];
    const rawFocusActivity = analyticsData?.focusActivity || [];
    const rawDistribution = analyticsData?.distribution || [];
    const overview = analyticsData?.overview || {};
    const premium = analyticsData?.premium || {};
    
    // Fill Heatmap if empty
    let heatmap = [...rawHeatmap];
    if (heatmap.length === 0) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysToSubtract = (ANALYTICS_CONSTANTS.HEATMAP_WEEKS * ANALYTICS_CONSTANTS.DAYS_PER_WEEK) + dayOfWeek;
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - daysToSubtract);

      let current = new Date(startDate);
      while (current <= today) {
        heatmap.push({
          date: current.toLocaleDateString('en-CA'),
          minutes: 0,
          points: 0,
          activities: [],
          intensityLevel: 0,
          isToday: current.toDateString() === today.toDateString()
        });
        current.setDate(current.getDate() + 1);
      }
    }

    // 2. Base metrics
    const currentStreak = overview.currentStreak ?? 0;
    const longestStreak = overview.longestStreak ?? 0;
    const totalSessions = overview.totalStudyDays ?? 0;
    const totalMinutes = overview.totalMinutes ?? 0;
    const totalXP = overview.totalPoints ?? 0;
    const totalHours = (totalMinutes / ANALYTICS_CONSTANTS.MINUTES_PER_HOUR).toFixed(1);
    
    const todayData = heatmap.find(d => d.isToday) || {};
    const todayMinutes = todayData.minutes || 0;
    const dailyGoalProgress = Math.min(100, Math.round((todayMinutes / ANALYTICS_CONSTANTS.TARGET_SESSION_MINUTES) * 100));

    // 3. Parse Premium Backend Analytics
    const deepFocusScore = premium.deepFocusScore || 0;
    const strongestSubject = premium.strongestSubject || 'Coming Soon';
    const bestStudyHour = premium.bestStudyHour || 'Coming Soon';
    const weeklyImprovement = premium.weeklyImprovement || 0;
    const insights = premium.insights || [];
    const records = premium.records || {
        longestSession: 0,
        highestXpDay: 0,
        fastestQuiz: 'Coming Soon',
        mostActiveWeekMin: 0
    };

    // 4. Transform charts
    let focusActivity = rawFocusActivity.map(day => ({
      name: new Date(day.date + 'T00:00:00Z').toLocaleDateString([], { month: "short", day: "numeric" }),
      minutes: Math.max(0, day.minutes || 0),
      sessions: day.minutes > 0 ? 1 : 0
    }));

    const colors = ["var(--color-primary)", "var(--color-text-primary)", "var(--color-text-secondary)", "var(--color-text-muted)", "var(--color-border-hover)", "var(--color-accent)"];
    let studyDistribution = rawDistribution.map((item, idx) => ({
      name: item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: Math.max(0, item.value || 0),
      color: colors[idx % colors.length]
    }));

    // Flags
    const hasLifetimeSessions = totalSessions > 0;
    
    return {
      isLoading,
      error,
      
      currentStreak,
      longestStreak,
      totalSessions,
      totalHours,
      totalMinutes,
      totalXP,
      
      deepFocusScore,
      strongestSubject,
      bestStudyHour,
      weeklyImprovement,
      insights,
      records,
      
      todayMinutes,
      dailyGoalProgress,
      
      heatmap,
      focusActivity,
      studyDistribution,

      hasLifetimeSessions
    };
  }, [analyticsData, isLoading, error]);
};
