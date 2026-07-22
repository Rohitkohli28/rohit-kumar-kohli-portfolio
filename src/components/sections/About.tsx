/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Award, Briefcase, GraduationCap, Calendar, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const [counts, setCounts] = useState({ cgpa: 0, leetcode: 0, internships: 0, certs: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Trigger count-up animation when in view
  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const duration = 1600; // ms

    const animateCounts = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quadratic
      const ease = 1 - (1 - progress) * (1 - progress);

      setCounts({
        cgpa: parseFloat((ease * 8.18).toFixed(2)),
        leetcode: Math.floor(ease * 352),
        internships: Math.floor(ease * 3),
        certs: Math.floor(ease * 5)
      });

      if (progress < 1) {
        requestAnimationFrame(animateCounts);
      }
    };

    requestAnimationFrame(animateCounts);
  }, [isVisible]);

  const interestTags = [
    'Enterprise Java', 'React Ecosystem', 'ETL Data Pipeline Design', 'Cloud Architecture', 'Real-time WebSockets', 'ServiceNow Automation'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  };

  const floatCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (delayIdx: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14,
        delay: 0.3 + delayIdx * 0.12
      }
    })
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-24 bg-bg-secondary border-t border-b border-border overflow-hidden grid-dots"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          
          {/* LEFT COLUMN: Narrative and Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              variants={itemVariants}
              className="text-accent font-mono text-xs tracking-[0.25em] uppercase"
            >
              // ABOUT ME
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="font-display font-black text-3xl md:text-5xl leading-tight text-text"
            >
              Building systems that make a <span className="gradient-text">difference</span>.
            </motion.h2>

            <motion.div 
              variants={itemVariants}
              className="space-y-4 text-text-sub font-heading leading-relaxed text-sm md:text-base"
            >
              <p>
                I am a Computer Science & Engineering undergraduate at <strong className="text-text">DIT University</strong>. With a cumulative <strong className="text-accent">8.18 CGPA</strong>, I focus on transforming complex algorithmic concepts into highly performant, production-ready full stack services and robust data flows.
              </p>
              <p>
                My drive lies in backend performance optimization and state management—whether it is designing low-latency API proxy middleware, modeling real-time Socket.IO chat servers, or engineering containerized ETL structures.
              </p>
              <p>
                I approach software architecture with visual rigor and operational accountability. My goal is to build highly durable, scalable cloud systems that seamlessly solve business challenges.
              </p>
            </motion.div>

            {/* Interest Tags */}
            <motion.div variants={itemVariants} className="pt-4">
              <div className="text-xs font-mono text-muted uppercase mb-3 flex items-center gap-1.5">
                <Zap size={12} className="text-accent" /> AREAS OF INTENSE FOCUS
              </div>
              <div className="flex flex-wrap gap-2.5">
                {interestTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-text border border-border bg-card/40 hover:border-primary/40 hover:bg-card/90 hover:text-primary transition-all duration-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Initials + Absolute Stat Badges */}
          <div className="lg:col-span-5 flex justify-center items-center relative h-[420px] md:h-[460px]">
            {/* Ambient visual background glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 filter blur-3xl" />

            {/* Central Animated Initials Box */}
            <motion.div 
              variants={floatCardVariants}
              custom={0}
              whileHover={{ scale: 1.03 }}
              className="relative w-56 h-56 rounded-3xl border border-border bg-card flex items-center justify-center overflow-hidden group select-none shadow-2xl z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/15 opacity-60 group-hover:opacity-100 transition-opacity" />
              {/* Rotating conic border segment wrapper */}
              <div className="absolute -inset-[3px] bg-gradient-conic from-primary via-secondary to-accent rounded-3xl -z-10 animate-[spin_8s_linear_infinite] opacity-40 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-6xl tracking-tighter bg-gradient-to-r from-text via-text-sub to-muted bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  RKK
                </span>
                <span className="text-[9px] font-mono text-accent tracking-[0.3em] uppercase mt-2 font-semibold">
                  DEVELOPER
                </span>
              </div>
            </motion.div>

            {/* Absolute Floating Stat Cards */}
            
            {/* Badge 1: CGPA */}
            <motion.div 
              variants={floatCardVariants}
              custom={1}
              whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 12 } }}
              className="absolute top-4 left-4 md:left-8 glass-card rounded-2xl p-4 flex items-center gap-3.5 z-20 shadow-xl max-w-[155px] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <GraduationCap size={18} />
              </div>
              <div>
                <div className="text-lg font-display font-extrabold text-text">8.18</div>
                <div className="text-[10px] font-mono text-muted uppercase">CSE CGPA</div>
              </div>
            </motion.div>

            {/* Badge 2: LeetCode */}
            <motion.div 
              variants={floatCardVariants}
              custom={2}
              whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 12 } }}
              className="absolute top-12 right-2 md:right-8 glass-card rounded-2xl p-4 flex items-center gap-3.5 z-20 shadow-xl max-w-[165px] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Award size={18} />
              </div>
              <div>
                <div className="text-lg font-display font-extrabold text-text">350+</div>
                <div className="text-[10px] font-mono text-muted uppercase">LeetCode Solved</div>
              </div>
            </motion.div>

            {/* Badge 3: Internships */}
            <motion.div 
              variants={floatCardVariants}
              custom={3}
              whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 12 } }}
              className="absolute bottom-16 left-2 md:left-6 glass-card rounded-2xl p-4 flex items-center gap-3.5 z-20 shadow-xl max-w-[155px] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Briefcase size={18} />
              </div>
              <div>
                <div className="text-lg font-display font-extrabold text-text">3 Roles</div>
                <div className="text-[10px] font-mono text-muted uppercase">Internships</div>
              </div>
            </motion.div>

            {/* Badge 4: Year/Period */}
            <motion.div 
              variants={floatCardVariants}
              custom={4}
              whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 12 } }}
              className="absolute bottom-8 right-6 md:right-10 glass-card rounded-2xl p-4 flex items-center gap-3.5 z-20 shadow-xl max-w-[160px] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-lg font-display font-extrabold text-text">2023-27</div>
                <div className="text-[10px] font-mono text-muted uppercase">B.Tech tenure</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* FULL WIDTH STAT COUNTER BAR (Scroll Reveal counter up) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.4 }}
          className="mt-20 pt-12 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8 text-center select-none"
        >
          {[
            { value: counts.cgpa, suffix: ' CGPA', label: 'Academic Standing' },
            { value: counts.leetcode, suffix: '+', label: 'DSA Solutions Checked' },
            { value: counts.internships, suffix: ' Roles', label: 'Internships Completed' },
            { value: counts.certs, suffix: '+', label: 'Verified Certifications' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1.5 group">
              <div className="text-3xl md:text-4xl font-display font-black text-text group-hover:text-primary transition-colors flex items-center justify-center">
                <span>{stat.value}</span>
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <div className="text-[11px] font-mono text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
