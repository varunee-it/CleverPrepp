import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, Sparkles, BookOpen, BrainCircuit, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import InteractivePreviewModal from './InteractivePreviewModal';

const HeroSection = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6"
            >
              <Sparkles size={16} />
              <span>Your Personal AI Study Tutor</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.1] mb-6"
            >
              Learn Faster.<br />
              Remember Longer.<br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-500 to-teal-500">
                Score Higher.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              CleverPrep uses advanced AI to instantly generate perfectly tailored notes, flashcards, and quizzes from your course materials. Study smarter in your dedicated Focus Workspace.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 font-bold text-white bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl transition-all duration-250 ease-out hover:-translate-y-[2px] hover:scale-[1.02] active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.12),0_10px_30px_rgba(139,92,246,0.18)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.15),0_12px_40px_rgba(139,92,246,0.22)] group relative"
              >
                {/* Premium Lavender Bottom Glow */}
                <div 
                  className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[80%] h-[16px] blur-[12px] transition-opacity duration-250 ease-out opacity-80 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0.18) 45%, transparent 80%)'
                  }}
                />
                <span className="flex items-center gap-2 text-base relative z-10">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
              </Link>
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 font-bold text-text-primary bg-bg-surface border-2 border-border hover:border-primary/50 hover:bg-bg-surface-hover rounded-xl transition-all hover:scale-105 active:scale-95 group"
              >
                <span className="flex items-center gap-2 text-base">
                  ✨ See AI in Action
                </span>
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-text-secondary"
            >
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free forever plan</div>
            </motion.div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="w-full lg:w-1/2 relative perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: -5, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative rounded-2xl bg-bg-surface border border-border shadow-2xl overflow-hidden transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Mockup Header */}
              <div className="h-12 border-b border-border bg-bg-base flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto w-1/2 h-6 bg-bg-surface-hover rounded-md border border-border" />
              </div>
              
              {/* Mockup Body */}
              <div className="p-6 bg-bg-base grid grid-cols-2 gap-4">
                
                {/* Stats Card */}
                <div className="col-span-2 flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border">
                  <div>
                    <p className="text-xs text-text-secondary font-bold uppercase mb-1">Study Streak</p>
                    <p className="text-2xl font-black text-text-primary">12 Days</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-2xl">
                    🔥
                  </div>
                </div>

                {/* AI Notes Card */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="p-4 rounded-xl bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/20"
                >
                  <BookOpen className="w-6 h-6 text-emerald-500 mb-3" />
                  <h3 className="font-bold text-text-primary text-sm mb-1">Cell Biology Notes</h3>
                  <div className="w-3/4 h-2 bg-emerald-500/20 rounded-full mt-3" />
                  <div className="w-1/2 h-2 bg-emerald-500/20 rounded-full mt-2" />
                </motion.div>

                {/* AI Quiz Card */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="p-4 rounded-xl bg-linear-to-br from-indigo-500/10 to-transparent border border-indigo-500/20"
                >
                  <BrainCircuit className="w-6 h-6 text-indigo-500 mb-3" />
                  <h3 className="font-bold text-text-primary text-sm mb-1">Anatomy Quiz</h3>
                  <p className="text-xs font-semibold text-indigo-600">Generated by AI</p>
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex-1 h-1.5 bg-indigo-500/40 rounded-full" />
                    ))}
                  </div>
                </motion.div>
                
                {/* Analytics */}
                <div className="col-span-2 p-4 rounded-xl bg-bg-surface border border-border flex items-end justify-between h-32">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="w-[10%] bg-primary/20 rounded-t-sm relative"
                    >
                      {h === 100 && <div className="absolute -top-1 inset-x-0 h-1 bg-primary rounded-t-sm" />}
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
              transition={{ opacity: { delay: 1 }, x: { delay: 1 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute -right-4 top-1/4 bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 p-3 rounded-2xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Accuracy</p>
                <p className="text-sm font-black text-slate-900">+24% this week</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <InteractivePreviewModal onClose={() => setIsPreviewOpen(false)} />
      )}
    </section>
  );
};

export default HeroSection;
