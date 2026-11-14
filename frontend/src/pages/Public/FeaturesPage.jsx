import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import FeatureSection from '../Landing/components/FeatureSection';

const FeaturesPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="Features | CleverPrep"
        description="Explore the complete suite of AI tools designed to help you study smarter, not harder."
      />
      <div className="pt-24 pb-12 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'Features', href: '/features' }]} />
      </div>
      <FeatureSection preview={false} />
    </PageTransition>
  );
};

export default FeaturesPage;
