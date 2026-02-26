import React from 'react';
import { useGameState } from '../hooks/useGameState';
import EgyptianPanel from './EgyptianPanel';
import UnitCard from './UnitCard';
import { cn } from '@/lib/utils';

export default function Shop() {
    const { state, buyUnit, refreshShop } = useGameState();
    const isPrep = state.phase === 'preparation';

    return (
        <EgyptianPanel title="Market of the Pharaoh" titleIcon="🏺" compact>
            <div className="flex items-start gap-2">
                {/* Shop units */}
                <div className="flex gap-1.5 flex-wrap">
                    {state.shop.map((shopUnit, idx) => (
                        <div key={idx} className="relative group">
                            {shopUnit.sold ? (
                                <div className="w-20 h-28 rounded-sm bg-[oklch(0.18_0.04_50_/_0.5)] border border-[oklch(0.30_0.06_50)] flex items-center justify-center">
                                    <span className="text-[oklch(0.40_0.06_50)] text-xs font-cinzel">SOLD</span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <UnitCard
                                        name={shopUnit.name}
                                        tier={shopUnit.tier}
                                        attack={0}
                                        factions={shopUnit.factions}
                                        abilityName={shopUnit.abilityName}
                                        abilityDescription={shopUnit.abilityDescription}
                                        portraitImage={shopUnit.portraitImage}
                                        cost={shopUnit.cost}
                                        onClick={() => isPrep && buyUnit(idx)}
                                    />
                                    <button
                                        className={cn(
                                            'w-full mt-0.5 py-0.5 rounded-sm text-[9px] font-cinzel font-semibold transition-all',
                                            isPrep && state.gold >= shopUnit.cost
                                                ? 'btn-egyptian'
                                                : 'bg-[oklch(0.25_0.04_50)] text-[oklch(0.45_0.06_50)] cursor-not-allowed border border-[oklch(0.30_0.06_50)]'
                                        )}
                                        onClick={() => isPrep && buyUnit(idx)}
                                        disabled={!isPrep || state.gold < shopUnit.cost}
                                    >
                                        Buy {shopUnit.cost}🪙
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Refresh button */}
                <div className="flex flex-col gap-1 ml-1">
                    <button
                        className={cn(
                            'px-2 py-1.5 rounded-sm text-[9px] font-cinzel font-semibold transition-all whitespace-nowrap',
                            isPrep && state.gold >= 2
                                ? 'btn-egyptian'
                                : 'bg-[oklch(0.25_0.04_50)] text-[oklch(0.45_0.06_50)] cursor-not-allowed border border-[oklch(0.30_0.06_50)]'
                        )}
                        onClick={() => isPrep && refreshShop()}
                        disabled={!isPrep || state.gold < 2}
                    >
                        🔄 Refresh<br />
                        <span className="text-[8px]">(2🪙)</span>
                    </button>
                    <div className="text-center">
                        <p className="text-[oklch(0.55_0.08_70)] text-[8px] font-cinzel">Gold</p>
                        <p className="text-[oklch(0.88_0.18_88)] text-sm font-cinzel font-bold">{state.gold}🪙</p>
                    </div>
                </div>
            </div>
        </EgyptianPanel>
    );
}
