import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BrainCircuit, FileBox, Layers, HelpCircle, Headphones, Target, CheckCircle2 } from 'lucide-react';

const ModuleSection = ({ title, desc, icon: Icon, reversed, children }) => (
  <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center py-20`}>
    <div className="flex-1 space-y-6">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
        <Icon className="w-7 h-7" strokeWidth={2} />
      </div>
      <h3 className="text-3xl md:text-4xl font-black text-slate-900">{title}</h3>
      <p className="text-lg text-slate-600 leading-relaxed">{desc}</p>
    </div>
    <div className="flex-1 w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
        <div className="relative bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)] rounded-3xl p-6 sm:p-8 overflow-hidden group">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const FlashcardDemo = () => {
  const [flipped, setFlipped] = React.useState(false);
  const [hasFlipped, setHasFlipped] = React.useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!hasFlipped) setHasFlipped(true);
  };

  return (
    <div className="aspect-[4/3] perspective-1000">
      <motion.div 
        onClick={handleFlip}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(167,139,250,0.15)' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full h-full relative preserve-3d cursor-pointer rounded-2xl"
        role="button"
        tabIndex={0}
        aria-label="Flashcard. Click to flip."
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8 text-center">
          <h4 className="text-xl font-bold text-slate-800 flex-1 flex items-center justify-center">What is the powerhouse of the cell?</h4>
          
          <motion.div 
            animate={{ opacity: hasFlipped ? 0 : 1 }}
            className="text-xs font-bold text-slate-400 mt-auto flex items-center gap-1.5"
          >
            👇 Click to Flip
          </motion.div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-primary text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center transform rotate-y-180">
          <h4 className="text-2xl font-black flex-1 flex items-center justify-center">Mitochondria</h4>
          <p className="text-sm text-white/80 mt-auto">Produces energy via cellular respiration.</p>
        </div>
      </motion.div>
    </div>
  );
};

const ProductModules = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upload */}
        <ModuleSection 
          title="Frictionless Uploads" 
          desc="Simply drag and drop your study material. CleverPrep supports PDFs, Word documents, text files, and images."
          icon={FileText}
        >
          <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-colors group-hover:bg-primary/10">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h4 className="font-bold text-slate-800 text-lg mb-2">Drag & Drop your files here</h4>
            <p className="text-slate-500 text-sm">Supports PDF, DOCX, TXT, Images up to 50MB</p>
          </div>
        </ModuleSection>

        {/* AI Processing */}
        <ModuleSection 
          title="Deep Concept Extraction" 
          desc="Gemini AI doesn't just read words—it understands concepts, maps relationships, extracts important formulas, and identifies keywords automatically."
          icon={BrainCircuit}
          reversed
        >
          <div className="relative h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-full max-w-sm space-y-4">
              {[
                { label: "Identifying Core Topics", width: "100%" },
                { label: "Mapping Relationships", width: "75%" },
                { label: "Extracting Formulas", width: "60%" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-primary">Done</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: item.width }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModuleSection>

        {/* AI Notes */}
        <ModuleSection 
          title="Perfectly Structured Notes" 
          desc="Say goodbye to messy highlighting. Get clean overviews, hierarchical headings, key concepts, and instant revision summaries."
          icon={FileBox}
        >
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-slate-100 rounded-md mb-6" />
            <div className="flex gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div className="h-4 w-full bg-slate-50 rounded-md" />
            </div>
            <div className="flex gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div className="h-4 w-5/6 bg-slate-50 rounded-md" />
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mt-6">
              <p className="text-xs font-bold text-primary mb-2">Important Formula</p>
              <code className="text-sm font-mono text-slate-800">E = mc²</code>
            </div>
          </div>
        </ModuleSection>

        {/* Flashcards */}
        <ModuleSection 
          title="Active Recall Flashcards" 
          desc="Master memorization with interactive flashcards. Test yourself, flip to reveal answers, and build long-term retention."
          icon={Layers}
          reversed
        >
          <FlashcardDemo />
        </ModuleSection>

        {/* Quiz */}
        <ModuleSection 
          title="Instant AI Quizzes" 
          desc="Test your understanding with generated MCQs. Get instant evaluations and detailed AI explanations for every answer."
          icon={HelpCircle}
        >
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-6">Which algorithm is used for shortest path?</h4>
            <div className="space-y-3">
              {["Bubble Sort", "Dijkstra's Algorithm", "Binary Search", "DFS"].map((opt, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${i === 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="font-medium text-sm">{opt}</span>
                  {i === 1 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-primary block mb-1">AI Explanation:</span>
              Dijkstra's algorithm finds the shortest path between nodes in a graph, widely used in network routing protocols.
            </div>
          </div>
        </ModuleSection>

        {/* Podcast */}
        <ModuleSection 
          title="Study on the Go" 
          desc="Turn any PDF into a podcast. Using Microsoft Edge TTS, listen to your notes in English or Hindi with ambient background music."
          icon={Headphones}
          reversed
        >
          <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl text-white">
            <div className="w-full aspect-video bg-slate-800 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.4),transparent)] opacity-50" />
              <Headphones className="w-16 h-16 text-primary" />
            </div>
            <h4 className="font-bold text-lg mb-1">Chapter 4 Summary</h4>
            <p className="text-slate-400 text-sm mb-6">AI Generated Podcast • English</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary rounded-full" />
              </div>
              <span className="text-xs font-mono text-slate-400">02:14 / 12:00</span>
            </div>
          </div>
        </ModuleSection>

        {/* Focus Workspace */}
        <ModuleSection 
          title="Deep Focus Workspace" 
          desc="Enter a flow state with integrated Pomodoro timers, ambient study music, goal tracking, and daily streak gamification."
          icon={Target}
        >
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center relative mb-6">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-primary stroke-current" strokeDasharray="552" strokeDashoffset="120" />
              </svg>
              <span className="text-4xl font-black text-slate-800 font-mono">24:59</span>
            </div>
            <h4 className="font-bold text-slate-800">Deep Work Session</h4>
            <p className="text-slate-500 text-sm mt-2">Lofi Beats • Notifications Silenced</p>
          </div>
        </ModuleSection>

      </div>
    </section>
  );
};

export default ProductModules;
