/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Flame,
  Swords,
  Copy,
  Check,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  SukunaMessage,
  SukunaDisposition,
  SUKUNA_OPENING_MESSAGE,
  calculateSukunaDisposition,
  calculateUserBattleRating,
  detectTechniqueInText,
} from './utils/sukunaGameLogic.ts';
import { audioFx } from './utils/audioEffects.ts';
import {
  SorcererProfile,
  loadSorcererProfile,
  saveSorcererProfile,
} from './utils/redeemAndProfile.ts';
import { SukunaAbility } from './utils/sukunaAbilities.ts';
import { ParticleEmbers } from './components/ParticleEmbers.tsx';
import { SlashOverlay } from './components/SlashOverlay.tsx';
import { BattleHud, ActiveTab } from './components/BattleHud.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import { CombatActions } from './components/CombatActions.tsx';
import { DomainModal } from './components/DomainModal.tsx';
import { CodexModal } from './components/CodexModal.tsx';
import { BattleArena } from './components/BattleArena.tsx';
import { SukunaArsenal } from './components/SukunaArsenal.tsx';
import { ProfileArena } from './components/ProfileArena.tsx';
import { RedeemCodesModal } from './components/RedeemCodesModal.tsx';

export default function App() {
  const [profile, setProfile] = useState<SorcererProfile>(() => loadSorcererProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('standoff');

  const [messages, setMessages] = useState<SukunaMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: SUKUNA_OPENING_MESSAGE,
      technique: 'fuga',
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [activeSlash, setActiveSlash] = useState<'dismantle' | 'cleave' | 'fuga' | 'domain' | 'world_slash' | 'lightning' | 'heal' | null>(null);
  const [screenShaking, setScreenShaking] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync profile to localStorage on updates
  const handleUpdateProfile = (newProfile: SorcererProfile) => {
    setProfile(newProfile);
    saveSorcererProfile(newProfile);
  };

  // Derive disposition stats
  const stats: SukunaDisposition = calculateSukunaDisposition(
    messages.map((m) => ({ role: m.role, content: m.content }))
  );

  // Derive user battle rating
  const battleRating = calculateUserBattleRating(
    messages.filter((m) => m.role === 'user').length,
    []
  );

  useEffect(() => {
    if (activeTab === 'standoff') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  const triggerVisualFx = (type: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'world_slash' | 'lightning' | 'heal') => {
    setActiveSlash(type);
    setScreenShaking(true);

    if (type === 'fuga') {
      audioFx.playFlameBurst();
    } else if (type === 'domain') {
      audioFx.playDomainExpansion();
    } else if (type === 'lightning') {
      audioFx.playImpact();
    } else {
      audioFx.playSlash();
    }

    setTimeout(() => {
      setScreenShaking(false);
    }, 450);

    setTimeout(() => {
      setActiveSlash(null);
    }, 950);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    audioFx.playSend();

    const userTechnique = detectTechniqueInText(content);
    if (userTechnique.technique === 'black_flash') {
      audioFx.playImpact();
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 350);
    }

    const userMsg: SukunaMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      technique: userTechnique.technique,
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
          characterId: 'sukuna',
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.reply;
      const techniqueTriggered = data.technique;

      const assistantMsg: SukunaMessage = {
        id: `sukuna-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        technique: techniqueTriggered,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (techniqueTriggered) {
        triggerVisualFx(techniqueTriggered);
      } else {
        audioFx.playSlash();
      }

      if (voiceEnabled) {
        audioFx.speakSukuna(assistantReply);
      }
    } catch (err) {
      console.warn('Network error, seamlessly continuing character dialog:', err);
      const fallbackMsg: SukunaMessage = {
        id: `sukuna-${Date.now()}`,
        role: 'assistant',
        content: `*Sukuna tilts his head, an amused scoff escaping his lips as flames flicker violently around his fingers.* "You stutter before the King of Curses? Steel your resolve, brat. If you hesitate in the ruins of Shibuya, you become dust."`,
        technique: 'dismantle',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      audioFx.playSlash();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    audioFx.playFlameBurst();
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: SUKUNA_OPENING_MESSAGE,
        technique: 'fuga',
        timestamp: Date.now(),
      },
    ]);
  };

  const handleCopyTranscript = () => {
    const text = messages
      .map((m) => `${m.role === 'assistant' ? 'RYOMEN SUKUNA' : profile.name.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleTriggerSpecificTechnique = async (technique: 'dismantle' | 'cleave' | 'fuga' | 'domain') => {
    triggerVisualFx(technique);
    try {
      const res = await fetch('/api/technique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technique }),
      });
      const data = await res.json();
      if (data.description) {
        const assistantMsg: SukunaMessage = {
          id: `sukuna-${Date.now()}`,
          role: 'assistant',
          content: data.description,
          technique,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (voiceEnabled) {
          audioFx.speakSukuna(data.description);
        }
      }
    } catch {
      // Handled silently
    }
  };

  // Called when user clicks "Unleash in Standoff" from SukunaArsenal
  const handleUnleashAbilityFromArsenal = (ability: SukunaAbility) => {
    setActiveTab('standoff');
    triggerVisualFx(ability.fxType);
    const actionText = `I challenge your supremacy as you invoke ${ability.name} (${ability.japanese})! Show me the full extent of this technique!`;
    handleSendMessage(actionText);
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black text-neutral-100 ${
        screenShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* Background Image: Sukuna Fuga Scene */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none scale-100"
        style={{
          backgroundImage: `url('/assets/aistudio/IMG_0183_76ab6d36.jpeg')`,
        }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            cinematicMode
              ? 'bg-gradient-to-t from-black/70 via-black/20 to-black/60'
              : 'bg-gradient-to-t from-black/85 via-black/55 to-black/75'
          }`}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-red-950/30" />
      </div>

      {/* Floating Animated Embers & Sparks */}
      <ParticleEmbers />

      {/* Slash & Flame Arrow Visual FX Overlay */}
      <SlashOverlay activeType={activeSlash} />

      {/* Top Navigation & Status HUD */}
      <BattleHud
        stats={stats}
        profile={profile}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          audioFx.playSend();
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          audioFx.setMuted(!next);
        }}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => {
          const next = !voiceEnabled;
          setVoiceEnabled(next);
          audioFx.setVoiceEnabled(next);
        }}
        onOpenDomain={() => setIsDomainOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        onOpenRedeem={() => setIsRedeemOpen(true)}
        onReset={handleReset}
        cinematicMode={cinematicMode}
        onToggleCinematic={() => setCinematicMode((prev) => !prev)}
      />

      {/* TAB CONTENT */}

      {/* 1. SHIBUYA STANDOFF (Main Interactive Sukuna Story) */}
      {activeTab === 'standoff' && (
        <main className="relative z-20 flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-3 min-h-0">
          {/* Battle Summary Banner if ongoing */}
          {messages.filter((m) => m.role === 'user').length > 0 && (
            <div className="mb-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/70 border border-neutral-800/80 backdrop-blur-md text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-cinzel text-neutral-300">
                  Evaluation: <strong className="text-amber-300">{battleRating.survivalGrade}</strong>
                </span>
                <span className="hidden sm:inline text-neutral-400">• {battleRating.title}</span>
              </div>
              <button
                onClick={handleCopyTranscript}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition"
                title="Copy Chat Transcript"
              >
                {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedTranscript ? 'Copied' : 'Copy Log'}</span>
              </button>
            </div>
          )}

          {/* Message Log */}
          <div
            className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[300px] max-h-[58vh] md:max-h-[62vh]"
            data-testid="chat-message-list"
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onTriggerFx={triggerVisualFx}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/80 border border-red-900/40 w-fit">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping delay-150" />
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping delay-300" />
                </div>
                <span className="text-xs font-cinzel text-red-300 italic tracking-wider">
                  Sukuna is assessing your insolence...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tactical Actions Deck */}
          <div className="mt-2">
            <CombatActions
              onSelectAction={(actionText) => {
                setInput(actionText);
                handleSendMessage(actionText);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Input Bar */}
          <div className="mt-2 relative">
            <div className="flex items-end gap-2 p-2 rounded-xl bg-neutral-950/90 border border-red-950/70 focus-within:border-red-600/80 shadow-[0_0_25px_rgba(220,38,38,0.15)] transition backdrop-blur-md">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="State your defiance or describe your cursed technique... (Enter to strike)"
                className="flex-1 bg-transparent border-0 resize-none text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-0 max-h-24 px-2 py-1.5 font-sans"
                aria-label="Your combat response to Ryomen Sukuna"
              />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTriggerSpecificTechnique('fuga')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 text-xs font-cinzel transition"
                  title="Trigger Flame Arrow (Fuga)"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fuga</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerSpecificTechnique('cleave')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-cinzel transition"
                  title="Trigger Cleave Technique"
                >
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span>Cleave</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex items-center justify-center p-2.5 rounded-lg bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  aria-label="Send action to Sukuna"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-neutral-500 font-mono">
              <span>Press Enter to strike • Shift+Enter for newline</span>
              <span className="flex items-center gap-1 text-red-400/80">
                <AlertTriangle className="w-3 h-3" />
                {profile.fingersConsumed} / 20 Fingers Restored
              </span>
            </div>
          </div>
        </main>
      )}

      {/* 2. BATTLE ARENA (All JJK Characters) */}
      {activeTab === 'arena' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <BattleArena />
        </main>
      )}

      {/* 3. SUKUNA'S ARSENAL (Every Ability) */}
      {activeTab === 'arsenal' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <SukunaArsenal onUnleashInStandoff={handleUnleashAbilityFromArsenal} />
        </main>
      )}

      {/* 4. SORCERER PROFILE & 20 FINGERS */}
      {activeTab === 'profile' && (
        <main className="relative z-20 flex-1 overflow-y-auto">
          <ProfileArena
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenRedeem={() => setIsRedeemOpen(true)}
          />
        </main>
      )}

      {/* Modals */}
      <DomainModal
        isOpen={isDomainOpen}
        onClose={() => setIsDomainOpen(false)}
        ruinRadius={stats.ruinRadius}
      />

      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onTriggerTechnique={handleTriggerSpecificTechnique}
      />

      <RedeemCodesModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
