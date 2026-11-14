import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, User as UserIcon, ArrowRight } from 'lucide-react';
import feedbackService from '../../../services/feedbackService';
import moment from 'moment';
import { useAuth } from '../../../context/AuthContext';

const TestimonialsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-bg-surface border border-border rounded-3xl p-8 h-64 animate-pulse flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="w-5 h-5 bg-border rounded-full" />
            ))}
          </div>
          <div className="h-4 bg-border rounded w-3/4 mb-3" />
          <div className="h-4 bg-border rounded w-full mb-3" />
          <div className="h-4 bg-border rounded w-5/6" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-border rounded-full" />
          <div>
            <div className="h-4 bg-border rounded w-24 mb-1" />
            <div className="h-3 bg-border rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Testimonials = ({ preview = false }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('helpful'); // 'helpful', 'newest', 'top'
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feedbackRes, statsRes] = await Promise.all([
          feedbackService.getPublicFeedback(activeTab),
          feedbackService.getFeedbackStats()
        ]);
        
        if (feedbackRes.success) {
          setFeedbacks(feedbackRes.data);
        }
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error("Failed to load feedback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <section id="testimonials" className="py-24 bg-bg-base overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
            {stats && stats.totalReviews > 0 ? "Loved by ambitious students." : "⭐ Student Reviews"}
          </h2>
          {stats && stats.totalReviews > 0 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="font-black text-slate-900">{stats.averageRating}/5</span>
              </div>
              <p className="text-sm font-medium text-text-secondary">
                Based on <span className="font-bold text-text-primary">{stats.totalReviews}</span> verified student reviews
              </p>
            </div>
          )}

          {stats && stats.totalReviews > 0 && (
            <div className="mt-6">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = "/dashboard/profile#feedback";
                  } else {
                    window.location.href = "/login?redirect=" + encodeURIComponent("/dashboard/profile#feedback");
                  }
                }} 
                className="inline-flex items-center justify-center h-10 px-6 bg-slate-900 text-white font-bold rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer text-sm"
              >
                Write a Review
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        {feedbacks.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-bg-surface border border-border p-1 rounded-xl shadow-xs">
              {[
                { id: 'helpful', label: 'Most Helpful' },
                { id: 'newest', label: 'Newest' },
                { id: 'top', label: 'Top Rated' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="min-h-[300px]">
          {loading ? (
            <TestimonialsSkeleton />
          ) : feedbacks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center p-12 sm:p-16 bg-white/40 backdrop-blur-xl border border-[rgba(167,139,250,0.22)] rounded-[32px] max-w-[700px] mx-auto relative overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.06),0_20px_60px_rgba(124,58,237,0.08)]"
            >
              {/* Subtle background particles / glow */}
              <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.15),transparent_60%)] rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </motion.div>
              </div>
              
              <motion.h3 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-3xl font-black text-slate-800 mb-4 relative z-10"
              >
                No reviews yet
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="text-base sm:text-lg text-slate-600 mb-8 max-w-md relative z-10"
              >
                Be the first student to share your CleverPrep experience. Your feedback helps improve CleverPrep for every student.
              </motion.p>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="relative z-10">
                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      window.location.href = "/dashboard/profile#feedback";
                    } else {
                      window.location.href = "/login?redirect=" + encodeURIComponent("/dashboard/profile#feedback");
                    }
                  }} 
                  className="group relative inline-flex items-center justify-center h-12 px-8 font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full transition-all duration-250 ease-out hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(124,58,237,0.15),0_10px_30px_rgba(139,92,246,0.2)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.2),0_12px_40px_rgba(139,92,246,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Write a Review
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </button>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
                className="text-[11px] font-medium text-slate-400 mt-6 relative z-10"
              >
                Real student feedback will automatically appear here after the first approved review.
              </motion.p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {(preview ? feedbacks.slice(0, 6) : feedbacks).map((feedback, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={feedback._id}
                    className="bg-bg-surface border border-border p-6 rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col h-full group relative overflow-hidden"
                  >
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < feedback.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap ml-4">
                        {moment(feedback.createdAt).fromNow()}
                      </span>
                    </div>

                    <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight relative z-10">{feedback.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 relative z-10">
                      "{feedback.review}"
                    </p>

                    {/* Author & Stats Block */}
                    <div className="mt-auto pt-5 border-t border-slate-100 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        {feedback.anonymous ? (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <UserIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        ) : feedback.avatar ? (
                          <img 
                            src={feedback.avatar} 
                            alt={feedback.displayName} 
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                            {feedback.displayName?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                            {feedback.anonymous ? "Anonymous Student" : feedback.displayName}
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          </h4>
                          <p className="text-xs font-medium text-slate-500 truncate">
                            {feedback.course || 'Student'} {feedback.college && `• ${feedback.college}`}
                          </p>
                        </div>
                      </div>

                      {/* Micro Stats */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {feedback.userStats?.documentsUploaded > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200/60">
                            {feedback.userStats.documentsUploaded} Docs
                          </span>
                        )}
                        {feedback.userStats?.quizzesCompleted > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {feedback.userStats.quizzesCompleted} Quizzes
                          </span>
                        )}
                        {feedback.userStats?.flashcardsGenerated > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {feedback.userStats.flashcardsGenerated} Sets
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
