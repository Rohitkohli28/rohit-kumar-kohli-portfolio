/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  Database, 
  Server, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Activity, 
  Workflow, 
  ArrowRight,
  CheckCircle2,
  Layers,
  Radio,
  FileText,
  CreditCard
} from 'lucide-react';

interface SystemDesignViewProps {
  project: Project;
}

export default function SystemDesignView({ project }: SystemDesignViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'diagram' | 'dataflow' | 'schema' | 'security'>('diagram');

  const isDocApp = project.id === 'doc-appt-system';
  const isResumeApp = project.id === 'ai-resume-analyzer';
  const isChatApp = project.id === 'real-time-chat-app';

  return (
    <div className="space-y-6">
      {/* System Design Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h5 className="font-heading font-extrabold text-base text-text flex items-center gap-2">
            <Workflow className="text-primary" size={18} />
            System Design & Architecture Blueprint
          </h5>
          <p className="text-xs font-mono text-muted mt-0.5">
            Production topology, data pipelines, schema design, and security architecture.
          </p>
        </div>

        <div className="flex gap-1.5 bg-card/60 p-1 rounded-xl border border-border">
          {[
            { id: 'diagram', label: 'Topology Diagram', icon: Layers },
            { id: 'dataflow', label: 'Request Lifecycle', icon: Zap },
            { id: 'schema', label: 'Data Model', icon: Database },
            { id: 'security', label: 'Security & Scale', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:text-text hover:bg-bg/40'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: TOPOLOGY DIAGRAM */}
      {activeSubTab === 'diagram' && (
        <div className="space-y-6">
          {/* Interactive Topology Visual Grid */}
          <div className="p-6 rounded-2xl border border-border bg-bg-secondary/70 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />

            <div className="relative z-10 space-y-8">
              {/* Layer 1: Client Viewport */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-primary font-bold uppercase tracking-wider">
                  <Globe size={14} /> Client Layer (Frontend SPA)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">Vite + React 19 UI</span>
                    <span className="text-[10px] font-mono text-muted">Single Page Application & Component State</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">
                      {isChatApp ? 'Web Speech API Engine' : isResumeApp ? 'PDF.js Document Parser' : 'Tailwind & Motion UI'}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      {isChatApp ? 'Voice Command Recognition Engine' : isResumeApp ? 'Browser PDF Text Extraction' : 'Interactive UI Components'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">State & WebSocket Client</span>
                    <span className="text-[10px] font-mono text-muted">Socket.IO Listener & Context Store</span>
                  </div>
                </div>
              </div>

              {/* Directional Connector Arrow */}
              <div className="flex justify-center items-center my-2">
                <div className="px-4 py-1 rounded-full bg-card border border-border font-mono text-[10px] text-accent flex items-center gap-2">
                  <span>HTTPS / WSS JSON Packets</span>
                  <ArrowRight size={12} className="animate-pulse" />
                </div>
              </div>

              {/* Layer 2: API Gateway & WebSocket Server */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-accent font-bold uppercase tracking-wider">
                  <Server size={14} /> Application & Gateway Server
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">Express.js API Proxy</span>
                    <span className="text-[10px] font-mono text-muted">REST Controllers & Middleware</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">JWT Authentication Guard</span>
                    <span className="text-[10px] font-mono text-muted">Role-Based Access Control (RBAC)</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-accent/30 bg-accent/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">Socket.IO Server Engine</span>
                    <span className="text-[10px] font-mono text-muted">Room Channels & Broadcast Router</span>
                  </div>
                </div>
              </div>

              {/* Directional Connector Arrow */}
              <div className="flex justify-center items-center my-2">
                <div className="px-4 py-1 rounded-full bg-card border border-border font-mono text-[10px] text-emerald-400 flex items-center gap-2">
                  <span>Mongoose / Redis / External SDKs</span>
                  <ArrowRight size={12} className="animate-pulse" />
                </div>
              </div>

              {/* Layer 3: Persistence & External Microservices */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                  <Database size={14} /> Database & External Microservices
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">MongoDB Database</span>
                    <span className="text-[10px] font-mono text-muted">Persistent Collections & Indexing</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">Google Gemini 3.5 Flash</span>
                    <span className="text-[10px] font-mono text-muted">LLM Inference & Entity Analytics</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
                    <span className="text-xs font-bold font-heading text-text block">
                      {isDocApp ? 'Razorpay & SMTP Gateway' : isResumeApp ? 'Redis Caching Service' : 'Voice Command Dispatcher'}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      {isDocApp ? 'Payments & Email Notifications' : isResumeApp ? 'Analysis Report Caching' : 'Socket Room Event Handler'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Architecture Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-2">
              <h6 className="font-mono text-xs text-primary font-bold uppercase flex items-center gap-1.5">
                <Radio size={14} /> Communication Protocols
              </h6>
              <p className="text-xs text-text-sub leading-relaxed">
                {isDocApp 
                  ? 'Dual-channel architecture utilizing REST HTTP APIs for transactional appointment bookings and Socket.IO WebSockets for real-time encrypted consultation messaging.'
                  : isChatApp 
                  ? 'Persistent bidirectional WebSockets with room namespaces supporting sub-50ms message delivery, user presence heartbeats, and typing state broadcasts.'
                  : 'Stateless RESTful API proxy running asynchronous document analysis pipelines with cached response models.'
                }
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-2">
              <h6 className="font-mono text-xs text-accent font-bold uppercase flex items-center gap-1.5">
                <Cpu size={14} /> AI & Computation Layer
              </h6>
              <p className="text-xs text-text-sub leading-relaxed">
                {isDocApp
                  ? 'Integrated Gemini AI engine processing clinical symptom reports, generating structured urgency classifications, differential considerations, and recommended medical specialists.'
                  : isResumeApp
                  ? 'Leverages Gemini API for high-precision ATS parsing, matching applicant profiles against target job descriptions, scoring keyword density, and surfacing structural suggestions.'
                  : 'Combines client-side Web Speech API for zero-latency voice recognition with server-side Socket event dispatchers for hands-free navigation.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DATA FLOW & REQUEST LIFECYCLE */}
      {activeSubTab === 'dataflow' && (
        <div className="space-y-4">
          <h6 className="font-heading font-extrabold text-sm text-text">// STEP-BY-STEP REQUEST LIFECYCLE</h6>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Client Interaction & Input Capture',
                desc: isDocApp 
                  ? 'User fills appointment form or submits symptoms in the patient workspace UI.'
                  : isResumeApp 
                  ? 'User uploads PDF resume or pastes text into ATS scoring portal.'
                  : 'User speaks voice command (e.g. "Join Neon City") or sends room message.',
                badge: 'Frontend SPA',
                color: 'text-primary border-primary/30 bg-primary/5'
              },
              {
                step: '02',
                title: 'API Gateway & JWT Authentication',
                desc: 'Express API Proxy validates Bearer token, checks role permissions (Patient/Doctor/Admin), and enforces rate-limiting headers.',
                badge: 'Express Gateway',
                color: 'text-accent border-accent/30 bg-accent/5'
              },
              {
                step: '03',
                title: 'Service Dispatch & Processing',
                desc: isDocApp
                  ? 'Triggers Razorpay order creation for paid appointments or invokes Gemini AI for symptom analysis.'
                  : isResumeApp
                  ? 'Parses document text, checks Redis cache, and dispatches analysis request to Gemini AI.'
                  : 'Emits Socket.IO room event, updates active channel registry, and dispatches message packet.',
                badge: 'Microservices',
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
              },
              {
                step: '04',
                title: 'Database Persistence & WebSocket Sync',
                desc: 'Writes updated appointment / message document to MongoDB with indexed timestamps, then broadcasts real-time update to connected clients.',
                badge: 'MongoDB & Sockets',
                color: 'text-purple-400 border-purple-500/30 bg-purple-500/5'
              }
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl border border-border bg-card/40 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center font-display font-black text-sm text-primary shrink-0">
                  {s.step}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h6 className="font-heading font-bold text-xs md:text-sm text-text">{s.title}</h6>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${s.color}`}>
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DATA MODEL & SCHEMA DESIGN */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4">
          <h6 className="font-heading font-extrabold text-sm text-text">// DATABASE SCHEMAS & ENTITY RELATIONSHIPS</h6>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-primary font-bold flex items-center gap-1.5">
                  <FileText size={14} /> {isDocApp ? 'Appointments Collection' : isResumeApp ? 'Resumes Collection' : 'Messages Collection'}
                </span>
                <span className="text-[10px] text-muted">MongoDB / Mongoose</span>
              </div>
              <ul className="space-y-1.5 text-muted text-[11px]">
                <li className="flex justify-between"><span className="text-text">_id:</span> <span>ObjectId (Primary Key)</span></li>
                <li className="flex justify-between"><span className="text-text">{isDocApp ? 'patientId:' : isResumeApp ? 'userId:' : 'senderId:'}</span> <span>ObjectId (Ref: User)</span></li>
                <li className="flex justify-between"><span className="text-text">{isDocApp ? 'doctorId:' : isResumeApp ? 'score:' : 'roomId:'}</span> <span>{isDocApp ? 'ObjectId (Ref: Doctor)' : isResumeApp ? 'Number (0-100)' : 'String (Indexed)'}</span></li>
                <li className="flex justify-between"><span className="text-text">{isDocApp ? 'status:' : isResumeApp ? 'gaps:' : 'text:'}</span> <span>{isDocApp ? 'Enum (pending/confirmed)' : isResumeApp ? 'Array<String>' : 'String (Encrypted)'}</span></li>
                <li className="flex justify-between"><span className="text-text">createdAt:</span> <span>ISODate (Indexed)</span></li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-accent font-bold flex items-center gap-1.5">
                  <Lock size={14} /> {isDocApp ? 'Users & Auth Schema' : isResumeApp ? 'Analysis Report Schema' : 'Rooms & Users Schema'}
                </span>
                <span className="text-[10px] text-muted">MongoDB / Mongoose</span>
              </div>
              <ul className="space-y-1.5 text-muted text-[11px]">
                <li className="flex justify-between"><span className="text-text">email:</span> <span>String (Unique, Indexed)</span></li>
                <li className="flex justify-between"><span className="text-text">passwordHash:</span> <span>String (Bcrypt Encrypted)</span></li>
                <li className="flex justify-between"><span className="text-text">role:</span> <span>Enum (patient/doctor/admin)</span></li>
                <li className="flex justify-between"><span className="text-text">sessionTokens:</span> <span>Array&lt;JWT&gt;</span></li>
                <li className="flex justify-between"><span className="text-text">updatedAt:</span> <span>ISODate</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SECURITY & SCALABILITY BLUEPRINT */}
      {activeSubTab === 'security' && (
        <div className="space-y-4">
          <h6 className="font-heading font-extrabold text-sm text-text">// SECURITY & PRODUCTION BLUEPRINT</h6>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <h6 className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5 uppercase">
                <ShieldCheck size={14} /> Security Controls
              </h6>
              <ul className="space-y-2 text-xs text-text-sub">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>JWT Tokens with HTTP-only cookie transport and automatic expiration guards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Environment variable secret isolation (`GEMINI_API_KEY`, `SMTP_PASS`, `JWT_SECRET`).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>CORS origin whitelisting & Helmet.js security HTTP response headers.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <h6 className="font-mono text-xs text-primary font-bold flex items-center gap-1.5 uppercase">
                <Activity size={14} /> Scalability & Performance
              </h6>
              <ul className="space-y-2 text-xs text-text-sub">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>Stateless Express REST routes ready for multi-instance horizontal scaling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>Database indexing on query keys (`email`, `roomId`, `patientId`, `createdAt`).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>WebSockets heartbeat ping/pong keep-alives preventing idle socket termination.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
