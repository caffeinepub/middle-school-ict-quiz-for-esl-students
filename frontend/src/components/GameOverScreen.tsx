import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Trophy, Skull, RotateCcw, Home } from 'lucide-react';

export default function GameOverScreen() {
  const { state, startGame, returnToMenu } = useGameState();
  const { round, wins, losses, playerHp } = state;

  const isVictory = playerHp > 0 && round > 10;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/egypt-menu-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-egyptian-dark/80" />

      <div className="relative z-10 egyptian-panel-gold p-8 max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isVictory ? '🏆' : '💀'}
        </div>

        {/* Title */}
        <h2 className="cinzel-decorative text-egyptian-gold text-3xl font-bold mb-2">
          {isVictory ? 'Pharaoh Victorious!' : 'The Sands Claim You'}
        </h2>
        <p className="font-garamond text-egyptian-sand/70 mb-6">
          {isVictory
            ? 'Your armies have conquered all who stood before you!'
            : 'Your forces have been defeated. The desert reclaims what was yours.'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-egyptian-dark/50 rounded-sm p-3 border border-egyptian-gold/20">
            <div className="cinzel text-egyptian-gold text-2xl font-bold">{round - 1}</div>
            <div className="cinzel text-egyptian-sand/60 text-xs mt-1">Rounds</div>
          </div>
          <div className="bg-egyptian-dark/50 rounded-sm p-3 border border-egyptian-gold/20">
            <div className="cinzel text-green-400 text-2xl font-bold">{wins}</div>
            <div className="cinzel text-egyptian-sand/60 text-xs mt-1">Victories</div>
          </div>
          <div className="bg-egyptian-dark/50 rounded-sm p-3 border border-egyptian-gold/20">
            <div className="cinzel text-red-400 text-2xl font-bold">{losses}</div>
            <div className="cinzel text-egyptian-sand/60 text-xs mt-1">Defeats</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="egyptian-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={returnToMenu}
            className="egyptian-btn-secondary flex-1 flex items-center justify-center gap-2 py-3 rounded-sm"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
