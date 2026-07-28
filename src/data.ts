/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, Experience, Achievement, BadgeItem, HackathonItem } from './types';

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
    id: 'india-ai-impact-buildathon',
    title: 'India AI Impact Buildathon',
    issuer: 'GUVI x HCL',
    date: 'Feb 2026',
    impact: 'Participated in national AI buildathon creating impactful solutions leveraging machine learning and AI technologies.',
    iconName: 'Award',
    accent: '#00C853',
    credentialId: '167lmEON42q9by1e17',
    verifyUrl: 'https://www.guvi.in/share-certificate/167lmEON42q9by1e17'
  },
  {
    id: 'tvs-credit-epic',
    title: 'TVS Credit EPIC 7.0 – IT Challenge',
    issuer: 'TVS Credit Services Ltd.',
    date: 'Oct 2025',
    impact: 'Competed in national IT challenge solving complex enterprise engineering and business technology problems.',
    iconName: 'Trophy',
    accent: '#3F51B5'
  },
  {
    id: 'bhartiya-antariksh-hackathon',
    title: 'Certificate of Acknowledgement – Bhartiya Antariksh Hackathon 2025',
    issuer: 'ISRO & H2S Hackathon',
    date: 'Sep 2025',
    impact: 'Recognized by ISRO for innovative technological contributions in space technology and satellite data applications.',
    iconName: 'Rocket',
    accent: '#FF9800',
    credentialId: '2025H2S06BAH25-P01666'
  },
  {
    id: 'hackground-india-2k25',
    title: 'Certificate of Participation in Hackground India 2K25',
    issuer: 'Unstop',
    date: 'Sep 2025',
    impact: 'Engaged in competitive national hackathon developing real-world software prototypes under tight deadlines.',
    iconName: 'Code',
    accent: '#10B981',
    credentialId: 'f80474ac-8c23-4ab4-aca2-48dd89f24abe'
  },
  {
    id: 'nextgen-pm',
    title: 'NextGen PM: National Product Management Championship',
    issuer: 'Unstop',
    date: 'Aug 2025',
    impact: 'Demonstrated strategic product roadmap planning, user research analysis, and feature prioritization.',
    iconName: 'Layers',
    accent: '#EC4899',
    credentialId: '536c0ffd-84dc-4908-93ce-03299cc48460'
  },
  {
    id: 'aws-ai-solutions',
    title: 'AWS Services for AI Solutions',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Jul 2025',
    impact: 'Mastered building scalable AI/ML pipelines, cloud inference endpoints, and intelligent web integrations using AWS cloud services.',
    iconName: 'Cloud',
    accent: '#FF9900',
    credentialId: 'TJQEF0FJAW8P'
  },
  {
    id: 'goldman-sachs-operations',
    title: 'Operations Job Simulation',
    issuer: 'Goldman Sachs',
    date: 'Jun 2025',
    impact: 'Completed practical operational workflows, process automation, and risk analysis simulations for global financial services.',
    iconName: 'Briefcase',
    accent: '#60A5FA',
    credentialId: 'Sj5k69CWT7NQwYQcB'
  },
  {
    id: 'walmart-software-eng',
    title: 'Advanced Software Engineering Simulation',
    issuer: 'Walmart Global Tech',
    date: 'Jun 2025',
    impact: 'Solved enterprise architecture challenges, data structure optimization, and high-concurrency system design scenarios.',
    iconName: 'Terminal',
    accent: '#0071CE',
    credentialId: 'E3xvxyvnjtABoYawP'
  },
  {
    id: 'ibm-generative-ai',
    title: 'Generative AI: Introduction and Applications',
    issuer: 'IBM',
    date: 'Jun 2025',
    impact: 'Gained comprehensive expertise in foundational LLM architectures, fine-tuning methodologies, and enterprise AI implementation.',
    iconName: 'Cpu',
    accent: '#052FAD',
    credentialId: '955G8L2AZ180'
  },
  {
    id: 'google-cybersecurity',
    title: 'Foundations of Cybersecurity',
    issuer: 'Google',
    date: 'Jun 2025',
    impact: 'Acquired core competencies in network security, threat modeling, SIEM tools, and security compliance frameworks.',
    iconName: 'Shield',
    accent: '#4285F4',
    credentialId: 'QNNSWGK2TYQ9'
  },
  {
    id: 'deloitte-cyber',
    title: 'Cyber Job Simulation',
    issuer: 'Deloitte',
    date: 'Jun 2025',
    impact: 'Executed cybersecurity incident response analysis, vulnerability assessment, and enterprise security consulting tasks.',
    iconName: 'Shield',
    accent: '#86BC25',
    credentialId: '56jLKiShgz4SkXQFJ'
  },
  {
    id: 'aws-certifications',
    title: 'AWS Certifications',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Jun 2025',
    impact: 'Validated foundational cloud infrastructure deployment, IAM security configurations, and serverless compute patterns.',
    iconName: 'Cloud',
    accent: '#FF9900',
    credentialId: '5wRd3cekiyp9HFdbd'
  },
  {
    id: 'ibm-prompt-engineering',
    title: 'Generative AI: Prompt Engineering Basics',
    issuer: 'IBM',
    date: 'May 2025',
    impact: 'Learned advanced prompt structure design, zero/few-shot techniques, and guardrailing strategies for generative AI applications.',
    iconName: 'Sparkles',
    accent: '#0F62FE',
    credentialId: 'NI0HT7D675TO'
  },
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
    id: 'servicenow-cert',
    title: 'ServiceNow Certified Developer',
    issuer: 'ServiceNow',
    date: '2024',
    impact: 'Certified platform developer credentials for script inclusions, custom widgets, client scripts, and system integrations.',
    iconName: 'Settings',
    accent: '#81C784'
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
    id: 'elite-coder',
    title: 'Elite Coders Winter of Code',
    issuer: 'Algorithmic Bootcamp',
    date: '2023',
    impact: 'Honored as a top performer for executing high-efficiency Java solutions for advanced graph and tree structures.',
    iconName: 'Award',
    accent: '#10B981'
  }
];

