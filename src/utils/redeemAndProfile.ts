/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RedeemCode {
  code: string;
  description: string;
  rewardFingers: number;
  rewardCursedEnergy: number;
  rewardTitle?: string;
  badge?: string;
}

export const VALID_REDEEM_CODES: Record<string, RedeemCode> = {
  FUGA2026: {
    code: 'FUGA2026',
    description: 'Unleash the Thermonuclear Flame Arrow! Grants 5 Sukuna Fingers & +50,000 CE.',
    rewardFingers: 5,
    rewardCursedEnergy: 50000,
    rewardTitle: 'Bearer of the Blazing Furnace',
    badge: '🔥 FUGA CHAMPION',
  },
  MALEVOLENT: {
    code: 'MALEVOLENT',
    description: 'Unlock Malevolent Shrine Overdrive! Grants 5 Sukuna Fingers & +40,000 CE.',
    rewardFingers: 5,
    rewardCursedEnergy: 40000,
    rewardTitle: 'Lord of the Skull Shrine',
    badge: '⛩️ SHRINE MASTER',
  },
  SIXEYES: {
    code: 'SIXEYES',
    description: 'Blessing of the Honored One! Grants Infinity trait & +35,000 CE.',
    rewardFingers: 2,
    rewardCursedEnergy: 35000,
    rewardTitle: 'The Honored Prodigy',
    badge: '⚡ SIX EYES AWAKENED',
  },
  BLACKFLASH: {
    code: 'BLACKFLASH',
    description: 'Sparks of Black! Grants 8x Consecutive Black Flash trait & +25,000 CE.',
    rewardFingers: 3,
    rewardCursedEnergy: 25000,
    rewardTitle: 'Chosen by the Black Sparks',
    badge: '💥 KOKUSEN MASTER',
  },
  HEIANERA: {
    code: 'HEIANERA',
    description: 'Golden Age of Jujutsu! Grants 5 Sukuna Fingers & Heian Warrior crest.',
    rewardFingers: 5,
    rewardCursedEnergy: 60000,
    rewardTitle: 'Heian Calamity Ascendant',
    badge: '👑 HEIAN OVERLORD',
  },
  SPECIALGRADE: {
    code: 'SPECIALGRADE',
    description: 'Immediate Special Grade Sorcerer certification with +100,000 CE!',
    rewardFingers: 4,
    rewardCursedEnergy: 100000,
    rewardTitle: 'Special Grade Anomaly',
    badge: '🌟 SPECIAL GRADE CERTIFIED',
  },
  MAXFINGERS: {
    code: 'MAXFINGERS',
    description: 'Instant 20 / 20 Sukuna Fingers! Unlocks full King of Curses form!',
    rewardFingers: 20,
    rewardCursedEnergy: 200000,
    rewardTitle: 'Vessel of 20 Fingers (Complete)',
    badge: '💀 COMPLETE CURSE KING',
  },
};

export interface SorcererProfile {
  name: string;
  title: string;
  clan: string;
  grade: string;
  cursedEnergy: number;
  maxCursedEnergy: number;
  fingersConsumed: number; // 0 to 20
  cursedEnergyTrait: string;
  cursedWeapon: string;
  activeBindingVow: string;
  activeSubscription: 'Free Sorcerer' | 'Special Grade Pass' | 'Sukuna Vessel VIP';
  redeemedCodes: string[];
  badges: string[];
}

const STORAGE_KEY = 'jjk_sukuna_profile_v2';

export const DEFAULT_PROFILE: SorcererProfile = {
  name: 'Challenger Sorcerer',
  title: 'Survivor of Shibuya',
  clan: 'Independent / Tokyo Jujutsu High',
  grade: 'Grade 1 Sorcerer',
  cursedEnergy: 45000,
  maxCursedEnergy: 150000,
  fingersConsumed: 15, // Starts at Shibuya 15 fingers!
  cursedEnergyTrait: 'Razor Slashing Aura',
  cursedWeapon: 'Special Grade Cursed Spear',
  activeBindingVow: "Revealing One's Hand (+20% Output)",
  activeSubscription: 'Special Grade Pass',
  redeemedCodes: [],
  badges: ['⚔️ Shibuya Combatant'],
};

export function loadSorcererProfile(): SorcererProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveSorcererProfile(profile: SorcererProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Silent
  }
}

export function redeemCodeAction(
  codeStr: string,
  currentProfile: SorcererProfile
): { success: boolean; message: string; updatedProfile: SorcererProfile } {
  const normalized = codeStr.trim().toUpperCase();
  if (currentProfile.redeemedCodes.includes(normalized)) {
    return {
      success: false,
      message: `Code "${normalized}" has already been redeemed by this sorcerer!`,
      updatedProfile: currentProfile,
    };
  }

  const found = VALID_REDEEM_CODES[normalized];
  if (!found) {
    return {
      success: false,
      message: `Invalid curse incantation code "${normalized}". Check the hint list!`,
      updatedProfile: currentProfile,
    };
  }

  const newFingers = Math.min(20, currentProfile.fingersConsumed + found.rewardFingers);
  const newCE = currentProfile.cursedEnergy + found.rewardCursedEnergy;
  const newBadges = [...currentProfile.badges];
  if (found.badge && !newBadges.includes(found.badge)) {
    newBadges.push(found.badge);
  }

  const updatedProfile: SorcererProfile = {
    ...currentProfile,
    fingersConsumed: newFingers,
    cursedEnergy: newCE,
    title: found.rewardTitle || currentProfile.title,
    redeemedCodes: [...currentProfile.redeemedCodes, normalized],
    badges: newBadges,
  };

  saveSorcererProfile(updatedProfile);

  return {
    success: true,
    message: `Code "${normalized}" successfully invoked! Received ${found.rewardFingers} Sukuna Fingers and +${found.rewardCursedEnergy.toLocaleString()} Cursed Energy!`,
    updatedProfile,
  };
}
