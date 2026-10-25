/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Gift,
  Check,
  Sparkles,
  Flame,
  Shield,
  Copy,
  Star,
  Award,
} from 'lucide-react';
import {
  SorcererProfile,
  VALID_REDEEM_CODES,
  redeemCodeAction,
} from '../utils/redeemAndProfile.ts';
import { audioFx } from '../utils/audioEffects.ts';

interface RedeemCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SorcererProfile;
  onUpdateProfile: (updated: SorcererProfile) => void;
}

export const RedeemCodesModal: React.FC<RedeemCodesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [code, setCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (codeToRedeem?: string) => {
    const targetCode = (codeToRedeem || code).trim();
    if (!targetCode) return;

    const result = redeemCodeAction(targetCode, profile);
    onUpdateProfile(result.updatedProfile);
    setStatusMessage({
      text: result.message,
      isError: !result.success,
    });

    if (result.success) {
      audioFx.playFlameBurst();
      setCode('');
    } else {
      audioFx.playSlash();
    }
  };

  const handleActivatePass = (passName: 'Special Grade Pass' | 'Sukuna Vessel VIP') => {
    let newFingers = profile.fingersConsumed;
    let newCE = profile.cursedEnergy;

    if (passName === 'Sukuna Vessel VIP') {
      newFingers = 20; // 20 MAX fingers!
      newCE += 100000;
    }

    const updated: SorcererProfile = {
      ...profile,
      activeSubscription: passName,
      fingersConsumed: newFingers,
      cursedEnergy: newCE,
      badges: [...new Set([...profile.badges, `👑 ${passName.toUpperCase()}`])],
    };

    onUpdateProfile(updated);
    audioFx.playDomainExpansion();
    setStatusMessage({
      text: `Subscription ${passName} is now active! 20 Fingers and Special Grade benefits unlocked!`,
      isError: false,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="redeem-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950/60 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-amber-400" />
            <div>
              <h2 id="redeem-title" className="font-cinzel text-lg font-bold text-neutral-100">
                Redeem Codes & Sorcerer Subscriptions
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Invoke ancient binding codes & claim Special Grade credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Input section */}
          <div className="space-y-2">
            <label className="text-xs font-cinzel font-semibold text-neutral-300 block">
              Enter Secret Jujutsu Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                placeholder="e.g. FUGA2026, MAXFINGERS, SIXEYES"
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 font-mono uppercase tracking-wider focus:outline-none focus:border-red-600"
              />
              <button
                onClick={() => handleRedeem()}
                disabled={!code.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-cinzel text-xs font-bold transition shadow-lg shrink-0"
              >
                Invoke Code
              </button>
            </div>

            {/* Status Toast */}
            {statusMessage && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed transition-all ${
                  statusMessage.isError
                    ? 'bg-red-950/40 border border-red-800 text-red-300'
                    : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </div>

          {/* Subscriptions / Passes */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Sorcerer Pass Tiers (Free In-App Activation)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Special Grade Pass */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  profile.activeSubscription === 'Special Grade Pass'
                    ? 'bg-neutral-900 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs font-bold text-amber-300">
                      Special Grade Pass
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Full access to all JJK Character arenas, unlimited tactical moves, and custom SFX.
                  </p>
                </div>
                <button
                  onClick={() => handleActivatePass('Special Grade Pass')}
                  className="mt-3 w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-cinzel text-neutral-200 transition font-semibold"
                >
                  {profile.activeSubscription === 'Special Grade Pass' ? '✓ Currently Active' : 'Activate Free'}
                </button>
              </div>

              {/* Sukuna's Vessel VIP */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  profile.activeSubscription === 'Sukuna Vessel VIP'
                    ? 'bg-red-950/30 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                    : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-xs font-bold text-red-300">
                      Sukuna's Vessel VIP
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      20 FINGERS MAX
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Instantly caps consumption to 20/20 Sukuna Fingers, unlocks Golden Heian banner, and +100k Cursed Energy.
                  </p>
                </div>
                <button
                  onClick={() => handleActivatePass('Sukuna Vessel VIP')}
                  className="mt-3 w-full py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-xs font-cinzel text-white transition font-semibold"
                >
                  {profile.activeSubscription === 'Sukuna Vessel VIP' ? '✓ Currently Active' : 'Activate 20 Fingers VIP'}
                </button>
              </div>
            </div>
          </div>

          {/* Available Codes Table with Instant Click-To-Apply */}
          <div className="space-y-2">
            <h3 className="font-cinzel text-sm font-bold text-neutral-200">
              Active Grimoire Codes (Click to Apply)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.values(VALID_REDEEM_CODES).map((cd) => {
                const isRedeemed = profile.redeemedCodes.includes(cd.code);
                return (
                  <div
                    key={cd.code}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-300 block">{cd.code}</span>
                      <span className="text-[11px] text-neutral-400 leading-tight block">
                        +{cd.rewardFingers} Fingers • +{cd.rewardCursedEnergy.toLocaleString()} CE
                      </span>
                    </div>
                    <button
                      onClick={() => handleRedeem(cd.code)}
                      disabled={isRedeemed}
                      aria-label={isRedeemed ? `Already redeemed ${cd.code}` : `Claim code ${cd.code}`}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-cinzel font-semibold transition shrink-0 ${
                        isRedeemed
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800'
                      }`}
                    >
                      {isRedeemed ? 'Redeemed' : 'Claim'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-900/80 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-cinzel font-semibold transition"
          >
            Close Grimoire
          </button>
        </div>
      </div>
    </div>
  );
};
