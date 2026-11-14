import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FileText, MessageSquare, AlignLeft, Layers, HelpCircle, Headphones, Target, RefreshCw, Award, Upload, BrainCircuit } from 'lucide-react';

const CardHoverEffect = ({ children }) => (
  <motion.div
    whileHover={{ 
      y: -6, 
      scale: 1.02,
      transition: { duration: 0.25, ease: 'easeOut' }
    }}
    className="relative flex flex-col h-full bg-bg-surface/40 backdrop-blur-md border border-white/10 rounded-[28px] p-7 overflow-hidden group shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow duration-250"
  >
    {/* Subtle noise texture */}
    <div 
      className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" 
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
    />
    
    {/* Soft radial purple glow (8-12% opacity) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
    
    {/* Border glow */}
    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-[28px] transition-colors duration-300 pointer-events-none z-10" />

    <div className="relative z-20 h-full flex flex-col">
      {children}
    </div>
  </motion.div>
);

const InteractiveProgress = () => {
  const containerRef = useRef(null);
  const [bounds, setBounds] = useState({ width: 0 });
  const [isDragged, setIsDragged] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setBounds({ width: containerRef.current.offsetWidth });
    }
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBounds({ width: entry.contentRect.width });
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const x = useMotionValue(0);
  
  useEffect(() => {
    if (bounds.width > 0 && !isDragged) {
      x.set(bounds.width * 0.35);
    }
  }, [bounds.width, isDragged, x]);
  
  const springX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.8 });
  const progressPercent = useTransform(springX, [0, bounds.width || 1], [0, 100]);
  
  const message = useTransform(progressPercent, (p) => {
    if (p < 20) return "Learning the fundamentals.";
    if (p < 40) return "Building strong concepts.";
    if (p < 60) return "AI is adapting to your pace.";
    if (p < 80) return "Almost exam ready.";
    return "Mastering concepts with confidence.";
  });

  const level = useTransform(progressPercent, (p) => {
    if (p < 20) return "Beginner";
    if (p < 40) return "Foundation";
    if (p < 60) return "Intermediate";
    if (p < 80) return "Advanced";
    return "Expert";
  });

  // Calculate tooltip X offset so it slightly follows the thumb
  const tooltipX = useTransform(springX, (val) => {
    if (bounds.width === 0) return 0;
    // Map thumb position to a smaller shift for the tooltip
    return (val - bounds.width / 2) * 0.4;
  });

  return (
    <div className="w-full group/progress cursor-default px-1 relative">
      {/* Tooltip */}
      <motion.div 
        className="absolute left-1/2 -top-10 w-max opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none z-30 flex justify-center"
        style={{ x: tooltipX, marginLeft: "-50%" }}
      >
        <div className="bg-bg-surface/90 backdrop-blur-md border border-border/50 text-text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
          <motion.span>{message}</motion.span>
        </div>
      </motion.div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold text-text-secondary tracking-wide">Beginner</span>
        <motion.span className="text-[12px] font-black text-primary tracking-wide">{level}</motion.span>
        <span className="text-[11px] font-bold text-text-secondary tracking-wide">Expert</span>
      </div>
      
      {/* Track */}
      <div 
        ref={containerRef}
        className="h-2.5 w-full bg-slate-100 dark:bg-black/30 rounded-full border border-white/5 relative shadow-inner cursor-pointer"
        onClick={(e) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          let newX = e.clientX - rect.left;
          if (newX < 0) newX = 0;
          if (newX > bounds.width) newX = bounds.width;
          x.set(newX);
          setIsDragged(true);
        }}
      >
        {/* Fill */}
        <motion.div
          style={{ width: useTransform(progressPercent, p => `${p}%`) }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A78BFA] rounded-full pointer-events-none"
        />
        
        {/* Draggable Thumb */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragged(true)}
          style={{ x }}
          whileHover={{ scale: 1.15 }}
          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          className="absolute top-1/2 -mt-[9px] -ml-[9px] w-[18px] h-[18px] bg-white rounded-full border border-primary/20 shadow-[0_0_20px_rgba(167,139,250,0.45)] cursor-grab z-10 flex items-center justify-center touch-none"
        >
          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
        </motion.div>
      </div>
      
      <div className="text-center mt-3 text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">
        AI Learning Progress
      </div>
    </div>
  );
};

