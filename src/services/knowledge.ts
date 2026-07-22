/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import knowledgeData from '../data/knowledge.json';

export interface KnowledgeBase {
  owner: {
    name: string;
    title: string;
    email: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
    resumePdf: string;
    availability: string;
    strongestLanguage: string;
    about: string;
  };
  summary: {
    bio: string;
    strongestLanguage: string;
    totalProjects: number;
    aiProjects: string[];
    availability: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade: string;
    highlights: string;
  }>;
  skills: Array<{
    category: string;
    items: Array<{ name: string; level: number; note: string }>;
  }>;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
    bullets: string[];
    tech: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    tagline: string;
    description: string;
    tech: string[];
    github: string;
    demo?: string;
    image?: string;
    usesAI: boolean;
    aiDetails?: string;
    status: string;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    year: string;
    impact: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function getKnowledge(): KnowledgeBase {
  return knowledgeData as KnowledgeBase;
}
