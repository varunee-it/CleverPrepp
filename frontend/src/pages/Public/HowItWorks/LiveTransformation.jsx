import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Loader2, PlayCircle, Settings, BrainCircuit } from 'lucide-react';

const LiveTransformation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Uploading...", desc: "Operating Systems.pdf", icon: Loader2, spin: true },
    { title: "Gemini AI reads the document", desc: "Extracting 40 pages of text", icon: BrainCircuit },
    { title: "Topics extracted", desc: "Memory Management, Scheduling, Deadlocks", icon: FileText },
    { title: "Concept relationships detected", desc: "Building knowledge graph", icon: Settings },
    { title: "Summary generated", desc: "Perfectly organized notes ready", icon: CheckCircle2 },
    { title: "Flashcards created", desc: "24 active recall cards generated", icon: CheckCircle2 },
    { title: "Quiz generated", desc: "15 MCQs with AI explanations", icon: CheckCircle2 },
    { title: "Podcast generated", desc: "12-minute audio summary ready", icon: PlayCircle },
    { title: "Focus Workspace updated", desc: "Study goals aligned", icon: CheckCircle2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="py-24 bg-bg-surface border-y border-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Live AI Transformation</h2>
          <p className="text-lg text-slate-600">Watch as your raw documents are instantly converted into a highly structured learning ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Raw PDF Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 aspect-[4/5] flex flex-col transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Operating Systems.pdf</h3>
                  <p className="text-slate-500 text-sm">40 Pages • 2.4 MB</p>
                </div>
              </div>
              
              {/* PDF Content Mockup */}
              <div className="flex-1 space-y-4">
                <div className="h-6 w-3/4 bg-slate-100 rounded-md" />
                <div className="h-4 w-full bg-slate-50 rounded-md" />
                <div className="h-4 w-5/6 bg-slate-50 rounded-md" />
                <div className="h-4 w-full bg-slate-50 rounded-md" />
                <div className="h-32 w-full bg-slate-100 rounded-xl mt-6 border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  [ Architecture Diagram ]
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-md mt-6" />
                <div className="h-4 w-4/5 bg-slate-50 rounded-md" />
              </div>

              {/* Scanning Laser Effect */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(124,58,237,0.8)] opacity-50 z-20"
              />
            </div>
          </div>

          {/* RIGHT: Animated Processing Steps */}
          <div className="relative h-[600px]">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" />
            
            <div className="space-y-6 relative z-10 py-4">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                
                return (
                  <div key={idx} className={`flex items-start gap-6 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : isPast ? 'opacity-60' : 'opacity-30'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 bg-white
                      ${isActive ? 'border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 
                        isPast ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-400'}`}
                    >
                      <step.icon className={`w-5 h-5 ${isActive && step.spin ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                    </div>
                    
                    <div className="pt-2">
                      <h4 className={`font-bold text-lg transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.title}
                      </h4>
                      <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveTransformation;
