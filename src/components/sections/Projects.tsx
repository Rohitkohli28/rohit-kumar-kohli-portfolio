/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS } from '../../data';
import { Project } from '../../types';
import { Github, ExternalLink, X, Cpu, Send, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import ChatSimulator from './ChatSimulator';
import SystemDesignView from './SystemDesignView';

interface ProjectCardProps {
  key?: string | number;
  proj: Project;
  index: number;
  isMobile: boolean;
  onOpenModal: (proj: Project) => void;
}

function ProjectCard({ proj, index, isMobile, onOpenModal }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this individual card's container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Calculate scaling and opacity transformations for the sticky scroll stacking effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const isFeatured = proj.featured;

  // On mobile, bypass scroll stacking and render static styles
  const motionStyles = isMobile 
    ? {} 
    : { scale, opacity, y: yOffset };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${isMobile ? 'h-auto mb-8' : 'h-[80vh] md:h-[95vh]'} flex flex-col justify-start`}
      style={{ zIndex: (index + 1) * 10 }}
    >
      <motion.div
        style={motionStyles}
        onClick={() => onOpenModal(proj)}
        className={`${
          isMobile 
            ? 'relative w-full' 
            : 'sticky top-32 w-full shadow-2xl'
        } group rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 flex flex-col ${
          isFeatured ? 'lg:flex-row min-h-[380px]' : 'min-h-[250px]'
        } cursor-pointer`}
      >
        {/* Visual Accent Block representing project preview */}
        <div
          className={`relative ${
            isFeatured ? 'w-full lg:w-[45%] h-[240px] lg:h-auto' : 'w-full h-[200px]'
          } overflow-hidden`}
          style={{ background: proj.preview }}
        >
          <div className="absolute inset-0 bg-grid opacity-10" />
          
          {/* Floating Number */}
          <div className="absolute top-4 left-6 text-6xl font-display font-black text-white/25 select-none z-10 drop-shadow-md">
            {proj.number}
          </div>

          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between font-mono text-[10px] text-white/90 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
            <span className="text-white font-bold tracking-wider uppercase">
              &lt;{proj.id.replace(/-/g, '_')}&gt;
            </span>
            <span className="text-accent font-semibold text-[10px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Interactive UI Preview
            </span>
          </div>
        </div>

        {/* Card Details / Info */}
        <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
          <div>
            {/* Status indicators */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono text-accent font-semibold">#{proj.id}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                proj.status === 'live' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
                {proj.status}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-text group-hover:text-primary transition-colors">
              {proj.title}
            </h3>
            <p className="font-heading text-xs font-bold text-text-sub tracking-wider uppercase mt-1 mb-4">
              {proj.tagline}
            </p>
            <p className="text-xs md:text-sm text-muted leading-relaxed mb-6 max-w-2xl">
              {proj.description}
            </p>
          </div>

          {/* Card footer tech tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-1.5 max-w-[60%]">
              {proj.tech.slice(0, 5).map((t) => (
                <span key={t} className="text-[10px] font-mono text-muted bg-bg/60 border border-border px-2.5 py-0.5 rounded-md">
                  {t}
                </span>
              ))}
              {proj.tech.length > 5 && (
                <span className="text-[10px] font-mono text-accent bg-accent/5 border border-accent/20 px-2 py-0.5 rounded-md">
                  +{proj.tech.length - 5} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Live <ExternalLink size={12} />
                </a>
              )}
              <a
                href={proj.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-mono text-muted hover:text-text flex items-center gap-1 cursor-pointer"
              >
                <Github size={13} /> Repo
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'interactive' | 'features' | 'architecture'>('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Interactive symptoms analysis state
  const [symptomsInput, setSymptomsInput] = useState('');
  const [symptomResult, setSymptomResult] = useState<any>(null);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  // Interactive resume scoring state
  const [resumeInput, setResumeInput] = useState('');
  const [jobDescInput, setJobDescInput] = useState('');
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openProjectModal = (proj: Project) => {
    setSelectedProject(proj);
    setActiveModalTab('overview');
    setSymptomResult(null);
    setResumeResult(null);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

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

  return (
    <section
      id="projects"
      className="relative w-full py-24 bg-bg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-4">
            // COMPLETED SYSTEMS
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-4">
            Featured Projects
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub">
            Scroll to watch cards stack sequentially. Click on any card to test drive live interactive prototype modules.
          </p>
        </div>

        {/* Skiper-style Sticky Projects Stack container */}
        <div className={`space-y-4 max-w-5xl mx-auto ${isMobile ? '' : 'relative pb-32'}`}>
          {PROJECTS.map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              proj={proj}
              index={idx}
              isMobile={isMobile}
              onOpenModal={openProjectModal}
            />
          ))}
        </div>

      </div>

      {/* DETAILED PROJECT MODAL (With Interactive Playgrounds!) */}
      {selectedProject && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-bg border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[750px]">
            
            {/* Modal Header */}
            <div className="bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-display font-black text-lg md:text-xl text-text">
                  {selectedProject.title}
                </h4>
                <p className="text-xs font-mono text-muted mt-0.5">
                  {selectedProject.tagline}
                </p>
              </div>
              <button
                onClick={closeProjectModal}
                className="p-1.5 rounded-lg border border-border text-muted hover:text-text transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs Row */}
            <div className="flex border-b border-border bg-card/40 overflow-x-auto">
              {[
                { name: 'System Overview', id: 'overview' },
                { name: 'Interactive Demo', id: 'interactive' },
                { name: 'Key Features', id: 'features' },
                { name: 'System Design & Architecture', id: 'architecture' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-5 py-3 font-heading font-semibold text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                    activeModalTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-bg/20'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Modal Body Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeModalTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="font-heading font-extrabold text-base text-text mb-2">// PROJECT MISSION</h5>
                    <p className="text-sm text-text-sub leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="p-4 rounded-xl border border-border bg-card/20">
                      <h6 className="font-mono text-xs text-primary font-bold mb-2">ENGINEERING CHALLENGE</h6>
                      <p className="text-xs text-muted leading-relaxed">
                        {selectedProject.id === 'doc-appt-system' 
                          ? 'Handling secure state synchronizations across multiple patient-doctor sockets and processing fast Razorpay tokens without transaction blocks.'
                          : selectedProject.id === 'real-time-chat-app'
                          ? 'Managing continuous WebSocket sessions, tracking bidirectional user events cleanly, and parsing Web Speech API voice signals inside a web viewport.'
                          : 'Extracting clean structural text blocks from varying PDF formats with high keyword matching accuracy against ATS parsers.'
                        }
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card/20">
                      <h6 className="font-mono text-xs text-accent font-bold mb-2">OPERATIONAL IMPACT</h6>
                      <p className="text-xs text-muted leading-relaxed">
                        {selectedProject.id === 'doc-appt-system'
                          ? 'Created a unified ecosystem that processes clinical schedules dynamically and gives patients secure, private, AI symptom sorting.'
                          : selectedProject.id === 'real-time-chat-app'
                          ? 'Delivered accessible, hand-free web navigation routes and dynamic messaging tools that elevate user interactions on touchscreens.'
                          : 'Empowered candidates to score their resumes in 3 seconds, removing keyword barriers and preparing profiles for recruiter screening.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE DEMO */}
              {activeModalTab === 'interactive' && (
                <div className="space-y-4">
                  
                  {/* Doctor System AI consultation Chat Demonstration */}
                  {selectedProject.id === 'doc-appt-system' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/4 flex items-start gap-3">
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
                          className="w-full bg-bg-secondary border border-border rounded-xl p-3 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSymptomLoading || !symptomsInput.trim()}
                          className="px-4 py-2.5 bg-primary hover:bg-primary-dim text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isSymptomLoading ? 'Evaluating with Gemini...' : 'Analyze Symptoms'} <Send size={12} />
                        </button>
                      </form>

                      {symptomResult && (
                        <div className="p-5 rounded-xl border border-border bg-bg-secondary space-y-4 font-sans text-xs md:text-sm animate-fadeIn">
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

                          <div className="text-[10px] font-mono text-red-400/80 bg-red-500/5 p-2 rounded border border-red-500/10">
                            <strong>DISCLAIMER:</strong> {symptomResult.disclaimer}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Resume Analyzer interactive dashboard demonstration */}
                  {selectedProject.id === 'ai-resume-analyzer' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-secondary/20 bg-secondary/4 flex items-start gap-3">
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
                              rows={4}
                              value={resumeInput}
                              onChange={(e) => setResumeInput(e.target.value)}
                              placeholder="Paste resume skills and highlights here..."
                              className="w-full bg-bg-secondary border border-border rounded-xl p-3 text-xs text-text focus:border-secondary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-muted mb-1 uppercase">Target Job Description</label>
                            <textarea
                              rows={4}
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
                          className="px-4 py-2.5 bg-secondary hover:bg-secondary-dim text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isResumeLoading ? 'Evaluating with Gemini...' : 'Analyze ATS Score'} <Send size={12} />
                        </button>
                      </form>

                      {resumeResult && (
                        <div className="p-5 rounded-xl border border-border bg-bg-secondary space-y-4 text-xs md:text-sm animate-fadeIn">
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
                  {selectedProject.id === 'real-time-chat-app' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-[#e94560]/20 bg-[#e94560]/4 flex items-start gap-3">
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

              {/* TAB 3: FEATURES */}
              {activeModalTab === 'features' && (
                <div className="space-y-4">
                  <h5 className="font-heading font-extrabold text-base text-text">// INTEGRATED FEATURES</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.features.map((feat, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-card/25 border border-border">
                        <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                        <span className="text-xs text-text-sub leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SYSTEM DESIGN & ARCHITECTURE */}
              {activeModalTab === 'architecture' && (
                <SystemDesignView project={selectedProject} />
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-bg-secondary px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono text-muted">ROHIT KUMAR KOHLI • PORTFOLIO</span>
              <div className="flex gap-3">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-border bg-card/50 hover:bg-card text-text text-xs font-mono font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Github size={14} /> GitHub Repository
                </a>
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
