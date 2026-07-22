/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow() {
  const {
    isOpen,
    hasVisited,
    input,
    setInput,
    isLoading,
    messages,
    toggleChat,
    clearChat,
    sendMessage
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  return (
    <>
      {/* 1. FLOATING CHATBOT BUTTON */}
      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-3 px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-mono font-semibold text-text shadow-xl flex items-center gap-2"
            >
              <Sparkles size={14} className="text-accent animate-pulse" />
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

      {/* 2. CHAT WINDOW DRAWER */}
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

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Reset Chat Session"
                  className="p-2 rounded-xl text-muted hover:text-primary hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
                  aria-label="Reset Chat Session"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 rounded-xl text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
                  aria-label="Close Assistant Chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body (Message Thread) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs md:text-sm">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onActionClick={(action) => {
                    if (action === 'close_chat') toggleChat();
                  }}
                />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompt Chips */}
            <SuggestedPrompts
              onSelectPrompt={(p) => sendMessage(p)}
              disabled={isLoading}
            />

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
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
