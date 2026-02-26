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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-egyptian-dark/70" />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-egyptian-gold to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-egyptian-gold to-transparent" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Title */}
        <div className="text-center">
          <div className="cinzel-decorative text-egyptian-gold text-sm tracking-[0.4em] uppercase mb-2 opacity-80">
            ✦ Ancient Egypt ✦
          </div>
          <h1 className="cinzel-decorative font-bold text-egyptian-gold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', textShadow: '0 0 40px oklch(0.75 0.18 75 / 0.6), 0 2px 4px rgba(0,0,0,0.8)' }}>
            Pharaoh's
          </h1>
          <h1 className="cinzel-decorative font-bold text-egyptian-gold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', textShadow: '0 0 40px oklch(0.75 0.18 75 / 0.6), 0 2px 4px rgba(0,0,0,0.8)' }}>
            Conquest
          </h1>
          <div className="mt-3 text-egyptian-sand/70 font-garamond text-lg tracking-widest">
            ─── Auto-Chess Strategy ───
          </div>
        </div>

        {/* Decorative hieroglyph row */}
        <div className="text-2xl opacity-40 tracking-[0.5em] text-egyptian-gold select-none">
          𓂀 𓃭 𓆣 𓇋 𓈖 𓉐 𓊃 𓋴
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={onStartGame}
            className="egyptian-btn px-8 py-4 text-lg rounded-sm w-full"
          >
            ⚔️ Start Game
          </button>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="egyptian-btn-secondary px-8 py-4 text-lg rounded-sm w-full"
          >
            📜 How to Play
          </button>
        </div>

        {/* Unit preview row */}
        <div className="flex gap-3 mt-4 flex-wrap justify-center max-w-2xl">
          {UNIT_DEFINITIONS.slice(0, 8).map(unit => (
            <div key={unit.id} className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-sm overflow-hidden border border-egyptian-gold/40"
                style={{ boxShadow: `0 0 8px ${unit.color}40` }}>
                <img
                  src={unit.portraitUrl}
                  alt={unit.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-egyptian-sand/60 text-xs cinzel" style={{ fontSize: '0.6rem' }}>
                {unit.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-egyptian-sand/40 text-xs font-garamond">
          © {new Date().getFullYear()} Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pharaohs-conquest')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-egyptian-gold/60 hover:text-egyptian-gold transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* How to Play Modal */}
      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="max-w-2xl max-h-[80vh] egyptian-panel border-egyptian-gold/60 text-foreground">
          <DialogHeader>
            <DialogTitle className="cinzel text-egyptian-gold text-2xl text-center">
              📜 How to Play
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4 scrollbar-thin">
            <div className="space-y-6 font-garamond text-egyptian-sand/90">
              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">⚔️ Game Overview</h3>
                <p>Pharaoh's Conquest is an auto-chess strategy game. Build an army of Egyptian warriors, place them on the battlefield, and watch them fight automatically. Survive as many rounds as possible!</p>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">🏪 The Shop</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Each round you get 5 gold (plus bonuses)</li>
                  <li>Buy units from the shop to add them to your bench</li>
                  <li>Reroll the shop for 2 gold to see new units</li>
                  <li>Lock the shop to keep the same units next round</li>
                  <li>Buy XP for 4 gold to level up faster</li>
                </ul>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">🗺️ The Board</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Drag units from your bench to the board</li>
                  <li>Your level determines how many units you can field</li>
                  <li>Click a board unit then click a bench slot to swap</li>
                  <li>Right-click or use the sell button to sell units</li>
                </ul>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">✨ Synergies</h3>
                <p className="mb-2">Placing units with matching traits activates powerful synergy bonuses:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SYNERGY_DEFINITIONS).map(([key, syn]) => (
                    <div key={key} className="bg-egyptian-dark/50 rounded p-2 border border-egyptian-gold/20">
                      <div className="cinzel text-egyptian-gold text-sm">{syn.icon} {syn.name}</div>
                      <div className="text-xs text-egyptian-sand/70 mt-1">{syn.description}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">⭐ Star Levels</h3>
                <p>Collect 3 copies of the same unit to automatically upgrade it to 2-star, gaining +80% HP and stats. Three 2-star units combine into a powerful 3-star!</p>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">💰 Economy Tips</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Win streaks give bonus gold each round</li>
                  <li>Interest: earn +1 gold per 10 gold saved (max 5)</li>
                  <li>Selling units returns their cost in gold</li>
                  <li>Higher level = access to stronger units in shop</li>
                </ul>
              </section>

              <section>
                <h3 className="cinzel text-egyptian-gold text-lg mb-2">❤️ Health</h3>
                <p>You start with 100 HP. Losing a round costs HP based on the round number. Reach 0 HP and the game ends. Win as many rounds as you can!</p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
