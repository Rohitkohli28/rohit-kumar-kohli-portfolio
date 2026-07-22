/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getKnowledge, KnowledgeBase } from './knowledge';

export interface RAGResult {
  isOutOfScope: boolean;
  outOfScopeMessage?: string;
  context: string;
  cardType: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none';
  intent: string;
}

const OUT_OF_SCOPE_REGEX = /weather|politics|movie|film|joke|funny|leetcode|solve|code for me|python script for|recipe|cooking|president|football|cricket/i;

export function retrieveRAGContext(query: string): RAGResult {
  const q = query.trim().toLowerCase();
  const knowledge = getKnowledge();

  // 1. Out of Scope Check
  if (OUT_OF_SCOPE_REGEX.test(q)) {
    return {
      isOutOfScope: true,
      outOfScopeMessage: "I'm specifically designed to answer questions about Rohit's professional profile, projects, skills, experience, education, certifications, and resume.",
      context: '',
      cardType: 'none',
      intent: 'out_of_scope'
    };
  }

  // 2. Intent & Card Type Classification
  let cardType: RAGResult['cardType'] = 'none';
  let intent = 'general';
  let contextChunks: string[] = [];

  // Resume intent
  if (/resume|cv|download resume|download cv|show resume/i.test(q)) {
    cardType = 'resume';
    intent = 'resume';
    contextChunks.push(`Resume PDF available at: ${knowledge.owner.resumePdf}. Summary: ${knowledge.summary.bio}`);
  }
  // Projects intent
  else if (/project|portfolio|app|doctor|chat|resume analyzer|work|built|completed/i.test(q)) {
    cardType = 'projects';
    intent = 'projects';
    contextChunks.push(`Total completed projects: ${knowledge.summary.totalProjects}. Projects list: ${JSON.stringify(knowledge.projects)}`);
  }
  // Skills & Strongest language intent
  else if (/skill|tech|stack|language|framework|java|react|node|mongo|azure|strongest/i.test(q)) {
    cardType = 'skills';
    intent = 'skills';
    contextChunks.push(`Strongest language: ${knowledge.owner.strongestLanguage}. Skills: ${JSON.stringify(knowledge.skills)}`);
  }
  // Experience & Internships intent
  else if (/experience|internship|celebal|smartbridge|smarted|job|work history/i.test(q)) {
    cardType = 'experience';
    intent = 'experience';
    contextChunks.push(`Work & Internship Experience: ${JSON.stringify(knowledge.experiences)}`);
  }
  // Contact intent
  else if (/contact|email|hire|reach|linkedin|github|phone|location/i.test(q)) {
    cardType = 'contact';
    intent = 'contact';
    contextChunks.push(`Contact Details: Email=${knowledge.owner.email}, GitHub=${knowledge.owner.github}, LinkedIn=${knowledge.owner.linkedin}, Location=${knowledge.owner.location}`);
  }
  // Certifications & Achievements intent
  else if (/certificate|certifications|achievement|award|google cloud|meta|hackathon/i.test(q)) {
    cardType = 'certifications';
    intent = 'certifications';
    contextChunks.push(`Certifications & Hackathon Ranks: ${JSON.stringify(knowledge.certifications)}`);
  }
  // About / Overview intent
  else if (/tell me about|who is rohit|about|profile|intro|introduce|background/i.test(q)) {
    intent = 'about';
    contextChunks.push(`Owner: ${JSON.stringify(knowledge.owner)}, Summary: ${JSON.stringify(knowledge.summary)}, Education: ${JSON.stringify(knowledge.education)}`);
  }
  // General RAG Fallback - Search FAQs
  else {
    const matchedFaq = knowledge.faqs.find((f) => 
      f.question.toLowerCase().includes(q) || q.includes(f.question.toLowerCase())
    );
    if (matchedFaq) {
      contextChunks.push(`FAQ Match: Q="${matchedFaq.question}" A="${matchedFaq.answer}"`);
    } else {
      contextChunks.push(`Full Profile: Owner=${JSON.stringify(knowledge.owner)}, Skills=${JSON.stringify(knowledge.skills)}, Projects=${JSON.stringify(knowledge.projects)}`);
    }
  }

  return {
    isOutOfScope: false,
    context: contextChunks.join('\n\n'),
    cardType,
    intent
  };
}
