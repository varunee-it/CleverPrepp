import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

import HeroSection from './HowItWorks/HeroSection';
import LiveTransformation from './HowItWorks/LiveTransformation';
import ProductModules from './HowItWorks/ProductModules';
import ComparisonSection from './HowItWorks/ComparisonSection';
import TechStack from './HowItWorks/TechStack';
import Pipeline from './HowItWorks/Pipeline';
import FinalCTA from './HowItWorks/FinalCTA';

const HowItWorksPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="How It Works | CleverPrep"
        description="See exactly how CleverPrep transforms your raw notes into an actionable study plan."
      />
      
      {/* Breadcrumb layer on top of Hero */}
      <div className="absolute top-24 left-0 w-full z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs paths={[{ name: 'How It Works', href: '/how-it-works' }]} />
        </div>
      </div>

      <HeroSection />
      <LiveTransformation />
      <ProductModules />
      <ComparisonSection />
      <TechStack />
      <Pipeline />
      <FinalCTA />
      
    </PageTransition>
  );
};

export default HowItWorksPage;
