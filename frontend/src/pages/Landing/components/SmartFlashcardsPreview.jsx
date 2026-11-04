import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { BrainCircuit, Sparkles, Clock, Repeat, Star, Zap, BookOpen } from 'lucide-react';

const SmartFlashcardsPreview = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  useEffect(() => {
    if (!isInView) return;
    
    // Auto-flip sequence
    const sequence = async () => {
      if (isHovered) return; // Pause auto-flip on hover
      setIsFlipped(true);
      await new Promise(r => setTimeout(r, 2500));
      if (isHovered) return;
      setIsFlipped(false);
    };

    const interval = setInterval(sequence, 6000); // 6 seconds total cycle
    return () => clearInterval(interval);
  }, [isInView, isHovered]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-[#0a0a0c] flex items-center justify-center p-4 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden group perspective-[2000px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Gradients & Particles */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Floating Particles */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: ['0%', '-50%', '0%'],
            x: ['0%', '20%', '0%'],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{ top: `${20 + i * 15}%`, left: `${10 + i * 20}%` }}
        />
      ))}

      {/* Floating Stack Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full max-w-[300px] aspect-[3/4] z-10 transform-style-3d"
      >
        {/* Card 3 (Bottom) */}
        <motion.div 
          animate={{ 
            rotateZ: isFlipped ? -6 : -4, 
            y: isFlipped ? -5 : 0, 
            x: isFlipped ? -5 : 0,
            scale: 0.9 
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-0"
        />
        
        {/* Card 2 (Middle) */}
        <motion.div 
          animate={{ 
            rotateZ: isFlipped ? 4 : 2, 
            y: isFlipped ? -15 : -10, 
            x: isFlipped ? 5 : 0,
            scale: 0.95 
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-10"
        />

        {/* Card 1 (Top Active) */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
          className="absolute inset-0 w-full h-full [transform-style:preserve-3d] z-20 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-xl rounded-[24px] border border-white/20 p-6 flex flex-col [backface-visibility:hidden] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Shimmer sweep */}
            <motion.div 
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-[20%] bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            
            {/* Badges */}
            <div className="flex items-center justify-between mb-8 text-[10px] font-bold">
              <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                <BookOpen size={12} /> Cell Biology
              </div>
              <div className="flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <BrainCircuit size={12} /> AI Generated
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center text-center px-2 relative z-10">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Question</span>
              <h3 className="text-xl font-black text-white leading-tight">
                What is the powerhouse of the cell?
              </h3>
            </div>

            {/* Bottom Meta */}
            <div className="mt-auto space-y-3 relative z-10">
              <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-white/50">
                <span className="flex items-center gap-1"><Zap size={12} className="text-amber-400"/> Medium</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-emerald-400"/> 18 sec</span>
              </div>
              <div className="text-center text-[9px] text-white/30 uppercase tracking-widest font-bold">
                Hover or wait to reveal
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full bg-linear-to-b from-indigo-900/60 to-purple-900/60 backdrop-blur-xl rounded-[24px] border border-purple-500/40 p-6 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Badges */}
            <div className="flex items-center justify-between mb-4 text-[10px] font-bold opacity-80">
              <div className="flex items-center gap-1 text-white/60">
                Card 8 / 42
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Sparkles size={12} /> 98% Match
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-purple-400/80 text-[10px] font-bold uppercase tracking-widest mb-2">Answer</span>
              <p className="text-[13px] font-medium text-white leading-relaxed mb-4">
                <span className="text-emerald-400 font-bold">Mitochondria</span> are known as the powerhouse of the cell because they generate ATP through cellular respiration, supplying energy required for cellular activities.
              </p>
              
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1 block">Key Takeaway</span>
                <ul className="text-[10px] font-mono text-white/80 space-y-1 ml-1">
                  <li>• Produces ATP</li>
                  <li>• Site of Cellular Respiration</li>
                  <li>• Double Membrane Organelle</li>
                </ul>
              </div>
            </div>

            {/* Bottom Chips */}
            <div className="mt-auto pt-3 flex flex-wrap gap-1.5 justify-center">
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1">
                <Zap size={10} /> Easy
              </div>
              <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1">
                <Star size={10} /> Important
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 w-full justify-center mt-0.5">
                <Repeat size={10} /> Next Review Tomorrow
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SmartFlashcardsPreview;
