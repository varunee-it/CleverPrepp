import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ paths }) => {
  const location = useLocation();

  return (
    <nav className="flex items-center text-sm text-text-secondary mb-8 overflow-x-auto pb-2 scrollbar-none" aria-label="Breadcrumb">
      <ol className="flex items-center min-w-max">
        <li>
          <div>
            <Link to="/" className="text-text-secondary hover:text-primary transition-colors flex items-center">
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {paths.map((path, index) => (
          <li key={path.name}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-text-muted shrink-0" />
              {index === paths.length - 1 ? (
                <span className="font-semibold text-text-primary pointer-events-none" aria-current="page">
                  {path.name}
                </span>
              ) : (
                <Link to={path.href} className="font-medium text-text-secondary hover:text-primary transition-colors">
                  {path.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
