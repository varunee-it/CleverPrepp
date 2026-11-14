import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import HowItWorks from './components/HowItWorks';
import StatsSection from './components/StatsSection';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import LearningJourneySection from './components/LearningJourneySection';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <SEO 
        title="CleverPrep | AI-Powered Study Assistant"
        description="Learn faster, remember longer, and score higher with perfectly tailored notes, flashcards, and quizzes powered by AI."
      />
      <div className="flex-1 flex flex-col">
        <HeroSection />
        <FeatureSection preview={true} />
        <HowItWorks preview={true} />
        <LearningJourneySection />
        <StatsSection />
        <Testimonials preview={true} />
        <FAQ preview={true} />
      </div>
    </PageTransition>
  );
};

export default LandingPage;
