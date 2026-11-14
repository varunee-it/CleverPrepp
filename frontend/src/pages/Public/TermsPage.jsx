import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const TermsPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="Terms of Service | CleverPrep"
        description="Read the terms and conditions for using CleverPrep's study tools."
      />
      <div className="pt-24 pb-24 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'Terms of Service', href: '/terms' }]} />
        
        <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none text-text-secondary mt-8">
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight mb-8">Terms of Service</h1>
          <p className="lead font-medium text-text-primary mb-12">
            Last updated: October 2026
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CleverPrep, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4">2. Description of Service</h2>
          <p>
            CleverPrep provides AI-powered educational tools, including automated note generation, flashcards, quizzes, and focus tracking (the "Service"). We reserve the right to modify, suspend, or discontinue the Service at any time.
          </p>

          <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4">3. User Conduct</h2>
          <p>
            You agree not to use the Service to upload or process any content that infringes upon third-party intellectual property rights, contains malicious code, or violates any applicable laws or university academic integrity policies.
          </p>
          
          <h2 className="text-2xl font-bold text-text-primary mt-12 mb-4">4. Academic Integrity</h2>
          <p>
            CleverPrep is designed as a study aid. You are solely responsible for ensuring that your use of the Service complies with the academic honor code of your educational institution. CleverPrep is not responsible for academic penalties resulting from improper use of AI-generated materials.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default TermsPage;
