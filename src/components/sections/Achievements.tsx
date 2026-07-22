/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../../data';
import * as Lucide from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface CertificateCardProps {
  key?: string | number;
  item: typeof ACHIEVEMENTS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}

function getSafeRange(center: number, offset: number): [number, number, number] {
  let r1 = center - offset;
  let r2 = center;
  let r3 = center + offset;

  // Clamp to [0, 1] with small epsilons to prevent duplicates and keep monotonicity
  if (r1 < 0) {
    r1 = 0;
    r2 = Math.max(0.01, r2);
    r3 = Math.max(0.02, r3);
  }
  if (r3 > 1) {
    r3 = 1;
    r2 = Math.min(0.99, r2);
    r1 = Math.min(0.98, r1);
  }

  // Ensure they are strictly increasing
  if (r1 >= r2) {
    r2 = r1 + 0.01;
  }
  if (r2 >= r3) {
    r3 = r2 + 0.01;
  }

  // Final check to keep everything in [0, 1]
  if (r3 > 1) {
    r3 = 1;
    r2 = 0.99;
    r1 = 0.98;
  }

  return [r1, r2, r3];
}

function CertificateCard({ item, index, total, scrollYProgress, isMobile }: CertificateCardProps) {
  // Map index to center of the scroll range
  const centerRange = index / (total - 1 || 1);
  
  // Create scaling, opacity, and shadow transformations centered around each card's focus point safely clamped to [0, 1]
  const scale = useTransform(
    scrollYProgress,
    getSafeRange(centerRange, 0.16),
    [0.93, 1.05, 0.93]
  );

  const opacity = useTransform(
    scrollYProgress,
    getSafeRange(centerRange, 0.18),
    [0.65, 1, 0.65]
  );

  const shadowOpacity = useTransform(
    scrollYProgress,
    getSafeRange(centerRange, 0.16),
    ["0px 4px 20px rgba(0,0,0,0.1)", "0px 15px 40px rgba(0,0,0,0.2)", "0px 4px 20px rgba(0,0,0,0.1)"]
  );

  // Fallback link mapping
  const verifyUrls: Record<string, string> = {
    'gcloud-hack': 'https://cloud.google.com/',
    'elite-coder': 'https://github.com/Rohitkohli28',
    'azure-developer': 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
    'meta-frontend': 'https://www.coursera.org/verify/professional-cert/meta-front-end-developer',
    'ibm-data-science': 'https://www.coursera.org/verify/professional-cert/ibm-data-science',
    'aicte-neat': 'https://neat.aicte-india.org/',
    'servicenow-cert': 'https://www.servicenow.com/services-training/certification.html'
  };

  const verifyUrl = verifyUrls[item.id] || 'https://github.com/Rohitkohli28';

  const renderIcon = (iconName: string, accent: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Lucide.Cloud size={24} style={{ color: accent }} />;
      case 'Award':
        return <Lucide.Award size={24} style={{ color: accent }} />;
      case 'Shield':
        return <Lucide.ShieldCheck size={24} style={{ color: accent }} />;
      case 'Code':
        return <Lucide.Code2 size={24} style={{ color: accent }} />;
      case 'Database':
        return <Lucide.Database size={24} style={{ color: accent }} />;
      case 'FileCheck':
        return <Lucide.FileCheck2 size={24} style={{ color: accent }} />;
      case 'Settings':
        return <Lucide.SlidersHorizontal size={24} style={{ color: accent }} />;
      default:
        return <Lucide.Award size={24} style={{ color: accent }} />;
    }
  };

  const cardStyle = isMobile ? {} : { scale, opacity, boxShadow: shadowOpacity };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col justify-between overflow-hidden shrink-0 transition-colors duration-300 select-none ${
        isMobile 
          ? 'w-[290px] h-[340px] snap-center' 
          : 'w-[400px] h-[370px]'
      }`}
      style={{
        ...cardStyle,
        borderTop: `4px solid ${item.accent}`
      }}
    >
      {/* Dynamic gradient backdrop reflecting card accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[50px] opacity-15 pointer-events-none"
        style={{ backgroundColor: item.accent }}
      />

      {/* Card Header (Icon, Seal, Verification Status) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-border bg-bg-secondary shadow-md"
            style={{ borderColor: `${item.accent}30` }}
          >
            {renderIcon(item.iconName, item.accent)}
          </div>
          
          {/* Detailed Gold Digital Seal */}
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center p-0.5 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
            </div>
            <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-widest">OFFICIAL SEAL</span>
          </div>
        </div>

        {/* Certificate metadata */}
        <div>
          <span className="text-[9px] font-mono text-muted uppercase tracking-[0.15em]">
            ISSUED BY • {item.issuer}
          </span>
          <h3 className="font-heading font-black text-base md:text-lg text-text leading-snug mt-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Brief / Impact */}
      <p className="text-xs md:text-sm text-text-sub line-clamp-3 leading-relaxed mt-4 italic font-medium">
        "{item.impact}"
      </p>

      {/* Verification footer with security status and dynamic link */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-green-400 block font-semibold uppercase tracking-wider">
            STATUS: ACTIVE VERIFIED
          </span>
          <span className="text-[7px] font-mono text-muted block break-all">
            TOKEN_ID: {(item.id + item.date).toUpperCase()}_SEC_GRP
          </span>
        </div>

        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-bg border border-border hover:border-accent text-accent hover:text-text hover:bg-accent-dim text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
        >
          Verify <Lucide.ArrowUpRight size={11} />
        </a>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen layout for mobile viewports
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track the vertical scroll progress of the containing wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef
  });

  // Transform the vertical scroll progress into horizontal track translation
  // Moves from right (0px starting offset) to left
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0px", "-2300px"]);

  return (
    <div ref={containerRef} id="achievements" className={`relative w-full ${isMobile ? 'py-16 bg-bg border-b border-border' : 'h-[320vh]'}`}>
      
      {/* STICKY CONTAINER FOR DESKTOP */}
      <div className={`${isMobile ? 'relative' : 'sticky top-0 h-[100vh] w-full flex flex-col justify-center overflow-hidden bg-bg border-b border-border'}`}>
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-12 select-none">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-3">
            // VERIFIED CREDENTIALS & HONORS
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-3">
            Certificates & Honors
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub max-w-2xl">
            {isMobile 
              ? 'Swipe horizontally to view certifications and credentials.'
              : 'Scroll down to slide the credentials vault. Active items scale up and brighten as they approach the center focus.'
            }
          </p>
        </div>

        {/* DESKTOP VIEW: Scroll-Driven Horizontal Track */}
        {!isMobile && (
          <div className="relative w-full h-[410px] flex items-center">
            {/* Horizontal track container */}
            <motion.div 
              style={{ x: xTransform }}
              className="flex gap-10 px-[15vw]"
            >
              {ACHIEVEMENTS.map((item, index) => (
                <CertificateCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={ACHIEVEMENTS.length}
                  scrollYProgress={scrollYProgress}
                  isMobile={false}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* MOBILE & TABLET VIEW: Touch-Friendly Horizontal Swipe Carousel */}
        {isMobile && (
          <div className="w-full overflow-x-auto flex gap-6 px-6 pb-6 snap-x snap-mandatory scrollbar-none">
            {ACHIEVEMENTS.map((item, index) => (
              <CertificateCard
                key={item.id}
                item={item}
                index={index}
                total={ACHIEVEMENTS.length}
                scrollYProgress={scrollYProgress}
                isMobile={true}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
