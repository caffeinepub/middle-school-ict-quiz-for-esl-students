import React from 'react';
import { useGameState, ShopUnit } from '../hooks/useGameState';
import { RefreshCw, Lock, Unlock, TrendingUp, Coins, Sword } from 'lucide-react';
import { SYNERGY_DEFINITIONS } from '../data/units';

function ShopUnitCard({ shopUnit, canAfford }: { shopUnit: ShopUnit; canAfford: boolean }) {
  const { buyUnit } = useGameState();
  const traitIcons = shopUnit.definition.traits.map(t => SYNERGY_DEFINITIONS[t]?.icon || '').join(' ');

  return (
    <div
      className={`relative flex flex-col select-none transition-all duration-150 group
        ${canAfford
          ? 'cursor-pointer hover:border-ember-gold/70'
          : 'opacity-45 cursor-not-allowed'
        }
      `}
      style={{
        background: 'oklch(0.13 0.03 55 / 0.95)',
        border: '1px solid oklch(0.35 0.08 65 / 0.6)',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
      onClick={() => canAfford && buyUnit(shopUnit)}
      draggable={canAfford}
      onDragStart={(e) => {
        e.dataTransfer.setData('shopUnitId', shopUnit.instanceId);
      }}
    >
      {/* Portrait */}
      <div className="relative w-full aspect-square overflow-hidden bg-deep-sand-dark/50">
        <img
          src={shopUnit.definition.portraitUrl}
          alt={shopUnit.definition.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.parentElement!.style.background = shopUnit.definition.color;
          }}
        />
        {/* Tier badge */}
        <div className="absolute top-0.5 right-0.5 bg-command-panel/90 border border-aged-bronze/50 px-1 text-xs font-mono text-ember-gold/80"
          style={{ fontSize: '0.6rem' }}>
          T{shopUnit.definition.tier}
        </div>
        {/* Hover overlay */}
        {canAfford && (
          <div className="absolute inset-0 bg-ember-gold/0 group-hover:bg-ember-gold/10 transition-colors duration-150 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity cinzel text-ember-gold text-xs font-bold tracking-wider">BUY</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-1.5 flex flex-col gap-0.5">
        <div className="cinzel text-egyptian-sand text-xs font-semibold leading-tight truncate" style={{ fontSize: '0.65rem' }}>
          {shopUnit.definition.name}
        </div>
        <div className="text-xs opacity-60 leading-none">{traitIcons}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <Coins className="w-2.5 h-2.5 text-ember-gold" />
          <span className="font-mono text-ember-gold font-bold text-sm">{shopUnit.cost}</span>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const { state, rerollShop, buyXp, lockShop, isShopLocked, startBattle, nextRound } = useGameState();
  const { shop, gold, phase, isBattling, level, xp, xpToNextLevel } = state;
  const xpPercent = (xp / xpToNextLevel) * 100;

  return (
    <div className="command-panel border border-aged-bronze/40 p-3 flex flex-col gap-3"
      style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sword className="w-3.5 h-3.5 text-ember-gold/70" />
          <h3 className="cinzel text-ember-gold font-bold text-sm tracking-widest uppercase">
            Market of the Pharaoh
          </h3>
        </div>
        <div className="flex items-center gap-1.5 command-panel border border-aged-bronze/40 px-2 py-0.5"
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
          <Coins className="w-3 h-3 text-ember-gold" />
          <span className="font-mono text-ember-gold font-bold text-sm">{gold}</span>
        </div>
      </div>

      {/* Shop units */}
      <div className="grid grid-cols-5 gap-2">
        {shop.map(shopUnit => (
          <ShopUnitCard
            key={shopUnit.instanceId}
            shopUnit={shopUnit}
            canAfford={gold >= shopUnit.cost && phase === 'prep'}
          />
        ))}
        {shop.length === 0 && (
          <div className="col-span-5 text-center text-egyptian-sand/30 cinzel text-sm py-4 border border-dashed border-aged-bronze/20">
            — Shop is empty —
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={rerollShop}
          disabled={gold < 2 || phase !== 'prep' || isShopLocked}
          className="tactical-btn flex items-center gap-1.5 px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="font-mono">Reroll</span>
          <span className="text-ember-gold/60 font-mono">2g</span>
        </button>

        <button
          onClick={lockShop}
          disabled={phase !== 'prep'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs cinzel font-semibold tracking-wide transition-all disabled:opacity-30
            ${isShopLocked
              ? 'bg-ember-gold/15 border border-ember-gold text-ember-gold'
              : 'bg-command-panel border border-aged-bronze/40 text-egyptian-sand/60 hover:border-aged-bronze/70'
            }
          `}
          style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
        >
          {isShopLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {isShopLocked ? 'Locked' : 'Lock'}
        </button>

        <button
          onClick={buyXp}
          disabled={gold < 4 || phase !== 'prep' || level >= 9}
          className="tactical-btn flex items-center gap-1.5 px-3 py-1.5 text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
        >
          <TrendingUp className="w-3 h-3" />
          <span className="font-mono">XP</span>
          <span className="text-ember-gold/60 font-mono">4g</span>
          <span className="text-egyptian-sand/40 font-mono text-xs">{xp}/{xpToNextLevel}</span>
        </button>

        <div className="ml-auto">
          {phase === 'prep' && !isBattling && (
            <button
              onClick={startBattle}
              disabled={state.board.length === 0}
              className="egyptian-btn flex items-center gap-2 px-5 py-2 text-sm rounded-none disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              ⚔ Battle!
            </button>
          )}
          {phase === 'battle' && isBattling && (
            <div className="cinzel text-ember-gold/60 text-xs animate-pulse tracking-widest">
              ⚔ Battling...
            </div>
          )}
          {phase === 'result' && !isBattling && (
            <button
              onClick={nextRound}
              className="egyptian-btn flex items-center gap-2 px-5 py-2 text-sm rounded-none"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              Next Round →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
