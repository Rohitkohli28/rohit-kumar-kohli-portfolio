/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, User, Sparkles, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'read';
  isSystem?: boolean;
}

export default function ChatSimulator() {
  const [channel, setChannel] = useState<'#general' | '#tech-talk' | '#voice-commands'>('#general');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '#general': [
      { id: '1', sender: 'Rohit', text: 'Welcome to ChatApp! Feel free to type or click the microphone to test voice command integrations. 🚀', timestamp: '10:42 AM', status: 'read' },
      { id: '2', sender: 'System', text: 'Voice commands are fully active. Try saying "who is online" or click any suggested commands below.', timestamp: '10:43 AM', status: 'read', isSystem: true }
    ],
    '#tech-talk': [
      { id: '1', sender: 'Rohit', text: 'This channel is for web technologies, sockets, and node backend talk. 💻', timestamp: '09:15 AM', status: 'read' }
    ],
    '#voice-commands': [
      { id: '1', sender: 'System', text: 'Commands guide: "send message hello", "clear message", "who is online", "help". 🎤', timestamp: '10:00 AM', status: 'read', isSystem: true }
    ]
  });

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, channel, isTyping]);

  // Speech-to-text Web Speech API setup
  const runVoiceCommand = (commandText: string) => {
    const cmd = commandText.toLowerCase().trim();
    
    // Add User Message representing the Voice input
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'You (Voice)',
      text: commandText,
      timestamp,
      status: 'read'
    };

    setMessages(prev => ({
      ...prev,
      [channel]: [...prev[channel], userMsg]
    }));

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = '';
      let systemMsg = false;

      if (cmd.includes('who is online')) {
        responseText = '🟢 Online: Rohit, Sarah, Dave, and you. Total: 4 active users.';
        systemMsg = true;
      } else if (cmd.includes('go to general') || cmd.includes('switch room general') || cmd.includes('general')) {
        setChannel('#general');
        responseText = 'Switched to #general room successfully.';
        systemMsg = true;
      } else if (cmd.includes('switch room tech talk') || cmd.includes('tech talk') || cmd.includes('go to tech talk')) {
        setChannel('#tech-talk');
        responseText = 'Switched to #tech-talk room successfully.';
        systemMsg = true;
      } else if (cmd.includes('clear message')) {
        setInput('');
        responseText = 'Cleared current draft input field.';
        systemMsg = true;
      } else if (cmd.includes('help')) {
        responseText = '🎤 Voice Commands: "who is online", "switch room tech talk", "clear message", "dark mode", "send message <text>".';
        systemMsg = true;
      } else if (cmd.startsWith('send message ')) {
        const payload = commandText.slice(13).trim();
        responseText = `Message sent: "${payload}"`;
        // Also send that actual text as a user message
        const subMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'You',
          text: payload,
          timestamp,
          status: 'read'
        };
        setMessages(prev => ({
          ...prev,
          [channel]: [...prev[channel], subMsg]
        }));
        return;
      } else {
        responseText = `Command "${commandText}" recognized but unsupported in this local sandbox. Try clicking a shortcut button below!`;
        systemMsg = true;
      }

      const reply: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'System',
        text: responseText,
        timestamp,
        status: 'read',
        isSystem: systemMsg
      };

      setMessages(prev => ({
        ...prev,
        [channel]: [...prev[channel], reply]
      }));
    }, 1000);
  };

  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Web Speech API not supported in this browser. Please use Chrome/Edge or click shortcuts below!');
      setTimeout(() => setSpeechError(''), 5000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError('');
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setSpeechError('Microphone permission blocked or silent. Use clickable shortcuts below!');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      if (text) {
        runVoiceCommand(text);
      }
    };

    recognition.start();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: input,
      timestamp,
      status: 'read'
    };

    setMessages(prev => ({
      ...prev,
      [channel]: [...prev[channel], newMsg]
    }));
    setInput('');

    // Simulate reactive responses
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Received! WebSockets connection is stable. ⚡",
        "Got it! That looks super clean.",
        "Yes, Socket.io is forwarding this to the MongoDB instance.",
        "Agreed! Voice UI rules are very interesting."
      ];
      const botResponse = responses[Math.floor(Math.random() * responses.length)];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'Rohit',
        text: botResponse,
        timestamp,
        status: 'read'
      };
      setMessages(prev => ({
        ...prev,
        [channel]: [...prev[channel], reply]
      }));
    }, 1200);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-[#1a1a2e]/90 text-white max-w-xl mx-auto flex flex-col h-[400px]">
      {/* Simulator Banner / Header */}
      <div className="bg-[#16213e] px-4 py-3 flex items-center justify-between border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-[#e94560] tracking-wider uppercase">Active Socket Room: {channel}</span>
        </div>
        <div className="flex gap-1.5">
          {['#general', '#tech-talk', '#voice-commands'].map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c as any)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold transition-all ${
                channel === c ? 'bg-[#e94560] text-white' : 'bg-bg-secondary text-muted hover:text-text'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1a1a2e] custom-scrollbar">
        {messages[channel].map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${
              msg.sender === 'You' || msg.sender === 'You (Voice)' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5 px-1">
              <span className="text-[9px] font-mono text-muted">{msg.sender}</span>
              <span className="text-[8px] font-mono text-muted/60">{msg.timestamp}</span>
            </div>
            <div
              className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                msg.isSystem
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  : msg.sender === 'You' || msg.sender === 'You (Voice)'
                  ? 'bg-[#e94560] text-white'
                  : 'bg-[#16213e] text-text-sub border border-border/20'
              }`}
            >
              {msg.text}
            </div>
            {/* Read Receipts */}
            {(msg.sender === 'You' || msg.sender === 'You (Voice)') && (
              <div className="flex items-center gap-0.5 mt-0.5 text-emerald-400 text-[8px] font-mono px-1">
                <CheckCheck size={10} /> read
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 mr-auto max-w-[80%] px-1 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-muted" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="text-[8px] font-mono text-muted">A member is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Error / Assistant Log */}
      {speechError && (
        <div className="bg-red-950/40 border-t border-red-900/30 text-red-300 px-3 py-1.5 text-[10px] font-mono shrink-0">
          ⚠️ {speechError}
        </div>
      )}

      {/* Suggested Voice Commands Bar */}
      <div className="bg-[#16213e]/60 px-3 py-2 border-t border-border/20 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 flex items-center gap-2">
        <span className="text-[9px] font-mono text-muted flex items-center gap-1 shrink-0">
          <Sparkles size={10} className="text-[#e94560]" /> Commands:
        </span>
        {[
          'who is online',
          'switch room tech talk',
          'help',
          'send message high speed Sockets'
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => runVoiceCommand(cmd)}
            className="px-2 py-1 bg-card/60 hover:bg-[#e94560]/10 border border-[#e94560]/30 hover:border-[#e94560]/80 rounded text-[9px] font-mono text-[#e94560] transition-all cursor-pointer"
          >
            "{cmd}"
          </button>
        ))}
      </div>

      {/* Chat Form Controls */}
      <form onSubmit={handleSendMessage} className="bg-[#16213e] p-2 border-t border-border/40 shrink-0 flex items-center gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a real-time message..."
          className="flex-1 bg-[#1a1a2e] border border-border/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-muted focus:border-[#e94560] outline-none"
        />
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            isListening 
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
              : 'bg-card/40 border-border/40 text-[#e94560] hover:bg-[#e94560]/10'
          }`}
          title={isListening ? 'Listening... Click to stop' : 'Click to speak a voice command'}
        >
          {isListening ? <Mic size={14} /> : <Mic size={14} />}
        </button>
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-[#e94560] hover:bg-[#d6344d] disabled:opacity-30 text-white cursor-pointer transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
