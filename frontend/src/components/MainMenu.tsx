import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UNIT_DEFINITIONS, SYNERGY_DEFINITIONS } from '../data/units';

interface MainMenuProps {
  onStartGame: () => void;
}

export default function MainMenu({ onStartGame }: MainMenuProps) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/egypt-menu-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark tactical overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, oklch(0.06 0.02 55 / 0.85) 0%, oklch(0.08 0.03 55 / 0.75) 50%, oklch(0.06 0.02 55 / 0.90) 100%)'
      }} />

      {/* Scanline texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.05 0.01 55 / 0.15) 2px, oklch(0.05 0.01 55 / 0.15) 4px)',
      }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-ember-gold to-transparent" />
      <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aged-bronze/50 to-transparent" />
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-ember-gold to-transparent" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-ember-gold/50" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-ember-gold/50" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-ember-gold/50" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-ember-gold/50" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Title */}
        <div className="text-center">
          <div className="font-mono text-ember-gold/60 text-xs tracking-[0.5em] uppercase mb-3">
            ✦ TACTICAL COMMAND ✦
          </div>
          <h1
            className="cinzel-decorative font-bold text-ember-gold leading-tight"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              textShadow: '0 0 40px oklch(0.75 0.18 75 / 0.5), 0 0 80px oklch(0.75 0.18 75 / 0.2), 0 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            Pharaoh's
          </h1>
          <h1
            className="cinzel-decorative font-bold text-ember-gold leading-tight"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              textShadow: '0 0 40px oklch(0.75 0.18 75 / 0.5), 0 0 80px oklch(0.75 0.18 75 / 0.2), 0 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            Conquest
          </h1>
          <div className="mt-3 font-mono text-aged-bronze/70 text-sm tracking-[0.3em] uppercase">
            ─── Auto-Chess Strategy ───
          </div>
        </div>

        {/* Hieroglyph row */}
        <div className="text-xl opacity-25 tracking-[0.5em] text-ember-gold select-none">
          𓂀 𓃭 𓆣 𓇋 𓈖 𓉐 𓊃 𓋴
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onStartGame}
            className="egyptian-btn px-8 py-4 text-lg w-full tracking-widest"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
          >
            ⚔ Start Game
          </button>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="tactical-btn px-8 py-4 text-base w-full tracking-widest"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
          >
            📜 How to Play
          </button>
        </div>

        {/* Unit preview row */}
        <div className="flex gap-3 mt-2 flex-wrap justify-center max-w-2xl">
          {UNIT_DEFINITIONS.slice(0, 8).map(unit => (
            <div key={unit.id} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity group">
              <div
                className="w-12 h-12 overflow-hidden border border-aged-bronze/40 group-hover:border-ember-gold/60 transition-colors"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  boxShadow: `0 0 8px ${unit.color}30`,
                }}
              >
                <img
                  src={unit.portraitUrl}
                  alt={unit.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <span className="font-mono text-egyptian-sand/50 group-hover:text-egyptian-sand/80 transition-colors" style={{ fontSize: '0.55rem' }}>
                {unit.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="font-mono text-egyptian-sand/30 text-xs">
          © {new Date().getFullYear()} Built with ❤ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pharaohs-conquest')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember-gold/40 hover:text-ember-gold/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* How to Play Modal */}
      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="max-w-2xl max-h-[80vh] border-aged-bronze/60 text-foreground"
          style={{ background: 'oklch(0.10 0.02 55 / 0.98)', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
          <DialogHeader>
            <DialogTitle className="cinzel text-ember-gold text-2xl text-center tracking-widest">
              📜 How to Play
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 font-garamond text-egyptian-sand/90">
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">⚔ Game Overview</h3>
                <p>Pharaoh's Conquest is an auto-chess strategy game. Build an army of Egyptian warriors, place them on the hexagonal battlefield, and watch them fight automatically. Survive as many rounds as possible!</p>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">🏪 The Shop</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Each round you get 5 gold (plus bonuses)</li>
                  <li>Buy units from the shop to add them to your bench</li>
                  <li>Reroll the shop for 2 gold to see new units</li>
                  <li>Lock the shop to keep the same units next round</li>
                  <li>Buy XP for 4 gold to level up faster</li>
                </ul>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">🗺 The Hex Board</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Drag units from your bench to the hexagonal board</li>
                  <li>Your level determines how many units you can field</li>
                  <li>Click a board unit then click a hex cell to move it</li>
                  <li>Use the sell button (hover) to sell units</li>
                </ul>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">✦ Synergies</h3>
                <p className="mb-2">Placing units with matching traits activates powerful synergy bonuses:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SYNERGY_DEFINITIONS).map(([key, syn]) => (
                    <div key={key} className="bg-deep-sand-dark/50 p-2 border border-aged-bronze/20"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                      <div className="cinzel text-ember-gold text-sm">{syn.icon} {syn.name}</div>
                      <div className="text-xs text-egyptian-sand/60 mt-1">{syn.description}</div>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">⭐ Star Levels</h3>
                <p>Collect 3 copies of the same unit to automatically upgrade it to 2-star, gaining +80% HP and stats. Three 2-star units combine into a powerful 3-star!</p>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">💰 Economy Tips</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Win streaks give bonus gold each round</li>
                  <li>Interest: earn +1 gold per 10 gold saved (max 5)</li>
                  <li>Selling units returns their cost in gold</li>
                  <li>Higher level = access to stronger units in shop</li>
                </ul>
              </section>
              <section>
                <h3 className="cinzel text-ember-gold text-lg mb-2">❤ Health</h3>
                <p>You start with 100 HP. Losing a round costs HP based on the round number. Reach 0 HP and the game ends. Win as many rounds as you can!</p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
