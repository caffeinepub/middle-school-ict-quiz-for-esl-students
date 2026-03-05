import React, { useState } from 'react';
import { useGameState, BoardUnit } from '../hooks/useGameState';
import { Sword, Shield } from 'lucide-react';
import {
  HEX_SIZE,
  HEX_WIDTH,
  HEX_HEIGHT,
  HEX_HORIZ_SPACING,
  COLS,
  PLAYER_ROWS,
  hexToPixel,
  hexPolygonPoints,
  getGridDimensions,
  posToColRow,
  colRowToPos,
} from '../utils/hexGrid';

const INNER_SIZE = HEX_SIZE - 2; // slightly smaller for gap effect

function UnitToken({ unit, isSelected, onClick }: {
  unit: BoardUnit;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const hpPercent = (unit.currentHp / unit.maxHp) * 100;
  const stars = unit.starLevel === 3 ? '★★★' : unit.starLevel === 2 ? '★★' : '★';

  const portraitSize = HEX_SIZE * 1.0;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Selection glow ring */}
      {isSelected && (
        <polygon
          points={hexPolygonPoints(0, 0, HEX_SIZE - 1)}
          fill="none"
          stroke="oklch(0.82 0.20 78)"
          strokeWidth="2.5"
          opacity="0.9"
          style={{ filter: 'drop-shadow(0 0 6px oklch(0.82 0.20 78 / 0.8))' }}
        />
      )}

      {/* Hex background */}
      <polygon
        points={hexPolygonPoints(0, 0, INNER_SIZE)}
        fill={unit.isPlayer ? 'oklch(0.18 0.06 200 / 0.92)' : 'oklch(0.18 0.06 25 / 0.92)'}
        stroke={unit.isPlayer
          ? (isSelected ? 'oklch(0.82 0.20 78)' : 'oklch(0.55 0.14 200 / 0.7)')
          : (isSelected ? 'oklch(0.82 0.20 78)' : 'oklch(0.55 0.20 25 / 0.7)')
        }
        strokeWidth={isSelected ? 2 : 1.5}
      />

      {/* Portrait clipped to hex */}
      <defs>
        <clipPath id={`clip-${unit.instanceId}`}>
          <polygon points={hexPolygonPoints(0, 0, INNER_SIZE - 3)} />
        </clipPath>
      </defs>
      <image
        href={unit.definition.portraitUrl}
        x={-portraitSize * 0.5}
        y={-portraitSize * 0.6}
        width={portraitSize}
        height={portraitSize}
        clipPath={`url(#clip-${unit.instanceId})`}
        preserveAspectRatio="xMidYMid slice"
        style={unit.isPlayer ? undefined : { filter: 'hue-rotate(160deg) saturate(0.7)' }}
      />

      {/* Dark overlay for readability */}
      <polygon
        points={hexPolygonPoints(0, 0, INNER_SIZE - 3)}
        fill={unit.isPlayer ? 'oklch(0.10 0.04 200 / 0.35)' : 'oklch(0.10 0.04 25 / 0.35)'}
        clipPath={`url(#clip-${unit.instanceId})`}
      />

      {/* HP bar background */}
      <rect
        x={-INNER_SIZE * 0.65}
        y={INNER_SIZE * 0.55}
        width={INNER_SIZE * 1.3}
        height={4}
        rx={2}
        fill="oklch(0.15 0.03 55)"
      />
      {/* HP bar fill */}
      <rect
        x={-INNER_SIZE * 0.65}
        y={INNER_SIZE * 0.55}
        width={INNER_SIZE * 1.3 * (hpPercent / 100)}
        height={4}
        rx={2}
        fill={hpPercent > 50 ? 'oklch(0.55 0.18 145)' : hpPercent > 25 ? 'oklch(0.70 0.18 75)' : 'oklch(0.55 0.22 25)'}
      />

      {/* Star level */}
      <text
        x={0}
        y={INNER_SIZE * 0.45}
        textAnchor="middle"
        fontSize="8"
        fill="oklch(0.85 0.20 78)"
        fontFamily="Cinzel, serif"
        style={{ textShadow: '0 0 4px oklch(0.75 0.18 75)' }}
      >
        {stars}
      </text>
    </g>
  );
}

