import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { GameState, GamePhase, BoardUnit, BenchUnit, ShopUnit, Position, FloatingDamage } from '../types/game';
import { UNIT_DEFINITIONS } from '../data/units';
import { runCombatTick, isCombatOver, SynergyBuffs } from '../utils/combatEngine';
import { calculateSynergies, getSynergyBuffs } from '../utils/synergyCalculator';
import { getTotalGoldIncome, getUnitSellValue } from '../utils/goldEconomy';

const BOARD_COLS = 8;
const BOARD_ROWS = 4;
const PREP_TIME = 30;
const MAX_BENCH = 8;
const MAX_BOARD = 8;
const SHOP_SIZE = 5;
const STARTING_HP = 100;
const STARTING_GOLD = 5;

let instanceCounter = 0;
function newInstanceId(): string {
    return `unit_${++instanceCounter}_${Date.now()}`;
}

function generateShop(): ShopUnit[] {
    const slots: ShopUnit[] = [];
    const pool = [...UNIT_DEFINITIONS];
    for (let i = 0; i < SHOP_SIZE; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const def = pool[idx];
        slots.push({
            slotIndex: i,
            definitionId: def.id,
            name: def.name,
            tier: def.tier,
            cost: def.cost,
            factions: def.factions,
            abilityName: def.abilityName,
            abilityDescription: def.abilityDescription,
            portraitImage: def.portraitImage,
            sold: false,
        });
    }
    return slots;
}

function generateEnemyUnits(round: number): BoardUnit[] {
    const scaleFactor = 1 + (round - 1) * 0.25;
    const count = Math.min(2 + Math.floor(round * 0.8), 8);
    const enemies: BoardUnit[] = [];
    const pool = [...UNIT_DEFINITIONS];

    for (let i = 0; i < count; i++) {
        const def = pool[Math.floor(Math.random() * pool.length)];
        const col = i % BOARD_COLS;
        const row = Math.floor(i / BOARD_COLS);
        const hp = Math.floor(def.baseHp * scaleFactor);
        enemies.push({
            instanceId: newInstanceId(),
            definitionId: def.id,
            name: def.name,
            tier: def.tier,
            hp,
            maxHp: hp,
            attack: Math.floor(def.baseAttack * scaleFactor),
            attackRange: def.attackRange,
            attackSpeed: def.attackSpeed,
            factions: def.factions,
            abilityName: def.abilityName,
            abilityDescription: def.abilityDescription,
            portraitImage: def.portraitImage,
            position: { x: col, y: row },
            isEnemy: true,
            isDead: false,
            isAttacking: false,
            lastAttackTime: 0,
        });
    }
    return enemies;
}

function createBoardUnitFromBench(bench: BenchUnit, position: Position): BoardUnit {
    return {
        instanceId: bench.instanceId,
        definitionId: bench.definitionId,
        name: bench.name,
        tier: bench.tier,
        hp: bench.hp,
        maxHp: bench.maxHp,
        attack: bench.attack,
        attackRange: bench.attackRange,
        attackSpeed: bench.attackSpeed,
        factions: bench.factions,
        abilityName: bench.abilityName,
        abilityDescription: bench.abilityDescription,
        portraitImage: bench.portraitImage,
        position,
        isEnemy: false,
        isDead: false,
        isAttacking: false,
        lastAttackTime: 0,
    };
}

function createBenchUnitFromDef(defId: string): BenchUnit | null {
    const def = UNIT_DEFINITIONS.find(d => d.id === defId);
    if (!def) return null;
    return {
        instanceId: newInstanceId(),
        definitionId: def.id,
        name: def.name,
        tier: def.tier,
        hp: def.baseHp,
        maxHp: def.baseHp,
        attack: def.baseAttack,
        attackRange: def.attackRange,
        attackSpeed: def.attackSpeed,
        factions: def.factions,
        abilityName: def.abilityName,
        abilityDescription: def.abilityDescription,
        portraitImage: def.portraitImage,
    };
}

