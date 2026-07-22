/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { EXPERIENCES } from '../../data';
import { Calendar, MapPin } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

export default function Experience() {
  const [activeEntry, setActiveEntry] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up scroll tracking for the vertical progress line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 60%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    restDelta: 0.001
  });

  useEffect(() => {
    const mobileMedia = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileMedia.matches);
    const mobileListener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileMedia.addEventListener("change", mobileListener);

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionMedia.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionMedia.addEventListener("change", motionListener);

    return () => {
      mobileMedia.removeEventListener("change", mobileListener);
      motionMedia.removeEventListener("change", motionListener);
    };
  }, []);

  const cardVariants = {
    hidden: (isEven: boolean) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : (isMobile ? 30 : (isEven ? 45 : -45)),
      scale: prefersReducedMotion ? 1 : 0.96
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: prefersReducedMotion 
        ? { duration: 0.15 } 
        : {
            type: "spring",
            stiffness: 85,
            damping: 16,
            duration: 0.6
          }
    }
  };

  const dotVariants = {
    hidden: { scale: 0.4, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: prefersReducedMotion 
        ? { duration: 0.1 } 
        : {
            type: "spring",
            stiffness: 150,
            damping: 12,
            delay: 0.1
          }
    }
  };

  return (
    <section
      id="experience"
      className="relative w-full py-24 bg-bg-secondary border-b border-border grid-dots overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-4">
            // CAREER TIMELINE
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-4">
            Work Experience
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub">
            A chronological summary of engineering internships, tech simulator outcomes, and professional contributions.
          </p>
        </div>

        {/* Experience Timeline Map */}
        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          {/* Vertical Center line background track */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-border/20 -translate-x-1/2 z-0" />

          {/* Active progressive line on scroll */}
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2 z-0 origin-top"
            style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
          />

          {/* Timeline Cards */}
          <div className="space-y-12 md:space-y-16">
            {EXPERIENCES.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={exp.company + exp.role}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.35 }}
                  onViewportEnter={() => setActiveEntry(index)}
                  onViewportLeave={() => {
                    if (activeEntry === index) setActiveEntry(null);
                  }}
                  custom={isEven}
                  className={`relative flex flex-col md:flex-row z-10 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                  onMouseEnter={() => setActiveEntry(index)}
                  onMouseLeave={() => setActiveEntry(null)}
                >
                  {/* Outer Pulsing Timeline Marker Dot */}
                  <motion.div 
                    variants={dotVariants}
                    className={`absolute left-4 md:left-1/2 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-bg border-[3px] transition-all duration-300 flex items-center justify-center z-20 ${
                      activeEntry === index 
                        ? 'border-secondary scale-125 shadow-[0_0_15px_rgba(139,92,246,0.6)]' 
                        : 'border-primary'
                    }`}
                  >
                    {/* Ring showing active status or glow */}
                    {activeEntry === index && (
                      <span className={`absolute inset-0 rounded-full bg-secondary/30 ${
                        prefersReducedMotion ? '' : 'animate-ping'
                      }`} style={{ animationDuration: '1.8s' }} />
                    )}
                    
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      activeEntry === index ? 'bg-secondary' : 'bg-primary'
                    }`} />
                  </motion.div>

                  {/* Spacer Column (For alternate layout offset) */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card Column */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <motion.div 
                      variants={cardVariants}
                      whileHover={prefersReducedMotion ? {} : {
                        y: -5,
                        scale: 1.015,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      className="glass-card rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-all duration-300 shadow-xl relative overflow-hidden group cursor-pointer"
                    >
                      
                      {/* Top Corner background color glow */}
                      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/4 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Timeline Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-heading font-extrabold text-lg text-text group-hover:text-primary transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <div className="text-primary font-heading font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                            {exp.company}
                            {exp.companyUrl && (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-muted hover:text-accent transition-colors cursor-pointer"
                              >
                                ↗
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border border-border text-text bg-bg/45">
                          {exp.type}
                        </span>
                      </div>

                      {/* Location + Dates Metadata Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-secondary" />
                          {exp.startDate} — {exp.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-accent" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Bullets List */}
                      <ul className="space-y-2.5 mb-6 text-xs md:text-sm text-text-sub font-sans leading-relaxed list-none pl-0">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex gap-2 items-start">
                            <span className="text-accent mt-1 select-none">✦</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technical Stack Tags inside experience card */}
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
                        {exp.tech.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono text-muted bg-bg/50 px-2 py-0.5 rounded border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
