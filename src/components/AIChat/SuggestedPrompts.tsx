/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const PROMPTS = [
  'Tell me about Rohit',
  'Show Projects',
  'Skills',
  'Experience',
  'Certifications',
  'Download Resume',
  'GitHub',
  'Contact Me'
];

export default function SuggestedPrompts({ onSelectPrompt, disabled }: SuggestedPromptsProps) {
  return (
    <div className="px-4 py-2 border-t border-border/60 bg-bg-secondary/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelectPrompt(prompt)}
          disabled={disabled}
          className="px-3 py-1.5 rounded-xl border border-border bg-card/60 hover:bg-card text-[10px] font-mono font-medium text-text-sub hover:text-primary transition-all shrink-0 cursor-pointer disabled:opacity-40"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
