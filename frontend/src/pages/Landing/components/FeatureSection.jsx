import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Copy, BrainCircuit, Timer, LineChart, Headphones, ArrowRight, Microscope, FileText, Sparkles, CheckCircle2, Flame, Trophy, Target, Music, Coffee, Check, ShieldCheck, Play, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartFlashcardsPreview from './SmartFlashcardsPreview';
import SmartQuizPreview from './SmartQuizPreview';

const features = [
  {
    title: "AI Generated Notes",
    description: "Instantly convert your raw documents, PDFs, or unstructured text into perfectly organized, comprehensive study notes. Save hours of manual summarization.",
    icon: BookOpen,
    color: "purple",
    cta: "Try AI Notes",
    image: (
      <div className="w-full h-full relative group">
        {/* Massive Background Glow */}
        <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.25),transparent_60%)] rounded-full blur-2xl opacity-70 group-hover:opacity-85 transition-opacity duration-250 ease-out pointer-events-none" />
        
        {/* Outer Premium Container */}
        <div className="w-full h-full flex flex-col p-4 sm:p-6 rounded-[24px] bg-white/40 backdrop-blur-xl border border-[rgba(167,139,250,0.22)] shadow-[0_8px_24px_rgba(15,23,42,0.06),0_20px_60px_rgba(124,58,237,0.08)] group-hover:-translate-y-[6px] group-hover:border-[rgba(139,92,246,0.4)] transition-all duration-250 ease-out relative z-10">
          
          {/* Document Container */}
          <div className="flex-1 rounded-xl shadow-md border border-[rgba(167,139,250,0.18)] p-4 sm:p-5 flex flex-col relative z-10 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.95)] to-[rgba(248,245,255,0.92)]">
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(167,139,250,0.18)] relative overflow-hidden">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <h4 className="font-bold text-slate-800 text-sm sm:text-base relative z-10 truncate">Cell Biology – Summary</h4>
              <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-primary/40 rounded-full" />
              {/* Shimmer effect */}
              <motion.div 
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-20 pointer-events-none"
              />
            </div>
  
            <div className="flex-1 space-y-4 overflow-hidden">
              {/* Overview */}
              <motion.div initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="flex items-center gap-1.5 mb-1.5 text-primary font-bold text-xs sm:text-sm">
                  <Microscope className="w-3.5 h-3.5" /> Overview
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                  Cell biology studies the structure, function, and behavior of cells, the fundamental units of life.
                </p>
              </motion.div>
  
              {/* Key Concepts */}
              <motion.div initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="flex items-center gap-1.5 mb-2 text-primary font-bold text-xs sm:text-sm">
                  <BrainCircuit className="w-3.5 h-3.5" /> Key Concepts
                </div>
                <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 ml-1">
                  <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400 shrink-0"/> <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Cell Theory</span></li>
                  <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400 shrink-0"/> Prokaryotic vs Eukaryotic Cells</li>
                  <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-slate-400 shrink-0"/> <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Plasma Membrane</span></li>
                </ul>
              </motion.div>
  
              {/* Formula */}
              <motion.div initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-slate-50 p-2 sm:p-2.5 rounded-lg border border-[rgba(167,139,250,0.18)] flex items-center justify-center font-mono text-[10px] sm:text-xs text-slate-700 font-medium">
                ATP → ADP + P<sub className="text-[8px] sm:text-[10px] ml-0.5">i</sub> + Energy
              </motion.div>
            </div>
  
            {/* Footer Stats */}
            <div className="mt-auto pt-3 border-t border-[rgba(167,139,250,0.18)] flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>AI Confidence <span className="text-primary font-bold">98%</span></span>
              </div>
              <div>3.2s</div>
            </div>
          </div>
  
          {/* Floating Badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_4px_12px_rgba(124,58,237,0.1)] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-700">
            <div className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            CleverPrep AI
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Smart Flashcards",
    description: "CleverPrep automatically extracts key concepts and creates spaced-repetition flashcards. Review them in our distraction-free interface to guarantee long-term retention.",
    icon: Copy,
    color: "blue",
    cta: "Create Flashcards",
    image: <SmartFlashcardsPreview />
  },
  {
    title: "AI Quiz Generator",
    description: "Test your knowledge before the real exam. Our AI analyzes your material and generates realistic multiple-choice quizzes with detailed explanations for every answer.",
    icon: BrainCircuit,
    color: "purple",
    cta: "Generate a Quiz",
    image: <SmartQuizPreview />
  },
  {
    title: "Focus Workspace",
    description: "Stay in deep focus with an AI-powered productivity environment designed to eliminate distractions and maximize learning.",
    icon: Timer,
    color: "purple",
    cta: "Start Focus Session",
    badge: "NEW AI Productivity",
    customContent: (
      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          {["Pomodoro Timer", "AI Study Sessions", "Ambient Music", "Smart Break Reminder", "Daily Goal Tracking", "XP & Streak Progress", "Focus Analytics"].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
              </div>
              <span className="text-sm font-bold text-slate-700">{item}</span>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Flame, title: "3 Day Streak", val: "🔥" },
            { icon: Trophy, title: "25 XP", val: "⭐" },
            { icon: Target, title: "92 Focus Score", val: "🎯" }
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} className="bg-white/60 border border-slate-200/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center gap-1">
                <span className="text-lg">{stat.val}</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{stat.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
    customCta: (
      <Link to="/register" className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-white overflow-hidden shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all mt-4 w-full sm:w-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] animate-gradient" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 blur-xl transition-opacity duration-300" />
        <span className="relative z-10 text-sm">Start Focus Session</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
      </Link>
    ),
    image: (
      <div className="w-full h-full bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-6 shadow-[0_20px_60px_rgba(139,92,246,0.15)] flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-400/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative z-10 w-full max-w-[320px] bg-white/90 backdrop-blur-2xl border border-white rounded-[24px] p-5 shadow-2xl flex flex-col gap-4">
          
          {/* Top Block */}
          <div className="flex flex-col items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full mb-3">
              <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">Focus Session</span>
            </div>
            <div className="text-4xl font-black text-slate-800 tracking-tighter mb-4">25:00</div>
            <div className="w-full">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Today's Goal</span>
                <span className="text-[10px] font-bold text-slate-600">45 / 120 mins</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "37.5%" }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Middle Blocks */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-2">
                <Music className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-700">Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-slate-400" />
                <div className="flex-1 h-1 bg-slate-200 rounded-full"><div className="w-[60%] h-full bg-indigo-400 rounded-full" /></div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-2">
                <Coffee className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold text-slate-700">Next Break</span>
              </div>
              <div className="text-sm font-black text-slate-800">08:00</div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-700">AI Notes</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-slate-400 line-through">Biology Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm border border-slate-300" />
                <span className="text-[10px] font-bold text-slate-700">Physics Formula Sheet</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    )
  }
];

