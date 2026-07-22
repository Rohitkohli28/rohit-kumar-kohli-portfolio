/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  UserCheck, 
  Award, 
  Briefcase, 
  Code2, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { PROJECTS, SKILLS, EXPERIENCES, ACHIEVEMENTS } from '../../data';

interface RichCardsProps {
  type: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications';
  onActionClick?: (action: string) => void;
}

export default function RichCards({ type, onActionClick }: RichCardsProps) {
  // 1. RESUME CARD
  if (type === 'resume') {
    return (
      <div className="mt-3 p-4 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-md space-y-3 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h6 className="font-heading font-extrabold text-xs text-text">Rohit_Kumar_Kohli_Resume.pdf</h6>
            <p className="text-[10px] font-mono text-muted">Full-Stack Software Engineer • Java / MERN / Cloud</p>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Official single-page resume detailing core engineering competencies, production full-stack projects, and internships.
        </p>

        <div className="flex gap-2 pt-1 font-mono text-xs">
          <a
            href="/Rohit_Kumar_Kohli_Resume.pdf"
            download="Rohit_Kumar_Kohli_Resume.pdf"
            className="flex-1 px-3 py-2 bg-primary hover:bg-primary-dim text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} /> Download PDF
          </a>
          <a
            href="/Rohit_Kumar_Kohli_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 border border-border bg-card hover:bg-card/80 text-text rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={13} /> View
          </a>
        </div>
      </div>
    );
  }

  // 2. PROJECTS CARDS
  if (type === 'projects') {
    return (
      <div className="mt-3 space-y-3">
        {PROJECTS.map((proj) => (
          <div key={proj.id} className="p-3.5 rounded-2xl border border-border bg-bg-secondary space-y-2.5 shadow-sm">
            {proj.image && (
              <div className="w-full h-28 rounded-xl overflow-hidden border border-border relative">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  {proj.title}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h6 className="font-heading font-extrabold text-xs text-text">{proj.title}</h6>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {proj.status}
              </span>
            </div>

            <p className="text-[11px] text-muted leading-snug line-clamp-2">{proj.description}</p>

            <div className="flex flex-wrap gap-1">
              {proj.tech.map((t) => (
                <span key={t} className="text-[9px] font-mono text-muted bg-card px-2 py-0.5 rounded border border-border">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <a
                href={proj.github}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-text hover:text-primary flex items-center gap-1 cursor-pointer"
              >
                <Github size={12} /> Code
              </a>
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Live Demo <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. SKILLS CARDS (Categorized Animated Badges)
  if (type === 'skills') {
    const categories = Array.from(new Set(SKILLS.map((s) => s.category)));
    return (
      <div className="mt-3 space-y-3 font-sans">
        {categories.map((cat) => {
          const categorySkills = SKILLS.filter((s) => s.category === cat);
          return (
            <div key={cat} className="space-y-1.5">
              <h6 className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">// {cat}</h6>
              <div className="flex flex-wrap gap-1.5">
                {categorySkills.map((sk) => (
                  <span
                    key={sk.name}
                    className="px-2.5 py-1 rounded-xl bg-bg-secondary border border-border text-[11px] font-mono text-text flex items-center gap-1.5 shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <span>{sk.icon}</span>
                    <span className="font-semibold">{sk.name}</span>
                    <span className="text-[9px] text-accent font-bold">({sk.level}%)</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 4. EXPERIENCE TIMELINE CARDS
  if (type === 'experience') {
    return (
      <div className="mt-3 space-y-3 font-sans">
        {EXPERIENCES.map((exp, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl border border-border bg-bg-secondary space-y-2 relative pl-4 border-l-2 border-l-primary">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h6 className="font-heading font-extrabold text-xs text-text">{exp.role}</h6>
                <span className="font-mono text-[11px] text-primary font-bold">{exp.company}</span>
              </div>
              <span className="text-[9px] font-mono text-muted whitespace-nowrap bg-card px-2 py-0.5 rounded border border-border">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>

            <ul className="space-y-1 text-[11px] text-muted list-disc pl-3">
              {exp.bullets.slice(0, 2).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1 pt-1">
              {exp.tech.map((t) => (
                <span key={t} className="text-[9px] font-mono text-muted bg-card px-2 py-0.5 rounded border border-border">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 5. CERTIFICATIONS CARDS
  if (type === 'certifications') {
    return (
      <div className="mt-3 space-y-2.5">
        {ACHIEVEMENTS.map((ach) => (
          <div key={ach.id} className="p-3 rounded-2xl border border-border bg-bg-secondary flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-accent shrink-0">
              <Award size={16} />
            </div>
            <div className="space-y-0.5">
              <h6 className="font-heading font-bold text-xs text-text">{ach.title}</h6>
              <p className="text-[10px] font-mono text-primary font-semibold">{ach.issuer} • {ach.date}</p>
              <p className="text-[11px] text-muted leading-snug">{ach.impact}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 6. CONTACT CARD
  if (type === 'contact') {
    return (
      <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
        <a
          href="mailto:kohlirohit2428@gmail.com"
          className="p-3 rounded-2xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Mail size={15} className="text-primary" /> Email Rohit
        </a>
        <a
          href="https://github.com/Rohitkohli28"
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Github size={15} className="text-accent" /> GitHub
        </a>
        <a
          href="https://linkedin.com/in/rohitkumarkohli"
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Linkedin size={15} className="text-blue-400" /> LinkedIn
        </a>
        <a
          href="#contact"
          onClick={() => onActionClick?.('close_chat')}
          className="p-3 rounded-2xl border border-primary/30 bg-primary/10 text-primary font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <UserCheck size={15} /> Direct Form
        </a>
      </div>
    );
  }

  return null;
}
