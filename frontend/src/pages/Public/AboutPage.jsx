import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { Target, Heart, Zap, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="About Us | CleverPrep"
        description="Learn about CleverPrep's mission to revolutionize learning with AI-powered study tools."
      />
      <div className="pt-24 pb-24 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'About', href: '/about' }]} />
        
        <div className="text-center mb-20 mt-8">
          <h2 className="text-sm font-black tracking-widest uppercase text-primary mb-3">Our Mission</h2>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight mb-6">
            Empowering students to learn faster and remember longer.
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            We built CleverPrep because we believe that students spend too much time organizing materials and not enough time actually learning. Our AI pipeline is designed to eliminate the busywork.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none text-text-secondary leading-relaxed mb-24">
          <h3 className="text-2xl font-bold text-text-primary mb-4">Why we built CleverPrep</h3>
          <p className="mb-6">
            The traditional study process is broken. Students spend hours highlighting textbooks, rewriting notes, and manually creating flashcards before they even begin to truly study the material. This preparation phase is mentally exhausting and often leaves little energy for the most important step: active recall and retention.
          </p>
          <p className="mb-12">
            With recent advancements in Large Language Models, we realized we could completely automate the preparation phase. CleverPrep acts as your personal AI tutor, instantly translating raw course materials into an actionable, spaced-repetition study plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-bg-surface border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-3">Laser Focus</h4>
            <p className="text-text-secondary">We design our tools specifically for deep, distraction-free work. The Focus Workspace is built to keep you in the zone.</p>
          </div>
          <div className="bg-bg-surface border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-3">Instant Value</h4>
            <p className="text-text-secondary">No complex onboarding or steep learning curves. Upload your document and get high-quality study materials in seconds.</p>
          </div>
          <div className="bg-bg-surface border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-3">Privacy First</h4>
            <p className="text-text-secondary">Your course materials and personal data are strictly yours. We do not use your private documents to train our core AI models.</p>
          </div>
          <div className="bg-bg-surface border border-border p-8 rounded-3xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <Heart size={24} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-3">Student Centric</h4>
            <p className="text-text-secondary">Every feature we ship is driven by direct feedback from real students trying to ace their actual exams.</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
