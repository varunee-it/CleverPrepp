import React, { useState } from 'react';
import PageTransition from '../../components/layout/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <PageTransition>
      <SEO 
        title="Contact Us | CleverPrep"
        description="Get in touch with the CleverPrep support team. We're here to help you succeed."
      />
      <div className="pt-24 pb-24 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs paths={[{ name: 'Contact', href: '/contact' }]} />
        
        <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight mb-6">
            Get in touch
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Have a question about CleverPrep? Need technical support? We're here to help you get the most out of your study sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-bg-surface border border-border rounded-3xl p-8 shadow-xs">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Email Support</h3>
              <p className="text-text-secondary mb-4">Our friendly team is here to help.</p>
              <a href="mailto:support@cleverprep.com" className="font-bold text-primary hover:text-primary-hover transition-colors">
                support@cleverprep.com
              </a>
            </div>

            <div className="bg-bg-surface border border-border rounded-3xl p-8 shadow-xs">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Response Time</h3>
              <p className="text-text-secondary">We aim to respond to all inquiries within 24 hours on business days.</p>
            </div>

            <div className="bg-bg-surface border border-border rounded-3xl p-8 shadow-xs">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Quick Answers</h3>
              <p className="text-text-secondary mb-4">Find answers instantly in our FAQ section.</p>
              <Link to="/faq" className="font-bold text-primary hover:text-primary-hover transition-colors">
                Browse FAQ &rarr;
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-bg-surface border border-border rounded-3xl p-8 sm:p-12 shadow-xs">
              <h2 className="text-2xl font-bold text-text-primary mb-8">Send us a message</h2>
              
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                  <p className="text-emerald-700">Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-bg-base text-text-primary focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-text-secondary mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-bg-base text-text-primary focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-text-secondary mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-bg-base text-text-primary focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-text-secondary mb-2">Message</label>
                    <textarea 
                      id="message" 
                      rows="6" 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full p-4 rounded-xl border border-border bg-bg-base text-text-primary focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                      placeholder="Tell us what you need help with..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default ContactPage;
