import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useGameState } from '../hooks/useGameState';
import { Position, FloatingDamage } from '../types/game';
import GridTile from './GridTile';
import UnitSprite from './UnitSprite';

const BOARD_COLS = 8;
const BOARD_ROWS = 4;
const CELL_SIZE = 72;

interface FloatingDamageDisplay extends FloatingDamage {
    visible: boolean;
}

export default function BattleBoard() {
    const { state, placeUnit, moveUnit, returnUnitToBench } = useGameState();
    const [dragOverPos, setDragOverPos] = useState<Position | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [draggingFrom, setDraggingFrom] = useState<'bench' | 'board' | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

    const isCombat = state.phase === 'combat';
    const isPrep = state.phase === 'preparation';

    const handleDragStart = useCallback((e: React.DragEvent, instanceId: string, from: 'bench' | 'board') => {
        setDraggingId(instanceId);
        setDraggingFrom(from);
        e.dataTransfer.setData('instanceId', instanceId);
        e.dataTransfer.setData('from', from);
    }, []);

    const handleDrop = useCallback((position: Position) => {
        if (!draggingId || !draggingFrom) return;
        if (position.y < 2) return; // Only friendly half

        if (draggingFrom === 'bench') {
            placeUnit(draggingId, position);
        } else if (draggingFrom === 'board') {
            moveUnit(draggingId, position);
        }
        setDraggingId(null);
        setDraggingFrom(null);
        setDragOverPos(null);
    }, [draggingId, draggingFrom, placeUnit, moveUnit]);

    const handleDragOver = useCallback((e: React.DragEvent, position: Position) => {
        e.preventDefault();
        setDragOverPos(position);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOverPos(null);
    }, []);

    const handleUnitClick = useCallback((instanceId: string) => {
        if (!isPrep) return;
        if (selectedUnit === instanceId) {
            setSelectedUnit(null);
        } else {
            setSelectedUnit(instanceId);
        }
    }, [isPrep, selectedUnit]);

    const handleTileClick = useCallback((position: Position) => {
        if (!isPrep || !selectedUnit) return;
        if (position.y < 2) return;

        const fromBoard = state.board.find(u => u.instanceId === selectedUnit);
        if (fromBoard) {
            moveUnit(selectedUnit, position);
        }
        setSelectedUnit(null);
    }, [isPrep, selectedUnit, state.board, moveUnit]);

    const boardWidth = BOARD_COLS * CELL_SIZE;
    const boardHeight = BOARD_ROWS * CELL_SIZE;

    return (
        <div className="flex flex-col gap-1">
            {/* Phase indicator */}
            <div className={cn(
                'flex items-center justify-center gap-2 py-1 rounded-sm border text-xs font-cinzel font-semibold tracking-wider',
                isCombat
                    ? 'border-[oklch(0.65_0.22_27_/_0.6)] text-[oklch(0.70_0.22_27)] bg-[oklch(0.20_0.06_27_/_0.3)] animate-combat-pulse'
                    : 'border-[oklch(0.78_0.15_85_/_0.4)] text-[oklch(0.78_0.15_85)] bg-[oklch(0.20_0.05_55_/_0.3)] animate-prep-pulse'
            )}>
                {isCombat ? '⚔ COMBAT PHASE ⚔' : isPrep ? '🏺 PREPARATION PHASE 🏺' : ''}
            </div>

            {/* Board */}
            <div
                className="relative rounded-sm overflow-hidden border border-[oklch(0.40_0.08_60_/_0.5)]"
                style={{ width: boardWidth, height: boardHeight }}
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/assets/generated/egypt-battle-board.dim_1200x600.png)' }}
                />
                <div className="absolute inset-0 bg-[oklch(0.10_0.03_50_/_0.5)]" />

                {/* Enemy half divider */}
                <div
                    className="absolute left-0 right-0 border-b-2 border-dashed border-[oklch(0.55_0.12_75_/_0.4)] z-10"
                    style={{ top: BOARD_ROWS / 2 * CELL_SIZE }}
                >
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[oklch(0.20_0.04_50)] px-2 py-0.5 rounded-full border border-[oklch(0.55_0.12_75_/_0.4)]">
                        <span className="text-[oklch(0.65_0.10_75)] text-[9px] font-cinzel">⚔ BATTLE LINE ⚔</span>
                    </div>
                </div>

                {/* Enemy zone label */}
                <div className="absolute top-1 left-1 z-10">
                    <span className="text-[oklch(0.65_0.18_27)] text-[9px] font-cinzel bg-[oklch(0.15_0.04_50_/_0.8)] px-1.5 py-0.5 rounded-sm border border-[oklch(0.40_0.08_27_/_0.4)]">
                        ENEMY TERRITORY
                    </span>
                </div>

                {/* Friendly zone label */}
                <div className="absolute bottom-1 left-1 z-10">
                    <span className="text-[oklch(0.65_0.12_75)] text-[9px] font-cinzel bg-[oklch(0.15_0.04_50_/_0.8)] px-1.5 py-0.5 rounded-sm border border-[oklch(0.40_0.08_60_/_0.4)]">
                        YOUR FORCES
                    </span>
                </div>

                {/* Grid tiles */}
                {Array.from({ length: BOARD_ROWS }).map((_, row) =>
                    Array.from({ length: BOARD_COLS }).map((_, col) => {
                        const pos: Position = { x: col, y: row };
                        const isEnemyZone = row < 2;
                        const isOccupied = state.board.some(u => u.position.x === col && u.position.y === row)
                            || state.enemyUnits.some(u => u.position.x === col && u.position.y === row);
                        const isDragOver = dragOverPos?.x === col && dragOverPos?.y === row;
                        const canDrop = !isEnemyZone;

                        return (
                            <GridTile
                                key={`${col}-${row}`}
                                position={pos}
                                cellSize={CELL_SIZE}
                                isEnemy={isEnemyZone}
                                isOccupied={isOccupied}
                                isDragOver={isDragOver}
                                canDrop={canDrop}
                                onDrop={handleDrop}
                                onDragOver={(e) => handleDragOver(e, pos)}
                                onDragLeave={handleDragLeave}
                                onClick={() => handleTileClick(pos)}
                            />
                        );
                    })
                )}

                {/* Enemy units */}
                {state.enemyUnits.map(unit => (
                    <UnitSprite
                        key={unit.instanceId}
                        unit={unit}
                        cellSize={CELL_SIZE}
                    />
                ))}

                {/* Friendly units */}
                {state.board.map(unit => (
                    <UnitSprite
                        key={unit.instanceId}
                        unit={unit}
                        cellSize={CELL_SIZE}
                        isSelected={selectedUnit === unit.instanceId}
                        onClick={() => handleUnitClick(unit.instanceId)}
                        draggable={isPrep}
                        onDragStart={(e) => handleDragStart(e, unit.instanceId, 'board')}
                    />
                ))}

                {/* Floating damage numbers */}
                {state.floatingDamages.map(dmg => (
                    <div
                        key={dmg.id}
                        className="absolute pointer-events-none z-50 animate-float-up"
                        style={{
                            left: dmg.x * CELL_SIZE + CELL_SIZE / 2,
                            top: dmg.y * CELL_SIZE,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <span
                            className={cn(
                                'font-cinzel font-bold text-shadow',
                                dmg.isCrit
                                    ? 'text-[oklch(0.88_0.18_88)] text-base'
                                    : 'text-[oklch(0.70_0.22_27)] text-sm'
                            )}
                            style={{
                                textShadow: '0 1px 3px oklch(0 0 0 / 0.8)',
                            }}
                        >
                            {dmg.isCrit ? '💥' : ''}{dmg.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Return to bench hint */}
            {isPrep && selectedUnit && (
                <div className="text-center text-[oklch(0.65_0.10_75)] text-xs font-cinzel">
                    Click a tile to move • Right-click to return to bench
                </div>
            )}
        </div>
    );
}
