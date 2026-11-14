import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import FAQ from '../Landing/components/FAQ';

const FAQPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="FAQ | CleverPrep"
        description="Frequently asked questions about CleverPrep's features, pricing, and capabilities."
      />
      <div className="pt-24 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'FAQ', href: '/faq' }]} />
      </div>
      <FAQ preview={false} />
    </PageTransition>
  );
};

export default FAQPage;
