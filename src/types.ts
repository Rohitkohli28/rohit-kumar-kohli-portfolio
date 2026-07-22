/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  status: 'live' | 'development' | 'archived';
  featured: boolean;
  tech: string[];
  features: string[];
  github: string;
  demo?: string;
  preview: string; // gradient CSS string for placeholder
  image?: string; // image asset URL
  architecture: string; // SVG description or component key
}

export interface Skill {
  name: string;
  icon: string; // Emoji or Lucide icon key
  category: 'lang' | 'frontend' | 'backend' | 'db' | 'cloud' | 'tools';
  level: number; // 0-100
  years?: number;
}

export interface Experience {
  company: string;
  role: string;
  type: 'internship' | 'simulation' | 'freelance';
  startDate: string;
  endDate: string | 'Present';
  location: string;
  bullets: string[];
  tech: string[];
  companyUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  impact: string;
  iconName: string;
  accent: string;
}
