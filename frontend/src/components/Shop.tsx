import React from 'react';
import { useGameState, ShopUnit } from '../hooks/useGameState';
import { RefreshCw, Lock, Unlock, TrendingUp, Coins } from 'lucide-react';
import { SYNERGY_DEFINITIONS } from '../data/units';

function ShopUnitCard({ shopUnit, canAfford }: { shopUnit: ShopUnit; canAfford: boolean }) {
  const { buyUnit } = useGameState();

  const traitIcons = shopUnit.definition.traits.map(t => SYNERGY_DEFINITIONS[t]?.icon || '').join('');

  return (
    <div
      className={`unit-card flex flex-col p-1.5 gap-1 select-none transition-all duration-150
        ${canAfford ? 'cursor-pointer hover:border-egyptian-gold/60' : 'opacity-50 cursor-not-allowed'}
      `}
      onClick={() => canAfford && buyUnit(shopUnit)}
      draggable={canAfford}
      onDragStart={(e) => {
        e.dataTransfer.setData('shopUnitId', shopUnit.instanceId);
      }}
    >
      {/* Portrait */}
      <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-egyptian-dark/50">
        <img
          src={shopUnit.definition.portraitUrl}
          alt={shopUnit.definition.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.parentElement!.style.background = shopUnit.definition.color;
          }}
        />
        {/* Tier badge */}
        <div className="absolute top-0.5 right-0.5 bg-egyptian-dark/80 rounded px-1 text-xs cinzel text-egyptian-gold">
          T{shopUnit.definition.tier}
        </div>
      </div>

      {/* Name */}
      <div className="cinzel text-egyptian-sand text-xs font-semibold leading-tight truncate">
        {shopUnit.definition.name}
      </div>

      {/* Traits */}
      <div className="text-xs opacity-70">{traitIcons}</div>

      {/* Cost */}
      <div className="flex items-center gap-1">
        <Coins className="w-3 h-3 text-egyptian-gold" />
        <span className="cinzel text-egyptian-gold font-bold text-sm">{shopUnit.cost}</span>
      </div>
    </div>
  );
}

export default function Shop() {
  const { state, rerollShop, buyXp, lockShop, isShopLocked, startBattle, nextRound } = useGameState();
  const { shop, gold, phase, isBattling, level, xp, xpToNextLevel } = state;

  const xpPercent = (xp / xpToNextLevel) * 100;

  return (
    <div className="egyptian-panel p-3 flex flex-col gap-3">
      {/* Shop header */}
      <div className="flex items-center justify-between">
        <h3 className="cinzel text-egyptian-gold font-bold text-sm tracking-wider">🏪 Market of the Pharaoh</h3>
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-egyptian-gold" />
          <span className="cinzel text-egyptian-gold font-bold">{gold}</span>
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
          <div className="col-span-5 text-center text-egyptian-sand/40 cinzel text-sm py-4">
            Shop is empty
          </div>
        )}
      </div>

      {/* Shop controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Reroll */}
        <button
          onClick={rerollShop}
          disabled={gold < 2 || phase !== 'prep' || isShopLocked}
          className="egyptian-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <RefreshCw className="w-3 h-3" />
          Reroll (2g)
        </button>

        {/* Lock */}
        <button
          onClick={lockShop}
          disabled={phase !== 'prep'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm cinzel font-semibold tracking-wide transition-all disabled:opacity-40
            ${isShopLocked
              ? 'bg-egyptian-gold/20 border border-egyptian-gold text-egyptian-gold'
              : 'bg-egyptian-dark/50 border border-egyptian-gold/30 text-egyptian-sand/70 hover:border-egyptian-gold/60'
            }
          `}
        >
          {isShopLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {isShopLocked ? 'Locked' : 'Lock'}
        </button>

        {/* Buy XP */}
        <button
          onClick={buyXp}
          disabled={gold < 4 || phase !== 'prep' || level >= 9}
          className="egyptian-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <TrendingUp className="w-3 h-3" />
          Buy XP (4g) {xp}/{xpToNextLevel}
        </button>

        {/* Battle / Next Round button */}
        <div className="ml-auto">
          {phase === 'prep' && !isBattling && (
            <button
              onClick={startBattle}
              disabled={state.board.length === 0}
              className="egyptian-btn flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              ⚔️ Battle!
            </button>
          )}
          {phase === 'battle' && isBattling && (
            <div className="cinzel text-egyptian-gold/60 text-xs animate-pulse">
              Battling...
            </div>
          )}
          {phase === 'result' && !isBattling && (
            <button
              onClick={nextRound}
              className="egyptian-btn flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-sm"
            >
              Next Round →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
