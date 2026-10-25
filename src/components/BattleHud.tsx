/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Flame,
  Shield,
  BookOpen,
  RotateCcw,
  Sparkles,
  Gift,
  Swords,
  User,
} from 'lucide-react';
import { SukunaDisposition } from '../utils/sukunaGameLogic.ts';
import { SorcererProfile } from '../utils/redeemAndProfile.ts';

export type ActiveTab = 'standoff' | 'arena' | 'arsenal' | 'profile';

interface BattleHudProps {
  stats: SukunaDisposition;
  profile: SorcererProfile;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenDomain: () => void;
  onOpenCodex: () => void;
  onOpenRedeem: () => void;
  onReset: () => void;
  cinematicMode: boolean;
  onToggleCinematic: () => void;
}

export const BattleHud: React.FC<BattleHudProps> = ({
  stats,
  profile,
  activeTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  onOpenDomain,
  onOpenCodex,
  onOpenRedeem,
  onReset,
  cinematicMode,
  onToggleCinematic,
}) => {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Lethal':
        return 'text-red-500 border-red-500 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'Entertained':
        return 'text-amber-400 border-amber-500 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'Intrigued':
        return 'text-orange-400 border-orange-500 bg-orange-950/40';
      case 'Bored':
        return 'text-neutral-400 border-neutral-700 bg-neutral-900/50';
      default:
        return 'text-red-400 border-red-800 bg-red-950/30';
    }
  };

  return (
    <header className="relative z-30 w-full border-b border-red-950/60 bg-black/90 backdrop-blur-md px-3 sm:px-4 py-2 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top row: Branding, stats, and utility buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Title & Character branding */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-red-950 via-red-900 to-black border border-red-600/70 shadow-[0_0_15px_rgba(220,38,38,0.6)] shrink-0">
              <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              </svg>
              {stats.flameArrowArmed && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-cinzel text-sm sm:text-base md:text-lg font-bold tracking-wider text-red-100 leading-none">
                  Ryomen Sukuna
                </h1>
                <span className="px-1.5 py-0.2 text-[9px] uppercase font-mono tracking-wider rounded bg-red-950 text-red-300 border border-red-800">
                  King of Curses
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="text-amber-500">Shibuya Ground Zero</span>
                <span>•</span>
                <span className="text-red-400 font-bold">
                  {profile.fingersConsumed} / 20 Fingers
                </span>
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sukuna's Mind */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border bg-neutral-950/80 border-neutral-800 text-[11px]">
              <span className="font-mono text-neutral-400 uppercase">Mind:</span>
              <span className={`px-1.5 py-0.5 rounded font-cinzel font-bold border ${getMoodColor(stats.mood)}`}>
                {stats.mood}
              </span>
            </div>

            {/* Crater Devastation */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg border border-neutral-800 bg-neutral-950/80 text-[11px]">
              <Flame className="w-3 h-3 text-amber-500" />
              <span className="font-mono text-neutral-400 uppercase">Crater:</span>
              <span className="font-mono font-bold text-amber-300">{stats.ruinRadius}m</span>
            </div>

            {/* Redeem Codes Button */}
            <button
              onClick={onOpenRedeem}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/70 text-amber-200 text-xs font-cinzel font-bold transition shadow-[0_0_10px_rgba(245,158,11,0.25)]"
              aria-label="Open Redeem Codes modal"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Redeem Codes</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border transition ${
                soundEnabled
                  ? 'bg-red-950/60 border-red-800/80 text-red-200'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Voice Toggle */}
            <button
              onClick={onToggleVoice}
              className={`p-1.5 rounded-lg border transition ${
                voiceEnabled
                  ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={voiceEnabled ? 'Sukuna Voice Active' : 'Enable Voice Narration'}
              aria-label={voiceEnabled ? 'Disable voice narration' : 'Enable voice narration'}
            >
              {voiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>

            {/* Cinematic View */}
            <button
              onClick={onToggleCinematic}
              className={`p-1.5 rounded-lg border transition ${
                cinematicMode
                  ? 'bg-amber-900/40 border-amber-600 text-amber-200'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Toggle Background View"
              aria-label="Toggle cinematic background view"
            >
              <Flame className="w-3.5 h-3.5" />
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-red-400 transition"
              title="Reset Standoff"
              aria-label="Reset battle standoff"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom row: Clean Navigation Menu */}
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-neutral-900">
          <button
            onClick={() => onSelectTab('standoff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition shrink-0 ${
              activeTab === 'standoff'
                ? 'bg-red-900/80 text-red-100 border border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <span>⛩️ Shibuya Standoff</span>
          </button>

          <button
            onClick={() => onSelectTab('arena')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition shrink-0 ${
              activeTab === 'arena'
                ? 'bg-red-900/80 text-red-100 border border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-blue-400" />
            <span>Battle Arena (All JJK)</span>
          </button>

          <button
            onClick={() => onSelectTab('arsenal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition shrink-0 ${
              activeTab === 'arsenal'
                ? 'bg-red-900/80 text-red-100 border border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Sukuna's Arsenal (All Abilities)</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition shrink-0 ${
              activeTab === 'profile'
                ? 'bg-red-900/80 text-red-100 border border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span>Sorcerer Profile ({profile.fingersConsumed}/20)</span>
          </button>

          {/* Quick Domain & Codex shortcuts */}
          <div className="flex items-center gap-1 ml-auto shrink-0 pl-2">
            <button
              onClick={onOpenDomain}
              className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-cinzel transition"
              aria-label="Open Malevolent Shrine details"
            >
              Malevolent Shrine
            </button>
            <button
              onClick={onOpenCodex}
              className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-cinzel transition"
              aria-label="Open Jujutsu technique codex"
            >
              Codex
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
