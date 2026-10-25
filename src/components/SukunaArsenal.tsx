/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Swords,
  Flame,
  Shield,
  Zap,
  RotateCw,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';
import { ALL_SUKUNA_ABILITIES, SukunaAbility } from '../utils/sukunaAbilities.ts';
import { audioFx } from '../utils/audioEffects.ts';

interface SukunaArsenalProps {
  onUnleashInStandoff: (ability: SukunaAbility) => void;
}

export const SukunaArsenal: React.FC<SukunaArsenalProps> = ({ onUnleashInStandoff }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recentlyCastId, setRecentlyCastId] = useState<string | null>(null);

  const categories = ['All', 'Slashing', 'Thermal', 'Domain', 'Ten Shadows', 'Cursed Tool', 'Physical & RCT'];

  const filteredAbilities =
    selectedCategory === 'All'
      ? ALL_SUKUNA_ABILITIES
      : ALL_SUKUNA_ABILITIES.filter((a) => a.category === selectedCategory);

  const handleCast = (ability: SukunaAbility) => {
    setRecentlyCastId(ability.id);
    if (ability.fxType === 'fuga') {
      audioFx.playFlameBurst();
    } else if (ability.fxType === 'domain') {
      audioFx.playDomainExpansion();
    } else if (ability.fxType === 'lightning') {
      audioFx.playImpact();
    } else {
      audioFx.playSlash();
    }

    onUnleashInStandoff(ability);

    setTimeout(() => {
      setRecentlyCastId(null);
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Slashing':
        return <Swords className="w-4 h-4 text-red-400" />;
      case 'Thermal':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Domain':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'Ten Shadows':
        return <RotateCw className="w-4 h-4 text-emerald-400" />;
      case 'Cursed Tool':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 space-y-5">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-neutral-900 to-black border border-red-800/60 p-6 shadow-[0_0_40px_rgba(220,38,38,0.25)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded bg-red-900/60 text-red-200 border border-red-700">
                Pinnacle Jujutsu
              </span>
              <span className="text-xs text-neutral-400 font-mono">11 Ancient & Modern Techniques</span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-black text-red-100 tracking-wider">
              Sukuna's Complete Arsenal
            </h2>
            <p className="text-sm text-neutral-300 max-w-2xl mt-1 leading-relaxed">
              Every technique, barrier manipulation, cursed tool, and divine manifestation wielded by
              the King of Curses from the Heian Era to the Shinjuku Showdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-black/60 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 font-mono block">SUKUNA FINGERS</span>
              <span className="font-cinzel text-lg font-bold text-red-400">20 / 20 MAX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-red-900/80 text-red-100 border border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ability Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAbilities.map((ability) => {
          const isJustCast = recentlyCastId === ability.id;
          return (
            <div
              key={ability.id}
              className="flex flex-col justify-between rounded-xl bg-neutral-950/80 border border-neutral-800/80 hover:border-red-700/60 transition-all duration-300 p-5 shadow-lg group hover:shadow-[0_0_25px_rgba(220,38,38,0.2)]"
            >
              <div className="space-y-3">
                {/* Top badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono">
                    {getCategoryIcon(ability.category)}
                    <span className="text-neutral-300">{ability.category}</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-950/30 border border-amber-900/50">
                    {ability.damageRating}
                  </span>
                </div>

                {/* Name & Japanese */}
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-neutral-100 group-hover:text-red-300 transition">
                    {ability.name}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">{ability.japanese}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed">{ability.description}</p>

                {/* Chants if available */}
                {ability.chants && ability.chants.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-[11px]">
                    <span className="font-mono text-red-400 font-semibold block mb-0.5">
                      Required Incantation:
                    </span>
                    <span className="text-red-200 italic font-serif">
                      "{ability.chants.join(' • ')}"
                    </span>
                  </div>
                )}

                {/* Lore */}
                <p className="text-[11px] text-neutral-400 italic leading-normal border-l-2 border-neutral-800 pl-2">
                  {ability.lore}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2 border-t border-neutral-900">
                <button
                  onClick={() => handleCast(ability)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-cinzel font-bold transition ${
                    isJustCast
                      ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                      : 'bg-red-950/60 hover:bg-red-900 border border-red-800/70 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                  }`}
                >
                  {isJustCast ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Unleashed in Standoff!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Unleash in Combat Standoff</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
