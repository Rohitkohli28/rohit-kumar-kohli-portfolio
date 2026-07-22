/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, Experience, Achievement } from './types';

export const SKILLS: Skill[] = [
  // Languages
  { name: 'Java', icon: '☕', category: 'lang', level: 90 },
  { name: 'JavaScript', icon: '🌐', category: 'lang', level: 88 },
  { name: 'SQL', icon: '🗄️', category: 'lang', level: 80 },

  // Frontend
  { name: 'React', icon: '⚛️', category: 'frontend', level: 92 },
  { name: 'TypeScript', icon: '🔷', category: 'frontend', level: 78 },
  { name: 'HTML/CSS', icon: '🎨', category: 'frontend', level: 95 },

  // Backend
  { name: 'Node.js', icon: '🟢', category: 'backend', level: 88 },
  { name: 'Express', icon: '🚂', category: 'backend', level: 85 },
  { name: 'REST APIs', icon: '🔌', category: 'backend', level: 92 },
  { name: 'JWT', icon: '🔑', category: 'backend', level: 82 },
  { name: 'Socket.IO', icon: '💬', category: 'backend', level: 80 },

  // Database
  { name: 'MongoDB', icon: '🍃', category: 'db', level: 86 },
  { name: 'MySQL', icon: '🐬', category: 'db', level: 80 },

  // Cloud
  { name: 'Microsoft Azure', icon: '☁️', category: 'cloud', level: 82 },
  { name: 'Docker', icon: '🐳', category: 'cloud', level: 75 },
  { name: 'ServiceNow', icon: '⚙️', category: 'cloud', level: 68 },

  // Tools
  { name: 'Git/GitHub', icon: '🐙', category: 'tools', level: 94 },
  { name: 'Postman', icon: '🚀', category: 'tools', level: 88 },
  { name: 'Power BI', icon: '📊', category: 'tools', level: 70 }
];

