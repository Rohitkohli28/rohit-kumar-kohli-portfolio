/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import RichCards from './RichCards';

export interface ChatMessageData {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  cardType?: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none';
  timestamp: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  onActionClick?: (action: string) => void;
}

export default function ChatMessage({ message, onActionClick }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-primary text-white font-medium rounded-br-xs shadow-md'
            : 'bg-card border border-border text-text-sub rounded-bl-xs shadow-sm font-sans'
        }`}
      >
        {message.text}

        {/* Rich UI Card Embeds */}
        {!isUser && message.cardType && message.cardType !== 'none' && (
          <RichCards type={message.cardType} onActionClick={onActionClick} />
        )}
      </div>

      <span className="text-[9px] font-mono text-muted mt-1 px-1">{message.timestamp}</span>
    </div>
  );
}
