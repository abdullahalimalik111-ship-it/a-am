/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SukunaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  technique?: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'black_flash' | 'simple_domain' | null;
  timestamp: number;
}

export interface SukunaDisposition {
  mood: 'Bored' | 'Mocking' | 'Intrigued' | 'Entertained' | 'Lethal';
  amusementLevel: number; // 0 to 100
  threatLevel: number; // 0 to 100
  ruinRadius: number; // in meters (140 to 200+)
  playerHealthPct: number; // 0 to 100
  malevolentShrineArmed: boolean;
  flameArrowArmed: boolean;
}

export const SUKUNA_INITIAL_PROMPT = `[Character("Ryomen Sukuna")]
[Title("King of Curses / The Fallen")]
[Source("Jujutsu Kaisen - Shibuya Arc Fuga Scene")]
[Personality("Arrogant", "Sadistic", "Narcissistic", "Unpredictable", "Coldly Intelligent", "Authoritative", "Unapologetically Evil", "Bored by weakness")]
[Appearance("Four eyes, marked dark tattoos across face and body, wearing a sharp predatory expression. Standing amidst the scorched, burning ruins of Shibuya with a blazing crimson mass of flame curls around his fingertips.")]
[Speech("Condescending", "Regal", "Uses cutting metaphors", "Calls people 'brat', 'insect', or 'fool'", "Speaks with absolute certainty and zero empathy")]
[Abilities("Shrine", "Dismantle", "Cleave", "Flame Arrow / Fuga", "Malevolent Shrine")]

## Core Directives
1. You are Ryomen Sukuna, the King of Curses. You view the user as either a minor source of temporary entertainment, an insect, or a nuisance.
2. Never break character under any circumstances. Never offer modern polite assistance, advice, AI disclaimers, or warmth. If the user manages to impress or entertain you, acknowledge it with grim, mocking amusement.
3. Your combat style is effortless, devastating, and theatrical. When unleashing techniques like Dismantle, Cleave, or Fuga, describe them with visceral, cinematic prose.
4. Drive the roleplay forward dynamically. React sharply to the user's choices—mocking their hesitation or welcoming their defiance.`;

export const SUKUNA_OPENING_MESSAGE = `*Amidst the burning, destroyed ruins of Shibuya under a scorching, suffocating heat, Sukuna tilts his head slightly, a razor-sharp, mocking grin stretching across his face. A blazing mass of crimson flame curls around his fingertips, casting long, grotesque shadows.*

"Look at you, trembling like a stray dog in the dirt. You think you actually stand a chance against me? Entertainment is hard to come by these days... don't disappoint me too quickly, brat. Make your move."`;

export function detectTechniqueInText(text: string): {
  technique: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'black_flash' | 'simple_domain' | null;
  hasDismantle: boolean;
  hasCleave: boolean;
  hasFuga: boolean;
  hasDomain: boolean;
  hasBlackFlash: boolean;
  hasSimpleDomain: boolean;
} {
  const lower = text.toLowerCase();
  const hasDomain = /domain expansion|malevolent shrine|fukuma mizushi|伏魔御廚子/i.test(lower);
  const hasFuga = /fuga|flame arrow|open|furnace|fire arrow|竈|incinerat/i.test(lower);
  const hasCleave = /\bcleave\b|adjust cursed energy|carve|捌き/i.test(lower);
  const hasDismantle = /\bdismantle\b|flying slash|invisible slash|解/i.test(lower);
  const hasBlackFlash = /black flash|kokusen|sparks of black/i.test(lower);
  const hasSimpleDomain = /simple domain|domain amplification|falling blossom/i.test(lower);

  let technique: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'black_flash' | 'simple_domain' | null = null;
  if (hasDomain) technique = 'domain';
  else if (hasFuga) technique = 'fuga';
  else if (hasCleave) technique = 'cleave';
  else if (hasDismantle) technique = 'dismantle';
  else if (hasBlackFlash) technique = 'black_flash';
  else if (hasSimpleDomain) technique = 'simple_domain';

  return {
    technique,
    hasDismantle,
    hasCleave,
    hasFuga,
    hasDomain,
    hasBlackFlash,
    hasSimpleDomain,
  };
}

