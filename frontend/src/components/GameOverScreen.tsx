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
      <div className="absolute inset-0" style={{
        background: 'oklch(0.06 0.02 55 / 0.88)'
      }} />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-ember-gold/40" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-ember-gold/40" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-ember-gold/40" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-ember-gold/40" />

      <div
        className="relative z-10 p-8 max-w-md w-full mx-4 text-center"
        style={{
          background: 'oklch(0.10 0.02 55 / 0.97)',
          border: '1px solid oklch(0.55 0.14 75 / 0.6)',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          boxShadow: '0 0 40px oklch(0.75 0.18 75 / 0.15), inset 0 0 60px oklch(0.05 0.02 55 / 0.5)',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-ember-gold/60 to-transparent" />

        {/* Icon */}
        <div className="text-6xl mb-4">
          {isVictory ? '🏆' : '💀'}
        </div>

        {/* Title */}
        <h2 className="cinzel-decorative text-ember-gold text-3xl font-bold mb-2 tracking-wider">
          {isVictory ? 'Pharaoh Victorious!' : 'The Sands Claim You'}
        </h2>
        <p className="font-garamond text-egyptian-sand/60 mb-8 text-sm">
          {isVictory
            ? 'Your armies have conquered all who stood before you!'
            : 'Your forces have been defeated. The desert reclaims what was yours.'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Rounds', value: round - 1, color: 'text-ember-gold' },
            { label: 'Victories', value: wins, color: 'text-green-400' },
            { label: 'Defeats', value: losses, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-3 border border-aged-bronze/25 bg-deep-sand-dark/40"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
            >
              <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
              <div className="cinzel text-egyptian-sand/50 text-xs mt-1 tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="egyptian-btn flex-1 flex items-center justify-center gap-2 py-3"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={returnToMenu}
            className="tactical-btn flex-1 flex items-center justify-center gap-2 py-3"
            style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-aged-bronze/40 to-transparent" />
      </div>
    </div>
  );
}
