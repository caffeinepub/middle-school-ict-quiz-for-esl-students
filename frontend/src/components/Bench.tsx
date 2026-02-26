import React from 'react';
import { useGameState } from '../hooks/useGameState';
import EgyptianPanel from './EgyptianPanel';
import UnitCard from './UnitCard';
import { cn } from '@/lib/utils';

const MAX_BENCH = 8;

export default function Bench() {
    const { state, sellUnit, returnUnitToBench } = useGameState();
    const isPrep = state.phase === 'preparation';

    const handleDragStart = (e: React.DragEvent, instanceId: string) => {
        e.dataTransfer.setData('instanceId', instanceId);
        e.dataTransfer.setData('from', 'bench');
    };

    return (
        <EgyptianPanel title="Barracks" titleIcon="⚔️" compact>
            <div className="flex gap-1.5 flex-wrap min-h-[80px]">
                {state.bench.map(unit => (
                    <div key={unit.instanceId} className="relative group">
                        <UnitCard
                            instanceId={unit.instanceId}
                            name={unit.name}
                            tier={unit.tier}
                            hp={unit.hp}
                            maxHp={unit.maxHp}
                            attack={unit.attack}
                            factions={unit.factions}
                            abilityName={unit.abilityName}
                            abilityDescription={unit.abilityDescription}
                            portraitImage={unit.portraitImage}
                            draggable={isPrep}
                            onDragStart={(e) => handleDragStart(e, unit.instanceId)}
                        />
                        {isPrep && (
                            <button
                                className="absolute -top-1 -right-1 w-4 h-4 bg-[oklch(0.50_0.20_27)] rounded-full text-white text-[8px] flex items-center justify-center hover:bg-[oklch(0.60_0.22_27)] z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => sellUnit(unit.instanceId, false)}
                                title="Sell unit"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, MAX_BENCH - state.bench.length) }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="w-20 h-28 rounded-sm border border-dashed border-[oklch(0.35_0.06_50_/_0.4)] flex items-center justify-center"
                    >
                        <span className="text-[oklch(0.35_0.06_50)] text-xs opacity-50">𓂀</span>
                    </div>
                ))}
            </div>

            <div className="mt-1 text-[oklch(0.50_0.08_70)] text-[9px] font-cinzel text-center">
                {state.bench.length}/{MAX_BENCH} units • Drag to board to deploy
            </div>
        </EgyptianPanel>
    );
}
