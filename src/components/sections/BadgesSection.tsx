/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BADGES } from '../../data';
import { BadgeItem } from '../../types';
import * as Lucide from 'lucide-react';
import { motion } from 'motion/react';

interface HangingCardProps {
  item: BadgeItem;
  index: number;
}

function HangingCard({ item, index }: HangingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Staggered initial tilt angles for authentic natural hanging look
  const initialTilts = [-3.5, 2.5, -4, 3, -2.5, 4, -3, 2];
  const initialTilt = initialTilts[index % initialTilts.length];

  // Render badge category icon
  const renderBadgeIcon = (badge: BadgeItem) => {
    const { iconName, accentColor, badgeType } = badge;

    if (badgeType === 'achievement') {
      return <Lucide.Trophy size={18} style={{ color: accentColor }} />;
    }

    switch (iconName) {
      case 'Medal':
        return <Lucide.Medal size={18} style={{ color: accentColor }} />;
      case 'MessageSquareCode':
        return <Lucide.MessageSquareCode size={18} style={{ color: accentColor }} />;
      case 'Sparkles':
        return <Lucide.Sparkles size={18} style={{ color: accentColor }} />;
      case 'ShieldCheck':
        return <Lucide.ShieldCheck size={18} style={{ color: accentColor }} />;
      case 'Globe':
        return <Lucide.Globe size={18} style={{ color: accentColor }} />;
      case 'Compass':
        return <Lucide.Compass size={18} style={{ color: accentColor }} />;
      case 'Award':
        return <Lucide.Award size={18} style={{ color: accentColor }} />;
      default:
        return <Lucide.Award size={18} style={{ color: accentColor }} />;
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center shrink-0 snap-center group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 📌 1. CUSTOMIZABLE HANGING PIN & CLIP */}
      <div className="relative flex flex-col items-center z-30">
        {/* Pin Clip Header */}
        <div 
          className="w-6 h-7 rounded-t-md rounded-b-sm shadow-md flex flex-col items-center justify-between py-1 border border-white/20 relative cursor-pointer"
          style={{ 
            backgroundColor: item.accentColor,
            boxShadow: `0 3px 10px ${item.accentColor}50`
          }}
        >
          {/* Metallic Pin Hole Ring */}
          <div className="w-2 h-2 rounded-full bg-slate-950 border border-white/40 shadow-inner" />
          
          {/* Metallic Pin Clip Ridge */}
          <div className="w-3 h-0.5 bg-white/30 rounded-full" />
        </div>

        {/* Vertical Cord Line Connecting Pin to Card */}
        <div className="w-0.5 h-5 bg-gradient-to-b from-white/40 via-border to-border/80 border-l border-white/10" />
      </div>

      {/* 🖼️ 2. SUSPENDED SWINGING HANGING CARD */}
      <motion.div
        animate={{
          rotate: isHovered ? 0 : [initialTilt, initialTilt + 2.5, initialTilt - 2.5, initialTilt],
          y: isHovered ? -6 : 0,
          scale: isHovered ? 1.03 : 1
        }}
        transition={{
          rotate: {
            duration: 4.5 + (index % 3) * 0.8,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          y: { duration: 0.2, ease: 'easeOut' },
          scale: { duration: 0.2, ease: 'easeOut' }
        }}
        style={{
          transformOrigin: 'top center',
          willChange: 'transform'
        }}
        className="w-[230px] sm:w-[255px] md:w-[275px] h-[340px] sm:h-[370px] rounded-2xl bg-card border border-border hover:border-primary/50 overflow-hidden flex flex-col justify-between shadow-xl transition-colors duration-300 relative cursor-pointer"
        style={{
          borderTop: `4px solid ${item.accentColor}`
        }}
      >
        {/* Dynamic gradient backdrop reflecting badge accent */}
        <div 
          className="absolute top-0 right-0 w-36 h-36 rounded-full filter blur-[50px] pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity duration-300"
          style={{ backgroundColor: item.accentColor }}
        />

        {/* Visual Top Banner / Image Header */}
        <div 
          className="relative w-full h-[120px] sm:h-[135px] p-4 flex flex-col justify-between overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${item.accentColor}25 0%, rgba(15,23,42,0.9) 100%)`
          }}
        >
          <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

          {/* Top Row: Icon & Category Chip */}
          <div className="flex items-center justify-between z-10">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/15 bg-black/40 backdrop-blur-md shadow-md shrink-0"
              style={{ borderColor: `${item.accentColor}40` }}
            >
              {renderBadgeIcon(item)}
            </div>

            <span 
              className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-sm truncate max-w-[130px]"
              style={{
                backgroundColor: `${item.accentColor}20`,
                color: '#FFFFFF',
                borderColor: `${item.accentColor}40`
              }}
            >
              {item.category}
            </span>
          </div>

          {/* Bottom Row: Organization & Earned Date */}
          <div className="z-10 flex items-center justify-between text-[8px] font-mono text-white/80 uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
            <span className="truncate max-w-[70%] font-semibold">{item.organization}</span>
            <span className="font-bold text-accent">{item.issuedDate}</span>
          </div>
        </div>

        {/* Card Details & Description */}
        <div className="p-4 flex-1 flex flex-col justify-between bg-card-solid/60 backdrop-blur-sm z-10">
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-text leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[11px] sm:text-xs text-text-sub line-clamp-2 leading-snug italic font-medium my-1">
              "{item.description}"
            </p>
          </div>

          {/* Special Competition Rank Pill if applicable */}
          {item.badgeType === 'achievement' && (
            <div className="my-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-amber-500 flex items-center gap-1">
                <Lucide.Medal size={11} /> RANK #10
              </span>
              <span className="text-[8px] font-mono text-amber-500/80">22.4K+ Entry</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between mt-auto">
            <span className="text-[7px] font-mono text-green-400 font-semibold block uppercase tracking-wider">
              ACTIVE
            </span>

            {item.verifyLink && (
              <a
                href={item.verifyLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${item.buttonText} for ${item.title}`}
                className="px-3 py-1 bg-accent/10 border border-accent/30 hover:border-accent text-accent hover:text-text hover:bg-accent-dim text-[9px] font-mono font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                {item.buttonText} <Lucide.ArrowUpRight size={10} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function BadgesSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="badges"
      className="relative w-full py-24 bg-bg border-b border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-12 select-none max-w-3xl">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-3">
            // HANGING BADGES GALLERY
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-4 flex items-center gap-3">
            🏅 Badges
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub leading-relaxed">
            An interactive hanging gallery of industry-recognized badges, certifications, and competitive achievements showcasing my continuous learning journey.
          </p>
        </div>

        {/* 🧶 FULL-WIDTH ADAPTIVE CURVED HANGING WIRE */}
        <div className="relative w-full mb-[-24px] select-none pointer-events-none z-20">
          <svg 
            className="w-full h-8 overflow-visible" 
            viewBox="0 0 1000 30" 
            preserveAspectRatio="none"
          >
            <path
              d="M 0 10 Q 500 28 1000 10"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="opacity-80"
            />
          </svg>
        </div>

        {/* 🎴 HANGING CARDS GALLERY SCROLL TRACK */}
        <div 
          ref={trackRef}
          className="w-full overflow-x-auto flex gap-8 md:gap-10 pb-10 pt-4 px-2 snap-x snap-mandatory scrollbar-none relative z-10"
        >
          {BADGES.map((item, index) => (
            <HangingCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* 🎛️ GALLERY NAVIGATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border/60 max-w-4xl mx-auto select-none">
          
          {/* Gallery Info */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-accent">
              01 <span className="text-muted">/ 0{BADGES.length} BADGES</span>
            </span>
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider hidden sm:block">
              Swipe or Scroll to view full collection
            </span>
          </div>

          {/* Navigation Controls (Left / Right Arrow Buttons) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTrack('left')}
              aria-label="Previous Hanging Card"
              className="w-10 h-10 rounded-2xl bg-card border border-border hover:border-accent/50 text-text flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <Lucide.ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scrollTrack('right')}
              aria-label="Next Hanging Card"
              className="w-10 h-10 rounded-2xl bg-card border border-border hover:border-accent/50 text-text flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <Lucide.ChevronRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
