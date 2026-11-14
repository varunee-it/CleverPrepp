import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const StatCounter = ({ value, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const end = parseInt(value, 10);
      if (start === end) return;

      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [value, isInView]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-linear-to-b from-bg-base to-bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-border">
          <StatCounter value="1000" label="Students" suffix="+" />
          <StatCounter value="50" label="Flashcards Generated" suffix="K+" />
          <StatCounter value="20" label="AI Quizzes" suffix="K+" />
          <StatCounter value="95" label="Satisfaction" suffix="%" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
