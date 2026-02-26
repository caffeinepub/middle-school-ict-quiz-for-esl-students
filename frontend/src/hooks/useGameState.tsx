import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { UNIT_DEFINITIONS, UnitDefinition, UnitTrait } from '../data/units';

export type GamePhase = 'prep' | 'battle' | 'result';
export type GameScreen = 'menu' | 'game' | 'gameover';

export interface BoardUnit {
  instanceId: string;
  unitId: string;
  definition: UnitDefinition;
  position: number; // 0-27 for player board (4 rows x 7 cols), 28-55 for enemy
  currentHp: number;
  maxHp: number;
  isPlayer: boolean;
  isAlive: boolean;
  statusEffects: string[];
  starLevel: 1 | 2 | 3;
}

export interface ShopUnit {
  instanceId: string;
  unitId: string;
  definition: UnitDefinition;
  cost: number;
}

export interface GameState {
  screen: GameScreen;
  phase: GamePhase;
  round: number;
  playerHp: number;
  gold: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  bench: BoardUnit[];
  board: BoardUnit[];
  enemyBoard: BoardUnit[];
  shop: ShopUnit[];
  selectedUnit: BoardUnit | null;
  battleLog: string[];
  wins: number;
  losses: number;
  streak: number;
  isBattling: boolean;
  battleResult: 'win' | 'loss' | 'draw' | null;
  activeSynergies: Record<string, number>;
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  returnToMenu: () => void;
  buyUnit: (shopUnit: ShopUnit) => void;
  sellUnit: (instanceId: string) => void;
  placeUnit: (instanceId: string, position: number) => void;
  removeFromBoard: (instanceId: string) => void;
  selectUnit: (unit: BoardUnit | null) => void;
  rerollShop: () => void;
  buyXp: () => void;
  startBattle: () => void;
  nextRound: () => void;
  lockShop: () => void;
  isShopLocked: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

const XP_TABLE = [0, 2, 6, 10, 20, 36, 56, 80, 100];
const BOARD_SIZE = 28;
const MAX_BENCH = 9;

function generateInstanceId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateShop(level: number): ShopUnit[] {
  const pool = [...UNIT_DEFINITIONS];
  const shopSize = 5;
  const result: ShopUnit[] = [];

  // Weight by tier based on level
  const tierWeights: Record<number, number[]> = {
    1: [100, 0, 0],
    2: [70, 30, 0],
    3: [50, 40, 10],
    4: [35, 40, 25],
    5: [20, 35, 45],
    6: [15, 25, 60],
    7: [10, 20, 70],
    8: [5, 15, 80],
    9: [0, 10, 90],
  };

  const weights = tierWeights[Math.min(level, 9)] || tierWeights[9];

  for (let i = 0; i < shopSize; i++) {
    const roll = Math.random() * 100;
    let tierTarget: 1 | 2 | 3 = 1;
    if (roll < weights[2]) tierTarget = 3;
    else if (roll < weights[2] + weights[1]) tierTarget = 2;

    const tierPool = pool.filter(u => u.tier === tierTarget);
    const fallbackPool = tierPool.length > 0 ? tierPool : pool;
    const chosen = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];

    result.push({
      instanceId: generateInstanceId(),
      unitId: chosen.id,
      definition: chosen,
      cost: chosen.cost,
    });
  }

  return result;
}

function generateEnemyBoard(round: number): BoardUnit[] {
  const difficulty = Math.min(round, 8);
  const count = Math.min(2 + Math.floor(round / 2), 7);
  const enemies: BoardUnit[] = [];

  // Pick units appropriate for the round
  const availableUnits = UNIT_DEFINITIONS.filter(u => u.tier <= Math.ceil(difficulty / 3));
  if (availableUnits.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const def = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    const hpScale = 1 + (round - 1) * 0.15;
    const atkScale = 1 + (round - 1) * 0.12;

    enemies.push({
      instanceId: generateInstanceId(),
      unitId: def.id,
      definition: def,
      position: 28 + i,
      currentHp: Math.floor(def.hp * hpScale),
      maxHp: Math.floor(def.hp * hpScale),
      isPlayer: false,
      isAlive: true,
      statusEffects: [],
      starLevel: round >= 6 ? 2 : 1,
    });
  }

  return enemies;
}