const FeatureSection = ({ preview = false }) => {
  const displayedFeatures = preview ? features.slice(0, 3) : features;

  return (
    <section id="features" className="py-24 bg-bg-base overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black tracking-widest uppercase text-primary mb-3">Core Features</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-6">
            Everything you need to master your exams.
          </h3>
          <p className="text-lg text-text-secondary leading-relaxed">
            Stop wasting time organizing notes. CleverPrep's AI pipeline instantly translates your course materials into an actionable study plan.
          </p>
        </div>

        <div className="space-y-32">
          {displayedFeatures.map((feature, index) => {
            const isEven = index % 2 === 0;
            const Icon = feature.icon;
            
            return (
              <div key={feature.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="w-full lg:w-1/2"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${feature.color}-100 text-${feature.color}-600`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight mb-4">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{feature.badge}</span>
                    </div>
                  )}
                  <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.customContent}

                  <div className="mt-8">
                    {feature.customCta ? (
                      feature.customCta
                    ) : (
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors group"
                      >
                        {feature.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </motion.div>

                {/* Visual Mockup */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="w-full lg:w-1/2 aspect-4/3 lg:aspect-square max-h-[400px]"
                >
                  {feature.image}
                </motion.div>
                
              </div>
            );
          })}
        </div>

        {preview && (
          <div className="mt-24 text-center">
            <Link
              to="/features"
              className="inline-flex items-center justify-center h-12 px-8 font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
            >
              Explore All Features
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeatureSection;
