import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, FileBox, Layers, HelpCircle, Headphones, Target, LineChart, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const steps = [
    { label: "Upload PDF", Icon: FileText },
    { label: "AI Processing", Icon: Cpu },
    { label: "Notes", Icon: FileBox },
    { label: "Flashcards", Icon: Layers },
    { label: "Quiz", Icon: HelpCircle },
    { label: "Podcast", Icon: Headphones },
    { label: "Focus Workspace", Icon: Target },
    { label: "Analytics", Icon: LineChart }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-bg-base">
      {/* Soft Glow Background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-8 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            ✨ The CleverPrep Magic
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            How CleverPrep Works
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-16">
            From a single PDF to a complete AI-powered study workspace in seconds.
          </p>
        </motion.div>

        {/* Animated Workflow Illustration */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-3.5 bg-white/60 backdrop-blur-xl border border-primary/15 rounded-2xl shadow-[0_4px_12px_rgba(124,58,237,0.05),0_10px_30px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_20px_rgba(124,58,237,0.15)] transition-all duration-300 group cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <step.Icon className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-sm md:text-base text-slate-800">{step.label}</span>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div variants={itemVariants} className="hidden md:flex text-slate-300 shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