export const BADGES: BadgeItem[] = [
  {
    id: 'quant-aptitude-bronze',
    title: 'Quantitative Aptitude Bronze Badge',
    organization: 'Naukri Campus',
    issuedDate: 'June 2026',
    category: 'Aptitude • Quantitative',
    description: 'Earned for building a strong foundation in quantitative aptitude, numerical reasoning, and mathematical problem-solving.',
    buttonText: 'Show Credential',
    verifyLink: 'https://www.naukri.com/campus',
    badgeType: 'badge',
    iconName: 'Medal',
    accentColor: '#CD7F32'
  },
  {
    id: 'gcloud-conversation-design',
    title: 'Conversation Design Fundamentals',
    organization: 'Google Cloud',
    issuedDate: 'August 7, 2025',
    category: 'AI • Conversational AI',
    description: 'Learned the fundamentals of designing effective conversational experiences, user interaction flows, and AI-powered dialogue systems.',
    buttonText: 'Learn More',
    verifyLink: 'https://cloud.google.com/training/badges',
    iconName: 'MessageSquareCode',
    accentColor: '#4285F4'
  },
  {
    id: 'gcloud-intro-generative-ai',
    title: 'Introduction to Generative AI',
    organization: 'Google Cloud',
    issuedDate: 'June 8, 2025',
    category: 'Generative AI',
    description: 'Completed Google\'s introductory program covering Large Language Models, Generative AI concepts, and practical AI applications.',
    buttonText: 'Learn More',
    verifyLink: 'https://cloud.google.com/training/badges',
    iconName: 'Sparkles',
    accentColor: '#34A853'
  },
  {
    id: 'ulsa-ai-appreciation',
    title: 'AI Appreciation Badge',
    organization: 'United Latino Students Association',
    issuedDate: 'July 2025',
    category: 'Artificial Intelligence',
    description: 'Recognizes foundational understanding of Artificial Intelligence concepts and emerging AI technologies.',
    buttonText: 'Show Credential',
    verifyLink: 'https://www.credly.com/',
    iconName: 'Award',
    accentColor: '#8B5CF6'
  },
  {
    id: 'ulsa-ai-aware',
    title: 'AI Aware Badge',
    organization: 'United Latino Students Association',
    issuedDate: 'July 2025',
    category: 'Artificial Intelligence',
    description: 'Awarded for demonstrating awareness of AI fundamentals, ethical considerations, and practical applications.',
    buttonText: 'Show Credential',
    verifyLink: 'https://www.credly.com/',
    iconName: 'ShieldCheck',
    accentColor: '#06B6D4'
  },
  {
    id: 'naukri-ssc-cgl-achievement',
    title: 'SSC CGL #8 Competition Achievement',
    organization: 'Naukri Campus',
    issuedDate: '2025',
    category: 'Competitive Achievement',
    description: 'Successfully participated in the Crack Government Exam (SSC CGL) #8 competition and secured Rank #10 among 22,458 participants nationwide, demonstrating strong analytical thinking, consistency, and problem-solving skills.',
    buttonText: 'Show Credential',
    verifyLink: 'https://www.naukri.com/campus',
    badgeType: 'achievement',
    iconName: 'Trophy',
    accentColor: '#F59E0B'
  },
  {
    id: 'ai-for-all',
    title: 'AI For All',
    organization: 'Intel & Govt. of India',
    issuedDate: '2025',
    category: 'AI Literacy',
    description: 'Appreciation badge for completing the national AI awareness initiative, understanding core AI concepts and ethical social impacts.',
    buttonText: 'Show Credential',
    verifyLink: 'https://ai-for-all.in/',
    badgeType: 'badge',
    iconName: 'Globe',
    accentColor: '#0071C5'
  },
  {
    id: 'future-ready',
    title: 'Future Ready Tech Certification',
    organization: 'Microsoft & Edunet Foundation',
    issuedDate: '2025',
    category: 'Cloud & Emerging Tech',
    description: 'Certified for completing future-ready technology skills training in cloud computing, modern software architectures, and AI tools.',
    buttonText: 'Show Credential',
    verifyLink: 'https://microsoft.com/',
    badgeType: 'badge',
    iconName: 'Compass',
    accentColor: '#00A4EF'
  }
];

