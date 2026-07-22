/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowUp, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isEasterEggRevealed, setIsEasterEggRevealed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setShowScrollTop(scrollPos > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (document.documentElement) document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    if (document.body) document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-bg-secondary border-t border-border/80 text-muted py-16 relative">
      <div className="max-w-7xl mx-auto px-6 space-y-12 select-none">
        
        {/* Row 1: Logo + Tagline + Social Icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/40">
          <div className="text-center md:text-left">
            <span className="font-display font-black text-2xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              RKK Portfolio
            </span>
            <p className="text-xs font-heading text-muted mt-1 max-w-sm">
              Engineering full-stack web workspaces, automated microservices, and secure server pipelines.
            </p>
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-3">
            {[
              { icon: <Github size={15} />, url: 'https://github.com/Rohitkohli28' },
              { icon: <Linkedin size={15} />, url: 'https://www.linkedin.com/in/rohitkumarkohli' },
              { icon: <ExternalLink size={14} />, url: 'https://leetcode.com/u/Rohit2028/' },
              { icon: <Mail size={15} />, url: 'mailto:kohlirohit2428@gmail.com' }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-8.5 h-8.5 rounded-lg border border-border hover:border-primary text-muted hover:text-text flex items-center justify-center bg-card/25 hover:bg-card transition-colors cursor-pointer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Navigation Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-text font-bold uppercase tracking-widest">Main Modules</h5>
            <ul className="space-y-2 text-xs font-sans">
              <li><button onClick={() => scrollToSection('hero')} className="hover:text-text transition-colors cursor-pointer">Home Hub</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-text transition-colors cursor-pointer">About Identity</button></li>
              <li><button onClick={() => scrollToSection('skills')} className="hover:text-text transition-colors cursor-pointer">Skill Matrix</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-text font-bold uppercase tracking-widest">Professional</h5>
            <ul className="space-y-2 text-xs font-sans">
              <li><button onClick={() => scrollToSection('experience')} className="hover:text-text transition-colors cursor-pointer">Timeline</button></li>
              <li><button onClick={() => scrollToSection('projects')} className="hover:text-text transition-colors cursor-pointer">Projects</button></li>
              <li><button onClick={() => scrollToSection('achievements')} className="hover:text-text transition-colors cursor-pointer">Credentials</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-text font-bold uppercase tracking-widest">Enquiries</h5>
            <ul className="space-y-2 text-xs font-sans">
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-text transition-colors cursor-pointer">Dispatch Form</button></li>
              <li><a href="mailto:kohlirohit2428@gmail.com" className="hover:text-text transition-colors cursor-pointer">Direct Mailbox</a></li>
              <li><a href="tel:+918868818564" className="hover:text-text transition-colors cursor-pointer">Phone Line</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-text font-bold uppercase tracking-widest">Connect</h5>
            <ul className="space-y-2 text-xs font-sans">
              <li><a href="https://github.com/Rohitkohli28" target="_blank" rel="noreferrer" className="hover:text-text transition-colors cursor-pointer">GitHub Profile</a></li>
              <li><a href="https://www.linkedin.com/in/rohitkumarkohli" target="_blank" rel="noreferrer" className="hover:text-text transition-colors cursor-pointer">LinkedIn Network</a></li>
              <li><a href="https://leetcode.com/u/Rohit2028/" target="_blank" rel="noreferrer" className="hover:text-text transition-colors cursor-pointer">LeetCode Solutions</a></li>
            </ul>
          </div>
        </div>

        {/* Row 3: Copyright claims + Floating Easter Egg + Back to Top */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Easter egg copyrights */}
          <div 
            className="text-xs font-sans cursor-help relative group"
            onMouseEnter={() => setIsEasterEggRevealed(true)}
            onMouseLeave={() => setIsEasterEggRevealed(false)}
          >
            {isEasterEggRevealed ? (
              <span className="font-mono text-accent text-[11px] animate-pulse">
                v2.0.1 — Compiled at 2026-06-26T22:50:16 UTC
              </span>
            ) : (
              <span>
                &copy; {new Date().getFullYear()} Rohit Kumar Kohli. All rights reserved.
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono">
            Built with React 19, Tailwind CSS v4 &amp; Express
          </span>
        </div>

      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-24 w-11 h-11 rounded-full bg-card border border-border text-text hover:text-primary shadow-2xl hover:border-primary/40 flex items-center justify-center transition-all duration-300 z-[9995] pointer-events-auto hover:-translate-y-1 cursor-pointer ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
