/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HACKATHONS } from '../../data';
import { HackathonItem } from '../../types';
import * as Lucide from 'lucide-react';
import { motion } from 'motion/react';

export default function HackathonsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % HACKATHONS.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + HACKATHONS.length) % HACKATHONS.length);
  };

  const renderIcon = (iconName: string, accentColor: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Lucide.Trophy size={22} style={{ color: accentColor }} />;
      case 'Cpu':
        return <Lucide.Cpu size={22} style={{ color: accentColor }} />;
      case 'Sparkles':
        return <Lucide.Sparkles size={22} style={{ color: accentColor }} />;
      case 'Rocket':
        return <Lucide.Rocket size={22} style={{ color: accentColor }} />;
      case 'Bot':
        return <Lucide.Bot size={22} style={{ color: accentColor }} />;
      case 'Lightbulb':
        return <Lucide.Lightbulb size={22} style={{ color: accentColor }} />;
      case 'Activity':
        return <Lucide.Activity size={22} style={{ color: accentColor }} />;
      case 'Code':
        return <Lucide.Code2 size={22} style={{ color: accentColor }} />;
      case 'Terminal':
        return <Lucide.Terminal size={22} style={{ color: accentColor }} />;
      case 'Zap':
        return <Lucide.Zap size={22} style={{ color: accentColor }} />;
      default:
        return <Lucide.Award size={22} style={{ color: accentColor }} />;
    }
  };

  // Determine fan layout geometry for desktop stack (Max 5 cards visible: d = -2, -1, 0, 1, 2)
  const getFanTransform = (index: number) => {
    const d = index - activeIndex;
    const absD = Math.abs(d);
    
    // Hide cards outside -2 to +2 range
    if (absD > 2) {
      return { x: d * 220, rotate: d * 10, scale: 0.6, opacity: 0, zIndex: 0, isVisible: false };
    }

    const spacing = 185;
    const x = d * spacing;
    const rotate = d * 6.5;
    const scale = d === 0 ? (HACKATHONS[index].featured ? 1.08 : 1.03) : absD === 1 ? 0.90 : 0.80;
    const opacity = d === 0 ? 1 : absD === 1 ? 0.88 : 0.65;
    const zIndex = 100 - absD * 10;

    return { x, rotate, scale, opacity, zIndex, isVisible: true };
  };

  return (
    <section
      id="achievements-competitions"
      className="relative w-full py-24 bg-bg border-b border-border overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-3">
            // HACKATHONS & INNOVATION COMPETITIONS
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-4 flex items-center gap-3">
            🏆 Achievements & Competitions
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub leading-relaxed">
            Showcasing my journey through national hackathons, innovation challenges, ideathons, product competitions, and AI-focused events where I collaborated, built solutions, and continuously expanded my technical expertise.
          </p>
        </div>

        {/* 📱 MOBILE VIEW: SINGLE-CARD SWIPEABLE CAROUSEL (< 640px) */}
        {isMobile ? (
          <div className="relative w-full py-4 flex flex-col items-center">
            <div className="w-full flex justify-center items-center">
              {HACKATHONS.map((item, index) => {
                if (index !== activeIndex) return null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-[340px] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-2xl p-6 relative"
                    style={{ 
                      borderTop: `5px solid ${item.accentColor}`,
                      boxShadow: `0 12px 35px -6px ${item.accentColor}35`
                    }}
                  >
                    {/* Vibrant Ambient Glow Orb */}
                    <div 
                      className="absolute -top-10 -right-10 w-44 h-44 rounded-full filter blur-[45px] pointer-events-none opacity-40"
                      style={{ backgroundColor: item.accentColor }}
                    />

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-4 z-10">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center border bg-slate-950/80 backdrop-blur-md shadow-lg shrink-0"
                        style={{ borderColor: `${item.accentColor}60` }}
                      >
                        {renderIcon(item.iconName, item.accentColor)}
                      </div>

                      <span 
                        className="text-[9px] font-mono font-extrabold px-3 py-1 rounded-full border backdrop-blur-md shadow-md truncate max-w-[160px]"
                        style={{
                          backgroundColor: `${item.accentColor}30`,
                          color: '#FFFFFF',
                          borderColor: `${item.accentColor}60`
                        }}
                      >
                        {item.categoryChip}
                      </span>
                    </div>

                    {/* Featured Tag */}
                    {item.featured && (
                      <div className="mb-3 z-10">
                        <span className="text-[9px] font-mono font-black px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 inline-flex items-center gap-1 uppercase tracking-wider shadow-md">
                          <Lucide.Sparkles size={11} /> 🌟 FEATURED ACHIEVEMENT
                        </span>
                      </div>
                    )}

                    {/* Title & Metadata */}
                    <div className="z-10 mb-3">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase mb-1">
                        <span className="font-semibold text-slate-300">{item.organizer}</span>
                        <span className="font-extrabold text-amber-400">{item.date}</span>
                      </div>
                      <h3 className="font-heading font-black text-xl text-white leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3 z-10">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase"
                        style={{
                          backgroundColor: `${item.accentColor}25`,
                          color: '#FFFFFF',
                          border: `1px solid ${item.accentColor}60`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full block animate-pulse" style={{ backgroundColor: item.accentColor }} />
                        {item.achievement}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed italic font-medium mb-4 z-10">
                      "{item.description}"
                    </p>

                    {/* CTA Footer */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between z-10">
                      <span className="text-[8px] font-mono text-slate-400 uppercase">VERIFIED ENTRY</span>

                      {item.verifyLink && (
                        <a
                          href={item.verifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-primary/20 border border-primary/40 hover:border-accent text-accent hover:text-white text-[10px] font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group/btn"
                        >
                          View Certificate <Lucide.ArrowUpRight size={12} className="shrink-0 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 🖥️ DESKTOP / TABLET VIEW: STACKED FAN CAROUSEL (MAX 5 CARDS VISIBLE) */
          <div className="relative w-full h-[520px] md:h-[560px] flex items-center justify-center my-6 select-none">
            
            {/* Left Floating Chevron Button */}
            <button
              onClick={prevCard}
              aria-label="Previous Certificate"
              className="absolute left-2 lg:left-8 z-50 w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-accent backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
            >
              <Lucide.ChevronLeft size={22} />
            </button>

            {/* Right Floating Chevron Button */}
            <button
              onClick={nextCard}
              aria-label="Next Certificate"
              className="absolute right-2 lg:right-8 z-50 w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-accent backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
            >
              <Lucide.ChevronRight size={22} />
            </button>

            {/* Fan Cards Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {HACKATHONS.map((item, index) => {
                const { x, rotate, scale, opacity, zIndex, isVisible } = getFanTransform(index);
                if (!isVisible) return null; // Render max 5 cards (-2 to +2)

                const d = index - activeIndex;
                const isActive = d === 0;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    initial={false}
                    animate={{
                      x,
                      rotate,
                      scale,
                      opacity,
                      zIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 26,
                      mass: 0.8
                    }}
                    style={{
                      transformOrigin: 'center bottom',
                      willChange: 'transform, opacity',
                      boxShadow: isActive 
                        ? `0 16px 40px -8px ${item.accentColor}45` 
                        : '0 10px 25px -5px rgba(0,0,0,0.5)',
                      borderColor: isActive 
                        ? (item.featured ? '#F59E0B' : item.accentColor) 
                        : 'rgba(255,255,255,0.12)'
                    }}
                    whileHover={isActive ? { y: -8, scale: scale * 1.02, transition: { duration: 0.2 } } : { y: -4, scale: scale * 1.02 }}
                    className={`absolute w-[360px] md:w-[410px] ${
                      isActive ? 'h-[480px] md:h-[510px]' : 'h-[360px] md:h-[390px]'
                    } rounded-3xl bg-slate-900 border-2 overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-300 shadow-2xl`}
                  >
                    {/* Vibrant Ambient Glow Orb */}
                    <div 
                      className="absolute -top-10 -right-10 w-52 h-52 rounded-full filter blur-[45px] pointer-events-none opacity-40"
                      style={{ backgroundColor: item.accentColor }}
                    />

                    {/* Card Header Image / Banner */}
                    <div 
                      className={`relative w-full ${isActive ? 'h-[180px] md:h-[200px]' : 'h-[160px]'} p-5 md:p-6 flex flex-col justify-between overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, ${item.accentColor}45 0%, rgba(15, 23, 42, 0.95) 100%)`
                      }}
                    >
                      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

                      {/* Top Row: Icon & Category Chip */}
                      <div className="flex items-center justify-between z-10">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center border bg-slate-950/80 backdrop-blur-md shadow-lg shrink-0"
                          style={{ borderColor: `${item.accentColor}60` }}
                        >
                          {renderIcon(item.iconName, item.accentColor)}
                        </div>

                        <span 
                          className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full border backdrop-blur-md shadow-md truncate max-w-[170px]"
                          style={{
                            backgroundColor: `${item.accentColor}30`,
                            color: '#FFFFFF',
                            borderColor: `${item.accentColor}60`
                          }}
                        >
                          {item.categoryChip}
                        </span>
                      </div>

                      {/* Featured Gold Badge Tag */}
                      {item.featured && isActive && (
                        <div className="z-10 self-start">
                          <span className="text-[9px] font-mono font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
                            <Lucide.Sparkles size={12} /> 🌟 FEATURED ACHIEVEMENT
                          </span>
                        </div>
                      )}

                      {/* Bottom Row: Date & Organizer */}
                      <div className="z-10 flex items-center justify-between text-[10px] font-mono text-slate-200 uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-xl border border-white/15 backdrop-blur-md shadow-sm">
                        <span className="truncate max-w-[70%] font-semibold text-slate-300">{item.organizer}</span>
                        <span className="font-extrabold text-amber-400">{item.date}</span>
                      </div>
                    </div>

                    {/* Card Body Details: Render full details ON ACTIVE CARD ONLY */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between bg-slate-900/90 backdrop-blur-sm z-10">
                      <div>
                        <h3 className={`font-heading font-black ${isActive ? 'text-lg md:text-xl' : 'text-base line-clamp-2'} text-white leading-snug mb-2 group-hover:text-primary transition-colors`}>
                          {item.title}
                        </h3>

                        {/* Render extra details ONLY on active/front card to prevent background overlap */}
                        {isActive && (
                          <>
                            <div className="mb-3">
                              <span 
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${item.accentColor}25`,
                                  color: '#FFFFFF',
                                  border: `1px solid ${item.accentColor}60`
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full block animate-pulse" style={{ backgroundColor: item.accentColor }} />
                                {item.achievement}
                              </span>
                            </div>

                            <p className="text-xs md:text-sm text-slate-300 line-clamp-3 leading-relaxed italic font-medium">
                              "{item.description}"
                            </p>
                          </>
                        )}
                      </div>

                      {/* Render CTA Action Footer ONLY on active card */}
                      {isActive && (
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
                          <span className="text-[8px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                            STATUS: VERIFIED ENTRY
                          </span>

                          {item.verifyLink && (
                            <a
                              href={item.verifyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`View Certificate for ${item.title}`}
                              className="px-4 py-2 bg-primary/20 border border-primary/40 hover:border-accent text-accent hover:text-white text-[11px] font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group/btn"
                            >
                              View Certificate <Lucide.ArrowUpRight size={13} className="shrink-0 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        )}

        {/* 🎛️ CAROUSEL NAVIGATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border/60 max-w-4xl mx-auto select-none">
          
          {/* Active Card Progress Indicator e.g., "3 of 10" */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-accent">
              {activeIndex + 1} <span className="text-muted">of {HACKATHONS.length}</span>
            </span>
            
            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {HACKATHONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to certificate ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex 
                      ? 'w-6 bg-accent' 
                      : 'w-1.5 bg-border hover:bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Controls (Left / Right Arrow Buttons & Keyboard Hint) */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider hidden sm:block">
              Use ← → Keys or Click Cards to Select
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={prevCard}
                aria-label="Previous Achievement"
                className="w-10 h-10 rounded-2xl bg-card border border-border hover:border-primary/50 text-text flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Lucide.ChevronLeft size={18} />
              </button>

              <button
                onClick={nextCard}
                aria-label="Next Achievement"
                className="w-10 h-10 rounded-2xl bg-card border border-border hover:border-primary/50 text-text flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Lucide.ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