const Card1Flow = () => {
  const icons = [Upload, BrainCircuit, AlignLeft, Layers, HelpCircle, Headphones];
  return (
    <div className="flex items-center gap-1.5 mb-6 opacity-90">
      {icons.map((Icon, i) => (
        <React.Fragment key={i}>
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] bg-bg-surface/60 border border-white/5 flex items-center justify-center shadow-sm"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary group-hover:text-primary transition-colors duration-300" />
          </motion.div>
          {i < icons.length - 1 && <div className="w-1.5 sm:w-2 h-[1px] bg-white/10" />}
        </React.Fragment>
      ))}
    </div>
  );
};

const Card1 = () => (
  <CardHoverEffect>
    <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-[160px] w-full pt-4">
      <Card1Flow />
      <InteractiveProgress />
    </div>
    <div className="mt-auto">
      <h3 className="text-[26px] font-bold text-text-primary mb-2">Understand Concepts</h3>
      <p className="text-[16px] text-text-secondary/80 leading-relaxed line-clamp-2">
        Upload any lecture notes, textbook, or PDF and let CleverPrep understand the content instantly using AI.
      </p>
    </div>
  </CardHoverEffect>
);

const Card2 = () => {
  const icons = [
    { Icon: FileText, angle: 0 },
    { Icon: MessageSquare, angle: 45 },
    { Icon: AlignLeft, angle: 90 },
    { Icon: Layers, angle: 135 },
    { Icon: HelpCircle, angle: 180 },
    { Icon: Headphones, angle: 225 },
    { Icon: Target, angle: 270 },
    { Icon: RefreshCw, angle: 315 },
  ];

  return (
    <CardHoverEffect>
      <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-[160px] relative w-full pt-4">
        {/* Center Logo */}
        <div className="relative w-14 h-14 bg-bg-surface/80 backdrop-blur-md rounded-[18px] border border-white/10 flex items-center justify-center shadow-lg z-10">
          <img src="/logo.png" alt="CleverPrep" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        {/* Orbiting Icons */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {icons.map(({ Icon, angle }, i) => (
            <div 
              key={i}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute top-[10%] sm:top-[5%]">
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                  className="bg-bg-surface/80 backdrop-blur-sm border border-white/5 rounded-xl p-2 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-primary/80" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-auto">
        <h3 className="text-[26px] font-bold text-text-primary mb-2">AI Learning Ecosystem</h3>
        <p className="text-[16px] text-text-secondary/80 leading-relaxed line-clamp-2">
          Everything you need to study lives in one intelligent workspace.
        </p>
      </div>
    </CardHoverEffect>
  );
};

const Card3 = () => {
  const steps = [
    { label: 'PDF', Icon: FileText },
    { label: 'AI Summary', Icon: AlignLeft },
    { label: 'Flashcards', Icon: Layers },
    { label: 'Quiz', Icon: HelpCircle },
    { label: 'Podcast', Icon: Headphones },
    { label: 'Exam Ready', Icon: Award, highlight: true },
  ];

  return (
    <CardHoverEffect>
      <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-[160px] w-full pt-2">
        <div className="flex flex-col items-center relative w-full max-w-[180px]">
          {/* Static Connecting Line */}
          <div className="absolute top-2 bottom-2 w-[1px] bg-white/5 left-1/2 -translate-x-1/2" />
          
          <div className="flex flex-col gap-1.5 w-full z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0.3, scale: 0.98 }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                className={`flex items-center gap-3 px-3 py-1 rounded-[10px] border ${
                  step.highlight 
                    ? 'bg-primary/10 border-primary/20 shadow-[0_0_12px_rgba(var(--color-primary),0.15)]' 
                    : 'bg-bg-surface/50 border-white/5 backdrop-blur-sm'
                }`}
              >
                <step.Icon className={`w-3.5 h-3.5 shrink-0 ${step.highlight ? 'text-primary' : 'text-text-secondary'}`} strokeWidth={2.5} />
                <span className={`text-[11px] font-bold tracking-wide ${step.highlight ? 'text-primary' : 'text-text-secondary'}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <h3 className="text-[26px] font-bold text-text-primary mb-2">Learn Smarter</h3>
        <p className="text-[16px] text-text-secondary/80 leading-relaxed line-clamp-2">
          One upload automatically generates every study resource you need.
        </p>
      </div>
    </CardHoverEffect>
  );
};

const LearningJourneySection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-bg-base border-t border-border/30">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[32px] md:text-[42px] font-black text-text-primary tracking-tight mb-4 font-display">
              Your AI Learning Journey
            </h2>
            <p className="text-[17px] md:text-[19px] text-text-secondary/90 leading-relaxed max-w-2xl mx-auto">
              Transform any PDF into an interactive learning experience with AI-powered study tools.
            </p>
          </motion.div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card1 />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card2 />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card3 />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningJourneySection;
