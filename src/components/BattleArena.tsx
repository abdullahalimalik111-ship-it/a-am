/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Swords,
  Send,
  Zap,
  Shield,
  Volume2,
  Sparkles,
  Award,
} from 'lucide-react';
import { JJK_CHARACTERS, JJKCharacter } from '../utils/jjkCharacters.ts';
import { audioFx } from '../utils/audioEffects.ts';

interface ArenaMessage {
  id: string;
  sender: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const BattleArena: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<JJKCharacter>(JJK_CHARACTERS[1]); // Default to Satoru Gojo
  const [messages, setMessages] = useState<ArenaMessage[]>([
    {
      id: 'arena-init',
      sender: JJK_CHARACTERS[1].name,
      role: 'assistant',
      content: JJK_CHARACTERS[1].initialMessage,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Switch character
  const handleSelectCharacter = (char: JJKCharacter) => {
    setSelectedChar(char);
    setMessages([
      {
        id: `arena-${char.id}-${Date.now()}`,
        sender: char.name,
        role: 'assistant',
        content: char.initialMessage,
        timestamp: Date.now(),
      },
    ]);
    audioFx.playSlash();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textOverride?: string) => {
    const text = (textOverride || input).trim();
    if (!text || isLoading) return;

    audioFx.playSend();

    const userMsg: ArenaMessage = {
      id: `user-${Date.now()}`,
      sender: 'You',
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: selectedChar.id,
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      const reply = data.reply;

      const assistantMsg: ArenaMessage = {
        id: `assistant-${Date.now()}`,
        sender: selectedChar.name,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      audioFx.playSlash();
    } catch {
      // Clean fallback
      const assistantMsg: ArenaMessage = {
        id: `assistant-${Date.now()}`,
        sender: selectedChar.name,
        role: 'assistant',
        content: `*${selectedChar.name} counters your advance with razor focus.* "Not bad, but you'll have to push far beyond your limits to match my technique!"`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbilityQuickTrigger = (abilityName: string, desc: string) => {
    const prompt = `I prepare to counter your technique! You unleash ${abilityName}: "${desc}"! How do you react?`;
    handleSendMessage(prompt);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 space-y-5">
      {/* Character Selection Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-500" />
            <h2 className="font-cinzel text-lg md:text-xl font-bold text-neutral-100 tracking-wider">
              Jujutsu Battle Arena — Select Opponent
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {JJK_CHARACTERS.length} Legendary Combatants
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {JJK_CHARACTERS.map((char) => {
            const isSelected = selectedChar.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char)}
                className={`flex items-center gap-3 p-3 rounded-xl border shrink-0 text-left transition-all duration-300 min-w-[210px] ${
                  isSelected
                    ? 'bg-neutral-900 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-[1.02]'
                    : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${char.avatarColor} border border-neutral-700 flex items-center justify-center font-cinzel font-bold text-white shadow-md`}
                >
                  {char.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-cinzel text-xs font-bold text-neutral-200">
                      {char.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {char.grade}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arena Split: Left Character Dossier, Right Live Duel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Character Profile Card */}
        <div className="lg:col-span-4 rounded-xl bg-neutral-950/90 border border-neutral-800/80 p-5 space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 block">
              {selectedChar.affiliation}
            </span>
            <h3 className="font-cinzel text-2xl font-black text-neutral-100">
              {selectedChar.name}
            </h3>
            <span className="text-xs text-neutral-400 font-mono block">
              {selectedChar.japaneseName} • {selectedChar.title}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs italic text-neutral-300 font-serif">
            "{selectedChar.quote}"
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400 font-mono">Grade</span>
              <span className="font-semibold text-amber-300">{selectedChar.grade}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-900">
              <span className="text-neutral-400 font-mono">Technique</span>
              <span className="font-semibold text-blue-300 text-right">
                {selectedChar.signatureTechnique}
              </span>
            </div>
            {selectedChar.domainExpansion && (
              <div className="flex justify-between py-1 border-b border-neutral-900">
                <span className="text-neutral-400 font-mono">Domain</span>
                <span className="font-semibold text-red-300 text-right">
                  {selectedChar.domainExpansion}
                </span>
              </div>
            )}
          </div>

          {/* Quick moves to force the duel */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Force Technique Clash:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedChar.abilities.map((ab) => (
                <button
                  key={ab.name}
                  onClick={() => handleAbilityQuickTrigger(ab.name, ab.description)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-[11px] font-cinzel transition disabled:opacity-40"
                >
                  ⚡ {ab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Duel Chat */}
        <div className="lg:col-span-8 rounded-xl bg-neutral-950/90 border border-neutral-800/80 flex flex-col h-[560px] shadow-2xl overflow-hidden">
          {/* Duel Header */}
          <div className="px-5 py-3 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-cinzel text-xs font-bold text-neutral-200">
                Active Clash vs {selectedChar.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              Real-Time AI Encounter
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-neutral-900 border border-blue-900/60 text-blue-100'
                        : 'bg-neutral-950/80 border border-neutral-800 text-neutral-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-neutral-800/50">
                      <span className="font-cinzel font-bold text-[11px] text-amber-300">
                        {msg.sender}
                      </span>
                      {!isUser && (
                        <button
                          onClick={() => audioFx.speakSukuna(msg.content)}
                          className="text-neutral-500 hover:text-amber-400 transition"
                          title="Speak Dialogue"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 text-xs text-neutral-400 italic">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{selectedChar.name} is formulating a response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-neutral-900/40 border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              placeholder={`Send a strike or words to ${selectedChar.name}...`}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-cinzel text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3 h-3" />
              <span>Strike</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
