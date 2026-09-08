import React, { useEffect } from 'react';

const SEO = ({ title, description, url, image }) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
    }

    // 2. Helper to set/update meta tags
    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    // URL
    if (url) {
      setMetaTag('property', 'og:url', url);
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // Image
    if (image) {
      setMetaTag('property', 'og:image', image);
      setMetaTag('name', 'twitter:image', image);
    }

    // General SEO and OG tags
    if (title) {
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }
    
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('name', 'theme-color', '#10b981'); // Emerald 500

  }, [title, description, url, image]);

  return null;
};

export default SEO;
