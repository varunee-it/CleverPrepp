import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Pipeline = () => {
  const nodes = [
    "PDF", "AI Engine", "Summary", "Flashcards", "Quiz", "Podcast", "Focus Workspace", "Analytics"
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">End to End Pipeline</h2>
          <p className="text-lg text-slate-600">The automated flow from a raw document to total mastery.</p>
        </div>

        <div className="relative py-12 overflow-x-auto hide-scrollbar">
          <div className="flex items-center min-w-max px-4">
            {nodes.map((node, i) => (
              <React.Fragment key={i}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`px-6 py-4 rounded-xl border-2 font-bold whitespace-nowrap shadow-sm ${
                    i === 1 ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {node}
                </motion.div>
                
                {i < nodes.length - 1 && (
                  <div className="w-12 sm:w-16 flex items-center justify-center shrink-0">
                    <motion.div 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="text-slate-300"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pipeline;
