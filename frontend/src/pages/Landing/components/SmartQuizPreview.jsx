import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BrainCircuit, BookOpen, Clock, Zap, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

const SmartQuizPreview = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-50px" });
  
  const [phase, setPhase] = useState('idle'); // idle -> selected -> revealed
  const [questionNum, setQuestionNum] = useState(3);

  useEffect(() => {
    if (!isInView) return;

    let timeout1, timeout2, timeout3;

    const sequence = () => {
      setPhase('idle');
      
      timeout1 = setTimeout(() => {
        setPhase('selected');
      }, 2500);

      timeout2 = setTimeout(() => {
        setPhase('revealed');
      }, 3500);

      timeout3 = setTimeout(() => {
        setQuestionNum(prev => prev >= 9 ? 1 : prev + 2);
        sequence();
      }, 8000);
    };

    sequence();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [isInView]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-linear-to-br from-purple-100/40 to-fuchsia-50/40 flex items-center justify-center p-4 sm:p-6 rounded-2xl border border-purple-200/50 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0" />
      
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-sm bg-white rounded-[24px] shadow-xl border border-slate-200/60 p-5 sm:p-6 flex flex-col relative z-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Badges */}
        <div className="flex items-center justify-between mb-6 text-[10px] font-bold">
          <div className="flex items-center gap-1.5 text-blue-500 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
            <BookOpen size={12} /> Biology Final Exam
          </div>
          <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <BrainCircuit size={12} /> AI Generated
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
            <span>Question {questionNum} of 10</span>
            <span className="text-primary">{(questionNum / 10) * 100}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-linear-to-r from-primary to-fuchsia-500 rounded-full"
              animate={{ width: `${(questionNum / 10) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-bold text-slate-800 mb-5 leading-tight">
          Which organelle is primarily responsible for ATP production?
        </h3>

        {/* Options */}
        <div className="space-y-2.5 mb-2 relative">
          {[
            { id: 'A', text: 'Nucleus' },
            { id: 'B', text: 'Mitochondria', isCorrect: true },
            { id: 'C', text: 'Ribosome' },
            { id: 'D', text: 'Golgi Apparatus' }
          ].map((opt, i) => {
            const isSelected = phase !== 'idle' && opt.isCorrect;
            const isRevealed = phase === 'revealed' && opt.isCorrect;

            return (
              <motion.div 
                key={opt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-3.5 rounded-xl border-2 transition-colors duration-300 flex items-center gap-3 ${
                  isRevealed 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 bg-white text-slate-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isRevealed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isSelected
                    ? 'border-primary bg-primary'
                    : 'border-slate-300'
                }`}>
                  {isRevealed && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} type="spring">
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </motion.div>
                  )}
                  {isSelected && !isRevealed && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[14px] font-semibold">{opt.id}. {opt.text}</span>
              </motion.div>
            );
          })}
        </div>

        {/* AI Explanation Slide Up */}
        <div className="overflow-hidden h-[90px] flex items-end">
          <AnimatePresence>
            {phase === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl mt-3"
              >
                <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles size={12} /> AI Explanation
                </div>
                <p className="text-[12px] text-slate-600 leading-snug font-medium">
                  Mitochondria generate ATP through cellular respiration, making them the primary source of energy production within eukaryotic cells.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <ShieldAlert size={12} className="text-amber-500" /> Medium
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <Zap size={12} className="text-blue-500" /> 10 Questions
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <Clock size={12} className="text-emerald-500" /> 5 min
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <BrainCircuit size={12} className="text-primary" /> 92% Accuracy Predict
          </div>
        </div>
      </motion.div>

      {/* Floating Badge */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
        <div className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
        CleverPrep AI
      </div>
    </div>
  );
};

export default SmartQuizPreview;
