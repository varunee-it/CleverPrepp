import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Testimonials from '../Landing/components/Testimonials';

const TestimonialsPage = () => {
  return (
    <PageTransition>
      <SEO 
        title="Student Reviews | CleverPrep"
        description="See what real students have to say about using CleverPrep to ace their exams."
      />
      <div className="pt-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'Testimonials', href: '/testimonials' }]} />
      </div>
      <div className="text-center max-w-3xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-6 mt-8">
          Trusted by students worldwide.
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed">
          Join thousands of successful students who have transformed their study habits with CleverPrep.
        </p>
      </div>
      <Testimonials preview={false} />
    </PageTransition>
  );
};

export default TestimonialsPage;
