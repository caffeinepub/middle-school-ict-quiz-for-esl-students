export type UnitClass = 'priest' | 'warrior' | 'archer' | 'guardian' | 'mage' | 'cavalry' | 'ruler';
export type UnitTrait = 'sun' | 'undead' | 'sky' | 'sphinx' | 'death' | 'magic' | 'war' | 'divine';
export type UnitTier = 1 | 2 | 3;

export interface UnitDefinition {
  id: string;
  name: string;
  title: string;
  cost: number;
  tier: UnitTier;
  class: UnitClass;
  traits: UnitTrait[];
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  ability: {
    name: string;
    description: string;
    cooldown: number;
  };
  portraitUrl: string;
  description: string;
  color: string;
}

export const UNIT_DEFINITIONS: UnitDefinition[] = [
  {
    id: 'ra-priest',
    name: 'Ra Priest',
    title: 'Servant of the Sun God',
    cost: 1,
    tier: 1,
    class: 'priest',
    traits: ['sun', 'divine'],
    hp: 500,
    attack: 45,
    defense: 20,
    speed: 1.0,
    ability: {
      name: 'Solar Blessing',
      description: 'Heals the lowest HP ally for 150 HP.',
      cooldown: 4,
    },
    portraitUrl: '/assets/generated/unit-ra-priest.dim_256x256.png',
    description: 'A devoted priest of Ra who channels the power of the sun to heal allies.',
    color: '#D4A017',
  },
  {
    id: 'mummy-warrior',
    name: 'Mummy Warrior',
    title: 'Undying Soldier',
    cost: 1,
    tier: 1,
    class: 'warrior',
    traits: ['undead'],
    hp: 800,
    attack: 60,
    defense: 35,
    speed: 0.7,
    ability: {
      name: 'Undying Rage',
      description: 'Upon death, revives once with 200 HP.',
      cooldown: 0,
    },
    portraitUrl: '/assets/generated/unit-mummy-warrior.dim_256x256.png',
    description: 'An ancient warrior bound by dark magic, capable of rising from death.',
    color: '#8B7355',
  },
  {
    id: 'horus-archer',
    name: 'Horus Archer',
    title: 'Eye of Horus',
    cost: 2,
    tier: 1,
    class: 'archer',
    traits: ['sky'],
    hp: 550,
    attack: 80,
    defense: 15,
    speed: 1.2,
    ability: {
      name: 'Falcon Strike',
      description: 'Fires a piercing arrow dealing 200 damage to a line of enemies.',
      cooldown: 5,
    },
    portraitUrl: '/assets/generated/unit-horus-archer.dim_256x256.png',
    description: 'A swift archer blessed by Horus, whose arrows never miss their mark.',
    color: '#4A90D9',
  },
  {
    id: 'sphinx',
    name: 'Sphinx',
    title: 'Guardian of Secrets',
    cost: 3,
    tier: 2,
    class: 'guardian',
    traits: ['sphinx'],
    hp: 1200,
    attack: 70,
    defense: 60,
    speed: 0.8,
    ability: {
      name: 'Riddle of the Ages',
      description: 'Silences all enemies for 2 seconds, preventing abilities.',
      cooldown: 6,
    },
    portraitUrl: '/assets/generated/unit-sphinx.dim_256x256.png',
    description: 'The legendary Sphinx, guardian of ancient knowledge and keeper of riddles.',
    color: '#C8A96E',
  },
  {
    id: 'anubis-guard',
    name: 'Anubis Guard',
    title: 'Warden of the Dead',
    cost: 2,
    tier: 1,
    class: 'guardian',
    traits: ['death', 'undead'],
    hp: 900,
    attack: 65,
    defense: 50,
    speed: 0.9,
    ability: {
      name: 'Death Mark',
      description: 'Marks an enemy, reducing their defense by 30% for 4 seconds.',
      cooldown: 5,
    },
    portraitUrl: '/assets/generated/unit-anubis-guard.dim_256x256.png',
    description: 'A fearsome guardian of Anubis who weakens enemies with the touch of death.',
    color: '#2D2D2D',
  },
  {
    id: 'isis-sorceress',
    name: 'Isis Sorceress',
    title: 'Mistress of Magic',
    cost: 3,
    tier: 2,
    class: 'mage',
    traits: ['magic', 'divine'],
    hp: 600,
    attack: 110,
    defense: 20,
    speed: 1.0,
    ability: {
      name: 'Wings of Isis',
      description: 'Deals 300 magic damage to all enemies in a cone.',
      cooldown: 5,
    },
    portraitUrl: '/assets/generated/unit-isis-sorceress.dim_256x256.png',
    description: 'The powerful sorceress Isis, wielding ancient magic to devastate foes.',
    color: '#9B59B6',
  },
  {
    id: 'charioteer',
    name: 'Charioteer',
    title: 'Desert Raider',
    cost: 2,
    tier: 1,
    class: 'cavalry',
    traits: ['war', 'sky'],
    hp: 700,
    attack: 90,
    defense: 25,
    speed: 1.5,
    ability: {
      name: 'Chariot Charge',
      description: 'Charges through enemies dealing 150 damage and stunning for 1 second.',
      cooldown: 4,
    },
    portraitUrl: '/assets/generated/unit-charioteer.dim_256x256.png',
    description: 'A swift charioteer who charges through enemy lines with devastating force.',
    color: '#E67E22',
  },
  {
    id: 'pharaoh',
    name: 'Pharaoh',
    title: 'God-King of Egypt',
    cost: 5,
    tier: 3,
    class: 'ruler',
    traits: ['divine', 'sun', 'war'],
    hp: 1800,
    attack: 130,
    defense: 70,
    speed: 1.0,
    ability: {
      name: 'Divine Decree',
      description: 'Buffs all allies with +30% attack and +20% defense for 5 seconds.',
      cooldown: 8,
    },
    portraitUrl: '/assets/generated/unit-pharaoh.dim_256x256.png',
    description: 'The mighty Pharaoh, god-king of Egypt, whose presence inspires all allies.',
    color: '#F1C40F',
  },
];

