import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Heart, Coins, Star, Trophy, Skull, Zap, ChevronLeft } from 'lucide-react';

function StatBlock({ label, children, accent = 'gold' }: {
  label: string;
  children: React.ReactNode;
  accent?: 'gold' | 'teal' | 'red' | 'green';
}) {
  const borderColor = {
    gold: 'border-aged-bronze/60',
    teal: 'border-egyptian-turquoise/40',
    red: 'border-egyptian-crimson/40',
    green: 'border-green-700/40',
  }[accent];

  const labelColor = {
    gold: 'text-ember-gold/60',
    teal: 'text-egyptian-turquoise/60',
    red: 'text-egyptian-crimson/60',
    green: 'text-green-500/60',
  }[accent];

  return (
    <div className={`command-panel border ${borderColor} px-2.5 py-1.5 flex flex-col gap-0.5 min-w-0`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
      <div className={`text-xs font-mono uppercase tracking-widest ${labelColor}`} style={{ fontSize: '0.6rem' }}>
        {label}
      </div>
      <div className="flex items-center gap-1">
        {children}
      </div>
    </div>
  );
}

export default function GameHUD() {
  const { state, returnToMenu } = useGameState();
  const { round, playerHp, gold, level, xp, xpToNextLevel, wins, losses, streak } = state;

  const hpPercent = (playerHp / 100) * 100;
  const xpPercent = (xp / xpToNextLevel) * 100;

  return (
    <div className="command-panel border-b border-aged-bronze/40 px-3 py-2 flex items-center gap-3 flex-wrap"
      style={{ background: 'oklch(0.09 0.02 55 / 0.98)' }}>
      {/* Left: Nav + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={returnToMenu}
          className="flex items-center gap-1 text-ember-gold/50 hover:text-ember-gold text-xs cinzel transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Menu
        </button>
        <div className="w-px h-6 bg-aged-bronze/30" />
        <div className="cinzel text-ember-gold font-bold text-base tracking-wider">
          Pharaoh's Conquest
        </div>
      </div>

      <div className="w-px h-6 bg-aged-bronze/30 hidden sm:block" />

      {/* Round */}
      <StatBlock label="Round" accent="gold">
        <span className="font-mono text-ember-gold font-bold text-lg leading-none">{round}</span>
      </StatBlock>

      {/* HP */}
      <StatBlock label="HP" accent="red">
        <Heart className="w-3 h-3 text-red-400 flex-shrink-0" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-2 bg-deep-sand-dark/80 rounded-none overflow-hidden border border-egyptian-crimson/20">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${hpPercent}%`,
                  background: hpPercent > 50
                    ? 'oklch(0.55 0.18 145)'
                    : hpPercent > 25
                      ? 'oklch(0.70 0.18 75)'
                      : 'oklch(0.55 0.22 25)',
                }}
              />
            </div>
            <span className="font-mono text-egyptian-sand font-bold text-sm">{playerHp}</span>
          </div>
        </div>
      </StatBlock>

      {/* Gold */}
      <StatBlock label="Gold" accent="gold">
        <Coins className="w-3.5 h-3.5 text-ember-gold flex-shrink-0" />
        <span className="font-mono text-ember-gold font-bold text-xl leading-none">{gold}</span>
      </StatBlock>

      {/* Level & XP */}
      <StatBlock label={`Level ${level}`} accent="teal">
        <Star className="w-3 h-3 text-egyptian-turquoise flex-shrink-0" />
        <div className="flex items-center gap-1.5">
          <div className="w-14 h-2 bg-deep-sand-dark/80 rounded-none overflow-hidden border border-egyptian-turquoise/20">
            <div
              className="h-full transition-all duration-500 bg-egyptian-turquoise"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="font-mono text-egyptian-turquoise/70 text-xs">{xp}/{xpToNextLevel}</span>
        </div>
      </StatBlock>

      {/* W/L */}
      <div className="flex items-center gap-2 ml-auto">
        <StatBlock label="Wins" accent="green">
          <Trophy className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="font-mono text-green-400 font-bold text-lg leading-none">{wins}</span>
        </StatBlock>
        <StatBlock label="Losses" accent="red">
          <Skull className="w-3 h-3 text-red-400 flex-shrink-0" />
          <span className="font-mono text-red-400 font-bold text-lg leading-none">{losses}</span>
        </StatBlock>

        {streak > 1 && (
          <div className="flex items-center gap-1 bg-ember-gold/10 px-2 py-1 border border-ember-gold/40"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <Zap className="w-3 h-3 text-ember-gold" />
            <span className="font-mono text-ember-gold text-xs font-bold">{streak}×</span>
          </div>
        )}
      </div>
    </div>
  );
}
