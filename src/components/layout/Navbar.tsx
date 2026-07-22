/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { useMagneticButton } from '../../hooks/useMagneticButton';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const { ref: resumeRef } = useMagneticButton(60, 8);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Section Observer to set active links dynamically
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-64px 0px 0px 0px' }
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'h-[52px] bg-bg/85 backdrop-blur-xl border-b border-border shadow-md'
            : 'h-[64px] bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-display font-black text-xl tracking-tight cursor-pointer"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              RKK
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-heading font-semibold text-[0.78rem] tracking-[0.08em] uppercase transition-colors relative cursor-pointer py-1.5 ${
                  activeSection === link.id
                    ? 'text-text'
                    : 'text-muted hover:text-text-sub'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark/Light mode rotator */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-text/30 transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              <div className={`transition-transform duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </div>
            </button>

            {/* Magnetic Resume */}
            <a
              ref={resumeRef as React.RefObject<HTMLAnchorElement>}
              href="/Rohit_Kumar_Kohli_Resume.pdf"
              download="Rohit_Kumar_Kohli_Resume.pdf"
              className="px-4 py-1.5 text-xs font-mono font-medium border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
            >
              RESUME.pdf
            </a>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-border text-muted hover:text-text transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-muted hover:text-text transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 text-center w-full max-w-[280px]">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="font-display font-black text-2xl tracking-wider text-muted hover:text-text transition-all uppercase py-2 cursor-pointer"
              style={{
                transitionDelay: `${index * 50}ms`,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.name}
            </button>
          ))}

          <hr className="border-border my-2" />

          {/* Mobile Resume Link */}
          <a
            href="/Rohit_Kumar_Kohli_Resume.pdf"
            download="Rohit_Kumar_Kohli_Resume.pdf"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mx-auto w-full max-w-[200px] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-white font-mono text-xs font-semibold rounded-lg"
          >
            <FileText size={14} /> DOWNLOAD RESUME
          </a>
        </div>
      </div>
    </>
  );
}