export const SYNERGY_DEFINITIONS = {
  sun: {
    name: 'Sun Cult',
    icon: '☀️',
    description: 'Sun units gain bonus attack speed.',
    thresholds: [
      { count: 2, bonus: '+15% attack speed' },
      { count: 4, bonus: '+35% attack speed' },
    ],
  },
  undead: {
    name: 'Undead Legion',
    icon: '💀',
    description: 'Undead units gain bonus HP regeneration.',
    thresholds: [
      { count: 2, bonus: '+50 HP regen/s' },
      { count: 4, bonus: '+120 HP regen/s' },
    ],
  },
  sky: {
    name: 'Sky Warriors',
    icon: '🦅',
    description: 'Sky units gain bonus attack range.',
    thresholds: [
      { count: 2, bonus: '+1 attack range' },
      { count: 3, bonus: '+2 attack range, +20% damage' },
    ],
  },
  sphinx: {
    name: 'Ancient Mystery',
    icon: '🔮',
    description: 'Sphinx units reduce enemy ability cooldowns.',
    thresholds: [
      { count: 1, bonus: 'Enemies have +2s ability cooldown' },
    ],
  },
  death: {
    name: 'Death Cult',
    icon: '⚰️',
    description: 'Death units deal bonus damage to low HP enemies.',
    thresholds: [
      { count: 2, bonus: '+25% damage vs enemies below 30% HP' },
      { count: 3, bonus: '+50% damage vs enemies below 50% HP' },
    ],
  },
  magic: {
    name: 'Arcane Arts',
    icon: '✨',
    description: 'Magic units gain spell power.',
    thresholds: [
      { count: 2, bonus: '+20% spell damage' },
      { count: 4, bonus: '+50% spell damage, spells pierce armor' },
    ],
  },
  war: {
    name: 'War Machine',
    icon: '⚔️',
    description: 'War units gain bonus attack damage.',
    thresholds: [
      { count: 2, bonus: '+20% attack damage' },
      { count: 4, bonus: '+45% attack damage' },
    ],
  },
  divine: {
    name: 'Divine Favor',
    icon: '👁️',
    description: 'Divine units gain bonus HP and healing.',
    thresholds: [
      { count: 2, bonus: '+200 max HP' },
      { count: 4, bonus: '+500 max HP, +10% healing received' },
    ],
  },
};
