/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandHistory {
  input: string;
  output: string[];
}

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      input: 'system --boot',
      output: [
        'Initializing RKK Terminal Emulator v2.0.1...',
        'Connection established with backend proxy route on port 3000.',
        'Type "help" to see all available commands.',
        '🟢 System status: ONLINE & available for opportunities.'
      ]
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    let output: string[] = [];

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '  whoami         - Display details about Rohit',
          '  ls skills/     - List technical skills',
          '  cat about.txt  - Print academic and university bio',
          '  status         - Current professional status',
          '  clear          - Clear the terminal screen',
          '  exit           - Close the terminal session'
        ];
        break;
      case 'whoami':
        output = [
          'rohit@portfolio:~$ Full Stack Developer | Java Engineer',
          'A computer science undergraduate with deep expertise in full-stack engineering, API proxy designing, and server automation.'
        ];
        break;
      case 'ls skills/':
        output = [
          'Languages/      Frontend/       Backend/        Databases/      Cloud/          Tools/',
          '  - Java          - React         - Node.js       - MongoDB       - AWS           - Git/GitHub',
          '  - JavaScript    - TypeScript    - Express       - MySQL         - Docker        - Postman',
          '  - Python        - Tailwind CSS  - Socket.IO                     - ServiceNow    - Power BI'
        ];
        break;
      case 'cat about.txt':
        output = [
          '🎓 Institution: DIT University, Dehradun, India',
          '📜 Degree: B.Tech Computer Science and Engineering (2023 - 2027)',
          '📈 Current CGPA: 8.18 / 10.0',
          '💼 Goal: Build robust cloud infrastructure and real-time collaborative services.'
        ];
        break;
      case 'status':
        output = [
          '🟢 Available for full-time Software Engineering & Full Stack Internship positions starting immediately.',
          '   Location: Open to relocation / remote opportunities.'
        ];
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        setInput('');
        return;
      default:
        output = [
          `Command not found: "${command}"`,
          'Type "help" to view a list of available terminal operations.'
        ];
    }

    setHistory(prev => [...prev, { input, output }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-[#030712] border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col h-[420px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="bg-[#0b0f19] border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} title="Close" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-mono text-muted ml-2">rohit@dit-university: ~</span>
          </div>
          <div className="text-[10px] font-mono text-primary animate-pulse bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            KONAMI ACCESS
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={containerRef}
          className="p-4 flex-1 overflow-y-auto font-mono text-sm text-text-sub space-y-4"
        >
          {history.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center text-[#38bdf8]">
                <span className="text-muted mr-1.5">rohit@dit-portfolio:~$</span>
                <span className="text-white font-medium">{item.input}</span>
              </div>
              {item.output.map((line, lIndex) => (
                <div key={lIndex} className="text-[#a1a1aa] whitespace-pre-wrap leading-relaxed pl-4">
                  {line}
                </div>
              ))}
            </div>
          ))}

          {/* Current Input */}
          <form onSubmit={handleCommandSubmit} className="flex items-center text-[#38bdf8]">
            <span className="text-muted mr-1.5">rohit@dit-portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono focus:ring-0 p-0"
              autoFocus
              autoComplete="off"
              spellCheck="false"
              placeholder="type commands here..."
            />
          </form>
        </div>

        {/* Terminal Footer */}
        <div className="bg-[#070a13] px-4 py-1.5 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted">
          <span>Type "exit" to close terminal</span>
          <span>SYSTEM: port-3000/tcp</span>
        </div>
      </div>
    </div>
  );
}
