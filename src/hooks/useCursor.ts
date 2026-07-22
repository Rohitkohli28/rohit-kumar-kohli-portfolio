/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export type CursorType = 'default' | 'hover' | 'drag' | 'hidden' | 'project' | 'crosshair';

export function useCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect mobile/touch devices
    const checkMobile = () => {
      const mobile = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return () => window.removeEventListener('resize', checkMobile);

    // Track mouse coordinates
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseLeave = () => {
      setCursorType('hidden');
    };

    const onMouseEnter = () => {
      setCursorType('default');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerping animation for the trailing ring
    let animationFrameId: number;
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

    const updateTrail = () => {
      setTrailPosition(prev => ({
        x: lerp(prev.x, position.x, 0.15), // 120ms lag factor
        y: lerp(prev.y, position.y, 0.15),
      }));
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);

    // Global Hover Detectors for link elements and interactive parts
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Clickable elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        if (target.closest('.project-card')) {
          setCursorType('project');
        } else if (target.closest('.image-hover')) {
          setCursorType('crosshair');
        } else {
          setCursorType('hover');
        }
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isMobile]);

  return { position, trailPosition, cursorType, isMobile, setCursorType };
}
