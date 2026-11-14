import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const ComparisonSection = () => {
  const before = [
    "Read 200 Pages manually",
    "Write notes by hand",
    "Create Flashcards yourself",
    "Search YouTube for explanations",
    "Unstructured, random revision"
  ];
  
  const after = [
    "Upload Once, understand instantly",
    "AI generated structured Notes",
    "Auto-generated Active Recall Flashcards",
    "Listen to AI Podcast summaries",
    "Gamified Focus Workspace"
  ];

  return (
    <section className="py-24 bg-bg-base border-y border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Why CleverPrep?</h2>
          <p className="text-lg text-slate-600">The traditional way of studying is slow and inefficient. See how AI changes the game.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Traditional */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col">
            <h3 className="text-xl font-bold text-slate-500 mb-8 pb-4 border-b border-slate-200">Traditional Study</h3>
            <ul className="space-y-6 flex-1">
              {before.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-slate-500" strokeWidth={3} />
                  </div>
                  <span className="font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CleverPrep */}
          <div className="flex-1 bg-primary text-white rounded-3xl p-8 sm:p-10 flex flex-col relative overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.15)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/20 relative z-10">CleverPrep</h3>
            <ul className="space-y-6 flex-1 relative z-10">
              {after.map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="font-bold text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
