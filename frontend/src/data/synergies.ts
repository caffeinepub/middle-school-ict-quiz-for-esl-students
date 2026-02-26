import { SynergyDefinition } from '../types/game';

export const SYNERGY_DEFINITIONS: SynergyDefinition[] = [
    {
        id: 'children-of-ra',
        name: 'Children of Ra',
        faction: 'Priest',
        icon: '☀️',
        description: 'Priests of Ra channel solar energy to empower their magic.',
        thresholds: [2, 4],
        bonusDescriptions: [
            '(2) Priest units deal +25% magic damage',
            '(4) Priest units deal +60% magic damage and heal 30 HP per attack',
        ],
    },
    {
        id: 'pharaohs-guard',
        name: "Pharaoh's Guard",
        faction: 'Warrior',
        icon: '⚔️',
        description: 'Elite warriors sworn to protect the Pharaoh gain increased resilience.',
        thresholds: [2, 4],
        bonusDescriptions: [
            '(2) Warrior units gain +20 armor (reduce incoming damage by 15%)',
            '(4) Warrior units gain +40 armor (reduce incoming damage by 30%)',
        ],
    },
    {
        id: 'desert-nomads',
        name: 'Desert Nomads',
        faction: 'Nomad',
        icon: '🐪',
        description: 'Nomads of the desert strike with incredible speed.',
        thresholds: [2, 3],
        bonusDescriptions: [
            '(2) Nomad units gain +20% attack speed',
            '(3) Nomad units gain +50% attack speed and +15 attack',
        ],
    },
    {
        id: 'undead-legion',
        name: 'Undead Legion',
        faction: 'Undead',
        icon: '💀',
        description: 'The undead refuse to stay dead, regenerating HP each round.',
        thresholds: [2, 4],
        bonusDescriptions: [
            '(2) Undead units regenerate 20 HP per second during combat',
            '(4) Undead units regenerate 50 HP per second and revive once with 30% HP',
        ],
    },
    {
        id: 'royal-bloodline',
        name: 'Royal Bloodline',
        faction: 'Royal',
        icon: '👑',
        description: 'The divine right of kings empowers all allied units.',
        thresholds: [1, 2],
        bonusDescriptions: [
            '(1) All allied units gain +10 attack',
            '(2) All allied units gain +25 attack and +100 HP',
        ],
    },
    {
        id: 'ancient-mystics',
        name: 'Ancient Mystics',
        faction: 'Mystic',
        icon: '🔮',
        description: 'Masters of ancient Egyptian magic unleash devastating spells.',
        thresholds: [2, 3],
        bonusDescriptions: [
            '(2) Mystic units deal +30% ability damage',
            '(3) Mystic units deal +70% ability damage and reduce enemy magic resistance',
        ],
    },
];
