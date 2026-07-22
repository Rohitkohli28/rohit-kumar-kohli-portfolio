/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { sendChatMessage, ChatMessagePayload } from '../services/gemini';
import { ChatMessageData } from '../components/AIChat/ChatMessage';

const INITIAL_MESSAGE: ChatMessageData = {
  id: 'welcome-init',
  sender: 'bot',
  text: "Hi! I'm Rohit's AI Portfolio Assistant. I can answer questions about his skills, projects, education, experience, certifications, resume, and contact details.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([INITIAL_MESSAGE]);

  useEffect(() => {
    const visited = localStorage.getItem('ai_chat_visited');
    if (visited) {
      setHasVisited(true);
    }
  }, []);

  const toggleChat = useCallback(() => {
    if (!isOpen && !hasVisited) {
      localStorage.setItem('ai_chat_visited', 'true');
      setHasVisited(true);
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, hasVisited]);

  const clearChat = useCallback(() => {
    setMessages([{
      ...INITIAL_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput('');
  }, []);

  const sendMessage = useCallback(async (textOverride?: string) => {
    const query = (textOverride || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setIsLoading(true);

    // Build payload history for context awareness
    const historyPayload: ChatMessagePayload[] = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    try {
      const response = await sendChatMessage(query, historyPayload);

      const botMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        cardType: response.cardType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat hook error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "AI assistant is temporarily unavailable.",
          cardType: 'none',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return {
    isOpen,
    hasVisited,
    input,
    setInput,
    isLoading,
    messages,
    toggleChat,
    clearChat,
    sendMessage
  };
}
