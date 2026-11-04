import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Pause, Play, SkipForward, RotateCcw, 
  FileText, BrainCircuit, Sparkles, BookOpen, 
  Headphones, Target, LineChart, ArrowRight,
  CheckCircle2, Loader2, PlayCircle, Zap, Shield, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 'upload', title: 'Upload Document', icon: FileText, duration: 2000 },
  { id: 'notes', title: 'Generating AI Notes', icon: BrainCircuit, duration: 2500 },
  { id: 'flashcards', title: 'Generating Flashcards', icon: Sparkles, duration: 2000 },
  { id: 'quiz', title: 'Generating Quiz', icon: BookOpen, duration: 2000 },
  { id: 'podcast', title: 'Generating Podcast', icon: Headphones, duration: 2500 },
  { id: 'focus', title: 'Focus Workspace', icon: Target, duration: 2000 },
  { id: 'analytics', title: 'Analytics Updated', icon: LineChart, duration: 2000 },
  { id: 'cta', title: 'Ready to start?', icon: Zap, duration: Infinity },
];

const InteractivePreviewModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const remainingTimeRef = useRef(null);

  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) cancelAnimationFrame(progressIntervalRef.current);
  };

  const startStep = (stepIndex, initialProgress = 0) => {
    clearTimers();
    setCurrentStep(stepIndex);
    setProgress(initialProgress);
    setIsPaused(false);

    if (stepIndex >= STEPS.length - 1) return; // CTA step

    const stepDuration = STEPS[stepIndex].duration;
    const timeToRun = stepDuration * (1 - (initialProgress / 100));
    startTimeRef.current = performance.now() - (initialProgress / 100) * stepDuration;

    const updateProgress = (timestamp) => {
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / stepDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        progressIntervalRef.current = requestAnimationFrame(updateProgress);
      }
    };
    progressIntervalRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      startStep(stepIndex + 1);
    }, timeToRun);
  };

  useEffect(() => {
    startStep(0);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePauseResume = () => {
    if (currentStep >= STEPS.length - 1) return;

    if (isPaused) {
      // Resume
      startStep(currentStep, progress);
    } else {
      // Pause
      clearTimers();
      setIsPaused(true);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      startStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    startStep(0);
  };

  const activeStepData = STEPS[currentStep];
  const isFinalStep = currentStep === STEPS.length - 1;

  // Renders the specific UI for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Upload
        return (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col items-center justify-center h-full space-y-6"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-32 h-40 bg-bg-surface border-2 border-primary/30 rounded-xl flex flex-col items-center justify-center shadow-2xl shadow-primary/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent" />
              <FileText size={48} className="text-primary mb-2" />
              <div className="w-16 h-2 bg-border rounded-full mb-1" />
              <div className="w-12 h-2 bg-border rounded-full" />
              
              {/* Laser scan line */}
              <motion.div 
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_8px_2px_rgba(var(--color-primary-rgb),0.8)]"
              />
            </motion.div>
            <p className="text-xl font-bold text-text-primary">Analyzing Advanced_Biology_Ch4.pdf</p>
          </motion.div>
        );

      case 1: // AI Notes
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full h-full max-w-lg mx-auto bg-bg-surface border border-border rounded-xl p-6 shadow-xl flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <BrainCircuit className="text-primary" />
              <h3 className="font-bold text-text-primary">AI Structured Notes</h3>
              <Loader2 className="ml-auto w-4 h-4 animate-spin text-text-muted" />
            </div>
            <div className="space-y-3 flex-1 overflow-hidden relative">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="h-4 bg-primary/20 rounded-sm w-3/4" />
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.2 }} className="h-4 bg-border rounded-sm w-full" />
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.4 }} className="h-4 bg-border rounded-sm w-5/6" />
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.6 }} className="h-4 bg-border rounded-sm w-full" />
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.8 }} className="h-4 bg-border rounded-sm w-4/5" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-bg-surface to-transparent" />
            </div>
          </motion.div>
        );

      case 2: // Flashcards
        return (
          <div className="flex items-center justify-center h-full perspective-1000">
            <motion.div 
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-80 h-48 bg-linear-to-br from-primary to-accent rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white relative transform-style-3d"
            >
              <Sparkles className="absolute top-4 right-4 opacity-50" />
              <h3 className="text-2xl font-bold text-center">Mitosis</h3>
              <p className="text-white/80 mt-2 text-sm">Click to reveal definition</p>
            </motion.div>
          </div>
        );

      case 3: // Quiz
        return (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full gap-3">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-primary">
              <BookOpen className="text-primary"/> Active Recall Quiz
            </h3>
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`w-full p-4 rounded-xl border ${i === 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-bg-surface border-border'} flex items-center gap-3`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${i === 2 ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border'}`}>
                  {i === 2 && <CheckCircle2 size={14} />}
                </div>
                <div className="flex-1 h-3 bg-border rounded-full" />
              </motion.div>
            ))}
          </div>
        );
      
      case 4: // Podcast
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-full bg-linear-to-tr from-primary to-accent shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] flex items-center justify-center mb-8 relative overflow-hidden"
            >
              <Headphones size={48} className="text-white relative z-10" />
            </motion.div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [20, Math.random() * 60 + 20, 20] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  className="w-3 bg-primary rounded-full"
                />
              ))}
            </div>
            <p className="mt-6 text-text-secondary font-medium">Generating "Chapter 4 Summary" Audio...</p>
          </div>
        );

      case 5: // Focus Workspace
        return (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full max-w-2xl mx-auto rounded-xl border border-border bg-[#0f1115] shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Ambient Background Simulation */}
            <div className="absolute inset-0 bg-linear-to-b from-indigo-900/20 to-transparent pointer-events-none" />
            <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-black/20">
              <div className="flex items-center gap-2 text-white/70">
                <Target size={16} /> <span className="text-sm font-medium">Focus Session</span>
              </div>
              <div className="text-xl font-mono text-white tracking-wider">25:00</div>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-4 border-primary/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)]">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-primary"
                />
                <div className="text-center">
                  <div className="text-sm text-white/50 mb-1">STAY FOCUSED</div>
                  <div className="text-4xl font-bold text-white font-mono">24:59</div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6: // Analytics
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col justify-center items-center gap-8"
          >
            <div className="flex gap-4 w-full max-w-lg">
              <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black text-primary mb-1"
                >12</motion.div>
                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider">Day Streak</div>
              </div>
              <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-black text-emerald-500 mb-1"
                >450</motion.div>
                <div className="text-xs text-text-secondary uppercase font-bold tracking-wider">XP Earned</div>
              </div>
            </div>
            
            {/* Heatmap Simulation */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: i > 20 ? [0.2, 1] : 0.2, scale: i === 27 ? [1, 1.2, 1] : 1 }}
                  transition={{ delay: i === 27 ? 0.5 : 0 }}
                  className={`w-6 h-6 rounded-sm ${i === 27 ? 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-bg-base' : i > 23 ? 'bg-primary/60' : i > 15 ? 'bg-primary/30' : 'bg-bg-surface border border-border'}`}
                />
              ))}
            </div>
          </motion.div>
        );

      case 7: // CTA
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-text-primary mb-4">Ready to build your own?</h2>
            <p className="text-text-secondary mb-8 text-lg">
              Join thousands of students scoring higher with AI-powered study materials.
            </p>
            <Link 
              to="/register"
              onClick={onClose}
              className="h-14 px-8 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl h-[600px] max-h-[90vh] bg-bg-base border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-bg-surface/50 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-text-primary leading-tight">Live AI Preview</h3>
                {!isFinalStep && (
                  <p className="text-xs text-text-muted">
                    Step {currentStep + 1} of {STEPS.length - 1}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-surface rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar (Global) */}
          {!isFinalStep && (
            <div className="h-1 w-full bg-bg-surface relative z-20">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-linear-to-r from-primary to-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 relative overflow-hidden bg-bg-base flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Current Step Overlay Text */}
            {!isFinalStep && (
              <motion.div 
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none z-30"
              >
                <div className="bg-bg-surface/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  {React.createElement(activeStepData.icon, { size: 16, className: "text-primary" })}
                  <span className="font-bold text-text-primary text-sm">{activeStepData.title}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="h-16 border-t border-border/50 bg-bg-surface/50 backdrop-blur-sm flex items-center justify-between px-6 z-20">
            <button 
              onClick={handleRestart}
              className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              <RotateCcw size={16} /> Restart
            </button>
            
            {!isFinalStep && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePauseResume}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  {isPaused ? <Play size={18} className="ml-1" /> : <Pause size={18} />}
                </button>
                <button 
                  onClick={handleSkip}
                  className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  Skip <ChevronRight size={16} />
                </button>
              </div>
            )}
            
            {isFinalStep && (
              <div className="text-sm font-bold text-primary flex items-center gap-2">
                <CheckCircle2 size={16} /> Preview Complete
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractivePreviewModal;
