import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare } from 'lucide-react';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
  ],
  Resources: [
    { name: 'Study Guides', href: '/guides' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
    { name: 'Help Center', href: '/help' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]
};

const Footer = () => {
  return (
    <footer className="bg-bg-base pt-20 pb-10 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="CleverPrep Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-black tracking-tight text-text-primary font-display">CleverPrep</span>
            </Link>
            <p className="text-text-secondary mb-8 max-w-sm leading-relaxed">
              Your personal AI study tutor. Learn faster, remember longer, and score higher with perfectly tailored notes, flashcards, and quizzes.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://cleverprep.com" className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                <Globe size={18} />
              </a>
              <Link to="/contact" className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                <MessageSquare size={18} />
              </Link>
              <a href="mailto:support@cleverprep.com" className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-text-primary mb-6 uppercase tracking-wider text-sm">{category}</h4>
              <ul className="space-y-4 text-text-secondary">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary font-medium">
            &copy; {new Date().getFullYear()} CleverPrep. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-text-secondary font-medium">
            <a href="#" className="hover:text-primary transition-colors">Status</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
