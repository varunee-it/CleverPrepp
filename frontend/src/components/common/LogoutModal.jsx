import React from "react";
import ReactDOM from "react-dom";
import { AlertCircle } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[12px] p-4 sm:p-8 animate-in fade-in duration-250"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-bg-surface w-full max-w-[480px] rounded-[28px] shadow-theme-2xl p-8 md:p-10 animate-in fade-in zoom-in-[0.96] duration-250 border border-border/50 flex flex-col items-center"
      >
        <div className="w-[64px] h-[64px] rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 shrink-0">
          <AlertCircle className="w-7 h-7 text-rose-500 stroke-[2]" />
        </div>

        {/* Title */}
        <h2 className="text-[22px] md:text-2xl font-black text-text-primary text-center mb-5 leading-tight tracking-tight">
          Log out of CleverPrep?
        </h2>

        {/* Description Paragraphs */}
        <div className="text-center text-text-secondary text-[15px] leading-relaxed max-w-[380px] mx-auto mb-8 flex flex-col gap-4 font-medium">
          <p>
            Your study materials, flashcards, quizzes, and progress will remain safely stored in your account.
          </p>
          <p>
            Logging out will not delete any of your data. Simply sign in again to continue learning from where you left off.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-center gap-3 mt-auto pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 rounded-2xl bg-bg-surface border border-border text-text-primary font-bold text-[15px] transition-all hover:bg-bg-surface-hover hover:border-border-hover disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-2xl bg-rose-500 text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(244,63,94,0.3)] transition-all hover:bg-rose-600 hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? "Logging Out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;