function calculateSynergies(board: BoardUnit[]): Record<string, number> {
  const counts: Record<string, number> = {};
  board.forEach(unit => {
    if (unit.isAlive) {
      unit.definition.traits.forEach(trait => {
        counts[trait] = (counts[trait] || 0) + 1;
      });
    }
  });
  return counts;
}

function simulateBattle(playerBoard: BoardUnit[], enemyBoard: BoardUnit[]): {
  result: 'win' | 'loss' | 'draw';
  log: string[];
  survivingEnemies: number;
} {
  const log: string[] = [];

  // Deep copy units for simulation
  const players = playerBoard.map(u => ({ ...u, currentHp: u.currentHp }));
  const enemies = enemyBoard.map(u => ({ ...u, currentHp: u.currentHp }));

  if (players.length === 0) {
    return { result: 'loss', log: ['No units on the board!'], survivingEnemies: enemies.length };
  }

  let round = 0;
  const maxRounds = 20;

  while (round < maxRounds) {
    const alivePlayers = players.filter(u => u.currentHp > 0);
    const aliveEnemies = enemies.filter(u => u.currentHp > 0);

    if (alivePlayers.length === 0 || aliveEnemies.length === 0) break;

    // Each player attacks a random enemy
    alivePlayers.forEach(player => {
      if (aliveEnemies.length === 0) return;
      const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      const dmg = Math.max(1, player.definition.attack - target.definition.defense / 2);
      target.currentHp -= dmg;
      if (target.currentHp <= 0) {
        log.push(`${player.definition.name} defeated ${target.definition.name}!`);
      }
    });

    // Each enemy attacks a random player
    const stillAliveEnemies = enemies.filter(u => u.currentHp > 0);
    const stillAlivePlayers = players.filter(u => u.currentHp > 0);

    stillAliveEnemies.forEach(enemy => {
      if (stillAlivePlayers.length === 0) return;
      const target = stillAlivePlayers[Math.floor(Math.random() * stillAlivePlayers.length)];
      const dmg = Math.max(1, enemy.definition.attack - target.definition.defense / 2);
      target.currentHp -= dmg;
      if (target.currentHp <= 0) {
        log.push(`${enemy.definition.name} defeated ${target.definition.name}!`);
      }
    });

    round++;
  }

  const finalPlayers = players.filter(u => u.currentHp > 0);
  const finalEnemies = enemies.filter(u => u.currentHp > 0);

  let result: 'win' | 'loss' | 'draw';
  if (finalPlayers.length > 0 && finalEnemies.length === 0) {
    result = 'win';
    log.push('Victory! Your army prevailed!');
  } else if (finalPlayers.length === 0 && finalEnemies.length > 0) {
    result = 'loss';
    log.push('Defeat! Your army was vanquished!');
  } else {
    result = 'draw';
    log.push('Draw! Both armies fought to a standstill!');
  }

  return { result, log, survivingEnemies: finalEnemies.length };
}