interface GameContextType {
    state: GameState;
    startGame: () => void;
    buyUnit: (slotIndex: number) => void;
    sellUnit: (instanceId: string, fromBoard: boolean) => void;
    placeUnit: (instanceId: string, position: Position) => void;
    moveUnit: (instanceId: string, newPosition: Position) => void;
    returnUnitToBench: (instanceId: string) => void;
    refreshShop: () => void;
    startCombat: () => void;
    restartGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<GameState>({
        phase: 'menu',
        round: 1,
        playerHp: STARTING_HP,
        maxPlayerHp: STARTING_HP,
        gold: STARTING_GOLD,
        bench: [],
        board: [],
        shop: generateShop(),
        enemyUnits: [],
        prepTimeLeft: PREP_TIME,
        combatLog: [],
        roundResult: null,
        floatingDamages: [],
    });

    const combatRef = useRef<{
        friendly: BoardUnit[];
        enemy: BoardUnit[];
        animFrame: number | null;
        startTime: number;
        lastTime: number;
        synergyBuffs: SynergyBuffs;
    } | null>(null);

    const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startGame = useCallback(() => {
        setState(prev => ({
            ...prev,
            phase: 'preparation',
            round: 1,
            playerHp: STARTING_HP,
            maxPlayerHp: STARTING_HP,
            gold: STARTING_GOLD,
            bench: [],
            board: [],
            shop: generateShop(),
            enemyUnits: generateEnemyUnits(1),
            prepTimeLeft: PREP_TIME,
            combatLog: [],
            roundResult: null,
            floatingDamages: [],
        }));
    }, []);

