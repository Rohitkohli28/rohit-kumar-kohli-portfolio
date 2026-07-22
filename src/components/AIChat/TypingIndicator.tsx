/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border text-muted font-mono text-xs w-max">
      <Bot size={16} className="text-primary animate-pulse" />
      <div className="flex items-center gap-1">
        <span>Rohit's AI is processing</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
