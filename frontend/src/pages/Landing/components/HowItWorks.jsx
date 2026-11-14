import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Cpu, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Upload,
    title: "1. Upload Your Notes",
    description: "Paste text, upload PDFs, or connect your existing notes. CleverPrep handles any format.",
    color: "blue"
  },
  {
    icon: Cpu,
    title: "2. AI Processing",
    description: "Our advanced language models analyze your content to understand key concepts and relationships.",
    color: "purple"
  },
  {
    icon: Zap,
    title: "3. Generate Materials",
    description: "Instantly receive structured notes, spaced-repetition flashcards, and realistic quizzes.",
    color: "emerald"
  },
  {
    icon: Trophy,
    title: "4. Master the Subject",
    description: "Study in the Focus Workspace, track your analytics, and ace your exams with confidence.",
    color: "amber"
  }
];

const HowItWorks = ({ preview = false }) => {
  return (
    <section id="how-it-works" className="py-24 bg-bg-surface border-y border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
            From raw notes to mastery in seconds.
          </h2>
          <p className="text-lg text-text-secondary">
            A simple, intuitive workflow designed to minimize preparation time and maximize actual learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-24 h-24 rounded-2xl bg-bg-base border-2 border-border shadow-sm flex items-center justify-center mb-6 group-hover:border-${step.color}-400 group-hover:shadow-md transition-all duration-300 relative`}>
                  <Icon size={32} className={`text-text-secondary group-hover:text-${step.color}-500 transition-colors`} />
                  {/* Glowing backdrop */}
                  <div className={`absolute inset-0 bg-${step.color}-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        {preview && (
          <div className="mt-16 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center h-12 px-8 font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
            >
              See How It Works in Detail
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default HowItWorks;
