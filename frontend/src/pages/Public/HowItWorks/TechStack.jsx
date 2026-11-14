import React from 'react';
import { Database, Layout, Server, Sparkles, Key, Mail, Mic2, FileCode2 } from 'lucide-react';

const TechStack = () => {
  const tech = [
    { name: "Gemini AI", icon: Sparkles, desc: "Powers intelligent note generation, flashcards, quizzes and summaries." },
    { name: "React", icon: Layout, desc: "Delivers buttery-smooth, interactive UI and fast transitions." },
    { name: "Express & Node.js", icon: Server, desc: "Robust and scalable backend API infrastructure." },
    { name: "MongoDB Atlas", icon: Database, desc: "Securely stores your workspace data in the cloud." },
    { name: "Microsoft Edge TTS", icon: Mic2, desc: "Generates natural-sounding dual-language podcasts." },
    { name: "Google OAuth", icon: Key, desc: "Provides secure, seamless one-click authentication." },
    { name: "JWT", icon: FileCode2, desc: "Ensures secure, stateless session management." },
    { name: "SMTP", icon: Mail, desc: "Handles reliable transactional email delivery." }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Powered by Modern Technology</h2>
          <p className="text-lg text-slate-400">CleverPrep is built on a cutting-edge stack to ensure speed, security, and intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tech.map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
