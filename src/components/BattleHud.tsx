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
} from 'lucide-react';
import { SukunaDisposition } from '../utils/sukunaGameLogic.ts';

interface BattleHudProps {
  stats: SukunaDisposition;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenDomain: () => void;
  onOpenCodex: () => void;
  onReset: () => void;
  cinematicMode: boolean;
  onToggleCinematic: () => void;
}

export const BattleHud: React.FC<BattleHudProps> = ({
  stats,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  onOpenDomain,
  onOpenCodex,
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
    <header className="relative z-30 w-full border-b border-red-950/60 bg-black/85 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Title & Character branding */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-950 via-red-900 to-black border border-red-600/70 shadow-[0_0_15px_rgba(220,38,38,0.6)] shrink-0">
            {/* Sukuna Curse Eye Mark SVG */}
            <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 0110.4-4.1l-1.4 1.4A4 4 0 008 12h-2z" fill="#f87171" />
            </svg>
            {stats.flameArrowArmed && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-cinzel text-base sm:text-lg md:text-xl font-bold tracking-wider text-red-100 leading-tight">
                Ryomen Sukuna
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider rounded bg-red-950 text-red-300 border border-red-800">
                King of Curses
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-mono flex items-center gap-1.5 sm:gap-2">
              <span className="text-amber-500">Shibuya Incident</span>
              <span>•</span>
              <span className="text-red-400">20 / 20 Fingers</span>
            </p>
          </div>
        </div>

        {/* Meters & Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Sukuna Mood Meter */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-lg border bg-neutral-950/80 border-neutral-800 text-xs">
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Sukuna's Mind:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-cinzel font-bold border transition-colors ${getMoodColor(
                stats.mood
              )}`}
            >
              {stats.mood} ({stats.amusementLevel}%)
            </span>
          </div>

          {/* Shibuya Devastation Radius */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-950/80 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Crater:
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {stats.ruinRadius}m
            </span>
          </div>

          {/* Player Cursed Energy / Integrity */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Your Endurance:
            </span>
            <div className="w-16 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${stats.playerHealthPct}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-blue-300">
              {stats.playerHealthPct}%
            </span>
          </div>
        </div>

        {/* Utility & Audio Controls */}
        <div className="flex items-center gap-1.5">
          {/* Audio SFX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'bg-red-950/60 border-red-800/80 text-red-200 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={soundEnabled ? 'Sound Effects Active (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Sukuna Voice Narration Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg border transition ${
              voiceEnabled
                ? 'bg-amber-950/60 border-amber-800/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={voiceEnabled ? 'Sukuna Voice Narration Active' : 'Enable Sukuna Voice Narration'}
            aria-label={voiceEnabled ? 'Disable voice narration' : 'Enable voice narration'}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Domain Expansion Viewer Button */}
          <button
            onClick={onOpenDomain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/70 text-red-200 text-xs font-cinzel font-semibold transition"
            aria-label="Open Malevolent Shrine details"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Malevolent Shrine</span>
          </button>

          {/* Technique Codex Button */}
          <button
            onClick={onOpenCodex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 text-xs font-cinzel font-semibold transition"
            aria-label="Open Jujutsu technique codex"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Codex</span>
          </button>

          {/* Cinematic Background Toggle */}
          <button
            onClick={onToggleCinematic}
            className={`p-2 rounded-lg border transition ${
              cinematicMode
                ? 'bg-amber-900/40 border-amber-600 text-amber-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Toggle Cinematic Art View"
            aria-label="Toggle cinematic background view"
          >
            <Flame className="w-4 h-4" />
          </button>

          {/* Restart Standoff */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-red-400 transition"
            title="Reset Battle Standoff"
            aria-label="Reset battle standoff"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
