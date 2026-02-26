import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { GameProvider, useGameState } from './hooks/useGameState';
import MainMenu from './components/MainMenu';
import GameHUD from './components/GameHUD';
import BattleBoard from './components/BattleBoard';
import Shop from './components/Shop';
import SynergyPanel from './components/SynergyPanel';
import Bench from './components/Bench';
import UnitDetail from './components/UnitDetail';
import BattleLog from './components/BattleLog';
import GameOverScreen from './components/GameOverScreen';

const queryClient = new QueryClient();

function GameApp() {
  const { state, startGame } = useGameState();
  const { screen } = state;

  if (screen === 'menu') {
    return <MainMenu onStartGame={startGame} />;
  }

  if (screen === 'gameover') {
    return <GameOverScreen />;
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-egyptian-dark flex flex-col overflow-hidden">
      {/* HUD */}
      <GameHUD />

      {/* Main game area */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden min-h-0">
        {/* Left panel: Synergies + Unit Detail */}
        <div className="flex flex-col gap-2 w-48 flex-shrink-0 overflow-y-auto scrollbar-thin">
          <SynergyPanel />
          <UnitDetail />
        </div>

        {/* Center: Battle Board + Bench + Shop */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 overflow-y-auto scrollbar-thin">
          <BattleBoard />
          <BattleLog />
          <Bench />
          <Shop />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-1.5 border-t border-egyptian-gold/10">
        <p className="text-egyptian-sand/25 text-xs font-garamond">
          © {new Date().getFullYear()} Pharaoh's Conquest — Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pharaohs-conquest')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-egyptian-gold/40 hover:text-egyptian-gold/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <GameProvider>
          <GameApp />
        </GameProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
