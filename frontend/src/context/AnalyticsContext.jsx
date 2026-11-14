import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import progressService from "../services/progressService";
import focusStorage from "../services/FocusStorage";
import { useAuth } from "../context/AuthContext";

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};

export const AnalyticsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [analyticsData, setAnalyticsData] = useState(null);
  
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      
      // Fetch backend global stats
      const backendData = await progressService.getAnalyticsData();
      
      // Fetch local focus stats (as these are currently stored locally)
      const focusStats = focusStorage.loadStats() || {};
      
      setAnalyticsData({
        overview: backendData?.data?.overview || {},
        today: backendData?.data?.today || {},
        heatmap: backendData?.data?.heatmap || [],
        focusActivity: backendData?.data?.focusActivity || [],
        distribution: backendData?.data?.distribution || [],
        premium: backendData?.data?.premium || {},
        recentActivity: backendData?.data?.recentActivity || { documents: [], quizzes: [] },
        focus: {
          totalTime: focusStats.totalFocusTime || 0,
          totalSessions: focusStats.totalSessions || 0,
          longestSession: focusStats.longestSession || 0,
          dailyStats: focusStats.dailyStats || [],
        }
      });
    } catch (error) {
      console.error("Failed to load global analytics:", error);
      setAnalyticsError(error);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return (
    <AnalyticsContext.Provider value={{ analyticsData, loadingAnalytics, analyticsError, refreshAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
