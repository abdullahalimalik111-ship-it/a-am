/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flame, Swords, Shield, Zap, BookOpen } from 'lucide-react';
import { audioFx } from '../utils/audioEffects.ts';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTechnique: (technique: 'dismantle' | 'cleave' | 'fuga' | 'domain') => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose, onTriggerTechnique }) => {
  const [activeTab, setActiveTab] = useState<'shrine' | 'fuga' | 'domain' | 'heian'>('fuga');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="codex-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-red-500" />
            <div>
              <h2 id="codex-title" className="font-cinzel text-lg md:text-xl font-bold text-white tracking-wide">
                Codex of the King of Curses
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Jujutsu Archive: Ryomen Sukuna (The Fallen King)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 transition"
            aria-label="Close Codex"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('fuga')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'fuga'
                ? 'border-amber-500 text-amber-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            ■ Open (Fuga)
          </button>
          <button
            onClick={() => setActiveTab('shrine')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'shrine'
                ? 'border-red-500 text-red-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-red-500" />
            Dismantle & Cleave
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'domain'
                ? 'border-red-600 text-red-200 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            Malevolent Shrine
          </button>
          <button
            onClick={() => setActiveTab('heian')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold rounded-t-lg transition flex items-center gap-2 border-b-2 ${
              activeTab === 'heian'
                ? 'border-purple-500 text-purple-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            The Fallen Legend
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-neutral-300 leading-relaxed">
          {activeTab === 'fuga' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xl font-bold text-amber-400">
                  Flame Arrow (Kamado / Fuga)
                </span>
                <button
                  onClick={() => {
                    audioFx.playFlameBurst();
                    onTriggerTechnique('fuga');
                  }}
                  className="px-3 py-1.5 rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 text-xs font-cinzel font-semibold transition"
                >
                  Demonstrate Fuga
                </button>
              </div>
              <p>
                Revealed in the heart of Shibuya against Jogo and later Mahoraga. By speaking the
                incantation <strong className="text-amber-300">"■ Open" (Fuga)</strong>, Sukuna
                channels extreme thermonuclear thermal energy in the form of a bow and arrow.
              </p>
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  Thermodynamic Properties
                </div>
                <p className="text-xs text-neutral-300">
                  The heat generated vaporizes steel, asphalt, and flesh in a fraction of a millisecond.
                  Combined with the pulverized debris from Malevolent Shrine, it acts as a catastrophic
                  thermobaric dust explosion, incinerating everything within ground zero.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shrine' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xl font-bold text-red-400">
                  The Innate Slashing Suite (Mizushi)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      audioFx.playSlash();
                      onTriggerTechnique('dismantle');
                    }}
                    className="px-2.5 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs font-cinzel font-semibold transition"
                  >
                    Dismantle
                  </button>
                  <button
                    onClick={() => {
                      audioFx.playSlash();
                      onTriggerTechnique('cleave');
                    }}
                    className="px-2.5 py-1.5 rounded bg-red-900/60 hover:bg-red-800 border border-red-700/60 text-red-200 text-xs font-cinzel font-semibold transition"
                  >
                    Cleave
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="font-cinzel text-red-400 font-semibold mb-1">Dismantle</div>
                  <p className="text-xs text-neutral-400">
                    Invisible flying slashes fired at high velocity. Primarily used against inanimate
                    matter or targets where cursed energy adaptation is unnecessary. Can be fired in
                    succession to slice through skyscrapers effortlessly.
                  </p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="font-cinzel text-amber-400 font-semibold mb-1">Cleave</div>
                  <p className="text-xs text-neutral-400">
                    A contact or close-range cut that actively assesses the target’s cursed energy
                    durability, adjusting its output to slice the opponent cleanly in two regardless of
                    their defense.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xl font-bold text-red-300">
                  Malevolent Shrine (Fukuma Mizushi)
                </span>
                <button
                  onClick={() => {
                    audioFx.playDomainExpansion();
                    onTriggerTechnique('domain');
                  }}
                  className="px-3 py-1.5 rounded bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-100 text-xs font-cinzel font-semibold transition"
                >
                  Unfurl Domain
                </button>
              </div>
              <p>
                A divine spectacle of barrierless domain architecture. By granting an escape route via a
                Binding Vow, the sure-hit range expands to a terrifying radius of up to 200 meters.
              </p>
              <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 text-xs space-y-2">
                <div className="text-red-400 font-semibold font-cinzel">The Ceaseless Onslaught</div>
                <p className="text-neutral-400">
                  Within the effective perimeter, Cleave rains upon anything with cursed energy while
                  Dismantle shreds all inanimate objects until entire districts are ground to powder.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'heian' && (
            <div className="space-y-4">
              <span className="font-cinzel text-xl font-bold text-purple-400">
                The Calamity of the Golden Age
              </span>
              <p>
                During the Heian Era—the golden age of Jujutsu—sorcerers gathered all their strength to
                challenge Sukuna, only to be utterly decimated. He became revered and feared as a natural
                disaster incarnate.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                  <span className="text-purple-300 font-bold block mb-1">Four Arms & Two Faces</span>
                  <p className="text-neutral-400">
                    Permitted uninterrupted incantations through his second stomach-mouth and constant hand
                    signs without disrupting combat flow.
                  </p>
                </div>
                <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
                  <span className="text-purple-300 font-bold block mb-1">20 Indestructible Wax Fingers</span>
                  <p className="text-neutral-400">
                    Special Grade cursed objects that transcended death, persisting for a thousand years
                    until consuming by Yuji Itadori.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-900/80 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-cinzel font-semibold transition"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