export const HACKATHONS: HackathonItem[] = [
  {
    id: 'nextgen-pm-championship',
    title: 'NextGen PM – National Product Management Championship',
    organizer: 'Book My Mentor',
    category: 'Product Management',
    categoryChip: '📊 Product Management',
    achievement: '🏅 Secured 4th Rank Nationwide',
    description: 'Secured 4th Rank nationally, showcasing excellence in product strategy, user-centric thinking, business analysis, and structured problem solving in a competitive national-level championship.',
    date: '2025',
    featured: true,
    verifyLink: 'https://unstop.com/certificate',
    accentColor: '#F59E0B',
    iconName: 'Trophy'
  },
  {
    id: 'superhack-2025',
    title: 'SuperHack 2025',
    organizer: 'SuperOps + AWS + Hack2Skill',
    category: 'AI Hackathon',
    categoryChip: '🤖 AI Hackathon',
    achievement: 'Certificate of Participation',
    description: 'Participated in SuperHack 2025, contributing to the development of AI-powered solutions for real-world IT management challenges while collaborating on innovative ideas.',
    date: '2025',
    verifyLink: 'https://hack2skill.com/',
    accentColor: '#3B82F6',
    iconName: 'Cpu'
  },
  {
    id: 'genai-exchange-hackathon',
    title: 'Gen AI Exchange Hackathon',
    organizer: 'Google Cloud + Hack2Skill',
    category: 'Generative AI',
    categoryChip: '🤖 AI Hackathon',
    achievement: 'Prototype Submission',
    description: 'Built and submitted an AI-powered prototype for the "Personalized Career & Skills Advisor" problem statement, contributing to AI innovation through Google Cloud\'s Gen AI Exchange Hackathon.',
    date: '2025',
    verifyLink: 'https://cloud.google.com/',
    accentColor: '#4285F4',
    iconName: 'Sparkles'
  },
  {
    id: 'bhartiya-antariksh-hackathon-comp',
    title: 'Bharatiya Antariksh Hackathon',
    organizer: 'ISRO + Hack2Skill',
    category: 'Space Technology',
    categoryChip: '🌌 Space Tech',
    achievement: 'Idea Submission',
    description: 'Successfully submitted an innovative solution for the Bharatiya Antariksh Hackathon, focusing on solving real-world space technology challenges through creative thinking and engineering.',
    date: '2025',
    verifyLink: 'https://isro.gov.in/',
    accentColor: '#FF9800',
    iconName: 'Rocket'
  },
  {
    id: 'ai-agents-that-build',
    title: 'AI Agents That Build',
    organizer: 'AugmentAppz',
    category: 'AI Hackathon',
    categoryChip: '🤖 AI Hackathon',
    achievement: 'Participation',
    description: 'Participated in AI HackFest focused on building intelligent AI Agents using the qRaptor Low-Code / No-Code GenAI platform.',
    date: '2025',
    verifyLink: 'https://augmentappz.com/',
    accentColor: '#8B5CF6',
    iconName: 'Bot'
  },
  {
    id: 'hackathon-irs-2026',
    title: 'Hackathon of IRS 2026',
    organizer: 'Indian Institute of Management (IIM), Indore',
    category: 'Innovation Challenge',
    categoryChip: '🚀 Innovation',
    achievement: 'Participation',
    description: 'Participated in Hackathon of IRS 2026 during IIM Indore\'s flagship festival, collaborating on innovative technology-driven solutions.',
    date: '2026',
    verifyLink: 'https://iimidr.ac.in/',
    accentColor: '#EC4899',
    iconName: 'Lightbulb'
  },
  {
    id: 'synapse-neurotech-challenge',
    title: 'Synapse – NeuroTech Challenge',
    organizer: 'IIT Dharwad',
    category: 'AI / NeuroTech',
    categoryChip: '🤖 AI Hackathon',
    achievement: 'Participation',
    description: 'Participated in the Synapse NeuroTech Challenge, exploring innovative applications of AI and emerging technologies in neuroscience-inspired problem solving.',
    date: '2025',
    verifyLink: 'https://iitdh.ac.in/',
    accentColor: '#06B6D4',
    iconName: 'Activity'
  },
  {
    id: 'tvs-credit-epic-comp',
    title: 'TVS Credit EPIC 7.0',
    organizer: 'TVS Credit',
    category: 'Technology Challenge',
    categoryChip: '💻 Software Engineering',
    achievement: 'Participation',
    description: 'Participated in the EPIC 7.0 IT Challenge, solving technology-driven business problems and demonstrating software engineering and analytical skills.',
    date: '2025',
    verifyLink: 'https://tvscredit.com/',
    accentColor: '#3F51B5',
    iconName: 'Code'
  },
  {
    id: 'tatva-hackwave',
    title: 'Tatva HackWave 1.0',
    organizer: 'Lovely Professional University (LPU)',
    category: 'Software Engineering',
    categoryChip: '💻 Software Engineering',
    achievement: 'Participation',
    description: 'Participated in HackWave 1.0, collaborating to design practical software solutions while enhancing teamwork and technical problem-solving abilities.',
    date: '2025',
    verifyLink: 'https://lpu.in/',
    accentColor: '#10B981',
    iconName: 'Terminal'
  },
  {
    id: 'ideathon-2025',
    title: 'Ideathon 2025',
    organizer: 'Vasantdada Patil Pratishthan\'s College of Engineering',
    category: 'Ideathon',
    categoryChip: '💡 Ideathon',
    achievement: 'Participation',
    description: 'Contributed innovative ideas and demonstrated creativity during Ideathon 2025, focusing on technology-enabled solutions for real-world challenges.',
    date: '2025',
    verifyLink: 'https://vppcoe.ac.in/',
    accentColor: '#F59E0B',
    iconName: 'Zap'
  }
];
