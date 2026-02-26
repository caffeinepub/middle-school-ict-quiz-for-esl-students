import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { calculateSynergies } from '../utils/synergyCalculator';
import { SYNERGY_DEFINITIONS } from '../data/synergies';
import EgyptianPanel from './EgyptianPanel';
import { cn } from '@/lib/utils';

export default function SynergyPanel() {
    const { state } = useGameState();
    const activeSynergies = calculateSynergies(state.board);

    return (
        <EgyptianPanel title="Synergies" titleIcon="𓂀" compact>
            <div className="flex flex-col gap-1.5">
                {SYNERGY_DEFINITIONS.map(synergy => {
                    const active = activeSynergies.find(s => s.synergyId === synergy.id);
                    const count = active?.count || 0;
                    const activeThreshold = active?.activeThreshold || null;
                    const isActive = activeThreshold !== null;
                    const nextThreshold = synergy.thresholds.find(t => t > count);

                    return (
                        <div
                            key={synergy.id}
                            className={cn(
                                'rounded-sm p-1.5 border transition-all',
                                isActive
                                    ? 'border-[oklch(0.78_0.15_85_/_0.6)] bg-[oklch(0.25_0.06_60_/_0.5)] animate-pulse-gold'
                                    : 'border-[oklch(0.30_0.06_50_/_0.4)] bg-[oklch(0.20_0.04_50_/_0.3)]'
                            )}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">{synergy.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        'font-cinzel font-semibold text-[9px] leading-tight',
                                        isActive ? 'text-[oklch(0.88_0.18_88)]' : 'text-[oklch(0.60_0.08_70)]'
                                    )}>
                                        {synergy.name}
                                    </p>
                                    <p className="text-[oklch(0.55_0.06_70)] text-[8px] leading-tight truncate">
                                        {synergy.faction}
                                    </p>
                                </div>
                                {/* Threshold indicators */}
                                <div className="flex gap-0.5">
                                    {synergy.thresholds.map(threshold => (
                                        <div
                                            key={threshold}
                                            className={cn(
                                                'w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-cinzel font-bold border',
                                                count >= threshold
                                                    ? 'bg-[oklch(0.78_0.15_85)] text-[oklch(0.15_0.04_55)] border-[oklch(0.88_0.18_88)]'
                                                    : 'bg-[oklch(0.20_0.04_50)] text-[oklch(0.50_0.08_70)] border-[oklch(0.35_0.06_50)]'
                                            )}
                                        >
                                            {threshold}
                                        </div>
                                    ))}
                                </div>
                                {/* Count */}
                                <div className={cn(
                                    'text-[9px] font-cinzel font-bold min-w-[16px] text-center',
                                    isActive ? 'text-[oklch(0.88_0.18_88)]' : 'text-[oklch(0.50_0.08_70)]'
                                )}>
                                    {count}
                                </div>
                            </div>

                            {/* Active bonus description */}
                            {isActive && (
                                <div className="mt-1 pl-6">
                                    <p className="text-[oklch(0.72_0.14_195)] text-[8px] leading-tight">
                                        ✦ {synergy.bonusDescriptions[synergy.thresholds.indexOf(activeThreshold!)]}
                                    </p>
                                </div>
                            )}

                            {/* Progress to next threshold */}
                            {!isActive && nextThreshold && (
                                <div className="mt-0.5 pl-6">
                                    <p className="text-[oklch(0.45_0.06_70)] text-[8px]">
                                        Need {nextThreshold - count} more
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </EgyptianPanel>
    );
}