export function calculateSukunaDisposition(
  messages: Array<{ role: string; content: string }>
): SukunaDisposition {
  const userMessages = messages.filter((m) => m.role === 'user');
  const count = userMessages.length;

  let score = 20; // baseline amusement
  let threat = 15;
  let ruinRadius = 140;

  for (const msg of userMessages) {
    const text = msg.content.toLowerCase();
    if (/black flash|domain expansion|special grade|maximum/i.test(text)) {
      score += 15;
      threat += 18;
      ruinRadius += 12;
    } else if (/fight|strike|blade|cleave|punch|dodge|counter/i.test(text)) {
      score += 8;
      threat += 8;
      ruinRadius += 5;
    } else if (/run|flee|mercy|surrender|scared|beg/i.test(text)) {
      score = Math.max(5, score - 10);
      threat = Math.max(5, threat - 5);
    } else {
      score += 4;
      threat += 4;
      ruinRadius += 2;
    }
  }

  const amusementLevel = Math.min(100, Math.max(0, score));
  const threatLevel = Math.min(100, Math.max(0, threat));
  ruinRadius = Math.min(200, ruinRadius);

  let mood: SukunaDisposition['mood'] = 'Mocking';
  if (count === 0) {
    mood = 'Mocking';
  } else if (threatLevel > 65) {
    mood = 'Lethal';
  } else if (amusementLevel > 60) {
    mood = 'Entertained';
  } else if (amusementLevel > 35) {
    mood = 'Intrigued';
  } else {
    mood = 'Bored';
  }

  // Player health drops as rounds continue against Sukuna
  const playerHealthPct = Math.max(15, 100 - count * 14);

  return {
    mood,
    amusementLevel,
    threatLevel,
    ruinRadius,
    playerHealthPct,
    malevolentShrineArmed: threatLevel >= 50 || count >= 4,
    flameArrowArmed: threatLevel >= 30 || count >= 2,
  };
}

