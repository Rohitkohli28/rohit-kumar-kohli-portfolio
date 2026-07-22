/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, ArrowRight, Download, Mail, ExternalLink, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useMagneticButton } from '../../hooks/useMagneticButton';
import { useTheme } from '../../context/ThemeContext';

interface TechNode {
  name: string;
  icon: string;
  abbrev: string;
  category: string;
  color: string;
  ringIndex: number;
  orbitRadius: number;
  angle: number;
  baseSpeed: number;
  x: number;
  y: number;
  z3d: number;
  x3d: number;
  y3d: number;
  floatingOffset: number;
  floatSpeed: number;
  hoverProgress: number; // 0 to 1 for smooth hover zoom
  pulseTimer: number;
  originalIdx: number;
}

interface AmbientParticle {
  x3d: number;
  y3d: number;
  z3d: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const { isDark } = useTheme();
  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Java Developer',
    'Data Engineering Intern'
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position with smoothing
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetMousePosRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 9999, y: 9999 });
  const scrollYRef = useRef(0);

  // Tooltip UI state
  const [hoveredNode, setHoveredNode] = useState<TechNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { ref: viewProjRef } = useMagneticButton(70, 10);
  const { ref: downloadResRef } = useMagneticButton(70, 10);
  const { ref: githubSocialRef } = useMagneticButton(40, 8);
  const { ref: linkedinSocialRef } = useMagneticButton(40, 8);
  const { ref: leetcodeSocialRef } = useMagneticButton(40, 8);
  const { ref: emailSocialRef } = useMagneticButton(40, 8);

  // Rotate roles index
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Track mouse coordinates for smooth parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMousePosRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 45, // Parallax intensity
        y: (e.clientY / innerHeight - 0.5) * 45,
      };
    };
    
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Tech Constellation Config & Canvas Loop (Interactive 3D Constellation Sphere)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = Date.now();
    const depth = 320; // 3D Perspective Depth
    const maxRadius = 140; // Max radius of the 3D sphere shell

    // Setup technical stack nodes consistent with skills list
    const technologies = [
      { name: 'Java', icon: '☕', abbrev: 'JV', category: 'Backend / Core', color: '#3b82f6', ringIndex: 2, orbitRadius: 180, baseSpeed: -0.001 },
      { name: 'JavaScript', icon: '🌐', abbrev: 'JS', category: 'Language', color: '#f59e0b', ringIndex: 0, orbitRadius: 90, baseSpeed: 0.0025 },
      { name: 'React', icon: '⚛️', abbrev: 'RE', category: 'Frontend UI', color: '#06b6d4', ringIndex: 1, orbitRadius: 135, baseSpeed: -0.0018 },
      { name: 'Node.js', icon: '🟢', abbrev: 'ND', category: 'Runtime Env', color: '#10b981', ringIndex: 1, orbitRadius: 135, baseSpeed: 0.0015 },
      { name: 'Express.js', icon: '🚂', abbrev: 'EX', category: 'Web API Framework', color: '#8b5cf6', ringIndex: 2, orbitRadius: 180, baseSpeed: 0.0012 },
      { name: 'MongoDB', icon: '🍃', abbrev: 'MD', category: 'Database (NoSQL)', color: '#059669', ringIndex: 3, orbitRadius: 225, baseSpeed: -0.0008 },
      { name: 'MySQL', icon: '🗄️', abbrev: 'MY', category: 'Database (Relational)', color: '#0ea5e9', ringIndex: 3, orbitRadius: 225, baseSpeed: 0.0009 },
      { name: 'Microsoft Azure', icon: '☁️', abbrev: 'AZ', category: 'Cloud Infrastructure', color: '#2563eb', ringIndex: 4, orbitRadius: 270, baseSpeed: 0.0006 },
      { name: 'Git/GitHub', icon: '🐙', abbrev: 'GH', category: 'Version Control', color: '#6366f1', ringIndex: 4, orbitRadius: 270, baseSpeed: -0.0007 },
    ];

    // Initialize 9 Core Nodes distributed on a 3D Sphere using Golden Spiral (Fibonacci) Sphere Algorithm
    const nodes: TechNode[] = technologies.map((tech, index) => {
      const k = index + 0.5;
      const phi = Math.acos(1 - (2 * k) / technologies.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;

      return {
        ...tech,
        angle: 0,
        x3d: maxRadius * Math.sin(phi) * Math.cos(theta),
        y3d: maxRadius * Math.sin(phi) * Math.sin(theta),
        z3d: maxRadius * Math.cos(phi),
        x: 0,
        y: 0,
        floatingOffset: 0,
        floatSpeed: 0.02 + Math.random() * 0.03,
        hoverProgress: 0,
        pulseTimer: Math.random() * 100,
        originalIdx: index,
      };
    });

    // Create 35 Ambient smaller background particles scattered in 3D Space on a slightly larger shell
    const ambientCount = 35;
    const ambientParticles: AmbientParticle[] = [];
    for (let i = 0; i < ambientCount; i++) {
      const R = 110 + Math.random() * 70;
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.sqrt(1 - u * u);

      ambientParticles.push({
        x3d: R * r * Math.cos(theta),
        y3d: R * r * Math.sin(theta),
        z3d: R * u,
        x: 0,
        y: 0,
        color: i % 2 === 0 ? '#3b82f6' : '#a855f7',
        size: 1 + Math.random() * 1.5,
      });
    }

    // Connect ambient particles to their nearest core node for constellation threads
    const ambientLinks = ambientParticles.map((particle) => {
      let nearestIdx = 0;
      let minDist = Infinity;
      nodes.forEach((node, idx) => {
        const d = Math.hypot(particle.x3d - node.x3d, particle.y3d - node.y3d, particle.z3d - node.z3d);
        if (d < minDist) {
          minDist = d;
          nearestIdx = idx;
        }
      });
      return nearestIdx;
    });

    // Interconnections representation
    const connections = [
      [0, 4], // Java ── Express.js
      [1, 2], // JavaScript ── React
      [2, 3], // React ── Node.js
      [3, 4], // Node.js ── Express.js
      [3, 5], // Node.js ── MongoDB
      [4, 6], // Express.js ── MySQL
      [0, 6], // Java ── MySQL
      [7, 5], // Azure ── MongoDB
      [7, 8], // Azure ── Git/GitHub
    ];

    // Pulses traveling along connection wires
    const pulses = connections.map(() => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Track hovered node index to slow speed and draw indicator
    let activeHoverIdx: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Speeds of rotation (damped smoothly)
    let targetYawSpeed = 0.0015;
    let targetPitchSpeed = 0.0008;
    let yawSpeed = targetYawSpeed;
    let pitchSpeed = targetPitchSpeed;

    const onCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const relativeX = rawX - cx;
      const relativeY = rawY - cy;

      // Update actual mouse ref for physical repulsion/attraction force
      currentMouseRef.current = { x: relativeX, y: relativeY };

      // Momentary acceleration of 3D rotation based on mouse dragging speed
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      if (lastMouseX !== 0 && lastMouseY !== 0) {
        yawSpeed += dx * 0.00015;
        pitchSpeed += dy * 0.00015;
      }

      // Check hover matching based on 2D projected coordinates on canvas
      let foundIndex: number | null = null;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dist = Math.hypot(relativeX - node.x, relativeY - node.y);
        const touchRadius = 24; // Easy hover zone
        if (dist < touchRadius) {
          foundIndex = i;
          break;
        }
      }

      activeHoverIdx = foundIndex;
      if (foundIndex !== null) {
        canvas.style.cursor = 'pointer';
        setHoveredNode(nodes[foundIndex]);
        setTooltipPos({ x: e.clientX, y: e.clientY });
      } else {
        canvas.style.cursor = 'default';
        setHoveredNode(null);
      }
    };

    const onCanvasMouseLeave = () => {
      currentMouseRef.current = { x: 9999, y: 9999 };
      activeHoverIdx = null;
      setHoveredNode(null);
    };

    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseleave', onCanvasMouseLeave);

    // Dynamic 3D Render Loop
    const draw = () => {
      const elapsed = Date.now() - startTime;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Smoothly damp speeds of rotation back to target values
      yawSpeed += (targetYawSpeed - yawSpeed) * 0.04;
      pitchSpeed += (targetPitchSpeed - pitchSpeed) * 0.04;

      // Parallax scroll coordinates
      const scrollY = scrollYRef.current;
      const exitProgress = Math.min(1, scrollY / 600);
      const constellationScale = 1 - 0.14 * exitProgress;
      const opacityMultiplier = 1 - 0.7 * exitProgress;
      const lineProgress = Math.min(1, Math.max(0, (elapsed - 1600) / 800));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply translation centering and scaling on scroll exit
      ctx.translate(cx, cy);
      ctx.scale(constellationScale, constellationScale);

      // --- LAYER 1: Update 3D rotated node positions ---
      nodes.forEach((node, idx) => {
        const speedFactor = activeHoverIdx === idx ? 0.08 : 1.0;

        // Yaw Y-rotation
        const cosY = Math.cos(yawSpeed * speedFactor);
        const sinY = Math.sin(yawSpeed * speedFactor);
        const x1 = node.x3d * cosY - node.z3d * sinY;
        const z1 = node.z3d * cosY + node.x3d * sinY;

        // Pitch X-rotation
        const cosX = Math.cos(pitchSpeed * speedFactor);
        const sinX = Math.sin(pitchSpeed * speedFactor);
        const y2 = node.y3d * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y3d * sinX;

        node.x3d = x1;
        node.y3d = y2;
        node.z3d = z2;

        // Perspective Projection calculation
        const scale = depth / (depth + node.z3d);
        const projX = node.x3d * scale;
        const projY = node.y3d * scale;

        // Apply interactive mouse physical repulsion force
        const mouseX = currentMouseRef.current.x;
        const mouseY = currentMouseRef.current.y;
        const distToMouse = Math.hypot(projX - mouseX, projY - mouseY);
        let repulsionX = 0;
        let repulsionY = 0;
        if (distToMouse < 90 && distToMouse > 0) {
          const force = (90 - distToMouse) / 90;
          const angle = Math.atan2(projY - mouseY, projX - mouseX);
          repulsionX = Math.cos(angle) * force * 18;
          repulsionY = Math.sin(angle) * force * 18;
        }

        node.x = projX + repulsionX;
        node.y = projY + repulsionY;

        // Delicate ambient breathing float offsets
        node.floatingOffset = Math.sin(elapsed * node.floatSpeed) * 3;
        node.y += node.floatingOffset;

        // Hover expand indicator
        const isHovered = activeHoverIdx === idx;
        if (isHovered) {
          node.hoverProgress += (1 - node.hoverProgress) * 0.16;
        } else {
          node.hoverProgress += (0 - node.hoverProgress) * 0.16;
        }
      });

      // --- LAYER 2: Update 3D rotated ambient particles ---
      ambientParticles.forEach((particle) => {
        // Yaw Y-rotation
        const cosY = Math.cos(yawSpeed);
        const sinY = Math.sin(yawSpeed);
        const x1 = particle.x3d * cosY - particle.z3d * sinY;
        const z1 = particle.z3d * cosY + particle.x3d * sinY;

        // Pitch X-rotation
        const cosX = Math.cos(pitchSpeed);
        const sinX = Math.sin(pitchSpeed);
        const y2 = particle.y3d * cosX - z1 * sinX;
        const z2 = z1 * cosX + particle.y3d * sinX;

        particle.x3d = x1;
        particle.y3d = y2;
        particle.z3d = z2;

        const scale = depth / (depth + particle.z3d);
        const projX = particle.x3d * scale;
        const projY = particle.y3d * scale;

        // Mouse repulsion on ambient dots
        const mouseX = currentMouseRef.current.x;
        const mouseY = currentMouseRef.current.y;
        const distToMouse = Math.hypot(projX - mouseX, projY - mouseY);
        let repulsionX = 0;
        let repulsionY = 0;
        if (distToMouse < 80 && distToMouse > 0) {
          const force = (80 - distToMouse) / 80;
          const angle = Math.atan2(projY - mouseY, projX - mouseX);
          repulsionX = Math.cos(angle) * force * 12;
          repulsionY = Math.sin(angle) * force * 12;
        }

        particle.x = projX + repulsionX;
        particle.y = projY + repulsionY;
      });

      // --- LAYER 3: Render connecting constellation threads & data packets ---
      if (lineProgress > 0) {
        // Draw Core Node Connections
        connections.forEach(([n1, n2], connectionIdx) => {
          const nodeA = nodes[n1];
          const nodeB = nodes[n2];

          // Compute wire fade based on average depth (z-sorting coordinate)
          const avgZ = (nodeA.z3d + nodeB.z3d) / 2;
          const depthFade = Math.max(0.04, Math.min(1.0, 1 - (avgZ + maxRadius) / (maxRadius * 2.5)));

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);

          const isWireGlow = activeHoverIdx === n1 || activeHoverIdx === n2;
          ctx.strokeStyle = isDark
            ? `rgba(139, 92, 246, ${(isWireGlow ? 0.38 : 0.08) * lineProgress * opacityMultiplier * depthFade})`
            : `rgba(37, 99, 235, ${(isWireGlow ? 0.28 : 0.07) * lineProgress * opacityMultiplier * depthFade})`;
          ctx.lineWidth = isWireGlow ? 1.2 : 0.5;
          ctx.stroke();

          // Render glowing traveling data pulses along the core connections
          const pulse = pulses[connectionIdx];
          pulse.progress += pulse.speed;
          if (pulse.progress > 1) pulse.progress = 0;

          const px = nodeA.x + (nodeB.x - nodeA.x) * pulse.progress;
          const py = nodeA.y + (nodeB.y - nodeA.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8 * depthFade, 0, 2 * Math.PI);
          ctx.fillStyle = nodeA.color;
          ctx.shadowBlur = 4 * depthFade;
          ctx.shadowColor = nodeA.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw Ambient Constellation Faint Lines
        ambientParticles.forEach((particle, idx) => {
          const targetNodeIdx = ambientLinks[idx];
          const node = nodes[targetNodeIdx];

          const avgZ = (particle.z3d + node.z3d) / 2;
          const depthFade = Math.max(0.01, Math.min(0.4, (1 - (avgZ + maxRadius) / (maxRadius * 2.5)) * 0.12));

          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${depthFade * lineProgress * opacityMultiplier})`
            : `rgba(15, 23, 42, ${depthFade * lineProgress * opacityMultiplier})`;
          ctx.lineWidth = 0.35;
          ctx.stroke();
        });
      }

      // --- LAYER 4: Draw Central Nebula Core / Breathing Singularity ---
      const coreProgress = Math.min(1, Math.max(0, elapsed / 800));
      if (coreProgress > 0) {
        const breathingFactor = 1 + 0.05 * Math.sin(elapsed * 0.0015);
        const coreRadius = 24 * coreProgress * breathingFactor;

        // Radial gradient singularity glow
        const glowRad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreRadius * 2);
        glowRad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(37, 99, 235, 0.25)');
        glowRad.addColorStop(0.5, isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(124, 58, 237, 0.08)');
        glowRad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(0, 0, coreRadius * 2, 0, 2 * Math.PI);
        ctx.fillStyle = glowRad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, coreRadius * 0.45, 0, 2 * Math.PI);
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.shadowBlur = isDark ? 12 : 4;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- LAYER 5: Render 3D Sorted Nodes (Back-to-Front Depth Occlusion) ---
      // 1. Draw back ambient particles (z3d > 0)
      ambientParticles.forEach((particle) => {
        if (particle.z3d > 0) {
          const depthScale = depth / (depth + particle.z3d);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * depthScale, 0, 2 * Math.PI);
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = isDark ? 4 * depthScale : 0;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 2. Draw back core nodes (z3d > 0)
      nodes.forEach((node) => {
        if (node.z3d > 0) {
          drawCoreNode(node, elapsed);
        }
      });

      // 3. Draw front ambient particles (z3d <= 0)
      ambientParticles.forEach((particle) => {
        if (particle.z3d <= 0) {
          const depthScale = depth / (depth + particle.z3d);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * depthScale, 0, 2 * Math.PI);
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = isDark ? 5 * depthScale : 0;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 4. Draw front core nodes (z3d <= 0)
      nodes.forEach((node) => {
        if (node.z3d <= 0) {
          drawCoreNode(node, elapsed);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(draw);
    };

    // Helpless helper helper for drawing depth-scaled tech nodes
    const drawCoreNode = (node: TechNode, elapsed: number) => {
      const appearanceDelay = 1200 + node.originalIdx * 80;
      const individualAppearance = Math.min(1, Math.max(0, (elapsed - appearanceDelay) / 400));

      if (individualAppearance <= 0) return;

      const depthScale = depth / (depth + node.z3d);

      ctx.save();
      ctx.translate(node.x, node.y);

      const hoverScale = 1 + 0.35 * node.hoverProgress;
      ctx.scale(hoverScale * depthScale, hoverScale * depthScale);

      // Node shadow halo glow
      if (isDark) {
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}12`;
        ctx.fill();
      }

      // Outer circle container
      const size = 15;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, 2 * Math.PI);
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 1.2 + 0.8 * node.hoverProgress;

      if (isDark && node.hoverProgress > 0) {
        ctx.shadowBlur = 10 * node.hoverProgress;
        ctx.shadowColor = node.color;
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner tech code text
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.abbrev, 0, 0.5);

      ctx.restore();
    };

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onCanvasMouseMove);
      canvas.removeEventListener('mouseleave', onCanvasMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isDark]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cinematic staggered text transition properties
  const labelVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.1 } 
    }
  };

  const textGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 14 }
    }
  };

  const btnContainerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 110, damping: 15, delay: 1.1 }
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-screen bg-bg flex items-center justify-center overflow-hidden pt-16 z-10"
    >
      {/* LAYER 0: Breathing Accent Gradient Mesh */}
      <div 
        className="absolute inset-0 gradient-hero z-0 pointer-events-none"
        style={{
          animation: 'breathing 12s ease-in-out infinite alternate',
        }}
      />

      {/* LAYER 1: SVG Geometric Structural Matrix */}
      <div className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-[1]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-text/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,var(--bg)_90%]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 relative">
        
        {/* HERO COPY LEFT (55% desktop width) */}
        <motion.div 
          variants={textGroupVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-7 text-left flex flex-col justify-center select-none"
        >
          {/* Status availability badge */}
          <motion.div 
            variants={labelVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/8 border border-green-500/20 rounded-full w-fit mb-6 text-xs text-green-500 font-mono tracking-wide font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block animate-ping" />
            Available for opportunities
          </motion.div>

          {/* Intro Eyebrow */}
          <motion.div 
            variants={itemVariants}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-4 flex items-center font-bold"
          >
            Hi, my name is
          </motion.div>

          {/* Name Display */}
          <h1 className="font-display font-black text-[3.8rem] md:text-[5.5rem] leading-[0.92] tracking-tight text-text mb-3">
            <motion.span 
              variants={itemVariants}
              className="block"
            >
              Rohit Kumar
            </motion.span>
            <motion.span 
              variants={itemVariants}
              className="block bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent filter drop-shadow-[0_0_12px_rgba(37,99,235,0.15)]"
            >
              Kohli
            </motion.span>
          </h1>

          {/* Dynamic Active Role Carousel */}
          <motion.div 
            variants={itemVariants}
            className="h-8 mb-6 overflow-hidden"
          >
            <div className="flex items-center font-mono text-base md:text-lg text-text-sub font-semibold tracking-wide">
              <span className="text-muted mr-2">&gt;</span>
              <span className="text-secondary mr-2">[</span>
              <span className="text-text animate-pulse">
                {roles[roleIndex]}
              </span>
              <span className="text-secondary ml-2">]</span>
            </div>
          </motion.div>

          {/* Description Paragraph */}
          <motion.p 
            variants={itemVariants}
            className="font-heading font-medium text-sm md:text-base text-text-sub max-w-[46ch] leading-relaxed mb-10"
          >
            A B.Tech CSE student at <strong className="text-text">DIT University</strong> engineering production-grade full-stack products, secure web frameworks, and automated data pipelines.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            variants={btnContainerVariants}
            className="flex flex-wrap gap-4 items-center mb-8"
          >
            <button
              ref={viewProjRef as React.RefObject<HTMLButtonElement>}
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold text-xs rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              View Projects <ArrowRight size={14} />
            </button>
            <a
              ref={downloadResRef as React.RefObject<HTMLAnchorElement>}
              href="/Rohit_Kumar_Kohli_Resume.pdf"
              download="Rohit_Kumar_Kohli_Resume.pdf"
              className="px-6 py-3 border border-border bg-card/40 hover:bg-card-hover text-text font-heading font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              Resume <Download size={14} />
            </a>
          </motion.div>

          {/* Social Row */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            {[
              { icon: <Github size={18} />, url: 'https://github.com/Rohitkohli28', ref: githubSocialRef },
              { icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/in/rohitkumarkohli', ref: linkedinSocialRef },
              { icon: <ExternalLink size={16} />, label: 'LeetCode', url: 'https://leetcode.com/u/Rohit2028/', ref: leetcodeSocialRef },
              { icon: <Mail size={16} />, url: 'mailto:kohlirohit2428@gmail.com', ref: emailSocialRef }
            ].map((social, index) => (
              <a
                key={index}
                ref={social.ref as React.RefObject<HTMLAnchorElement>}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-border hover:border-accent text-text-sub hover:text-accent bg-card/20 hover:bg-card/50 flex items-center justify-center transition-all cursor-pointer relative"
                aria-label={social.label || 'Social Link'}
              >
                {social.icon}
                {social.label && (
                  <span className="absolute -top-6 text-[8px] font-mono opacity-0 hover:opacity-100 transition-all bg-card text-text px-1.5 py-0.5 rounded border border-border">
                    {social.label}
                  </span>
                )}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* TECH CONSTELLATION GRAPH RIGHT (45% desktop width) */}
        <div className="md:col-span-5 relative w-full h-[380px] md:h-[500px] flex justify-center items-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
          />
        </div>
      </div>

      {/* HTML-Overlay Pixel-Perfect Tooltip */}
      {hoveredNode && (
        <div
          className="fixed pointer-events-none z-[9999] bg-bg/95 border border-primary/20 p-3 rounded-xl shadow-xl max-w-[210px] animate-fadeIn backdrop-blur-md"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xl">{hoveredNode.icon}</span>
            <div>
              <h4 className="text-xs font-mono font-bold text-text">{hoveredNode.name}</h4>
              <p className="text-[9px] font-mono text-muted uppercase tracking-wider">{hoveredNode.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 5: Scrolling indicator footer link */}
      <button 
        onClick={() => scrollToSection('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] text-muted group-hover:text-text transition-colors">SCROLL</span>
        <div className="animate-bounce">
          <ChevronDown size={14} className="text-primary group-hover:text-accent transition-colors" />
        </div>
      </button>

      <style>{`
        @keyframes breathing {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.04); }
        }
      `}</style>
    </section>
  );
}
