/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useCursor } from '../../hooks/useCursor';

export default function CustomCursor() {
  const { position, trailPosition, cursorType, isMobile } = useCursor();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  if (isMobile || cursorType === 'hidden') return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        id="custom-cursor-ring"
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border transition-all duration-300 ease-out flex items-center justify-center text-[8px] font-mono font-bold tracking-widest text-white uppercase"
        style={{
          transform: `translate3d(${trailPosition.x - (cursorType === 'hover' ? 24 : cursorType === 'project' ? 32 : 16)}px, ${trailPosition.y - (cursorType === 'hover' ? 24 : cursorType === 'project' ? 32 : 16)}px, 0) scale(${isClicked ? 0.8 : 1})`,
          width: cursorType === 'hover' ? '48px' : cursorType === 'project' ? '64px' : '32px',
          height: cursorType === 'hover' ? '48px' : cursorType === 'project' ? '64px' : '32px',
          borderColor: cursorType === 'project' ? '#06B6D4' : '#2563EB',
          backgroundColor: cursorType === 'hover' ? 'rgba(37, 99, 235, 0.1)' : cursorType === 'project' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
        }}
      >
        {cursorType === 'project' && <span className="animate-pulse">View</span>}
        {cursorType === 'crosshair' && <span className="text-[12px] text-accent">+</span>}
      </div>

      {/* Inner Dot */}
      <div
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[10000]"
        style={{
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
          transition: 'transform 0.05s ease-out',
          backgroundColor: cursorType === 'project' ? '#06B6D4' : '#2563EB',
        }}
      />
    </>
  );
}
