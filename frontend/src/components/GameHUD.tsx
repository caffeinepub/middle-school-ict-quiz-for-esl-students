import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { cn } from '@/lib/utils';

export default function GameHUD() {
    const { state, startCombat } = useGameState();
    const isPrep = state.phase === 'preparation';
    const isCombat = state.phase === 'combat';

    const hpPercent = (state.playerHp / state.maxPlayerHp) * 100;
    const isLowHp = hpPercent < 30;

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[oklch(0.18_0.05_55)] via-[oklch(0.20_0.04_50)] to-[oklch(0.18_0.05_55)] border-b border-[oklch(0.40_0.08_60_/_0.5)]">
            {/* Game title */}
            <div className="flex items-center gap-2 mr-2">
                <span className="text-[oklch(0.78_0.15_85)] text-lg">𓂀</span>
                <h1 className="font-cinzel-decorative font-bold text-[oklch(0.88_0.18_88)] text-sm tracking-wider">
                    Pharaoh's Conquest
                </h1>
            </div>

            <div className="w-px h-6 bg-[oklch(0.40_0.08_60_/_0.5)]" />

            {/* Round */}
            <div className="flex items-center gap-1.5">
                <span className="text-[oklch(0.72_0.14_195)] text-sm">🏺</span>
                <div>
                    <p className="text-[oklch(0.55_0.08_70)] text-[9px] font-cinzel leading-none">ROUND</p>
                    <p className="text-[oklch(0.88_0.18_88)] text-sm font-cinzel font-bold leading-none">{state.round}</p>
                </div>
            </div>

            <div className="w-px h-6 bg-[oklch(0.40_0.08_60_/_0.5)]" />

            {/* HP */}
            <div className="flex items-center gap-1.5">
                <span className="text-[oklch(0.65_0.22_27)] text-sm">𓂋</span>
                <div>
                    <p className="text-[oklch(0.55_0.08_70)] text-[9px] font-cinzel leading-none">PHARAOH HP</p>
                    <div className="flex items-center gap-1">
                        <p className={cn(
                            'text-sm font-cinzel font-bold leading-none',
                            isLowHp ? 'text-[oklch(0.65_0.22_27)]' : 'text-[oklch(0.65_0.18_140)]'
                        )}>
                            {state.playerHp}/{state.maxPlayerHp}
                        </p>
                    </div>
                    <div className="w-20 h-1.5 rounded-full bg-[oklch(0.20_0.04_27)] mt-0.5 overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-500',
                                isLowHp
                                    ? 'bg-gradient-to-r from-[oklch(0.55_0.22_27)] to-[oklch(0.65_0.24_30)]'
                                    : 'bg-gradient-to-r from-[oklch(0.55_0.20_140)] to-[oklch(0.65_0.22_145)]'
                            )}
                            style={{ width: `${hpPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="w-px h-6 bg-[oklch(0.40_0.08_60_/_0.5)]" />

            {/* Gold */}
            <div className="flex items-center gap-1.5">
                <span className="text-[oklch(0.88_0.18_88)] text-sm">🪙</span>
                <div>
                    <p className="text-[oklch(0.55_0.08_70)] text-[9px] font-cinzel leading-none">GOLD</p>
                    <p className="text-[oklch(0.88_0.18_88)] text-sm font-cinzel font-bold leading-none">{state.gold}</p>
                </div>
            </div>

            <div className="w-px h-6 bg-[oklch(0.40_0.08_60_/_0.5)]" />

            {/* Prep timer */}
            {isPrep && (
                <div className="flex items-center gap-1.5">
                    <span className="text-[oklch(0.72_0.14_195)] text-sm">⏳</span>
                    <div>
                        <p className="text-[oklch(0.55_0.08_70)] text-[9px] font-cinzel leading-none">PREP TIME</p>
                        <p className={cn(
                            'text-sm font-cinzel font-bold leading-none',
                            state.prepTimeLeft <= 10 ? 'text-[oklch(0.65_0.22_27)]' : 'text-[oklch(0.72_0.14_195)]'
                        )}>
                            {state.prepTimeLeft}s
                        </p>
                    </div>
                </div>
            )}

            {/* Combat status */}
            {isCombat && (
                <div className="flex items-center gap-1.5">
                    <span className="text-[oklch(0.65_0.22_27)] text-sm animate-pulse">⚔</span>
                    <p className="text-[oklch(0.65_0.22_27)] text-xs font-cinzel font-bold animate-pulse">BATTLE!</p>
                </div>
            )}

            <div className="flex-1" />

            {/* Start combat button */}
            {isPrep && (
                <button
                    className="btn-egyptian px-3 py-1.5 rounded-sm text-xs"
                    onClick={startCombat}
                >
                    ⚔ Start Battle
                </button>
            )}
        </div>
    );
}