const initialState: GameState = {
  screen: 'menu',
  phase: 'prep',
  round: 1,
  playerHp: 100,
  gold: 5,
  xp: 0,
  level: 1,
  xpToNextLevel: 2,
  bench: [],
  board: [],
  enemyBoard: [],
  shop: [],
  selectedUnit: null,
  battleLog: [],
  wins: 0,
  losses: 0,
  streak: 0,
  isBattling: false,
  battleResult: null,
  activeSynergies: {},
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [isShopLocked, setIsShopLocked] = useState(false);
  const battleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    const shop = generateShop(1);
    const enemyBoard = generateEnemyBoard(1);
    setState({
      ...initialState,
      screen: 'game',
      shop,
      enemyBoard,
      gold: 5,
    });
    setIsShopLocked(false);
  }, []);

  const returnToMenu = useCallback(() => {
    if (battleTimeoutRef.current) clearTimeout(battleTimeoutRef.current);
    setState(prev => ({ ...prev, screen: 'menu' }));
  }, []);

  const buyUnit = useCallback((shopUnit: ShopUnit) => {
    setState(prev => {
      if (prev.gold < shopUnit.cost) return prev;
      if (prev.bench.length >= MAX_BENCH) return prev;

      const newUnit: BoardUnit = {
        instanceId: generateInstanceId(),
        unitId: shopUnit.unitId,
        definition: shopUnit.definition,
        position: -1,
        currentHp: shopUnit.definition.hp,
        maxHp: shopUnit.definition.hp,
        isPlayer: true,
        isAlive: true,
        statusEffects: [],
        starLevel: 1,
      };

      // Check for 3-star upgrade
      const sameUnits = [...prev.bench, ...prev.board].filter(u => u.unitId === shopUnit.unitId && u.starLevel === 1);
      if (sameUnits.length >= 2) {
        // Upgrade to 2-star
        const toRemove = sameUnits.slice(0, 2).map(u => u.instanceId);
        const newBench = prev.bench.filter(u => !toRemove.includes(u.instanceId));
        const newBoard = prev.board.filter(u => !toRemove.includes(u.instanceId));
        const upgradedUnit: BoardUnit = {
          ...newUnit,
          starLevel: 2,
          maxHp: shopUnit.definition.hp * 1.8,
          currentHp: shopUnit.definition.hp * 1.8,
        };
        return {
          ...prev,
          gold: prev.gold - shopUnit.cost,
          bench: [...newBench, upgradedUnit],
          board: newBoard,
          shop: prev.shop.filter(s => s.instanceId !== shopUnit.instanceId),
        };
      }

      return {
        ...prev,
        gold: prev.gold - shopUnit.cost,
        bench: [...prev.bench, newUnit],
        shop: prev.shop.filter(s => s.instanceId !== shopUnit.instanceId),
      };
    });
  }, []);

  const sellUnit = useCallback((instanceId: string) => {
    setState(prev => {
      const unit = [...prev.bench, ...prev.board].find(u => u.instanceId === instanceId);
      if (!unit) return prev;

      const sellValue = unit.definition.cost * unit.starLevel;
      const newBench = prev.bench.filter(u => u.instanceId !== instanceId);
      const newBoard = prev.board.filter(u => u.instanceId !== instanceId);
      const newSynergies = calculateSynergies(newBoard);

      return {
        ...prev,
        gold: prev.gold + sellValue,
        bench: newBench,
        board: newBoard,
        selectedUnit: prev.selectedUnit?.instanceId === instanceId ? null : prev.selectedUnit,
        activeSynergies: newSynergies,
      };
    });
  }, []);

  const placeUnit = useCallback((instanceId: string, position: number) => {
    setState(prev => {
      if (prev.phase === 'battle') return prev;

      const unit = [...prev.bench, ...prev.board].find(u => u.instanceId === instanceId);
      if (!unit) return prev;

      // Check board size limit (level = max board units)
      const currentBoardCount = prev.board.filter(u => u.instanceId !== instanceId).length;
      const isFromBench = prev.bench.some(u => u.instanceId === instanceId);

      if (isFromBench && currentBoardCount >= prev.level) return prev;

      // Check if position is occupied
      const occupant = prev.board.find(u => u.position === position && u.instanceId !== instanceId);

      let newBoard = prev.board.filter(u => u.instanceId !== instanceId);
      let newBench = prev.bench.filter(u => u.instanceId !== instanceId);

      if (occupant) {
        // Swap: move occupant to bench
        newBench = [...newBench, { ...occupant, position: -1 }];
        newBoard = newBoard.filter(u => u.instanceId !== occupant.instanceId);
      }

      newBoard = [...newBoard, { ...unit, position, isPlayer: true }];
      const newSynergies = calculateSynergies(newBoard);

      return {
        ...prev,
        board: newBoard,
        bench: newBench,
        activeSynergies: newSynergies,
      };
    });
  }, []);

  const removeFromBoard = useCallback((instanceId: string) => {
    setState(prev => {
      if (prev.phase === 'battle') return prev;
      const unit = prev.board.find(u => u.instanceId === instanceId);
      if (!unit) return prev;

      const newBoard = prev.board.filter(u => u.instanceId !== instanceId);
      const newBench = [...prev.bench, { ...unit, position: -1 }];
      const newSynergies = calculateSynergies(newBoard);

      return {
        ...prev,
        board: newBoard,
        bench: newBench,
        activeSynergies: newSynergies,
      };
    });
  }, []);

  const selectUnit = useCallback((unit: BoardUnit | null) => {
    setState(prev => ({ ...prev, selectedUnit: unit }));
  }, []);

  const rerollShop = useCallback(() => {
    setState(prev => {
      if (prev.gold < 2) return prev;
      if (isShopLocked) return prev;
      return {
        ...prev,
        gold: prev.gold - 2,
        shop: generateShop(prev.level),
      };
    });
  }, [isShopLocked]);

  const buyXp = useCallback(() => {
    setState(prev => {
      if (prev.gold < 4) return prev;
      const newXp = prev.xp + 4;
      const xpNeeded = XP_TABLE[prev.level] || 100;
      if (newXp >= xpNeeded && prev.level < 9) {
        return {
          ...prev,
          gold: prev.gold - 4,
          xp: newXp - xpNeeded,
          level: prev.level + 1,
          xpToNextLevel: XP_TABLE[prev.level + 1] || 100,
        };
      }
      return {
        ...prev,
        gold: prev.gold - 4,
        xp: newXp,
      };
    });
  }, []);

  const lockShop = useCallback(() => {
    setIsShopLocked(prev => !prev);
  }, []);

  const startBattle = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'prep') return prev;
      if (prev.board.length === 0) return prev;

      const { result, log, survivingEnemies } = simulateBattle(prev.board, prev.enemyBoard);

      return {
        ...prev,
        phase: 'battle',
        isBattling: true,
        battleLog: log,
        battleResult: result,
      };
    });

    // After "battle animation" time, show result
    battleTimeoutRef.current = setTimeout(() => {
      setState(prev => {
        if (!prev.battleResult) return prev;

        let hpLoss = 0;
        if (prev.battleResult === 'loss') {
          hpLoss = 5 + prev.round;
        } else if (prev.battleResult === 'draw') {
          hpLoss = 2;
        }

        const newHp = Math.max(0, prev.playerHp - hpLoss);
        const newWins = prev.battleResult === 'win' ? prev.wins + 1 : prev.wins;
        const newLosses = prev.battleResult === 'loss' ? prev.losses + 1 : prev.losses;
        const newStreak = prev.battleResult === 'win' ? prev.streak + 1 : 0;

        if (newHp <= 0) {
          return {
            ...prev,
            playerHp: 0,
            wins: newWins,
            losses: newLosses,
            streak: newStreak,
            isBattling: false,
            phase: 'result',
            screen: 'gameover',
          };
        }

        return {
          ...prev,
          playerHp: newHp,
          wins: newWins,
          losses: newLosses,
          streak: newStreak,
          isBattling: false,
          phase: 'result',
        };
      });
    }, 3000);
  }, []);

  const nextRound = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'result') return prev;

      const newRound = prev.round + 1;
      // Gold income: base 5 + streak bonus + interest
      const streakBonus = Math.min(prev.streak, 3);
      const interest = Math.min(Math.floor(prev.gold / 10), 5);
      const newGold = Math.min(10, 5 + streakBonus + interest);

      // Level up XP
      const xpGain = 2;
      const newXp = prev.xp + xpGain;
      const xpNeeded = XP_TABLE[prev.level] || 100;
      let newLevel = prev.level;
      let finalXp = newXp;
      if (newXp >= xpNeeded && prev.level < 9) {
        newLevel = prev.level + 1;
        finalXp = newXp - xpNeeded;
      }

      const newEnemyBoard = generateEnemyBoard(newRound);
      const newShop = isShopLocked ? prev.shop : generateShop(newLevel);

      return {
        ...prev,
        round: newRound,
        gold: newGold,
        xp: finalXp,
        level: newLevel,
        xpToNextLevel: XP_TABLE[newLevel] || 100,
        phase: 'prep',
        battleResult: null,
        battleLog: [],
        enemyBoard: newEnemyBoard,
        shop: newShop,
        isBattling: false,
      };
    });
  }, [isShopLocked]);

  useEffect(() => {
    return () => {
      if (battleTimeoutRef.current) clearTimeout(battleTimeoutRef.current);
    };
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      returnToMenu,
      buyUnit,
      sellUnit,
      placeUnit,
      removeFromBoard,
      selectUnit,
      rerollShop,
      buyXp,
      startBattle,
      nextRound,
      lockShop,
      isShopLocked,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be used within GameProvider');
  return ctx;
}
