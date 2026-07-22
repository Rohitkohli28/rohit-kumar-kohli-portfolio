/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Briefcase, 
  Code2, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { PROJECTS, SKILLS, EXPERIENCES, ACHIEVEMENTS } from '../../data';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  cardType?: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none';
  timestamp: string;
}

const QUICK_CHIPS = [
  'Tell me about Rohit',
  'Show projects',
  'Skills',
  'Experience',
  'Download resume',
  'Certifications',
  'Contact'
];

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hi! I'm Rohit's AI Portfolio Assistant. I can answer questions about his skills, projects, education, experience, certifications, resume, and contact details.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Track first visit for button pulse
  useEffect(() => {
    const visited = localStorage.getItem('chatbot_visited');
    if (!visited) {
      setHasVisited(false);
    } else {
      setHasVisited(true);
    }
  }, []);

  const toggleChat = () => {
    if (!isOpen && !hasVisited) {
      localStorage.setItem('chatbot_visited', 'true');
      setHasVisited(true);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });
      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I don't have that information in my knowledge base.",
        cardType: data.cardType || 'none',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "I don't have that information in my knowledge base.",
          cardType: 'none',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING CIRCULAR CHATBOT BUTTON */}
      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-3 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-mono font-semibold text-text shadow-xl flex items-center gap-2"
            >
              <Sparkles size={13} className="text-accent animate-pulse" />
              <span>Ask me anything about Rohit</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleChat}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
            isOpen 
              ? 'bg-card border border-border text-text' 
              : 'bg-gradient-to-r from-primary via-secondary to-accent text-white'
          }`}
          aria-label="Toggle AI Assistant Chat"
        >
          {/* Animated Pulse Ring on first visit */}
          {!hasVisited && !isOpen && (
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="relative">
              <Bot size={26} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-bg" />
            </div>
          )}
        </motion.button>
      </div>

      {/* 2. CHATBOT WINDOW DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 md:right-6 w-[92vw] sm:w-[420px] h-[600px] max-h-[82vh] bg-bg/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl z-[9990] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-bg-secondary/90 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-md">
                  <div className="w-full h-full bg-bg rounded-[14px] flex items-center justify-center text-primary">
                    <Bot size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-text flex items-center gap-1.5">
                    Rohit's AI Assistant
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                      RAG Engine
                    </span>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online • Instant Answers</span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleChat}
                className="p-2 rounded-xl text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
                aria-label="Close Assistant Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body (Message Thread) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs md:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white font-medium rounded-br-xs shadow-md'
                        : 'bg-card border border-border text-text-sub rounded-bl-xs shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {/* RICH INTERACTIVE CARDS */}
                    {msg.sender === 'bot' && msg.cardType === 'resume' && (
                      <div className="mt-3 p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-3 font-mono text-xs">
                        <div className="flex items-center gap-2 text-text font-bold">
                          <FileText size={16} className="text-primary" />
                          <span>Rohit_Kumar_Kohli_Resume.pdf</span>
                        </div>
                        <p className="text-[11px] text-muted font-sans">
                          Official single-page full-stack developer resume detailing production projects, Java engineering background, and AWS/Azure cloud skills.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <a
                            href="/Rohit_Kumar_Kohli_Resume.pdf"
                            download="Rohit_Kumar_Kohli_Resume.pdf"
                            className="flex-1 px-3 py-2 bg-primary hover:bg-primary-dim text-white font-mono font-bold text-[10px] rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          >
                            <Download size={12} /> Download PDF
                          </a>
                          <a
                            href="/Rohit_Kumar_Kohli_Resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 border border-border bg-card hover:bg-card/80 text-text font-mono text-[10px] rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ExternalLink size={12} /> View
                          </a>
                        </div>
                      </div>
                    )}

                    {msg.sender === 'bot' && msg.cardType === 'projects' && (
                      <div className="mt-3 space-y-2.5">
                        {PROJECTS.map((p) => (
                          <div key={p.id} className="p-3 rounded-xl border border-border bg-bg-secondary space-y-2">
                            <div className="flex justify-between items-start">
                              <h6 className="font-heading font-bold text-xs text-text">{p.title}</h6>
                              <span className="text-[9px] font-mono text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                                {p.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted leading-snug line-clamp-2">{p.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {p.tech.slice(0, 4).map((t) => (
                                <span key={t} className="text-[9px] font-mono text-muted bg-card px-2 py-0.5 rounded border border-border">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-text hover:text-primary flex items-center gap-1"
                              >
                                <Github size={11} /> Code
                              </a>
                              {p.demo && (
                                <a
                                  href={p.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-mono text-primary font-bold hover:underline flex items-center gap-1 ml-auto"
                                >
                                  Live Demo <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.sender === 'bot' && msg.cardType === 'skills' && (
                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {SKILLS.map((s) => (
                            <span key={s.name} className="px-2.5 py-1 rounded-lg bg-bg-secondary border border-border text-[10px] font-mono text-text flex items-center gap-1">
                              <span>{s.icon}</span>
                              <span>{s.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.sender === 'bot' && msg.cardType === 'experience' && (
                      <div className="mt-3 space-y-2.5">
                        {EXPERIENCES.map((exp, i) => (
                          <div key={i} className="p-3 rounded-xl border border-border bg-bg-secondary space-y-1">
                            <div className="flex justify-between items-start">
                              <h6 className="font-heading font-bold text-xs text-text">{exp.role}</h6>
                              <span className="text-[9px] font-mono text-muted">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-[11px] font-mono text-primary">{exp.company}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.sender === 'bot' && msg.cardType === 'contact' && (
                      <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
                        <a
                          href="mailto:kohlirohit2428@gmail.com"
                          className="p-2.5 rounded-xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors"
                        >
                          <Mail size={14} className="text-primary" /> Email Rohit
                        </a>
                        <a
                          href="https://github.com/Rohitkohli28"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors"
                        >
                          <Github size={14} className="text-accent" /> GitHub
                        </a>
                        <a
                          href="https://linkedin.com/in/rohitkumarkohli"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl border border-border bg-bg-secondary hover:bg-card text-text flex items-center gap-2 transition-colors"
                        >
                          <Linkedin size={14} className="text-blue-400" /> LinkedIn
                        </a>
                        <a
                          href="#contact"
                          onClick={() => setIsOpen(false)}
                          className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary font-bold flex items-center gap-2 transition-colors"
                        >
                          <UserCheck size={14} /> Hire Me
                        </a>
                      </div>
                    )}

                  </div>
                  <span className="text-[9px] font-mono text-muted mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-muted font-mono text-xs p-2">
                  <Bot size={14} className="animate-spin text-primary" />
                  <span>Rohit's AI is searching knowledge base...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="px-4 py-2 border-t border-border/60 bg-bg-secondary/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg border border-border bg-card/60 hover:bg-card text-[10px] font-mono text-text-sub hover:text-primary transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-bg-secondary border-t border-border flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects, resume..."
                disabled={isLoading}
                className="flex-1 bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-text placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-primary hover:bg-primary-dim text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
