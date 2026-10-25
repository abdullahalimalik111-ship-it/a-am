/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { audioFx } from '../utils/audioEffects.ts';

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruinRadius: number;
}

export const DomainModal: React.FC<DomainModalProps> = ({ isOpen, onClose, ruinRadius }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="domain-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-red-700/60 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.35)] overflow-hidden">
        {/* Header banner with kanji */}
        <div className="relative bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 px-6 py-5 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-red-500 font-serif">⛩️</span>
            <div>
              <h2
                id="domain-title"
                className="font-cinzel text-xl md:text-2xl font-bold tracking-wider text-red-100 flex items-center gap-2"
              >
                Domain Expansion: Malevolent Shrine
              </h2>
              <p className="text-xs text-red-400/90 font-mono tracking-wider">
                <span className="font-jp text-red-300">伏魔御廚子</span> • Fukuma Mizushi • Barrierless Inherent Domain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 transition"
            aria-label="Close Domain Expansion details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 text-sm text-neutral-300">
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-base font-cinzel">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              The Divine Technique: Painting on the Sky
            </div>
            <p className="leading-relaxed text-neutral-300">
              Unlike ordinary domains that manifest a separate enclosed dimensional barrier, Sukuna’s
              Malevolent Shrine is realized directly into reality without closing the barrier. It is
              likened to painting a masterpiece not on canvas, but across the sky itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
              <div className="text-amber-400 font-cinzel font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cleave • <span className="font-jp">捌き</span></span>
              </div>
              <p className="text-xs text-neutral-400">
                Automatically strikes targets possessed of cursed energy. It relentlessly adjusts its
                cutting output and intensity based on the target’s cursed energy density and durability.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1">
              <div className="text-red-400 font-cinzel font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>Dismantle • <span className="font-jp">解</span></span>
              </div>
              <p className="text-xs text-neutral-400">
                The standard slashing technique tailored for inanimate objects. In Malevolent Shrine, it
                incessantly shears through buildings, asphalt, and armor until everything is dust.
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-900 rounded-lg flex items-center justify-between border border-neutral-800">
            <div>
              <span className="text-xs text-neutral-400 block font-mono">Current Devastation Radius</span>
              <span className="font-cinzel text-lg font-bold text-red-400">
                {ruinRadius} meters (Shibuya Ground Zero)
              </span>
            </div>
            <button
              onClick={() => {
                audioFx.playDomainExpansion();
                audioFx.playSlash();
              }}
              className="px-3 py-1.5 rounded bg-red-900/70 hover:bg-red-800 text-red-100 text-xs font-cinzel font-semibold transition border border-red-700/50 flex items-center gap-1.5"
            >
              Sound the Bell of Enmaten
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/90 border-t border-neutral-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-cinzel font-semibold tracking-wider text-xs transition"
          >
            Return to Standoff
          </button>
        </div>
      </div>
    </div>
  );
};
