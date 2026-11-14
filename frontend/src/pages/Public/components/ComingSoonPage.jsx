import React from 'react';
import PageTransition from '../../../components/layout/PageTransition';
import SEO from '../../../components/common/SEO';
import Breadcrumbs from '../../../components/common/Breadcrumbs';
import { Link } from 'react-router-dom';

const ComingSoonPage = ({ title, description, breadcrumbPath }) => {
  return (
    <PageTransition>
      <SEO 
        title={`${title} | CleverPrep`}
        description={description}
      />
      <div className="pt-24 pb-32 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: title, href: breadcrumbPath }]} />
        
        <div className="text-center mt-20 flex flex-col items-center justify-center p-12 bg-bg-surface border border-dashed border-border rounded-3xl">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {title} are coming soon
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mb-8 leading-relaxed">
            {description} We're working hard to bring this feature to you. Check back later!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center h-12 px-6 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover transition-colors"
          >
            Create your free account
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default ComingSoonPage;
