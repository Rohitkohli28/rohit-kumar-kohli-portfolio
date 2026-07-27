import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI | null {
  if (!aiClient && env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'rohit-portfolio-backend' } }
    });
  }
  return aiClient;
}

export async function analyzeSymptomsService(params: {
  symptoms: string;
  gender?: string;
  age?: string;
  duration?: string;
}) {
  const ai = getGemini();
  if (ai) {
    try {
      const prompt = `
        You are a clinical assistant integrated into Rohit's Doctor Appointment System app.
        Analyze the following symptoms and provide a summary of potential considerations, recommendations, and target specialists.
        
        Patient Profile:
        - Gender: ${params.gender || 'Not specified'}
        - Age: ${params.age || 'Not specified'}
        - Duration: ${params.duration || 'Not specified'}
        - Symptoms: "${params.symptoms}"

        Return JSON format:
        {
          "analysis": "Clinical overview based on symptoms.",
          "possibilities": ["Possibility 1", "Possibility 2"],
          "recommendedSpecialist": "Type of doctor (e.g. Cardiologist, General Physician)",
          "urgency": "Low | Medium | High | Emergency",
          "nextSteps": ["Step 1", "Step 2"],
          "disclaimer": "Demonstration AI tool built by Rohit Kumar Kohli..."
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err: any) {
      logger.warn('[Gemini Symptom Analyzer Error]:', err.message);
    }
  }

  // Fallback Response
  return {
    analysis: `Demultiplexed symptoms analysis for: "${params.symptoms}". Symptoms indicate potential mild physiological irritation or localized standard inflammation. Recommend observing for 48 hours.`,
    possibilities: ['Localized Tension/Strain', 'Mild Viral/Bacterial Response', 'Environmental Hypersensitivity'],
    recommendedSpecialist: 'General Physician / Family Doctor',
    urgency: 'Medium',
    nextSteps: [
      'Monitor temperature hourly',
      'Maintain high fluid intake (2.5L+ hydration)',
      'Schedule a consultation if symptoms persist beyond 72 hours'
    ],
    disclaimer: 'This symptom summary is simulated offline by Rohit Kumar Kohli’s portfolio service. Always consult a certified healthcare professional before making clinical decisions.'
  };
}

export async function analyzeResumeService(params: {
  resumeText: string;
  jobDescription?: string;
}) {
  const ai = getGemini();
  if (ai) {
    try {
      const prompt = `
        You are an expert HR systems consultant and ATS optimization engine integrated into Rohit's AI Resume Analyzer app.
        Analyze the provided resume text against the target job description.
        
        Resume text: "${params.resumeText}"
        Target job description: "${params.jobDescription || 'Full Stack Software Engineer / Java Developer'}"

        Return JSON format:
        {
          "score": 85,
          "gaps": ["Required skill 1", "Required skill 2"],
          "strengths": ["Strength 1", "Strength 2"],
          "improvements": [
            { "section": "Experience", "feedback": "Detailed feedback..." },
            { "section": "Skills", "feedback": "Detailed feedback..." }
          ],
          "overallFeedback": "Executive summary of match status."
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err: any) {
      logger.warn('[Gemini Resume Analyzer Error]:', err.message);
    }
  }

  // Fallback Response
  return {
    score: 82,
    gaps: ['Continuous Integration (CI/CD)', 'System Design Patterns', 'Unit Testing (Jest/JUnit)'],
    strengths: ['Strong core Java engineering foundation', 'Full stack internship accomplishments', 'ServiceNow workflow design knowledge'],
    improvements: [
      { section: 'Header/Contact', feedback: 'Include a direct hyperlink to your verified portfolio and LeetCode link.' },
      { section: 'Skills Matrix', feedback: 'Explicitly category-sort front-end vs back-end frameworks for ATS parsers.' },
      { section: 'Achievements', feedback: 'Quantify impact. Specify exact performance gains or optimization metrics.' }
    ],
    overallFeedback: 'This is an excellent resume showing a high potential for modern full-stack development, especially in enterprise Java and MERN environments.'
  };
}

export async function chatAssistantService(params: {
  message: string;
  history?: Array<{ role: string; content: string }>;
}) {
  const query = params.message.trim().toLowerCase();

  // Load knowledge base from frontend data file if available
  let knowledge: any = {};
  try {
    const kPath = path.join(process.cwd(), '..', 'src', 'data', 'knowledge.json');
    if (fs.existsSync(kPath)) {
      knowledge = JSON.parse(fs.readFileSync(kPath, 'utf8'));
    }
  } catch (err) {
    logger.warn('Failed loading knowledge.json in backend:', err);
  }

  const owner = knowledge.owner || {};

  // Intent classification
  let cardType: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none' = 'none';
  if (/resume|cv|download resume|download cv/i.test(query)) cardType = 'resume';
  else if (/project|portfolio|app|doctor|chat|resume analyzer|work|built/i.test(query)) cardType = 'projects';
  else if (/skill|tech|stack|language|framework|java|react|node|mongo|azure/i.test(query)) cardType = 'skills';
  else if (/experience|internship|celebal|smartbridge|smarted|job/i.test(query)) cardType = 'experience';
  else if (/contact|email|hire|reach|linkedin|github|phone/i.test(query)) cardType = 'contact';
  else if (/certificate|certifications|achievement|award|aws|meta/i.test(query)) cardType = 'certifications';

  const ai = getGemini();
  if (ai) {
    try {
      const formattedHistory = (params.history || [])
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
        .join('\n');

      const systemPrompt = `
        You are Rohit's AI Portfolio Assistant. Answer questions about Rohit Kumar Kohli (his background, skills, education, projects, work experience, certifications, resume, and contact details).
        
        KNOWLEDGE BASE:
        ${JSON.stringify(knowledge, null, 2)}
        
        History:
        ${formattedHistory}

        User Question: "${params.message}"
        Format in Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: systemPrompt
      });

      if (response.text) {
        return { reply: response.text.trim(), cardType };
      }
    } catch (err: any) {
      logger.warn('[Gemini Chat Error]:', err.message);
    }
  }

  // Fallback RAG answers
  let reply = "";
  if (/how are you|how do you do|what's up|hi|hello|hey/i.test(query)) {
    reply = "Hello! 👋 I'm Rohit's AI Portfolio Assistant. Feel free to ask about Rohit's skills, projects, experience, education, or resume!";
  } else if (cardType === 'resume') {
    reply = "Here is Rohit's official resume. You can preview or download the PDF directly below!";
  } else if (cardType === 'projects') {
    reply = "Rohit has engineered production apps including the Doctor Appointment System, AI Resume Analyzer, and Real-Time Chat App. Check out the project cards below:";
  } else if (cardType === 'skills') {
    reply = "Rohit is strongest in Java (90% proficiency) and highly skilled in React 19, TypeScript, Node.js, Express, MongoDB, AWS, Docker, and Socket.IO.";
  } else if (cardType === 'experience') {
    reply = "Rohit has completed software engineering internships at SmartBridge (ServiceNow) and SmartED Innovations (Full Stack Web Development).";
  } else if (cardType === 'contact') {
    reply = `You can reach out to Rohit directly via email at **${owner.email || 'kohlirohit2428@gmail.com'}**, or connect on GitHub and LinkedIn.`;
  } else {
    reply = `Rohit Kumar Kohli is a Full-Stack Software Engineer specializing in Java and the MERN stack (8.18 CGPA at DIT University). Ask about his skills, projects, experience, or resume!`;
  }

  return { reply, cardType };
}