export const EXPERIENCES: Experience[] = [
  {
    company: 'Celebal Technologies',
    role: 'Data Engineering Intern',
    type: 'internship',
    startDate: 'June 2024',
    endDate: 'August 2024',
    location: 'Jaipur, India (Remote)',
    bullets: [
      'Built ETL pipelines processing 120GB of structured data using Azure Databricks and SQL.',
      'Implemented data transformation workflows reducing processing time by 28%.',
      'Created interactive Power BI dashboards for direct stakeholder reporting and insights.',
      'Collaborated with cross-functional teams on Azure-based cloud data solutions.'
    ],
    tech: ['SQL', 'Azure Databricks', 'ETL', 'Power BI', 'Data Pipelines', 'Microsoft Azure'],
    companyUrl: 'https://celebaltech.com'
  },
  {
    company: 'SmartBridge',
    role: 'ServiceNow Virtual Intern',
    type: 'simulation',
    startDate: 'April 2024',
    endDate: 'May 2024',
    location: 'Dehradun, India (Remote)',
    bullets: [
      'Developed custom ServiceNow applications for IT service management (ITSM) workflows.',
      'Automated incident management pipelines, reducing median resolution time by 35%.',
      'Configured workflow automation, script includes, and business rules using Flow Designer.',
      'Completed 4 hands-on enterprise-scale projects within the ServiceNow ecosystem.'
    ],
    tech: ['ServiceNow', 'ITSM', 'JavaScript', 'Flow Designer', 'Automation'],
    companyUrl: 'https://thesmartbridge.com'
  },
  {
    company: 'SmartED Innovations',
    role: 'Full Stack Developer Intern',
    type: 'internship',
    startDate: 'December 2023',
    endDate: 'February 2024',
    location: 'Noida, India (Remote)',
    bullets: [
      'Built and deployed 3 full-stack features using the MERN stack for 2,500+ active users.',
      'Designed highly secure RESTful APIs with JWT authentication and role-based access control.',
      'Improved page load performance by 40% through lazy loading, code splitting, and memoization.',
      'Participated in daily standups, code reviews, and Agile sprint planning cycles.'
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'REST APIs']
  },
  {
    company: 'Microsoft Azure',
    role: 'Cloud Virtual Job Simulation',
    type: 'simulation',
    startDate: 'November 2023',
    endDate: 'November 2023',
    location: 'Azure (Remote)',
    bullets: [
      'Architected a highly resilient serverless solution using Azure Functions, Blob Storage, and CosmosDB.',
      'Implemented auto-scaling policies on Azure App Services, reducing simulated infrastructure costs by 15%.',
      'Deployed fully containerized applications using Azure Kubernetes Service (AKS) and monitored resource health metrics.'
    ],
    tech: ['Microsoft Azure', 'Functions', 'Blob Storage', 'CosmosDB', 'AKS', 'ARM Templates']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'doc-appt-system',
    number: '01',
    title: 'Doctor Appointment System',
    tagline: 'Healthcare platform connecting patients and doctors in real-time',
    description: 'A comprehensive, production-grade healthcare workspace that manages patient-doctor scheduling, processes subscriptions, enables encrypted text consultations, and provides an intelligent symptoms assistant.',
    status: 'live',
    featured: true,
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.IO', 'JWT', 'Razorpay', 'Gemini AI'],
    features: [
      'Multi-role authentication system (Patient, Doctor, and Admin workspaces) secured by JWT.',
      'Real-time encrypted consultation chats built with Socket.IO WebSockets.',
      'AI-powered clinical symptom analyses using Google Gemini 3.5 Flash.',
      'Razorpay payment gateway integration supporting tiered subscription plans.',
      'Appointment scheduling calendar with granular doctor availability controls.',
      'Secure medical history storage and electronic prescription management.',
      'Full-featured Admin dashboard with user management and visual analytics.'
    ],
    github: 'https://github.com/Rohitkohli28/doctor-appointment-system',
    demo: 'https://rohit-healthcare-appointment.vercel.app',
    preview: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%)',
    architecture: 'Client (Vite/React) ──► Express API Proxy (CORS) ──► Socket.IO WS / MongoDB / Gemini SDK / Razorpay'
  },
  {
    id: 'ai-resume-analyzer',
    number: '02',
    title: 'AI Resume Analyzer',
    tagline: 'ATS-optimized resume scoring and improvement engine',
    description: 'An advanced, containerized software tool designed to give job-seekers deep keyword gaps analysis, ATS compatibility scoring, and section-by-section improvements using artificial intelligence.',
    status: 'live',
    featured: false,
    tech: ['React', 'Node.js', 'Docker', 'Gemini AI', 'PDF.js', 'Redis', 'REST API'],
    features: [
      'PDF and DOCX document uploading and automated text parsing via PDF.js.',
      'ATS compatibility scoring algorithm checking structure, layout, and keyword density.',
      'AI-powered gap analysis comparing resume highlights against targeted job descriptions.',
      'Actionable, section-by-section improvement suggestions generated by LLMs.',
      'Automatic entity-extraction classifying tech skills, credentials, and languages.',
      'Downloadable, styled analysis report with visual score meters.',
      'Fully containerized local deployment using Docker and multi-container Docker Compose.'
    ],
    github: 'https://github.com/Rohitkohli28/ai-resume-analyzer',
    preview: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #db2777 100%)',
    architecture: 'React UI (Tailwind) ──► Node API Service (Express) ──► Redis (Caching) ──► Gemini AI (Evaluation)'
  },
  {
    id: 'real-time-chat-app',
    number: '03',
    title: 'Real-Time Chat Application',
    tagline: 'MERN Chat with Voice Commands & WebSockets',
    description: 'A full-stack, responsive communication platform equipped with a Voice Command engine utilizing the Web Speech API. Built with React, Node.js, Express, Socket.io, and MongoDB, it supports dynamic chat rooms, typing indicators, read receipts, message deletion, and online user tracking.',
    status: 'live',
    featured: false,
    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT', 'Web Speech API', 'Tailwind CSS', 'Express'],
    features: [
      'Real-time bidirectional message streaming powered by Socket.io WebSockets.',
      'Voice Command integration with 15+ navigation, UI theme, and messaging commands.',
      'Secure JWT session authentication with auto-login and registration workflows.',
      'Robust persistent storage using MongoDB database and Mongoose schemas.',
      'Active feedback indicators including typing alerts and read receipts.',
      'Interactive controls for message deletion and tracking online user counts.'
    ],
    github: 'https://github.com/Rohitkohli28/real-time-chat-app',
    demo: 'https://rohit-chat-app.vercel.app',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #e94560 100%)',
    architecture: 'React Client (Vite) ──► Express API Service ──► Socket.io WebSockets ──► Mongoose / MongoDB'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'gcloud-hack',
    title: 'Google Cloud Hackathon',
    issuer: 'National Level Hackathon',
    date: '2024',
    impact: 'Developed an innovative AI-driven educational platform leveraging Gemini API, gaining recognition in the top national ranks.',
    iconName: 'Cloud',
    accent: '#4285F4'
  },
  {
    id: 'elite-coder',
    title: 'Elite Coders Winter of Code',
    issuer: 'Algorithmic Bootcamp',
    date: '2023',
    impact: 'Honored as a top performer for executing high-efficiency Java solutions for advanced graph and tree structures.',
    iconName: 'Award',
    accent: '#10B981'
  },
  {
    id: 'azure-developer',
    title: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    date: '2024',
    impact: 'Validated proficiency in designing, building, testing, and maintaining secure, scalable cloud applications and APIs on Microsoft Azure.',
    iconName: 'Shield',
    accent: '#008AD7'
  },
  {
    id: 'meta-frontend',
    title: 'Meta Frontend Developer Certificate',
    issuer: 'Coursera / Meta',
    date: '2023',
    impact: 'Rigorous professional certification program covering advanced React patterns, unit testing with Jest, and UI design.',
    iconName: 'Code',
    accent: '#0668E1'
  },
  {
    id: 'ibm-data-science',
    title: 'IBM Data Science Professional',
    issuer: 'IBM',
    date: '2023',
    impact: 'Acquired core competencies in data analysis, predictive modeling, high-efficiency SQL database structures, and storytelling.',
    iconName: 'Database',
    accent: '#052FAD'
  },
  {
    id: 'aicte-neat',
    title: 'AICTE NEAT Internship',
    issuer: 'Govt. of India recognized',
    date: '2023',
    impact: 'Selected for state-level technological training, completing microservices architecture and client-server project briefs.',
    iconName: 'FileCheck',
    accent: '#EF4444'
  },
  {
    id: 'servicenow-cert',
    title: 'ServiceNow Certified Developer',
    issuer: 'ServiceNow',
    date: '2024',
    impact: 'Certified platform developer credentials for script inclusions, custom widgets, client scripts, and system integrations.',
    iconName: 'Settings',
    accent: '#81C784'
  }
];