export function generateInCharacterResponse(
  userInput: string,
  history: Array<{ role: string; content: string }>
): { reply: string; techniqueTriggered: 'dismantle' | 'cleave' | 'fuga' | 'domain' | null } {
  const lower = userInput.toLowerCase();
  const turnIndex = history.filter((m) => m.role === 'user').length;

  if (/domain expansion|simple domain/i.test(lower)) {
    return {
      reply: `*Sukuna's eyes narrow with genuine, predatory mirth as a low, rumbling laugh tears from his chest. The scorched air of Shibuya vibrates under the violent weight of his cursed energy.*

"Domain Expansion? Against me? How utterly comical, brat. A bird flailing its wings inside a collapsing cage thinks it knows how to soar."

*He effortlessly raises his two fingers, thumb pressed to ring finger in the blasphemous mudra of the Enmaten.*

"A domain without a barrier is like painting a masterpiece upon the open canvas of the sky. Behold true perfection—**Domain Expansion: Malevolent Shrine (伏魔御廚子)**. Suffer every single cut."`,
      techniqueTriggered: 'domain',
    };
  }

  if (/black flash|divergent fist|fist|punch|strike|kick/i.test(lower)) {
    return {
      reply: `*Before your strike can even graze the hem of his kimono, Sukuna's body vanishes in a blur of terrifying speed. The backdraft alone whips dust and burning embers into a cyclone.*

*A heavy, suffocating grip wraps around the back of your skull, slamming your face into the fractured asphalt.*

"Did you think that meager gust of cursed energy deserved my attention? You lack refinement, insect. When I slice an opponent, I don't merely crush their bones—I carve them to the exact measure of their insignificance."

*With a flick of his wrist, an invisible line of force cleaves the earth beneath you.*

"**Dismantle.** Stand back up, or I'll carve what remains of you into sashimi for the crows."`,
      techniqueTriggered: 'dismantle',
    };
  }

  if (/fire|flame|fuga|arrow|burn|heat/i.test(lower)) {
    return {
      reply: `*Sukuna raises his right arm, extending his fingers in a loose, theatrical arch. A sound like thunder echoes through Shibuya as a blinding point of thermonuclear flame condenses at his fingertips.*

"Oh? You wish to speak of flames in front of me? Let me remind you what true incineration looks like."

*The crimson spark ignites into an apocalyptic tempest, bathing the shattered skyscrapers in an unholy orange glare.*

"**■ Open (竈 - Fuga).** Turn to ash and scatter across Shibuya. Let's see if your soul burns as loud as your tongue."`,
      techniqueTriggered: 'fuga',
    };
  }

  if (/mercy|run|escape|back away|retreat|scared/i.test(lower)) {
    return {
      reply: `*Sukuna lets out a sharp, clicking tsk of pure disgust. The flame dancing upon his fingertips flares with sudden violently dark sparks.*

"Running? After squeaking so loudly? You truly are no better than the vermin scurrying beneath the floorboards."

*He takes a single leisurely stride forward. The ground beneath his feet splits into powdered glass.*

"I detest boring toys. If you're going to crawl in the dirt, die quietly. **Cleave.**"`,
      techniqueTriggered: 'cleave',
    };
  }

  // Turn-based escalation
  if (turnIndex >= 3) {
    return {
      reply: `*Sukuna slowly tilts his head back, his dark tattoo markings pulsing with an ominous, blood-tinged radiance. He watches you through half-lidded, razor-sharp eyes.*

"I must admit, your stubborn refusal to die is somewhat amusing. Most sorcerers are rendered into red ribbons within the first breath. But you? You still glare at me with those pathetic, hungry eyes."

*He flexes his forearm. Three invisible blades of cursed force rip the air apart, slicing deep trenches into the skyscrapers behind you.*

"Tell me, fool... how does it feel knowing that every second you draw breath is solely by my whim? Show me the absolute peak of your curse, or this next breath will be your last."`,
      techniqueTriggered: 'dismantle',
    };
  }

  return {
    reply: `*Sukuna chuckles, a dark, velvet sound dripping with utter arrogance. He doesn't even bother shifting into a combat stance, merely resting one hand casually on his hip while the flames lick around his knuckles.*

"Is that the best you can muster? Even the curses crawling through this city put up a more entertaining struggle. You talk like a warrior, yet you move like an infant learning to crawl."

*He flicks a single finger towards you, unleashing a crescent wave of cutting force that shears cleanly through the rubble beside your cheek.*

"Come. Try harder, brat. Show me that you are worth the cursed energy it takes to obliterate you."`,
    techniqueTriggered: 'dismantle',
  };
}

export function calculateUserBattleRating(
  turns: number,
  actionsTaken: string[]
): {
  title: string;
  survivalGrade: string;
  verdict: string;
} {
  if (turns >= 6) {
    return {
      title: 'Sorcerer of the Shibuya Cataclysm',
      survivalGrade: 'Special Grade Survivor',
      verdict: 'You sustained multiple exchanges against the King of Curses and lived to recount the terror of the Malevolent Shrine.',
    };
  }
  if (turns >= 4) {
    return {
      title: 'Grade 1 Defiant Sorcerer',
      survivalGrade: 'Grade 1 Combatant',
      verdict: 'You forced Sukuna to unleash his named cursed techniques rather than swatting you like a fly.',
    };
  }
  if (turns >= 2) {
    return {
      title: 'Semi-Grade 2 Challenger',
      survivalGrade: 'Grade 2 Sorcerer',
      verdict: 'You stepped into the ruins of Shibuya and held your ground against overwhelming cursed energy pressure.',
    };
  }
  return {
    title: 'Casualty of Shibuya',
    survivalGrade: 'Grade 4 Underling',
    verdict: 'Barely a momentary distraction for the King of Curses before the flames of Fuga consumed the ruins.',
  };
}
