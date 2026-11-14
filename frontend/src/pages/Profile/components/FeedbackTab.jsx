import React, { useState, useEffect } from 'react';
import { Lock, Star, Upload, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import feedbackService from '../../../services/feedbackService';

const FeedbackTab = ({ existingFeedback, onFeedbackSaved, stats }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [wouldRecommend, setWouldRecommend] = useState(true);

  useEffect(() => {
    if (existingFeedback) {
      setRating(existingFeedback.rating || 0);
      setTitle(existingFeedback.title || '');
      setReview(existingFeedback.review || '');
      setAnonymous(existingFeedback.anonymous || false);
      setWouldRecommend(existingFeedback.wouldRecommend !== false);
    }
  }, [existingFeedback]);

  // Unlock logic
  const isUnlocked = 
    (stats?.totalDocuments && stats.totalDocuments >= 1) ||
    (stats?.totalQuizzes && stats.totalQuizzes >= 1) ||
    (stats?.totalFlashcardSets && stats.totalFlashcardSets >= 1) ||
    (stats?.totalStudyDays && stats.totalStudyDays > 0);

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-xs relative">
          <Lock className="w-8 h-8 text-slate-400" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Review Locked</h2>
        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
          We'd love to hear your experience after you've used CleverPrep. Upload your first study document to unlock Feedback.
        </p>
        <Link
          to="/dashboard/documents"
          className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (review.length < 30) {
      setError("Review must be at least 30 characters.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Collect basic info about device
      const userAgent = window.navigator.userAgent;
      
      const payload = {
        rating,
        title,
        review,
        anonymous,
        wouldRecommend,
        device: userAgent,
        version: "1.0.0"
      };

      const res = await feedbackService.upsertFeedback(payload);
      if (res.success) {
        setSuccess(true);
        onFeedbackSaved(res.data);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || "Failed to submit feedback");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {existingFeedback ? "Edit Your Review" : "Rate CleverPrep"}
        </h2>
        <p className="text-sm text-slate-500">
          Share your experience with other students. Your profile name and avatar will be displayed automatically unless you choose to remain anonymous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
        
        {/* Rating */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Overall Rating <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-hidden group"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-8 h-8 transition-all ${
                    (hoverRating || rating) >= star 
                      ? 'text-amber-400 fill-amber-400 scale-110' 
                      : 'text-slate-200 group-hover:text-amber-200'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Review Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Saved me during finals week!"
            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-hidden"
          />
        </div>

        {/* Review */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <label className="block text-sm font-bold text-slate-700">Experience <span className="text-red-500">*</span></label>
            <span className={`text-xs font-medium ${review.length < 30 ? 'text-amber-500' : 'text-slate-400'}`}>
              {review.length}/500 {review.length < 30 && '(Min 30)'}
            </span>
          </div>
          <textarea
            required
            maxLength={500}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you liked, what could be improved, and how it helped you study..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-hidden resize-none"
          />
        </div>

        {/* Toggles */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex-1">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-700">I recommend this</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex-1">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="text-sm font-bold text-slate-700">Post Anonymously</span>
          </label>
        </div>

        {/* Messages & Actions */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2">
              <Info className="w-4 h-4" /> {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100 flex items-center gap-2">
              <Info className="w-4 h-4" /> Review saved successfully!
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-400">
              Only one review per user. You can update it anytime.
            </div>
            <button
              type="submit"
              disabled={loading || review.length < 30 || rating === 0}
              className={`h-11 px-8 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center min-w-[120px]
                ${loading || review.length < 30 || rating === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-primary text-white hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-md shadow-primary/20'
                }
              `}
            >
              {loading ? "Saving..." : (existingFeedback ? "Update Review" : "Submit Review")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackTab;
