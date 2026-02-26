import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Heart, Coins, Star, Trophy, Skull, Zap } from 'lucide-react';

export default function GameHUD() {
  const { state, returnToMenu } = useGameState();
  const { round, playerHp, gold, level, xp, xpToNextLevel, wins, losses, streak } = state;

  const hpPercent = (playerHp / 100) * 100;
  const xpPercent = (xp / xpToNextLevel) * 100;

  return (
    <div className="egyptian-panel px-4 py-2 flex items-center justify-between gap-4 flex-wrap">
      {/* Left: Title & Round */}
      <div className="flex items-center gap-4">
        <button
          onClick={returnToMenu}
          className="cinzel text-egyptian-gold/60 hover:text-egyptian-gold text-sm transition-colors"
        >
          ← Menu
        </button>
        <div className="cinzel text-egyptian-gold font-bold text-lg">
          Pharaoh's Conquest
        </div>
        <div className="egyptian-panel px-3 py-1 cinzel text-egyptian-sand text-sm">
          Round <span className="text-egyptian-gold font-bold">{round}</span>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* HP */}
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-egyptian-sand/60 cinzel">HP</div>
            <div className="flex items-center gap-1">
              <div className="w-24 hp-bar">
                <div
                  className="hp-bar-fill"
                  style={{
                    width: `${hpPercent}%`,
                    background: hpPercent > 50 ? 'oklch(0.55 0.18 145)' : hpPercent > 25 ? 'oklch(0.65 0.18 75)' : 'oklch(0.55 0.22 25)',
                  }}
                />
              </div>
              <span className="text-sm font-bold text-egyptian-sand cinzel">{playerHp}</span>
            </div>
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-egyptian-gold" />
          <span className="cinzel text-egyptian-gold font-bold text-lg">{gold}</span>
          <span className="text-egyptian-sand/50 text-xs cinzel">gold</span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-egyptian-turquoise" />
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-egyptian-sand/60 cinzel">Lv.{level}</div>
            <div className="flex items-center gap-1">
              <div className="w-16 hp-bar">
                <div
                  className="hp-bar-fill bg-egyptian-turquoise"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-xs text-egyptian-sand/60 cinzel">{xp}/{xpToNextLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: W/L/Streak */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-egyptian-gold" />
          <span className="cinzel text-egyptian-gold font-bold">{wins}</span>
        </div>
        <div className="flex items-center gap-1">
          <Skull className="w-4 h-4 text-egyptian-crimson" />
          <span className="cinzel text-red-400 font-bold">{losses}</span>
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1 bg-egyptian-gold/10 px-2 py-0.5 rounded-sm border border-egyptian-gold/30">
            <Zap className="w-3 h-3 text-egyptian-gold" />
            <span className="cinzel text-egyptian-gold text-xs font-bold">{streak} streak</span>
          </div>
        )}
      </div>
    </div>
  );
}
