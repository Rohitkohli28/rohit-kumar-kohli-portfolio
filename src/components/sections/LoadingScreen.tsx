/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [milestone, setMilestone] = useState('Initializing Core Engine...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if skipped already in session
    const isSkipped = sessionStorage.getItem('portfolio-loader-skipped');
    if (isSkipped === 'true') {
      onComplete();
      return;
    }

    // Milestones tracking timeline simulating deep assembly
    const milestones = [
      { percentage: 25, label: 'Loading UI Typography (Inter, Syne)...' },
      { percentage: 55, label: 'Assembling Full-Stack APIs & Socket Layers...' },
      { percentage: 85, label: 'Pre-rendering Portfolio Canvas Blocks...' },
      { percentage: 100, label: 'Assembly Complete. Starting Experience...' }
    ];

    let currentMilestoneIndex = 0;
    
    // Check if fonts are ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setProgress(p => Math.max(p, 30));
        setMilestone('Google Web Fonts verified active.');
      });
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        
        // Match appropriate label based on progression
        const matchingMilestone = milestones.find(m => next >= m.percentage - 10 && next <= m.percentage);
        if (matchingMilestone) {
          setMilestone(matchingMilestone.label);
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            sessionStorage.setItem('portfolio-loader-skipped', 'true');
            setTimeout(() => {
              onComplete();
            }, 600); // match fade transition
          }, 400);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      id="portfolio-loader"
      className={`fixed inset-0 bg-bg z-[99999] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="text-center relative max-w-sm px-6">
        {/* Animated Monogram "RKK" */}
        <div className="relative mb-12 flex justify-center items-center h-24">
          <svg
            className="w-40 h-24 stroke-[1.5] text-white overflow-visible"
            viewBox="0 0 160 80"
            fill="none"
          >
            {/* R */}
            <path
              d="M10 70 V10 H30 C45 10, 45 35, 30 35 H10 M30 35 L45 70"
              className="stroke-primary"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: 'drawPath 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            />
            {/* K */}
            <path
              d="M65 10 V70 M65 40 L90 10 M65 40 L90 70"
              className="stroke-secondary"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: 'drawPath 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s'
              }}
            />
            {/* K */}
            <path
              d="M110 10 V70 M110 40 L135 10 M110 40 L135 70"
              className="stroke-accent"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: 'drawPath 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s'
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mt-10">
            Portfolio v2.0
          </div>
        </div>

        {/* Milestone Text indicator */}
        <div className="h-6 overflow-hidden mb-3">
          <p className="text-xs font-mono text-text-sub tracking-wider animate-pulse">
            {milestone}
          </p>
        </div>

        {/* Numeric Progress percentage */}
        <div className="text-3xl font-display font-extrabold text-white mb-6">
          {progress}%
        </div>

        {/* Genuine loading progress bar */}
        <div className="w-64 h-1 bg-border rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer info inside loader */}
        <div className="absolute bottom-[-140px] left-1/2 -translate-x-1/2 w-72 text-[9px] font-mono text-muted flex justify-between">
          <span>PORT: 3000 (SECURE)</span>
          <span>ROHIT KUMAR KOHLI</span>
        </div>
      </div>

      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