    const restartGame = useCallback(() => {
        if (combatRef.current?.animFrame) {
            cancelAnimationFrame(combatRef.current.animFrame);
            combatRef.current = null;
        }
        if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
        }
        setState(prev => ({
            ...prev,
            phase: 'menu',
        }));
    }, []);

    // Prep timer
    useEffect(() => {
        if (state.phase === 'preparation') {
            prepTimerRef.current = setInterval(() => {
                setState(prev => {
                    if (prev.phase !== 'preparation') return prev;
                    const newTime = prev.prepTimeLeft - 1;
                    if (newTime <= 0) {
                        return { ...prev, prepTimeLeft: 0 };
                    }
                    return { ...prev, prepTimeLeft: newTime };
                });
            }, 1000);
        }
        return () => {
            if (prepTimerRef.current) {
                clearInterval(prepTimerRef.current);
                prepTimerRef.current = null;
            }
        };
    }, [state.phase]);

    // Auto-start combat when prep time runs out
    useEffect(() => {
        if (state.phase === 'preparation' && state.prepTimeLeft <= 0) {
            startCombat();
        }
    }, [state.prepTimeLeft, state.phase]);

    const startCombat = useCallback(() => {
        if (prepTimerRef.current) {
            clearInterval(prepTimerRef.current);
            prepTimerRef.current = null;
        }

        setState(prev => {
            if (prev.phase !== 'preparation') return prev;
            const activeSynergies = calculateSynergies(prev.board);
            const synergyBuffs = getSynergyBuffs(activeSynergies);

            const friendlyUnits = prev.board.map(u => ({
                ...u,
                lastAttackTime: 0,
                isAttacking: false,
                isDead: false,
            }));
            const enemyUnits = prev.enemyUnits.map(u => ({
                ...u,
                lastAttackTime: 0,
                isAttacking: false,
                isDead: false,
            }));

            combatRef.current = {
                friendly: friendlyUnits,
                enemy: enemyUnits,
                animFrame: null,
                startTime: performance.now(),
                lastTime: performance.now(),
                synergyBuffs,
            };

            return {
                ...prev,
                phase: 'combat',
                board: friendlyUnits,
                enemyUnits,
                floatingDamages: [],
            };
        });
    }, []);

    // Combat loop
    useEffect(() => {
        if (state.phase !== 'combat') return;
        if (!combatRef.current) return;

        const tick = (now: number) => {
            if (!combatRef.current) return;
            const delta = (now - combatRef.current.lastTime) / 1000;
            combatRef.current.lastTime = now;
            const elapsed = (now - combatRef.current.startTime) / 1000;

            const { updatedFriendly, updatedEnemy, events } = runCombatTick(
                combatRef.current.friendly,
                combatRef.current.enemy,
                elapsed,
                delta,
                combatRef.current.synergyBuffs
            );

            combatRef.current.friendly = updatedFriendly;
            combatRef.current.enemy = updatedEnemy;

            const newDamages: FloatingDamage[] = events
                .filter(e => e.type === 'attack' && e.damage !== undefined && e.targetId)
                .map(e => {
                    const target = [...updatedFriendly, ...updatedEnemy].find(u => u.instanceId === e.targetId);
                    return {
                        id: `dmg_${Date.now()}_${Math.random()}`,
                        x: target ? target.position.x : 0,
                        y: target ? target.position.y : 0,
                        value: e.damage!,
                        isCrit: e.isCrit || false,
                        timestamp: Date.now(),
                    };
                });

            const result = isCombatOver(updatedFriendly, updatedEnemy);

            setState(prev => {
                const now2 = Date.now();
                const freshDamages = prev.floatingDamages.filter(d => now2 - d.timestamp < 1200);
                return {
                    ...prev,
                    board: updatedFriendly,
                    enemyUnits: updatedEnemy,
                    floatingDamages: [...freshDamages, ...newDamages],
                };
            });

            if (result) {
                handleCombatEnd(result);
                return;
            }

            combatRef.current.animFrame = requestAnimationFrame(tick);
        };

        combatRef.current.animFrame = requestAnimationFrame(tick);

        return () => {
            if (combatRef.current?.animFrame) {
                cancelAnimationFrame(combatRef.current.animFrame);
            }
        };
    }, [state.phase]);

    const handleCombatEnd = useCallback((result: 'friendly_win' | 'enemy_win') => {
        if (combatRef.current?.animFrame) {
            cancelAnimationFrame(combatRef.current.animFrame);
        }

        setState(prev => {
            const isWin = result === 'friendly_win';
            const hpLoss = isWin ? 0 : Math.max(5, 10 - prev.round);
            const newHp = Math.max(0, prev.playerHp - hpLoss);
            const isGameOver = newHp <= 0;

            return {
                ...prev,
                phase: isGameOver ? 'gameover' : 'result',
                playerHp: newHp,
                roundResult: isWin ? 'win' : 'loss',
                combatLog: [
                    ...prev.combatLog,
                    isWin
                        ? `Round ${prev.round}: Victory! Your forces prevailed!`
                        : `Round ${prev.round}: Defeat! Lost ${hpLoss} HP.`,
                ],
            };
        });
    }, []);

    const advanceRound = useCallback(() => {
        setState(prev => {
            const newRound = prev.round + 1;
            const goldIncome = getTotalGoldIncome(newRound, prev.gold);
            const newGold = prev.gold + goldIncome;

            // Heal surviving board units partially
            const healedBoard = prev.board
                .filter(u => !u.isDead)
                .map(u => ({
                    ...u,
                    hp: Math.min(u.maxHp, u.hp + Math.floor(u.maxHp * 0.3)),
                    isDead: false,
                    isAttacking: false,
                    lastAttackTime: 0,
                }));

            return {
                ...prev,
                phase: 'preparation',
                round: newRound,
                gold: newGold,
                board: healedBoard,
                enemyUnits: generateEnemyUnits(newRound),
                shop: generateShop(),
                prepTimeLeft: PREP_TIME,
                roundResult: null,
                floatingDamages: [],
            };
        });
    }, []);

    // Auto-advance from result screen
    useEffect(() => {
        if (state.phase === 'result') {
            const timer = setTimeout(() => {
                advanceRound();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state.phase, advanceRound]);

    const buyUnit = useCallback((slotIndex: number) => {
        setState(prev => {
            const shopUnit = prev.shop[slotIndex];
            if (!shopUnit || shopUnit.sold) return prev;
            if (prev.gold < shopUnit.cost) return prev;
            if (prev.bench.length >= MAX_BENCH) return prev;

            const newUnit = createBenchUnitFromDef(shopUnit.definitionId);
            if (!newUnit) return prev;

            const newShop = prev.shop.map((s, i) =>
                i === slotIndex ? { ...s, sold: true } : s
            );

            return {
                ...prev,
                gold: prev.gold - shopUnit.cost,
                bench: [...prev.bench, newUnit],
                shop: newShop,
            };
        });
    }, []);

    const sellUnit = useCallback((instanceId: string, fromBoard: boolean) => {
        setState(prev => {
            let cost = 1;
            let newBench = prev.bench;
            let newBoard = prev.board;

            if (fromBoard) {
                const unit = prev.board.find(u => u.instanceId === instanceId);
                if (!unit) return prev;
                const def = UNIT_DEFINITIONS.find(d => d.id === unit.definitionId);
                cost = getUnitSellValue(def?.cost || 1);
                newBoard = prev.board.filter(u => u.instanceId !== instanceId);
            } else {
                const unit = prev.bench.find(u => u.instanceId === instanceId);
                if (!unit) return prev;
                const def = UNIT_DEFINITIONS.find(d => d.id === unit.definitionId);
                cost = getUnitSellValue(def?.cost || 1);
                newBench = prev.bench.filter(u => u.instanceId !== instanceId);
            }

            return {
                ...prev,
                gold: prev.gold + cost,
                bench: newBench,
                board: newBoard,
            };
        });
    }, []);

    const placeUnit = useCallback((instanceId: string, position: Position) => {
        setState(prev => {
            if (prev.phase !== 'preparation') return prev;
            const benchUnit = prev.bench.find(u => u.instanceId === instanceId);
            if (!benchUnit) return prev;

            // Check if position is in friendly half (rows 2-3)
            if (position.y < 2) return prev;

            // Check if position is occupied
            const occupied = prev.board.find(u => u.position.x === position.x && u.position.y === position.y);
            if (occupied) return prev;

            if (prev.board.length >= MAX_BOARD) return prev;

            const boardUnit = createBoardUnitFromBench(benchUnit, position);
            return {
                ...prev,
                bench: prev.bench.filter(u => u.instanceId !== instanceId),
                board: [...prev.board, boardUnit],
            };
        });
    }, []);

    const moveUnit = useCallback((instanceId: string, newPosition: Position) => {
        setState(prev => {
            if (prev.phase !== 'preparation') return prev;
            if (newPosition.y < 2) return prev;

            const unitIdx = prev.board.findIndex(u => u.instanceId === instanceId);
            if (unitIdx < 0) return prev;

            const occupiedIdx = prev.board.findIndex(
                u => u.instanceId !== instanceId && u.position.x === newPosition.x && u.position.y === newPosition.y
            );

            const newBoard = [...prev.board];
            if (occupiedIdx >= 0) {
                // Swap positions
                const oldPos = newBoard[unitIdx].position;
                newBoard[occupiedIdx] = { ...newBoard[occupiedIdx], position: oldPos };
            }
            newBoard[unitIdx] = { ...newBoard[unitIdx], position: newPosition };

            return { ...prev, board: newBoard };
        });
    }, []);

    const returnUnitToBench = useCallback((instanceId: string) => {
        setState(prev => {
            if (prev.phase !== 'preparation') return prev;
            const boardUnit = prev.board.find(u => u.instanceId === instanceId);
            if (!boardUnit) return prev;
            if (prev.bench.length >= MAX_BENCH) return prev;

            const benchUnit: BenchUnit = {
                instanceId: boardUnit.instanceId,
                definitionId: boardUnit.definitionId,
                name: boardUnit.name,
                tier: boardUnit.tier,
                hp: boardUnit.hp,
                maxHp: boardUnit.maxHp,
                attack: boardUnit.attack,
                attackRange: boardUnit.attackRange,
                attackSpeed: boardUnit.attackSpeed,
                factions: boardUnit.factions,
                abilityName: boardUnit.abilityName,
                abilityDescription: boardUnit.abilityDescription,
                portraitImage: boardUnit.portraitImage,
            };

            return {
                ...prev,
                board: prev.board.filter(u => u.instanceId !== instanceId),
                bench: [...prev.bench, benchUnit],
            };
        });
    }, []);

    const refreshShop = useCallback(() => {
        setState(prev => {
            if (prev.gold < 2) return prev;
            return {
                ...prev,
                gold: prev.gold - 2,
                shop: generateShop(),
            };
        });
    }, []);

    return (
        <GameContext.Provider value={{
            state,
            startGame,
            buyUnit,
            sellUnit,
            placeUnit,
            moveUnit,
            returnUnitToBench,
            refreshShop,
            startCombat,
            restartGame,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameState(): GameContextType {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGameState must be used within GameProvider');
    return ctx;
}
