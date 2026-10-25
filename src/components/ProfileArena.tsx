/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  Zap,
  Flame,
  Award,
  Swords,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  SorcererProfile,
  saveSorcererProfile,
} from '../utils/redeemAndProfile.ts';
import { audioFx } from '../utils/audioEffects.ts';

interface ProfileArenaProps {
  profile: SorcererProfile;
  onUpdateProfile: (updated: SorcererProfile) => void;
  onOpenRedeem: () => void;
}

export const ProfileArena: React.FC<ProfileArenaProps> = ({
  profile,
  onUpdateProfile,
  onOpenRedeem,
}) => {
  const [name, setName] = useState(profile.name);
  const [clan, setClan] = useState(profile.clan);
  const [trait, setTrait] = useState(profile.cursedEnergyTrait);
  const [weapon, setWeapon] = useState(profile.cursedWeapon);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const clans = [
    'Independent / Tokyo Jujutsu High',
    'Gojo Clan (Limitless Lineage)',
    'Zenin Clan (Shadow & Weapons)',
    'Kamo Clan (Bloodline Mastery)',
    'Inumaki Clan (Cursed Speech)',
    'Ancient Heian Reincarnated',
  ];

  const traits = [
    'Razor Slashing Aura (Sukuna-Type)',
    'Electric / Lightning Charge (Kashimo-Type)',
    'Infinite Light & Gravity (Gojo-Type)',
    'Heavy Oceanic Abyss (Yuta-Type)',
    'Rough Sandpaper Impact (Hakari-Type)',
  ];

  const weapons = [
    'Special Grade Cursed Spear',
    'Inverted Spear of Heaven (Technique Nullifier)',
    'Split Soul Katana (Soul Slicer)',
    'Playful Cloud (Pure Physical Force)',
    'Supreme Martial Solution: Kamutoke',
    'Bare Fists (Soul Striking Martial Arts)',
  ];

  const handleSave = () => {
    const updated: SorcererProfile = {
      ...profile,
      name,
      clan,
      cursedEnergyTrait: trait,
      cursedWeapon: weapon,
    };
    onUpdateProfile(updated);
    saveSorcererProfile(updated);
    audioFx.playSend();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleConsumeOneFinger = () => {
    if (profile.fingersConsumed >= 20) return;
    const nextFingers = profile.fingersConsumed + 1;
    const updated: SorcererProfile = {
      ...profile,
      fingersConsumed: nextFingers,
      cursedEnergy: profile.cursedEnergy + 10000,
      title: nextFingers === 20 ? 'True Vessel of the 20 Fingers' : profile.title,
    };
    onUpdateProfile(updated);
    saveSorcererProfile(updated);
    audioFx.playFlameBurst();
  };

  const handleMaxAllFingers = () => {
    const updated: SorcererProfile = {
      ...profile,
      fingersConsumed: 20,
      cursedEnergy: profile.cursedEnergy + 100000,
      title: 'Complete Curse King Incarnate',
      badges: [...new Set([...profile.badges, '💀 20/20 FINGERS MASTER'])],
    };
    onUpdateProfile(updated);
    saveSorcererProfile(updated);
    audioFx.playDomainExpansion();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Top Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-black border border-neutral-800 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-900 via-neutral-900 to-black border-2 border-red-600/70 flex items-center justify-center font-cinzel text-2xl font-bold text-red-200 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              {profile.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-xl md:text-2xl font-bold text-neutral-100">
                  {profile.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                  {profile.grade}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {profile.title} • {profile.clan}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 text-[10px] font-mono">
                  {profile.activeSubscription}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  CE: <strong className="text-blue-400">{profile.cursedEnergy.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRedeem}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-white font-cinzel text-xs font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Redeem Codes & Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 20 Sukuna Fingers Progress & Consumption Chamber */}
      <div className="p-6 rounded-2xl bg-neutral-950/80 border border-red-900/40 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="font-cinzel text-lg font-bold text-neutral-100">
                Sukuna's 20 Cursed Wax Fingers
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Consume the indestructible fragments of the King of Curses to unlock absolute Jujutsu supremacy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConsumeOneFinger}
              disabled={profile.fingersConsumed >= 20}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-cinzel font-semibold text-neutral-200 transition disabled:opacity-40"
            >
              +1 Finger
            </button>
            <button
              onClick={handleMaxAllFingers}
              disabled={profile.fingersConsumed >= 20}
              className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 border border-red-600 text-xs font-cinzel font-bold text-white transition disabled:opacity-40 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
              Max Out 20 Fingers
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">Current Consumption</span>
            <span className="text-amber-400 font-bold">
              {profile.fingersConsumed} / 20 FINGERS ({(profile.fingersConsumed / 20) * 100}%)
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-red-600 to-red-500 transition-all duration-500"
              style={{ width: `${(profile.fingersConsumed / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* 20 Fingers Grid Showcase */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
          {Array.from({ length: 20 }).map((_, idx) => {
            const isConsumed = idx < profile.fingersConsumed;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  isConsumed
                    ? 'bg-red-950/50 border-red-600 text-red-200 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    : 'bg-neutral-950 border-neutral-900 text-neutral-600'
                }`}
                title={`Sukuna Finger #${idx + 1}`}
              >
                <span className="text-xs font-mono font-bold">#{idx + 1}</span>
                <span className="text-xs">{isConsumed ? '💀' : '🔒'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Customization Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Personal info */}
        <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="font-cinzel text-sm font-bold text-neutral-200">
              Sorcerer Identity
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Sorcerer Alias</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Affiliation / Clan</label>
            <select
              value={clan}
              onChange={(e) => setClan(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-600"
            >
              {clans.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: Combat Attributes */}
        <div className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
            <Swords className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-sm font-bold text-neutral-200">
              Combat Equipment & Trait
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Cursed Energy Trait</label>
            <select
              value={trait}
              onChange={(e) => setTrait(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-600"
            >
              {traits.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">Equipped Cursed Weapon</label>
            <select
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-red-600"
            >
              {weapons.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-cinzel text-xs font-bold transition flex items-center gap-2 shadow-lg"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Attributes Saved!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Update Sorcerer Dossier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
