import React from 'react';
import { useGameState, BoardUnit } from '../hooks/useGameState';
import { Coins } from 'lucide-react';

function BenchUnitCard({ unit }: { unit: BoardUnit }) {
  const { selectUnit, sellUnit, placeUnit, state } = useGameState();
  const { selectedUnit, phase } = state;
  const isSelected = selectedUnit?.instanceId === unit.instanceId;
  const stars = unit.starLevel === 3 ? '★★★' : unit.starLevel === 2 ? '★★' : '★';
  const hpPercent = (unit.currentHp / unit.maxHp) * 100;

  const handleClick = () => {
    if (phase === 'battle') return;
    if (isSelected) {
      selectUnit(null);
    } else {
      selectUnit(unit);
    }
  };

  const handleSell = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === 'battle') return;
    sellUnit(unit.instanceId);
  };

  return (
    <div
      className={`unit-card relative flex flex-col p-1.5 gap-1 select-none group
        ${isSelected ? 'selected' : ''}
        ${phase === 'battle' ? 'cursor-default' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      draggable={phase !== 'battle'}
      onDragStart={(e) => {
        e.dataTransfer.setData('unitId', unit.instanceId);
        selectUnit(unit);
      }}
    >
      {/* Portrait */}
      <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-egyptian-dark/50">
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
        {/* Star level */}
        <div className="absolute top-0.5 left-0.5 text-egyptian-gold text-xs leading-none" style={{ fontSize: '0.6rem' }}>
          {stars}
        </div>
      </div>

      {/* Name */}
      <div className="cinzel text-egyptian-sand text-xs leading-tight truncate" style={{ fontSize: '0.6rem' }}>
        {unit.definition.name}
      </div>

      {/* HP bar */}
      <div className="hp-bar">
        <div
          className="hp-bar-fill"
          style={{
            width: `${hpPercent}%`,
            background: 'oklch(0.55 0.18 145)',
          }}
        />
      </div>

      {/* Sell button (on hover) */}
      {phase !== 'battle' && (
        <button
          onClick={handleSell}
          className="absolute -top-1 -right-1 w-5 h-5 bg-egyptian-crimson/80 border border-red-500/50 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-egyptian-crimson z-10"
          title={`Sell for ${unit.definition.cost * unit.starLevel}g`}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function Bench() {
  const { state, placeUnit } = useGameState();
  const { bench, level } = state;
  const maxBench = 9;

  return (
    <div className="egyptian-panel p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="cinzel text-egyptian-gold font-bold text-sm tracking-wider">
          🏺 Bench ({bench.length}/{maxBench})
        </h3>
        <span className="cinzel text-egyptian-sand/50 text-xs">
          Board: {state.board.length}/{level}
        </span>
      </div>

      <div className="grid grid-cols-9 gap-1.5">
        {bench.map(unit => (
          <BenchUnitCard key={unit.instanceId} unit={unit} />
        ))}
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxBench - bench.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-sm border border-dashed border-egyptian-gold/15 bg-egyptian-dark/20"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              // Units dropped on bench go back to bench (handled by board logic)
            }}
          />
        ))}
      </div>
    </div>
  );
}
