/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { retrieveRAGContext } from './rag';
import { getKnowledge } from './knowledge';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatApiResponse {
  reply: string;
  cardType: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none';
  isOutOfScope?: boolean;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessagePayload[] = []
): Promise<ChatApiResponse> {
  // 1. Try Backend API endpoint
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply && data.reply !== "AI assistant is temporarily unavailable.") {
        return data;
      }
    }
  } catch (error) {
    console.warn('Backend API request failed, executing client-side RAG engine:', error);
  }

  // 2. High-Fidelity Client-Side RAG & Conversational Engine
  const rag = retrieveRAGContext(message);
  if (rag.isOutOfScope) {
    return {
      reply: rag.outOfScopeMessage || "I'm specifically designed to answer questions about Rohit's professional profile, projects, skills, experience, education, certifications, and resume.",
      cardType: 'none',
      isOutOfScope: true
    };
  }

  const k = getKnowledge();
  const q = message.trim().toLowerCase();

  let reply = "";

  // Conversational & Small Talk Matchers
  if (/how are you|how do you do|how's it going|how are u|what's up|whats up|how is it going/i.test(q)) {
    reply = "I'm doing great, thank you for asking! 😊 I'm ready to help you explore Rohit's portfolio, projects, skills, and resume. What would you like to know?";
  } else if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|hi there|hello there)$|^(hi|hello|hey)\s!*$/i.test(q)) {
    reply = "Hello! 👋 I'm Rohit's AI Portfolio Assistant. How can I help you today? Feel free to ask about Rohit's skills, projects, experience, education, or resume!";
  } else if (/thank you|thanks|thanku|thx|awesome|great|cool|nice|perfect/i.test(q)) {
    reply = "You're very welcome! 😊 Let me know if you need anything else about Rohit's portfolio, projects, or resume.";
  } else if (/who created you|what can you do|who are you|what is your name|capabilities|help/i.test(q)) {
    reply = "I am Rohit's personal AI Portfolio Assistant! I'm designed to help recruiters, developers, and visitors learn all about Rohit Kumar Kohli — including his Java expertise, 3 production full-stack apps, work experience, education (8.4 CGPA), certifications, and official resume. What would you like to explore?";
  } else if (/bye|goodbye|see ya|see you|have a good day/i.test(q)) {
    reply = "Goodbye! 👋 Thanks for visiting Rohit's portfolio. Have a wonderful day ahead!";
  } 
  // Portfolio FAQ & Knowledge Base Matchers
  else if (/strongest language|strongest programming/i.test(q)) {
    reply = "Rohit is strongest in Java (90% proficiency). He uses Java extensively for core software engineering, data structures & algorithms, object-oriented design, and high-performance backend systems.";
  } else if (/uses ai|use ai|ai project/i.test(q)) {
    reply = "Two of Rohit's projects use AI:\n1. **Doctor Appointment System**: Integrates Google Gemini 3.5 Flash for real-time clinical symptom analysis and urgency classification.\n2. **AI Resume Analyzer**: Uses Gemini AI for ATS resume scoring (0-100), section improvement feedback, and keyword gap analysis.";
  } else if (/how many project|completed project/i.test(q)) {
    reply = "Rohit has completed 3 major production full-stack applications:\n1. Doctor Appointment System (Live at https://rohit-healthcare-appointment.vercel.app)\n2. AI Resume Analyzer\n3. Real-Time Chat Application (Live at https://rohit-chat-app.vercel.app)";
  } else if (/available|hire|internship/i.test(q) && !/experience/i.test(q)) {
    reply = "Yes! Rohit is actively available for full-time Software Engineer, Full Stack Developer, and Data Engineering roles as well as internships.";
  } else if (rag.cardType === 'resume') {
    reply = "Here is Rohit's official resume. You can preview or download the PDF directly below!";
  } else if (rag.cardType === 'projects') {
    reply = "Rohit has engineered 3 production full-stack apps including the Doctor Appointment System, AI Resume Analyzer, and Real-Time Chat App. Check out the project cards below:";
  } else if (rag.cardType === 'skills') {
    reply = "Rohit is strongest in Java (90% proficiency) and highly skilled in React 19, TypeScript, Node.js, Express, MongoDB, Microsoft Azure, Docker, and Socket.IO. Here is his skill matrix:";
  } else if (rag.cardType === 'experience') {
    reply = "Rohit has completed software engineering internships at Celebal Technologies (Data Engineering), SmartBridge (ServiceNow), SmartED Innovations (Full Stack MERN), and Microsoft Azure Cloud Simulation:";
  } else if (rag.cardType === 'contact') {
    reply = `You can reach out to Rohit directly via email at **${k.owner.email}**, or connect on GitHub and LinkedIn:`;
  } else if (rag.cardType === 'certifications') {
    reply = "Rohit holds multiple certifications including Google Cloud Hackathon Top Rank, Microsoft Certified Azure Developer Associate, Meta Frontend Developer Certificate, and ServiceNow Certified Developer.";
  } else if (/tell me about|who is rohit|about|profile|intro|introduce|background/i.test(q)) {
    reply = `### About ${k.owner.name}\n\n${k.owner.about}\n\n- **Role**: ${k.owner.title}\n- **Education**: B.Tech CSE (8.4 CGPA)\n- **Strongest Language**: Java (90%)\n- **Top Projects**: Doctor Appointment System, AI Resume Analyzer, Real-Time Chat App\n- **Location**: ${k.owner.location}\n- **Email**: ${k.owner.email}\n- **GitHub**: [github.com/Rohitkohli28](${k.owner.github})\n- **Status**: ${k.owner.availability}`;
  } else if (/education|college|university|degree|cgpa/i.test(q)) {
    const edu = k.education[0];
    reply = `### Education\n\n- **Degree**: ${edu.degree}\n- **Grade**: ${edu.grade}\n- **Duration**: ${edu.year}\n- **Highlights**: ${edu.highlights}`;
  } else {
    reply = `Rohit Kumar Kohli is a Full Stack Software Engineer skilled in Java, MERN, and Cloud. Ask about his skills, projects, experience, resume, or contact details!`;
  }

  return {
    reply,
    cardType: rag.cardType
  };
}
