export type Faction = 'Royal' | 'Warrior' | 'Priest' | 'Nomad' | 'Mystic' | 'Undead';

export type GamePhase = 'menu' | 'preparation' | 'combat' | 'result' | 'gameover';

export interface Position {
    x: number; // column 0-7
    y: number; // row 0-3
}

export interface UnitDefinition {
    id: string;
    name: string;
    tier: 1 | 2 | 3;
    baseHp: number;
    baseAttack: number;
    attackRange: number; // 1 = melee, 2+ = ranged
    attackSpeed: number; // attacks per second
    cost: number;
    factions: Faction[];
    abilityName: string;
    abilityDescription: string;
    portraitImage: string;
}

export interface BoardUnit {
    instanceId: string;
    definitionId: string;
    name: string;
    tier: 1 | 2 | 3;
    hp: number;
    maxHp: number;
    attack: number;
    attackRange: number;
    attackSpeed: number;
    factions: Faction[];
    abilityName: string;
    abilityDescription: string;
    portraitImage: string;
    position: Position;
    isEnemy: boolean;
    isDead: boolean;
    isAttacking: boolean;
    lastAttackTime: number;
}

export interface BenchUnit {
    instanceId: string;
    definitionId: string;
    name: string;
    tier: 1 | 2 | 3;
    hp: number;
    maxHp: number;
    attack: number;
    attackRange: number;
    attackSpeed: number;
    factions: Faction[];
    abilityName: string;
    abilityDescription: string;
    portraitImage: string;
}

export interface ShopUnit {
    slotIndex: number;
    definitionId: string;
    name: string;
    tier: 1 | 2 | 3;
    cost: number;
    factions: Faction[];
    abilityName: string;
    abilityDescription: string;
    portraitImage: string;
    sold: boolean;
}

export interface SynergyDefinition {
    id: string;
    name: string;
    faction: Faction;
    icon: string;
    description: string;
    thresholds: number[];
    bonusDescriptions: string[];
}

export interface ActiveSynergy {
    synergyId: string;
    faction: Faction;
    count: number;
    activeThreshold: number | null;
}

export interface FloatingDamage {
    id: string;
    x: number;
    y: number;
    value: number;
    isCrit: boolean;
    timestamp: number;
}

export interface CombatEvent {
    type: 'attack' | 'death' | 'heal';
    attackerId: string;
    targetId?: string;
    damage?: number;
    isCrit?: boolean;
}

export interface GameState {
    phase: GamePhase;
    round: number;
    playerHp: number;
    maxPlayerHp: number;
    gold: number;
    bench: BenchUnit[];
    board: BoardUnit[];
    shop: ShopUnit[];
    enemyUnits: BoardUnit[];
    prepTimeLeft: number;
    combatLog: string[];
    roundResult: 'win' | 'loss' | null;
    floatingDamages: FloatingDamage[];
}
