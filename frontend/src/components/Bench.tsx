import React from 'react';
import { useGameState, BoardUnit } from '../hooks/useGameState';

function BenchUnitCard({ unit }: { unit: BoardUnit }) {
  const { selectUnit, sellUnit, state } = useGameState();
  const { selectedUnit, phase } = state;
  const isSelected = selectedUnit?.instanceId === unit.instanceId;
  const stars = unit.starLevel === 3 ? '★★★' : unit.starLevel === 2 ? '★★' : '★';
  const hpPercent = (unit.currentHp / unit.maxHp) * 100;

  const handleClick = () => {
    if (phase === 'battle') return;
    if (isSelected) selectUnit(null);
    else selectUnit(unit);
  };

  const handleSell = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === 'battle') return;
    sellUnit(unit.instanceId);
  };

  return (
    <div
      className={`relative flex flex-col select-none group transition-all duration-150
        ${phase === 'battle' ? 'cursor-default' : 'cursor-pointer'}
      `}
      style={{
        background: isSelected
          ? 'oklch(0.18 0.06 75 / 0.4)'
          : 'oklch(0.13 0.03 55 / 0.95)',
        border: isSelected
          ? '1px solid oklch(0.75 0.18 75 / 0.8)'
          : '1px solid oklch(0.30 0.06 65 / 0.5)',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        boxShadow: isSelected ? '0 0 10px oklch(0.75 0.18 75 / 0.3)' : 'none',
      }}
      onClick={handleClick}
      draggable={phase !== 'battle'}
      onDragStart={(e) => {
        e.dataTransfer.setData('unitId', unit.instanceId);
        selectUnit(unit);
      }}
    >
      {/* Portrait */}
      <div className="relative w-full aspect-square overflow-hidden bg-deep-sand-dark/50">
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
        <div className="absolute top-0.5 left-0.5 text-ember-gold leading-none font-mono" style={{ fontSize: '0.55rem' }}>
          {stars}
        </div>
      </div>

      {/* Name */}
      <div className="cinzel text-egyptian-sand/80 leading-tight truncate px-1 pt-0.5" style={{ fontSize: '0.58rem' }}>
        {unit.definition.name}
      </div>

      {/* HP bar */}
      <div className="mx-1 mb-1 h-1 bg-deep-sand-dark/80 overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${hpPercent}%`,
            background: 'oklch(0.55 0.18 145)',
          }}
        />
      </div>

      {/* Sell button */}
      {phase !== 'battle' && (
        <button
          onClick={handleSell}
          className="absolute -top-1 -right-1 w-4 h-4 bg-egyptian-crimson/80 border border-red-600/50 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-egyptian-crimson z-10"
          title={`Sell for ${unit.definition.cost * unit.starLevel}g`}
          style={{ fontSize: '0.65rem' }}
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
    <div className="command-panel border border-aged-bronze/40 p-3 flex flex-col gap-2"
      style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
      <div className="flex items-center justify-between border-b border-aged-bronze/25 pb-2">
        <h3 className="cinzel text-ember-gold font-bold text-xs tracking-widest uppercase">
          🏺 Bench
        </h3>
        <span className="font-mono text-egyptian-sand/40 text-xs border border-aged-bronze/25 px-1.5 py-0.5">
          {bench.length}/{maxBench} · Board: {state.board.length}/{level}
        </span>
      </div>

      <div className="grid grid-cols-9 gap-1.5">
        {bench.map(unit => (
          <BenchUnitCard key={unit.instanceId} unit={unit} />
        ))}
        {Array.from({ length: Math.max(0, maxBench - bench.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square border border-dashed border-aged-bronze/15 bg-deep-sand-dark/20"
            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); }}
          />
        ))}
      </div>
    </div>
  );
}
