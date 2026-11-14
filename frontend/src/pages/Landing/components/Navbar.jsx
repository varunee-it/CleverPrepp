import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleScroll();
    handleResize();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isFloating = isScrolled && !isMobile;
  
  // Calculate target styles for Framer Motion
  const targetWidth = isFloating ? (windowWidth >= 1024 ? "900px" : "740px") : "100%";
  const targetY = isFloating ? 24 : 0;
  const targetRadius = isFloating ? "30px" : "0px";

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        initial={false}
        animate={{
          width: targetWidth,
          y: targetY,
          borderRadius: targetRadius,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut"
        }}
        className={`pointer-events-auto flex flex-col transition-colors duration-300 relative ${
          isScrolled
            ? isFloating
              ? 'bg-bg-base/80 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-border/50 py-3'
              : 'bg-bg-base/90 backdrop-blur-md border-b border-border shadow-xs py-3 w-full'
            : 'bg-transparent py-5 w-full border-b border-transparent'
        }`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: isFloating ? '100%' : '1400px' }}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img src="/logo.png" alt="CleverPrep Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-text-primary">CleverPrep</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-primary font-bold' : 'text-text-secondary hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <Link
                to="/login"
                className="text-sm font-bold text-text-primary hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center h-10 px-6 font-bold text-white bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl transition-all duration-250 ease-out hover:-translate-y-[2px] active:scale-95 shadow-[0_4px_12px_rgba(124,58,237,0.12),0_10px_30px_rgba(139,92,246,0.18)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.15),0_12px_40px_rgba(139,92,246,0.22)]"
              >
                {/* Premium Lavender Bottom Glow */}
                <div 
                  className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[80%] h-[16px] blur-[12px] transition-opacity duration-250 ease-out opacity-80 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0.18) 45%, transparent 80%)'
                  }}
                />
                <span className="relative z-10 flex items-center gap-2 text-sm">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-bg-surface border-b border-border shadow-lg p-4 md:hidden flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary hover:bg-bg-surface-hover hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-bold text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative block px-4 py-3 text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-center transition-all duration-250 ease-out shadow-[0_4px_12px_rgba(124,58,237,0.12),0_10px_30px_rgba(139,92,246,0.18)]"
              >
                {/* Premium Lavender Bottom Glow */}
                <div 
                  className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[80%] h-[16px] blur-[12px] opacity-80 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0.18) 45%, transparent 80%)'
                  }}
                />
                <span className="relative z-10">Get Started Free</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Navbar;
