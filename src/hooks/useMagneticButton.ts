/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useState } from 'react';

interface MagneticOffset {
  x: number;
  y: number;
}

export function useMagneticButton(radius = 80, maxDisplacement = 12) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState<MagneticOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Detect if mobile/touch
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        // Compute pull proportional to proximity
        const pull = (radius - distance) / radius; // 0 (at boundary) to 1 (at center)
        const targetX = (dx / distance) * maxDisplacement * pull;
        const targetY = (dy / distance) * maxDisplacement * pull;
        
        // Apply spring transition style
        element.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
        element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        setOffset({ x: targetX, y: targetY });
      } else {
        // Reset if mouse is outside radius
        reset();
      }
    };

    const reset = () => {
      element.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // bouncy spring back
      element.style.transform = 'translate3d(0, 0, 0)';
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', reset);
    };
  }, [radius, maxDisplacement]);

  return { ref, offset };
}
