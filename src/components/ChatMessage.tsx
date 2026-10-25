/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, Flame, Swords, Shield, Zap } from 'lucide-react';
import { SukunaMessage } from '../utils/sukunaGameLogic.ts';
import { audioFx } from '../utils/audioEffects.ts';

interface ChatMessageProps {
  message: SukunaMessage;
  onTriggerFx?: (type: 'dismantle' | 'cleave' | 'fuga' | 'domain') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onTriggerFx }) => {
  const isSukuna = message.role === 'assistant';

  // Format message content: separate italicized actions *...* from spoken dialogue "..."
  const formatContent = (content: string) => {
    // Split by quotes and asterisks
    const parts = content.split(/(\*[^*]+\*|"[^"]+")/g);

    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        // Descriptive roleplay action
        return (
          <span
            key={index}
            className="block my-1.5 italic text-neutral-300/90 leading-relaxed font-sans"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith('"') && part.endsWith('"')) {
        // Spoken dialogue
        return (
          <span
            key={index}
            className="inline-block my-1 font-serif text-amber-100 font-semibold text-[15px] tracking-wide leading-relaxed drop-shadow-[0_1px_4px_rgba(239,68,68,0.4)]"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderTechniqueBadge = () => {
    if (!message.technique) return null;

    switch (message.technique) {
      case 'fuga':
        return (
          <button
            onClick={() => {
              audioFx.playFlameBurst();
              onTriggerFx?.('fuga');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-cinzel font-bold rounded bg-amber-950/80 border border-amber-600/80 text-amber-300 hover:bg-amber-900 transition"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Technique: ■ Open (Fuga)
          </button>
        );
      case 'domain':
        return (
          <button
            onClick={() => {
              audioFx.playDomainExpansion();
              onTriggerFx?.('domain');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-cinzel font-bold rounded bg-red-950/80 border border-red-600/80 text-red-200 hover:bg-red-900 transition"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            Malevolent Shrine Active
          </button>
        );
      case 'cleave':
        return (
          <button
            onClick={() => {
              audioFx.playSlash();
              onTriggerFx?.('cleave');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-cinzel font-bold rounded bg-red-950/80 border border-red-700/80 text-red-300 hover:bg-red-900 transition"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            Technique: Cleave
          </button>
        );
      case 'dismantle':
        return (
          <button
            onClick={() => {
              audioFx.playSlash();
              onTriggerFx?.('dismantle');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-cinzel font-bold rounded bg-red-950/80 border border-red-800/80 text-red-300 hover:bg-red-900 transition"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            Technique: Dismantle
          </button>
        );
      case 'black_flash':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-mono font-bold rounded bg-purple-950/80 border border-purple-600/80 text-purple-200">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Black Flash Impact!
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex w-full mb-4 ${isSukuna ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`relative max-w-2xl rounded-xl p-4 transition-all duration-300 ${
          isSukuna
            ? 'bg-gradient-to-b from-neutral-950/90 to-black/90 border border-red-900/60 shadow-[0_4px_25px_rgba(220,38,38,0.2)] text-neutral-200'
            : 'bg-neutral-900/90 border border-blue-900/60 shadow-[0_4px_20px_rgba(30,58,138,0.25)] text-blue-50'
        }`}
      >
        {/* Author header */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSukuna
                  ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse'
                  : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]'
              }`}
            />
            <span
              className={`font-cinzel text-xs font-bold tracking-wider ${
                isSukuna ? 'text-red-400' : 'text-blue-300'
              }`}
            >
              {isSukuna ? 'Ryomen Sukuna' : 'Challenger Sorcerer'}
            </span>
          </div>

          {isSukuna && (
            <button
              onClick={() => audioFx.speakSukuna(message.content)}
              className="text-neutral-500 hover:text-amber-400 p-1 rounded transition"
              title="Speak Sukuna's Words"
              aria-label="Speak Sukuna dialogue"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Message body */}
        <div className="text-sm leading-relaxed space-y-1">
          {formatContent(message.content)}
        </div>

        {/* Technique Badge if present */}
        {renderTechniqueBadge()}
      </div>
    </div>
  );
};
