import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import authService from "../../services/authService";
import { useAnalytics } from "../../context/AnalyticsContext";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { User, Lock, Bell, BarChart3, Settings, ShieldCheck } from "lucide-react";
import { getUserDisplayName, getUserInitials } from "../../utils/userUtils";

import ProfileSkeleton from "./components/ProfileSkeleton";
import AccountTab from "./components/AccountTab";
import SecurityTab from "./components/SecurityTab";
import StatisticsTab from "./components/StatisticsTab";
import SettingsTab from "./components/SettingsTab";
import FeedbackTab from "./components/FeedbackTab";
import { useTour } from "../../context/TourContext";
import feedbackService from "../../services/feedbackService";

const ProfilePage = () => {
  const { user } = useAuth();
  const { analyticsData, loadingAnalytics, analyticsError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [userFeedback, setUserFeedback] = useState(null);
  const location = useLocation();

  // Active section tab: 'account' | 'security' | 'statistics' | 'settings' | 'feedback'
  const [activeSection, setActiveSection] = useState("account");
  const { activeStep } = useTour();

  useEffect(() => {
    if (location.hash === '#feedback') {
      setActiveSection('feedback');
    }
  }, [location.hash]);

  useEffect(() => {
    if (activeStep && activeStep.route === "/profile" && activeStep.profileSection) {
      setActiveSection(activeStep.profileSection);
    }
  }, [activeStep]);

  useEffect(() => {
    setImgError(false);
  }, [user]);

  const isGoogleUser = user?.provider === "google";

  useEffect(() => {
    const initProfile = async () => {
      try {
        const res = await feedbackService.getMyFeedback();
        if (res.success && res.data) {
          setUserFeedback(res.data);
        }
      } catch (err) {
        console.error("Failed to load feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    initProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const getInitials = () => {
    return getUserInitials(user);
  };

  const getAvatarUrl = () => {
    const rawSrc = user?.profileImage || user?.avatar;
    if (!rawSrc) return null;
    if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://")) {
      return rawSrc;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";
    const cleanPath = rawSrc.startsWith("/") ? rawSrc : `/${rawSrc}`;
    return `${baseUrl}${cleanPath}`;
  };

  const avatarSrc = !imgError ? getAvatarUrl() : null;

  return (
    <div className="max-w-5xl mx-auto pb-12 relative z-10 space-y-8 animate-in fade-in duration-300">
      <PageHeader title="Account Hub" subtitle="Manage your learning identity, security, and preferences" />

      {/* Top Banner section */}
      <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-300/80">
        <div className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-3xl overflow-hidden select-none ${
          !avatarSrc ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/10" : ""
        }`}>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>

        <div className="text-center sm:text-left flex-1 pt-1 space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {getUserDisplayName(user)}{" "}
            {user?.isEmailVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                Verified Student <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              </span>
            )}
            {isGoogleUser && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                Google Account
              </span>
            )}
          </h2>
          <p className="text-slate-500 font-semibold text-sm">{user?.email}</p>
          {user?.createdAt && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
              Member since {moment(user.createdAt).format("MMMM YYYY")}
            </p>
          )}
        </div>
      </div>

      {/* Main Grid: Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Navigation Options Menu */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
            Account Options
          </h3>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col p-1.5 gap-1">
            {/* Account Settings */}
            <button
              onClick={() => setActiveSection("account")}
              className={`flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 text-left w-full group cursor-pointer border ${
                activeSection === "account"
                  ? "bg-primary/10 border-primary/20 text-text-primary font-bold shadow-xs"
                  : "bg-transparent border-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === "account" 
                  ? "text-primary bg-primary/10 border border-primary/20" 
                  : "bg-bg-surface-hover text-text-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Personal Information</p>
                <p className="text-[11px] font-medium text-text-muted mt-0.5">Manage username and avatar picture</p>
              </div>
            </button>

            {/* Security Settings */}
            <button
              onClick={() => setActiveSection("security")}
              className={`flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 text-left w-full group cursor-pointer border ${
                activeSection === "security"
                  ? "bg-primary/10 border-primary/20 text-text-primary font-bold shadow-xs"
                  : "bg-transparent border-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === "security" 
                  ? "text-primary bg-primary/10 border border-primary/20" 
                  : "bg-bg-surface-hover text-text-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Security & Password</p>
                <p className="text-[11px] font-medium text-text-muted mt-0.5">Update credentials and secure keys</p>
              </div>
            </button>



            {/* Statistics */}
            <button
              onClick={() => setActiveSection("statistics")}
              className={`flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 text-left w-full group cursor-pointer border ${
                activeSection === "statistics"
                  ? "bg-primary/10 border-primary/20 text-text-primary font-bold shadow-xs"
                  : "bg-transparent border-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === "statistics" 
                  ? "text-primary bg-primary/10 border border-primary/20" 
                  : "bg-bg-surface-hover text-text-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Learning Analytics</p>
                <p className="text-[11px] font-medium text-text-muted mt-0.5">Verify study cards and quiz results</p>
              </div>
            </button>

            {/* Account Control Settings */}
            <button
              onClick={() => setActiveSection("settings")}
              className={`flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 text-left w-full group cursor-pointer border ${
                activeSection === "settings"
                  ? "bg-primary/10 border-primary/20 text-text-primary font-bold shadow-xs"
                  : "bg-transparent border-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === "settings" 
                  ? "text-primary bg-primary/10 border border-primary/20" 
                  : "bg-bg-surface-hover text-text-muted group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Settings & Control</p>
                <p className="text-[11px] font-medium text-text-muted mt-0.5">Export data or delete profile details</p>
              </div>
            </button>
            {/* Feedback & Reviews */}
            <button
              onClick={() => setActiveSection("feedback")}
              className={`flex items-center gap-4 p-4.5 rounded-2xl transition-all duration-200 text-left w-full group cursor-pointer border ${
                activeSection === "feedback"
                  ? "bg-amber-500/10 border-amber-500/20 text-text-primary font-bold shadow-xs"
                  : "bg-transparent border-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === "feedback" 
                  ? "text-amber-500 bg-amber-500/10 border border-amber-500/20" 
                  : "bg-bg-surface-hover text-text-muted group-hover:bg-amber-500/10 group-hover:text-amber-500"
              }`}>
                <span className="text-lg">⭐</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {userFeedback ? "Edit Your Review" : "Rate CleverPrep"}
                </p>
                <p className="text-[11px] font-medium text-text-muted mt-0.5">Share your experience with others</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Active Detail Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:shadow-md hover:border-slate-300/80">
          {activeSection === "account" && <AccountTab />}
          {activeSection === "security" && <SecurityTab />}

          {activeSection === "statistics" && (
            analyticsError ? (
              <div className="text-center py-12 text-red-500 font-semibold">Failed to load analytics data.</div>
            ) : (
              <StatisticsTab statsData={analyticsData} loading={loadingAnalytics} />
            )
          )}
          {activeSection === "settings" && <SettingsTab />}
          {activeSection === "feedback" && (
            <FeedbackTab 
              existingFeedback={userFeedback} 
              onFeedbackSaved={(feedback) => setUserFeedback(feedback)}
              stats={analyticsData?.overview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;