function HexGrid({
  isEnemy,
  units,
  selectedUnit,
  dragOver,
  onCellClick,
  onCellDragOver,
  onCellDragLeave,
  onCellDrop,
  onUnitClick,
}: {
  isEnemy: boolean;
  units: BoardUnit[];
  selectedUnit: BoardUnit | null;
  dragOver: number | null;
  onCellClick: (pos: number) => void;
  onCellDragOver: (e: React.DragEvent, pos: number) => void;
  onCellDragLeave: () => void;
  onCellDrop: (e: React.DragEvent, pos: number) => void;
  onUnitClick: (unit: BoardUnit, e: React.MouseEvent) => void;
}) {
  const { width, height } = getGridDimensions(COLS, PLAYER_ROWS);
  const rowOffset = isEnemy ? COLS * PLAYER_ROWS : 0;

  // Column labels A-G
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const labelPad = 18;

  return (
    <div className="relative" style={{ width: width + labelPad * 2, height: height + labelPad }}>
      <svg
        width={width + labelPad * 2}
        height={height + labelPad}
        style={{ overflow: 'visible' }}
      >
        {/* Column labels */}
        {colLabels.map((label, col) => {
          const { x } = hexToPixel(col, 0);
          return (
            <text
              key={`col-${col}`}
              x={x + labelPad}
              y={12}
              textAnchor="middle"
              fontSize="9"
              fill="oklch(0.65 0.12 75 / 0.7)"
              fontFamily="'Roboto Mono', monospace"
              letterSpacing="0.05em"
            >
              {label}
            </text>
          );
        })}

        {/* Row labels */}
        {Array.from({ length: PLAYER_ROWS }).map((_, row) => {
          const { y } = hexToPixel(0, row);
          return (
            <text
              key={`row-${row}`}
              x={8}
              y={y + labelPad + 4}
              textAnchor="middle"
              fontSize="9"
              fill="oklch(0.65 0.12 75 / 0.7)"
              fontFamily="'Roboto Mono', monospace"
            >
              {row + 1}
            </text>
          );
        })}

        <g transform={`translate(${labelPad}, ${labelPad})`}>
          {Array.from({ length: PLAYER_ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => {
              const pos = rowOffset + row * COLS + col;
              const { x, y } = hexToPixel(col, row);
              const unit = units.find(u => u.position === pos);
              const isHighlighted = dragOver === pos;
              const canPlace = !isEnemy && !unit && selectedUnit;

              return (
                <g
                  key={pos}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: canPlace ? 'pointer' : 'default' }}
                  onClick={() => !isEnemy && !unit && onCellClick(pos)}
                  onDragOver={(e) => !isEnemy && onCellDragOver(e, pos)}
                  onDragLeave={onCellDragLeave}
                  onDrop={(e) => !isEnemy && onCellDrop(e, pos)}
                >
                  {/* Empty hex tile */}
                  <polygon
                    points={hexPolygonPoints(0, 0, INNER_SIZE)}
                    fill={
                      isHighlighted
                        ? 'oklch(0.30 0.10 75 / 0.5)'
                        : isEnemy
                          ? 'oklch(0.14 0.04 25 / 0.6)'
                          : 'oklch(0.14 0.04 200 / 0.6)'
                    }
                    stroke={
                      isHighlighted
                        ? 'oklch(0.75 0.18 75 / 0.9)'
                        : isEnemy
                          ? 'oklch(0.40 0.10 25 / 0.35)'
                          : 'oklch(0.40 0.10 200 / 0.35)'
                    }
                    strokeWidth={isHighlighted ? 2 : 1}
                    style={{
                      transition: 'fill 0.15s ease, stroke 0.15s ease',
                      filter: canPlace ? 'brightness(1.2)' : undefined,
                    }}
                  />

                  {/* Inner hex decoration */}
                  <polygon
                    points={hexPolygonPoints(0, 0, INNER_SIZE * 0.6)}
                    fill="none"
                    stroke={isEnemy ? 'oklch(0.35 0.08 25 / 0.2)' : 'oklch(0.35 0.08 200 / 0.2)'}
                    strokeWidth="0.5"
                  />

                  {/* Unit token */}
                  {unit && (
                    <UnitToken
                      unit={unit}
                      isSelected={selectedUnit?.instanceId === unit.instanceId}
                      onClick={(e) => onUnitClick(unit, e)}
                    />
                  )}
                </g>
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
}

export default function BattleBoard() {
  const { state, placeUnit, selectUnit } = useGameState();
  const { board, enemyBoard, selectedUnit, phase, isBattling } = state;
  const [dragOver, setDragOver] = useState<number | null>(null);

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

  const handleDragOver = (e: React.DragEvent, pos: number) => {
    e.preventDefault();
    setDragOver(pos);
  };

  const handleDrop = (e: React.DragEvent, pos: number) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('unitId');
    if (id) placeUnit(id, pos);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Battle status banner */}
      {isBattling && (
        <div className="command-panel-gold p-2 text-center glow-pulse">
          <span className="cinzel text-ember-gold font-bold text-sm tracking-widest">
            ⚔ BATTLE IN PROGRESS ⚔
          </span>
        </div>
      )}

      {phase === 'result' && state.battleResult && (
        <div className={`p-2 text-center border ${
          state.battleResult === 'win'
            ? 'bg-green-950/50 border-green-600/50 text-green-400'
            : state.battleResult === 'loss'
              ? 'bg-red-950/50 border-red-700/50 text-red-400'
              : 'bg-yellow-950/50 border-yellow-700/50 text-yellow-400'
        }`} style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
          <span className="cinzel font-bold text-sm tracking-widest">
            {state.battleResult === 'win' ? '🏆 VICTORY!' : state.battleResult === 'loss' ? '💀 DEFEAT!' : '⚖ DRAW!'}
          </span>
        </div>
      )}

      {/* Board container */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/battle-board-dark-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
      >
        {/* Dark tactical overlay */}
        <div className="absolute inset-0 bg-command-panel/75" />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.02 55 / 0.7) 100%)'
        }} />
        {/* Border frame */}
        <div className="absolute inset-0 border border-aged-bronze/40 pointer-events-none"
          style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
        />

        <div className="relative z-10 p-3 flex flex-col gap-2">
          {/* Enemy side label */}
          <div className="flex items-center gap-2 mb-0.5">
            <Sword className="w-3 h-3 text-egyptian-crimson" />
            <span className="cinzel text-egyptian-crimson/80 text-xs tracking-widest uppercase">
              Enemy Forces <span className="font-mono text-egyptian-crimson/60">({enemyBoard.length})</span>
            </span>
            <div className="flex-1 h-px bg-egyptian-crimson/20" />
          </div>

          {/* Enemy hex grid */}
          <div className="flex justify-center overflow-x-auto">
            <HexGrid
              isEnemy={true}
              units={enemyBoard}
              selectedUnit={selectedUnit}
              dragOver={dragOver}
              onCellClick={handleCellClick}
              onCellDragOver={handleDragOver}
              onCellDragLeave={() => setDragOver(null)}
              onCellDrop={handleDrop}
              onUnitClick={handleUnitClick}
            />
          </div>

          {/* Divider */}
          <div className="my-1 relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ember-gold/40 to-transparent" />
            <div className="command-panel-gold px-3 py-0.5 flex items-center gap-2"
              style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)' }}>
              <span className="cinzel text-ember-gold/80 text-xs tracking-widest">⚔ BATTLE FIELD ⚔</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ember-gold/40 to-transparent" />
          </div>

          {/* Player hex grid */}
          <div className="flex justify-center overflow-x-auto">
            <HexGrid
              isEnemy={false}
              units={board}
              selectedUnit={selectedUnit}
              dragOver={dragOver}
              onCellClick={handleCellClick}
              onCellDragOver={handleDragOver}
              onCellDragLeave={() => setDragOver(null)}
              onCellDrop={handleDrop}
              onUnitClick={handleUnitClick}
            />
          </div>

          {/* Player side label */}
          <div className="flex items-center gap-2 mt-0.5">
            <Shield className="w-3 h-3 text-egyptian-turquoise" />
            <span className="cinzel text-egyptian-turquoise/80 text-xs tracking-widest uppercase">
              Your Army <span className="font-mono text-egyptian-turquoise/60">({board.length}/{state.level})</span>
            </span>
            <div className="flex-1 h-px bg-egyptian-turquoise/20" />
            {selectedUnit && (
              <span className="cinzel text-ember-gold/70 text-xs">
                ▶ Place {selectedUnit.definition.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
