import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Is CleverPrep really free?",
    answer: "Yes! CleverPrep offers a generous free tier that includes access to AI notes generation, flashcards, quizzes, and the Focus Workspace."
  },
  {
    question: "How does the AI generate notes and quizzes?",
    answer: "Our platform uses state-of-the-art Large Language Models (LLMs) tuned specifically for educational content. When you upload a document or paste text, the AI analyzes the core concepts and automatically structures them into comprehensive notes, spaced-repetition flashcards, and realistic multiple-choice quizzes."
  },
  {
    question: "What file formats can I upload?",
    answer: "Currently, you can upload PDF documents, plain text files, or directly paste text into our editor. We are actively working on adding support for Word documents, PowerPoints, and YouTube video links."
  },
  {
    question: "Are the generated quizzes accurate?",
    answer: "Yes, our AI is highly accurate as it grounds its generation strictly on the material you provide. It avoids hallucinating external facts, ensuring that you are tested only on the content relevant to your specific coursework."
  },
  {
    question: "Can I use CleverPrep on my phone?",
    answer: "Absolutely. CleverPrep is a Progressive Web App (PWA), meaning you can install it directly to your home screen on iOS and Android for a native app-like experience."
  }
];

const FAQ = ({ preview = false }) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const displayedFaqs = preview ? faqs.slice(0, 4) : faqs;

  return (
    <section id="faq" className="py-24 bg-bg-surface border-y border-border">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
            <MessageCircleQuestion size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-text-secondary">
            Everything you need to know about the product and how it works.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {displayedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl transition-colors duration-200 ${
                  isOpen ? 'border-primary/30 bg-bg-base shadow-sm' : 'border-border bg-bg-surface hover:bg-bg-surface-hover'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-text-primary text-lg">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-text-secondary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-text-secondary leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {preview ? (
          <div className="mt-12 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center h-12 px-8 font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
            >
              View All FAQs
            </Link>
          </div>
        ) : (
          <div className="mt-16 text-center bg-bg-base p-8 rounded-3xl border border-border">
            <h3 className="text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
            <p className="text-text-secondary mb-6">We're here to help you get the most out of your study sessions.</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center h-12 px-6 font-bold text-text-primary bg-bg-surface border border-border hover:border-primary/50 hover:bg-bg-surface-hover rounded-xl transition-all shadow-xs"
            >
              Create your free account
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default FAQ;
