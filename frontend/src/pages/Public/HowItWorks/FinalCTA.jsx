import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-24 bg-bg-surface">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Ready to transform the way you study?
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Join CleverPrep and let AI create your complete study workspace instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center h-14 px-8 font-bold text-white bg-gradient-to-r from-primary to-purple-400 rounded-xl transition-all duration-250 ease-out hover:-translate-y-1 shadow-[0_10px_30px_rgba(139,92,246,0.18)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]"
          >
            <span className="flex items-center gap-2 text-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </span>
          </Link>
          <Link
            to="/features"
            className="inline-flex items-center justify-center h-14 px-8 font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors text-lg"
          >
            View Features
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
