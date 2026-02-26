import React, { useState } from 'react';
import { useGameState, BoardUnit } from '../hooks/useGameState';
import { Sword, Shield } from 'lucide-react';

const COLS = 7;
const PLAYER_ROWS = 4;

function UnitToken({ unit, onClick, isSelected }: {
  unit: BoardUnit;
  onClick: (e: React.MouseEvent) => void;
  isSelected: boolean;
}) {
  const hpPercent = (unit.currentHp / unit.maxHp) * 100;
  const stars = unit.starLevel === 3 ? '★★★' : unit.starLevel === 2 ? '★★' : '★';

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex flex-col items-center justify-center cursor-pointer rounded-sm transition-all duration-150 select-none
        ${isSelected ? 'ring-2 ring-egyptian-gold scale-105' : ''}
        ${unit.isPlayer ? 'border border-egyptian-turquoise/60' : 'border border-egyptian-crimson/60'}
      `}
      style={{
        background: unit.isPlayer
          ? 'oklch(0.20 0.05 200 / 0.85)'
          : 'oklch(0.20 0.05 25 / 0.85)',
        boxShadow: isSelected
          ? '0 0 12px oklch(0.75 0.18 75 / 0.8)'
          : unit.isPlayer
            ? '0 0 6px oklch(0.65 0.15 200 / 0.3)'
            : '0 0 6px oklch(0.50 0.20 25 / 0.3)',
      }}
    >
      {/* Portrait */}
      <div className="w-10 h-10 rounded-sm overflow-hidden mb-0.5">
        <img
          src={unit.definition.portraitUrl}
          alt={unit.definition.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.parentElement!.style.background = unit.definition.color;
          }}
        />
      </div>

      {/* Star level */}
      <div className="text-egyptian-gold text-xs leading-none" style={{ fontSize: '0.55rem' }}>
        {stars}
      </div>

      {/* HP bar */}
      <div className="absolute bottom-0.5 left-1 right-1 hp-bar" style={{ height: '3px' }}>
        <div
          className="hp-bar-fill"
          style={{
            width: `${hpPercent}%`,
            background: hpPercent > 50 ? 'oklch(0.55 0.18 145)' : hpPercent > 25 ? 'oklch(0.65 0.18 75)' : 'oklch(0.55 0.22 25)',
          }}
        />
      </div>

      {/* Name tooltip on hover */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-egyptian-dark/90 border border-egyptian-gold/40 px-1.5 py-0.5 rounded text-xs cinzel text-egyptian-sand whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none z-20 transition-opacity">
        {unit.definition.name}
      </div>
    </div>
  );
}

export default function BattleBoard() {
  const { state, placeUnit, selectUnit } = useGameState();
  const { board, enemyBoard, selectedUnit, phase, isBattling } = state;
  const [dragOver, setDragOver] = useState<number | null>(null);

  const getUnitAtPosition = (pos: number, isEnemy: boolean): BoardUnit | undefined => {
    if (isEnemy) {
      return enemyBoard.find(u => u.position === pos);
    }
    return board.find(u => u.position === pos);
  };

  const handleCellClick = (position: number) => {
    if (phase === 'battle' || isBattling) return;

    if (selectedUnit && selectedUnit.isPlayer) {
      placeUnit(selectedUnit.instanceId, position);
      selectUnit(null);
    }
  };

  const handleUnitClick = (unit: BoardUnit, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === 'battle' || isBattling) return;

    if (selectedUnit?.instanceId === unit.instanceId) {
      selectUnit(null);
    } else {
      selectUnit(unit);
    }
  };

  const renderGrid = (isEnemy: boolean): React.ReactElement[] => {
    const cells: React.ReactElement[] = [];
    const rowOffset = isEnemy ? 28 : 0;

    for (let row = 0; row < PLAYER_ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const pos = rowOffset + row * COLS + col;
        const unit = getUnitAtPosition(pos, isEnemy);
        const isHighlighted = dragOver === pos;

        cells.push(
          <div
            key={pos}
            className={`hex-cell relative aspect-square rounded-sm border transition-all duration-150
              ${isEnemy
                ? 'border-egyptian-crimson/20 bg-egyptian-crimson/5'
                : 'border-egyptian-turquoise/20 bg-egyptian-turquoise/5'
              }
              ${isHighlighted && !isEnemy ? 'border-egyptian-gold/60 bg-egyptian-gold/10' : ''}
              ${!isEnemy && !unit && selectedUnit ? 'cursor-pointer hover:border-egyptian-gold/40 hover:bg-egyptian-gold/5' : ''}
            `}
            onClick={() => !isEnemy && !unit && handleCellClick(pos)}
            onDragOver={(e) => {
              if (!isEnemy) {
                e.preventDefault();
                setDragOver(pos);
              }
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              const id = e.dataTransfer.getData('unitId');
              if (id && !isEnemy) placeUnit(id, pos);
            }}
          >
            {unit && (
              <UnitToken
                unit={unit}
                onClick={(e: React.MouseEvent) => {
                  if (!isEnemy) handleUnitClick(unit, e);
                }}
                isSelected={selectedUnit?.instanceId === unit.instanceId}
              />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Battle status banner */}
      {isBattling && (
        <div className="egyptian-panel-gold p-2 text-center glow-pulse">
          <span className="cinzel text-egyptian-gold font-bold text-sm tracking-widest">
            ⚔️ BATTLE IN PROGRESS ⚔️
          </span>
        </div>
      )}

      {phase === 'result' && state.battleResult && (
        <div className={`p-2 text-center rounded-sm border ${
          state.battleResult === 'win'
            ? 'bg-green-900/30 border-green-500/50 text-green-400'
            : state.battleResult === 'loss'
              ? 'bg-red-900/30 border-red-500/50 text-red-400'
              : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
        }`}>
          <span className="cinzel font-bold text-sm">
            {state.battleResult === 'win' ? '🏆 VICTORY!' : state.battleResult === 'loss' ? '💀 DEFEAT!' : '⚖️ DRAW!'}
          </span>
        </div>
      )}

      {/* Board container */}
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/egypt-battle-board.dim_1200x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-egyptian-dark/50" />

        <div className="relative z-10 p-2 flex flex-col gap-1">
          {/* Enemy side label */}
          <div className="flex items-center gap-2 mb-1">
            <Sword className="w-3 h-3 text-egyptian-crimson" />
            <span className="cinzel text-egyptian-crimson/80 text-xs">Enemy Forces ({enemyBoard.length})</span>
          </div>

          {/* Enemy grid */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {renderGrid(true)}
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-egyptian-gold/30 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-egyptian-dark px-3 py-0.5 rounded-full border border-egyptian-gold/40">
              <span className="cinzel text-egyptian-gold/60 text-xs">⚔️</span>
            </div>
          </div>

          {/* Player grid */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {renderGrid(false)}
          </div>

          {/* Player side label */}
          <div className="flex items-center gap-2 mt-1">
            <Shield className="w-3 h-3 text-egyptian-turquoise" />
            <span className="cinzel text-egyptian-turquoise/80 text-xs">
              Your Army ({board.length}/{state.level})
            </span>
            {selectedUnit && (
              <span className="cinzel text-egyptian-gold/60 text-xs ml-auto">
                Click a cell to place {selectedUnit.definition.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
