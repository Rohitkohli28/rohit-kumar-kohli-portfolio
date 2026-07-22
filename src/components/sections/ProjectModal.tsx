/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Github, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Send, 
  CheckCircle, 
  ArrowUp,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { Project } from '../../types';
import { PROJECTS } from '../../data';
import SystemDesignView from './SystemDesignView';
import ChatSimulator from './ChatSimulator';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (proj: Project) => void;
}

export default function ProjectModal({ project, onClose, onSelectProject }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'interactive' | 'architecture' | 'challenges'>('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Interactive symptoms state (Doctor Appt)
  const [symptomsInput, setSymptomsInput] = useState('');
  const [symptomResult, setSymptomResult] = useState<any>(null);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  // Interactive resume scoring state (AI Resume Analyzer)
  const [resumeInput, setResumeInput] = useState('');
  const [jobDescInput, setJobDescInput] = useState('');
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  // Lock body scrolling while modal is open
  useEffect(() => {
    if (project) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [project]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset internal states when active project changes
  useEffect(() => {
    setActiveTab('overview');
    setSymptomResult(null);
    setResumeResult(null);
    setSymptomsInput('');
    setResumeInput('');
    setJobDescInput('');
  }, [project?.id]);

  if (!project) return null;

  // Project navigation indexing
  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  // Symptom submit handler
  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsSymptomLoading(true);
    setSymptomResult(null);

    try {
      const res = await fetch('/api/gemini/symptom-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsInput,
          gender: 'Male',
          age: '24',
          duration: '3 days'
        })
      });
      const data = await res.json();
      setSymptomResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSymptomLoading(false);
    }
  };

  // Resume submit handler
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeInput.trim()) return;

    setIsResumeLoading(true);
    setResumeResult(null);

    try {
      const res = await fetch('/api/gemini/resume-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeInput,
          jobDescription: jobDescInput
        })
      });
      const data = await res.json();
      setResumeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResumeLoading(false);
    }
  };

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 200);
  };

  const scrollToModalTop = () => {
    const el = document.getElementById('modal-scroll-body');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[1000px] h-[90vh] max-h-[820px] bg-bg border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
        >
          {/* 1. STICKY HEADER */}
          <div className="sticky top-0 z-30 bg-bg-secondary/95 backdrop-blur-md border-b border-border px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold">
                {project.number}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-base md:text-lg text-text">
                    {project.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {project.status}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-muted line-clamp-1">
                  {project.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border text-muted hover:text-text hover:bg-card transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* 2. TABBED NAVIGATION BAR */}
          <div className="flex items-center border-b border-border bg-card/40 px-3 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'features', name: 'Features' },
              { id: 'interactive', name: 'Interactive Demo' },
              { id: 'architecture', name: 'Architecture' },
              { id: 'challenges', name: 'Challenges & Impact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 font-heading font-bold text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-muted border-transparent hover:text-text'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* 3. MODAL SCROLLABLE BODY */}
          <div 
            id="modal-scroll-body"
            onScroll={handleModalScroll}
            className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6 relative"
          >
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Above-The-Fold Summary Card */}
                <div className="p-5 rounded-2xl border border-border bg-bg-secondary/70 backdrop-blur-sm space-y-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold mb-1">
                        <Sparkles size={14} /> Production Application Overview
                      </div>
                      <h4 className="font-heading font-black text-xl text-text">
                        {project.title}
                      </h4>
                      <p className="text-xs font-heading font-semibold text-text-sub mt-0.5">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 hover:shadow-lg transition-all cursor-pointer"
                        >
                          <ExternalLink size={13} /> Live Demo
                        </a>
                      )}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 border border-border bg-card hover:bg-card/80 text-text text-xs font-mono font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Github size={13} /> Repository
                      </a>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-muted leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-mono text-muted uppercase self-center mr-1">Technologies:</span>
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-text bg-card px-2.5 py-0.5 rounded-lg border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High Level Quick Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-card/25 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                      <Code2 size={15} /> System Architecture
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {project.architecture}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-card/25 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-accent font-bold">
                      <Zap size={15} /> Real-Time Features
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {project.id === 'doc-appt-system' 
                        ? 'Socket.io WebSockets, Razorpay payments, Gemini 3.5 Flash symptoms engine'
                        : project.id === 'real-time-chat-app'
                        ? 'Web Speech API Voice Navigation, Socket.io bidirectional message streaming'
                        : 'PDF.js parser, Redis caching layer, Gemini ATS resume evaluator'
                      }
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-card/25 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                      <ShieldCheck size={15} /> Security & Auth
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      Role-Based Access Control (RBAC), JWT sessions, CORS proxy, and sanitized inputs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FEATURES */}
            {activeTab === 'features' && (
              <div className="space-y-4 animate-fadeIn">
                <h5 className="font-heading font-extrabold text-sm text-text uppercase tracking-wider">
                  // INTEGRATED SYSTEM FEATURES
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {project.features.map((feat, i) => (
                    <div key={i} className="flex gap-3 items-start p-4 rounded-2xl bg-bg-secondary/60 border border-border hover:border-primary/30 transition-colors">
                      <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={17} />
                      <span className="text-xs md:text-sm text-text-sub leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: INTERACTIVE DEMO */}
            {activeTab === 'interactive' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Doctor System AI consultation Chat Demonstration */}
                {project.id === 'doc-appt-system' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                      <Cpu className="text-primary mt-0.5 shrink-0" size={18} />
                      <div>
                        <h6 className="font-heading font-bold text-sm text-text">Live Clinical Symptoms Analyzer</h6>
                        <p className="text-xs text-muted">Test Rohit’s backend AI pipeline. Input symptoms below (e.g., "throbbing headache, eye pain, bright light causes discomfort") and get a dynamic AI sorting simulation.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSymptomSubmit} className="space-y-3">
                      <textarea
                        rows={3}
                        value={symptomsInput}
                        onChange={(e) => setSymptomsInput(e.target.value)}
                        placeholder="Type or paste symptoms description here..."
                        className="w-full bg-bg-secondary border border-border rounded-xl p-3 text-xs text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isSymptomLoading || !symptomsInput.trim()}
                        className="px-4 py-2.5 bg-primary hover:bg-primary-dim text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isSymptomLoading ? 'Evaluating with Gemini...' : 'Analyze Symptoms'} <Send size={13} />
                      </button>
                    </form>

                    {symptomResult && (
                      <div className="p-5 rounded-2xl border border-border bg-bg-secondary space-y-4 font-sans text-xs md:text-sm animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-border/60 pb-2">
                          <span className="font-mono text-[10px] text-muted">AI-EVALUATION LOG</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            symptomResult.urgency === 'Emergency' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>{symptomResult.urgency} Priority</span>
                        </div>
                        
                        <p className="text-text-sub leading-relaxed italic">"{symptomResult.analysis}"</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="block font-mono text-[10px] text-muted uppercase mb-1">Potential Considerations</h6>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-text-sub">
                              {symptomResult.possibilities?.map((p: any, i: number) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h6 className="block font-mono text-[10px] text-muted uppercase mb-1">Target Specialist</h6>
                            <span className="text-text font-semibold">{symptomResult.recommendedSpecialist}</span>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono text-red-400/80 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                          <strong>DISCLAIMER:</strong> {symptomResult.disclaimer}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Resume Analyzer interactive dashboard demonstration */}
                {project.id === 'ai-resume-analyzer' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-secondary/20 bg-secondary/5 flex items-start gap-3">
                      <Cpu className="text-secondary mt-0.5 shrink-0" size={18} />
                      <div>
                        <h6 className="font-heading font-bold text-sm text-text">ATS Keyword Gap Scanner</h6>
                        <p className="text-xs text-muted">Paste resume summary and details alongside a job role below to run an instant ATS compatibility score evaluation.</p>
                      </div>
                    </div>

                    <form onSubmit={handleResumeSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-muted mb-1 uppercase">Resume Text</label>
                          <textarea
                            rows={3}
                            value={resumeInput}
                            onChange={(e) => setResumeInput(e.target.value)}
                            placeholder="Paste resume skills and highlights here..."
                            className="w-full bg-bg-secondary border border-border rounded-xl p-3 text-xs text-text focus:border-secondary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-muted mb-1 uppercase">Target Job Description</label>
                          <textarea
                            rows={3}
                            value={jobDescInput}
                            onChange={(e) => setJobDescInput(e.target.value)}
                            placeholder="Paste target job criteria here..."
                            className="w-full bg-bg-secondary border border-border rounded-xl p-3 text-xs text-text focus:border-secondary outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isResumeLoading || !resumeInput.trim()}
                        className="px-4 py-2.5 bg-secondary hover:bg-secondary-dim text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isResumeLoading ? 'Evaluating with Gemini...' : 'Analyze ATS Score'} <Send size={13} />
                      </button>
                    </form>

                    {resumeResult && (
                      <div className="p-5 rounded-2xl border border-border bg-bg-secondary space-y-4 text-xs md:text-sm animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-border/60 pb-2">
                          <span className="font-mono text-[10px] text-muted">ATS COMPATIBILITY RATING</span>
                          <span className="text-emerald-400 font-display font-black text-lg">{resumeResult.score} / 100</span>
                        </div>

                        <p className="text-text-sub leading-relaxed italic">"{resumeResult.overallFeedback}"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="block font-mono text-[10px] text-muted uppercase mb-1">Identified Strengths</h6>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-400">
                              {resumeResult.strengths?.map((s: any, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h6 className="block font-mono text-[10px] text-muted uppercase mb-1">Criticial Keyword Gaps</h6>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-red-400">
                              {resumeResult.gaps?.map((g: any, i: number) => <li key={i}>{g}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Real-time chat app simulator */}
                {project.id === 'real-time-chat-app' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-[#e94560]/20 bg-[#e94560]/5 flex items-start gap-3">
                      <Cpu className="text-[#e94560] mt-0.5 shrink-0" size={18} />
                      <div>
                        <h6 className="font-heading font-bold text-sm text-text">Voice & Socket Sandbox Simulator</h6>
                        <p className="text-xs text-muted">Test the voice assistant and socket room router in real-time. Speak commands via mic or click command shortcuts below.</p>
                      </div>
                    </div>
                    <ChatSimulator />
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SYSTEM DESIGN & ARCHITECTURE */}
            {activeTab === 'architecture' && (
              <div className="animate-fadeIn">
                <SystemDesignView project={project} />
              </div>
            )}

            {/* TAB 5: CHALLENGES & IMPACT */}
            {activeTab === 'challenges' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl border border-border bg-bg-secondary/70 space-y-2">
                    <h6 className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                      // ENGINEERING CHALLENGE
                    </h6>
                    <p className="text-xs md:text-sm text-muted leading-relaxed">
                      {project.id === 'doc-appt-system' 
                        ? 'Handling secure state synchronizations across multiple patient-doctor sockets and processing fast Razorpay tokens without transaction blocks.'
                        : project.id === 'real-time-chat-app'
                        ? 'Managing continuous WebSocket sessions, tracking bidirectional user events cleanly, and parsing Web Speech API voice signals inside a web viewport.'
                        : 'Extracting clean structural text blocks from varying PDF formats with high keyword matching accuracy against ATS parsers.'
                      }
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-bg-secondary/70 space-y-2">
                    <h6 className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                      // OPERATIONAL IMPACT
                    </h6>
                    <p className="text-xs md:text-sm text-muted leading-relaxed">
                      {project.id === 'doc-appt-system'
                        ? 'Created a unified ecosystem that processes clinical schedules dynamically and gives patients secure, private, AI symptom sorting.'
                        : project.id === 'real-time-chat-app'
                        ? 'Delivered accessible, hand-free web navigation routes and dynamic messaging tools that elevate user interactions on touchscreens.'
                        : 'Empowered candidates to score their resumes in 3 seconds, removing keyword barriers and preparing profiles for recruiter screening.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Back to Top Button in Modal */}
            {showScrollTop && (
              <button
                onClick={scrollToModalTop}
                className="sticky bottom-4 right-4 ml-auto w-9 h-9 rounded-full bg-primary text-white shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 cursor-pointer"
                aria-label="Back to modal top"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>

          {/* 4. STICKY FOOTER WITH PROJECT NAVIGATION */}
          <div className="sticky bottom-0 z-30 bg-bg-secondary/95 backdrop-blur-md px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Cycle Projects */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectProject(prevProject)}
                className="px-3 py-1.5 border border-border bg-card hover:bg-card/80 text-text text-xs font-mono rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-[11px] font-mono text-muted">
                {currentIndex + 1} / {PROJECTS.length}
              </span>
              <button
                onClick={() => onSelectProject(nextProject)}
                className="px-3 py-1.5 border border-border bg-card hover:bg-card/80 text-text text-xs font-mono rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center gap-2.5">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 border border-border bg-card hover:bg-card/80 text-text text-xs font-mono font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Github size={13} /> Code
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer"
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
