/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/sections/LoadingScreen';
import CustomCursor from './components/sections/CustomCursor';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import GithubActivity from './components/sections/GithubActivity';
import LeetcodeActivity from './components/sections/LeetcodeActivity';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import TerminalModal from './components/sections/TerminalModal';

// Lazy-load AI Chatbot for zero initial bundle size impact
const ChatWindow = React.lazy(() => import('./components/AIChat/ChatWindow'));

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Scroll Progress tracker
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  // Scroll Reveal Observer for clean GPU-accelerated fade-ups
  useEffect(() => {
    if (!isLoaded) return;

    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoaded]);

  // Konami Code Event Observer ("↑↑↓↓←→←→BA" keys)
  useEffect(() => {
    const konamiSequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a'
    ];
    let sequenceIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.key.toLowerCase();
      
      if (pressedKey === konamiSequence[sequenceIndex]) {
        sequenceIndex++;
        if (sequenceIndex === konamiSequence.length) {
          setIsTerminalOpen(true);
          sequenceIndex = 0;
        }
      } else {
        sequenceIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      {/* 1. Loader screen gating */}
      {!isLoaded ? (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      ) : (
        <div className="relative min-h-screen bg-bg selection:bg-primary/30 selection:text-white animate-fadeIn">
          
          {/* 2. Top Scroll progress bar indicator */}
          <div className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent z-[9999] transition-all duration-75" style={{ width: `${scrollProgress}%` }} />

          {/* 3. Custom Cursor */}
          <CustomCursor />

          {/* 4. Navbar */}
          <Navbar />

          {/* 5. Main Single-Page Sections Content */}
          <main className="relative z-10">
            <Hero />
            
            <div className="reveal-on-scroll">
              <About />
            </div>

            <div className="reveal-on-scroll">
              <Skills />
            </div>

            <div className="reveal-on-scroll">
              <Experience />
            </div>

            <div className="reveal-on-scroll">
              <Projects />
            </div>

            <div className="reveal-on-scroll">
              <GithubActivity />
            </div>

            <div className="reveal-on-scroll">
              <LeetcodeActivity />
            </div>

            <div className="reveal-on-scroll">
              <Achievements />
            </div>

            <div className="reveal-on-scroll">
              <Contact />
            </div>
          </main>

          {/* 6. Footer */}
          <Footer />

          {/* 7. Konami CLI Terminal modal */}
          <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

          {/* 8. Floating AI Portfolio Assistant Chatbot (Lazy-Loaded) */}
          <React.Suspense fallback={null}>
            <ChatWindow />
          </React.Suspense>
        </div>
      )}
    </ThemeProvider>
  );
}

