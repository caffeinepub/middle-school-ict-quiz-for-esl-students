import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { SYNERGY_DEFINITIONS } from '../data/units';
import { Sword, Shield, Heart, Zap, Coins } from 'lucide-react';

export default function UnitDetail() {
  const { state, sellUnit, removeFromBoard } = useGameState();
  const { selectedUnit, phase } = state;

  if (!selectedUnit) {
    return (
      <div className="egyptian-panel p-3 flex flex-col items-center justify-center gap-2 min-h-[200px]">
        <div className="text-4xl opacity-20">𓂀</div>
        <p className="cinzel text-egyptian-sand/30 text-xs text-center">
          Select a unit to view details
        </p>
      </div>
    );
  }

  const unit = selectedUnit;
  const def = unit.definition;
  const stars = unit.starLevel === 3 ? '★★★' : unit.starLevel === 2 ? '★★' : '★';
  const hpPercent = (unit.currentHp / unit.maxHp) * 100;
  const isOnBoard = state.board.some(u => u.instanceId === unit.instanceId);
  const sellValue = def.cost * unit.starLevel;

  return (
    <div className="egyptian-panel p-3 flex flex-col gap-3">
      {/* Header */}
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-sm overflow-hidden border border-egyptian-gold/40 flex-shrink-0"
          style={{ boxShadow: `0 0 12px ${def.color}40` }}>
          <img
            src={def.portraitUrl}
            alt={def.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              el.parentElement!.style.background = def.color;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="cinzel text-egyptian-gold font-bold text-sm">{def.name}</div>
          <div className="cinzel text-egyptian-sand/60 text-xs">{def.title}</div>
          <div className="text-egyptian-gold text-sm mt-0.5">{stars}</div>
          <div className="flex items-center gap-1 mt-1">
            {def.traits.map(trait => {
              const syn = SYNERGY_DEFINITIONS[trait as keyof typeof SYNERGY_DEFINITIONS];
              return syn ? (
                <span key={trait} className="text-xs bg-egyptian-dark/60 border border-egyptian-gold/20 px-1 rounded cinzel text-egyptian-sand/70">
                  {syn.icon} {syn.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div>
        <div className="flex justify-between text-xs cinzel text-egyptian-sand/60 mb-1">
          <span>HP</span>
          <span>{Math.floor(unit.currentHp)}/{Math.floor(unit.maxHp)}</span>
        </div>
        <div className="hp-bar" style={{ height: '6px' }}>
          <div
            className="hp-bar-fill"
            style={{
              width: `${hpPercent}%`,
              background: hpPercent > 50 ? 'oklch(0.55 0.18 145)' : hpPercent > 25 ? 'oklch(0.65 0.18 75)' : 'oklch(0.55 0.22 25)',
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="flex items-center gap-1.5 bg-egyptian-dark/40 rounded-sm p-1.5">
          <Sword className="w-3 h-3 text-egyptian-crimson" />
          <span className="cinzel text-xs text-egyptian-sand/70">ATK</span>
          <span className="cinzel text-xs text-egyptian-sand font-bold ml-auto">{def.attack}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-egyptian-dark/40 rounded-sm p-1.5">
          <Shield className="w-3 h-3 text-egyptian-turquoise" />
          <span className="cinzel text-xs text-egyptian-sand/70">DEF</span>
          <span className="cinzel text-xs text-egyptian-sand font-bold ml-auto">{def.defense}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-egyptian-dark/40 rounded-sm p-1.5">
          <Heart className="w-3 h-3 text-red-400" />
          <span className="cinzel text-xs text-egyptian-sand/70">HP</span>
          <span className="cinzel text-xs text-egyptian-sand font-bold ml-auto">{def.hp}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-egyptian-dark/40 rounded-sm p-1.5">
          <Zap className="w-3 h-3 text-egyptian-gold" />
          <span className="cinzel text-xs text-egyptian-sand/70">SPD</span>
          <span className="cinzel text-xs text-egyptian-sand font-bold ml-auto">{def.speed}x</span>
        </div>
      </div>

      {/* Ability */}
      <div className="bg-egyptian-lapis/20 border border-egyptian-lapis/40 rounded-sm p-2">
        <div className="cinzel text-egyptian-turquoise text-xs font-bold mb-1">
          ✨ {def.ability.name}
        </div>
        <div className="text-egyptian-sand/70 text-xs leading-relaxed">
          {def.ability.description}
        </div>
        <div className="cinzel text-egyptian-sand/40 text-xs mt-1">
          Cooldown: {def.ability.cooldown}s
        </div>
      </div>

      {/* Actions */}
      {phase !== 'battle' && (
        <div className="flex gap-2">
          {isOnBoard && (
            <button
              onClick={() => removeFromBoard(unit.instanceId)}
              className="egyptian-btn-secondary flex-1 py-1.5 text-xs rounded-sm"
            >
              → Bench
            </button>
          )}
          <button
            onClick={() => sellUnit(unit.instanceId)}
            className="flex items-center justify-center gap-1 flex-1 py-1.5 text-xs rounded-sm cinzel font-semibold bg-egyptian-crimson/20 border border-egyptian-crimson/40 text-red-400 hover:bg-egyptian-crimson/30 transition-all"
          >
            <Coins className="w-3 h-3" />
            Sell ({sellValue}g)
          </button>
        </div>
      )}
    </div>
  );
}
