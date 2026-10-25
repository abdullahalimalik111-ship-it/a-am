/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SukunaAbility {
  id: string;
  name: string;
  japanese: string;
  category: 'Slashing' | 'Thermal' | 'Domain' | 'Ten Shadows' | 'Cursed Tool' | 'Physical & RCT';
  chants?: string[];
  description: string;
  lore: string;
  fxType: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'world_slash' | 'lightning' | 'heal';
  damageRating: string;
}

export const ALL_SUKUNA_ABILITIES: SukunaAbility[] = [
  {
    id: 'dismantle',
    name: 'Dismantle',
    japanese: '解 (Kai)',
    category: 'Slashing',
    description: 'The standard invisible slash of Shrine, flying through the air to sever targets cleanly.',
    lore: 'Primarily used on inanimate matter or opponents without active cursed energy reinforcement. Sukuna can fire dozens of these in a heartbeat.',
    fxType: 'dismantle',
    damageRating: 'Special Grade High',
  },
  {
    id: 'cleave',
    name: 'Cleave',
    japanese: '捌き (Hachi)',
    category: 'Slashing',
    description: 'The adjusted slash that tailors its cutting frequency and cursed energy to the target’s durability.',
    lore: 'Requires physical contact or close proximity. Because it measures toughness and cuts through in one blow, it is notoriously impossible to defend against normally.',
    fxType: 'cleave',
    damageRating: 'Special Grade Fatal',
  },
  {
    id: 'spiderweb',
    name: 'Spiderweb Cleave',
    japanese: '蜘蛛の糸 (Kumo no Ito)',
    category: 'Slashing',
    description: 'Directs Cleave through the earth and walls in an expanding spiderweb pattern, collapsing entire city blocks.',
    lore: 'Used against Maki Zenin to bypass her airborne footing and demolish the foundations beneath her feet.',
    fxType: 'cleave',
    damageRating: 'Catastrophic AOE',
  },
  {
    id: 'world_slash',
    name: 'World Cutting Slash',
    japanese: '世界を断つ斬撃 (Sekai o Tatsu Zangeki)',
    category: 'Slashing',
    chants: ['Dragon Scales (竜鱗)', 'Repulsion (反発)', 'Paired Meteors (番の流星)'],
    description: 'An extended Dismantle that expands its target from the opponent to space, existence, and the entire world itself.',
    lore: 'Learned by witnessing Mahoraga’s second adaptation against Satoru Gojo. It does not cut through Infinity; it cuts the very space Infinity occupies.',
    fxType: 'world_slash',
    damageRating: 'Existential / Reality-Severing',
  },
  {
    id: 'fuga',
    name: 'Furnace: Flame Arrow (Fuga)',
    japanese: '竈 (Kamado / 開 - Fūga)',
    category: 'Thermal',
    chants: ['■ Open (開)'],
    description: 'A terrifying thermonuclear heat arrow condensed at his fingertips, launched like a bowstring draw.',
    lore: 'Requires Shrine’s slashes to pulverize the surrounding terrain into fine combustible particulate dust before igniting it as a thermobaric explosion.',
    fxType: 'fuga',
    damageRating: 'Ground Zero Incineration',
  },
  {
    id: 'malevolent_shrine',
    name: 'Domain Expansion: Malevolent Shrine',
    japanese: '伏魔御廚子 (Fukuma Mizushi)',
    category: 'Domain',
    chants: ['Enmaten Mudra (閻魔天の印)'],
    description: 'A barrierless divine domain that materializes a Buddhist shrine of skulls in physical reality with up to 200m sure-hit radius.',
    lore: 'Cleave relentlessly rains upon everything with cursed energy, while Dismantle shreds inanimate matter until whole districts are ground into dust.',
    fxType: 'domain',
    damageRating: 'Pinnacle Sure-Hit Cataclysm',
  },
  {
    id: 'mahoraga_adapt',
    name: 'Ten Shadows: Mahoraga Adaptation',
    japanese: '八握剣 異戒神将 魔虚羅',
    category: 'Ten Shadows',
    description: 'The Eight-Handled Sword Divine General that adapts to any attack after turning the dharma wheel on its back.',
    lore: 'Sukuna bore the burden of adaptation in his soul while fighting Gojo, utilizing Mahoraga’s blueprint to devise the World Cutting Slash.',
    fxType: 'world_slash',
    damageRating: 'Infinite Adaptive Defense & Counter',
  },
  {
    id: 'kamutoke',
    name: 'Supreme Martial Solution: Kamutoke',
    japanese: '神武解 (Kamutoke)',
    category: 'Cursed Tool',
    description: 'An ancient Heian vajra dagger capable of calling down devastating thunderbolts of divine lightning.',
    lore: 'Crafted for Sukuna by Yorozu. Sukuna wielded it to rain lightning upon the sorcerers in Shinjuku.',
    fxType: 'lightning',
    damageRating: 'Special Grade High Voltage',
  },
  {
    id: 'domain_amplification',
    name: 'Domain Amplification',
    japanese: '領域展延 (Ryōiki Ten\'en)',
    category: 'Domain',
    description: 'Wrapping an empty domain closely around one’s body to neutralize enemy innate techniques on contact.',
    lore: 'Allows Sukuna to physically touch Gojo through Infinity, trading off his own innate technique while active.',
    fxType: 'cleave',
    damageRating: 'Technique Nullification',
  },
  {
    id: 'rct_brain_reset',
    name: 'Reverse Cursed Technique & Brain Refresh',
    japanese: '反転術式 & 脳修復',
    category: 'Physical & RCT',
    description: 'Instantly regenerates lost limbs, heals fatal wounds, and destroys & restores the prefrontal cortex to reset burned-out cursed techniques.',
    lore: 'A masterclass feat of Jujutsu physiology that ordinary sorcerers would commit suicide trying to replicate.',
    fxType: 'heal',
    damageRating: 'Instant Restoration',
  },
  {
    id: 'heian_true_form',
    name: 'Heian Era True Incarnation',
    japanese: '完全変態 (Heian Sukuna)',
    category: 'Physical & RCT',
    description: 'The four-armed, two-faced body of the King of Curses with an extra stomach mouth for ceaseless chants.',
    lore: 'The ideal sorcerer anatomy: two hands continuously weave hand signs, two hands engage in melee, and the stomach mouth recites incantations without breathlessness.',
    fxType: 'world_slash',
    damageRating: 'Peak Physical & Jujutsu Supremacy',
  },
];
