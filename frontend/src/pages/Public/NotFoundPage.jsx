import React from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <PageTransition>
      <SEO 
        title="Page Not Found | CleverPrep"
        description="The page you are looking for does not exist."
      />
      <div className="pt-32 pb-32 max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Search size={48} />
        </div>
        <h1 className="text-6xl sm:text-8xl font-black text-text-primary tracking-tight mb-6">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
          Page not found
        </h2>
        <p className="text-lg text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-12 px-8 font-bold text-text-primary bg-bg-surface border border-border hover:border-primary/50 hover:bg-bg-surface-hover rounded-xl transition-all shadow-xs w-full sm:w-auto"
          >
            Back to Home
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center h-12 px-8 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all w-full sm:w-auto"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
