import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Faction } from '../types/game';

interface UnitCardProps {
    instanceId?: string;
    name: string;
    tier: 1 | 2 | 3;
    hp?: number;
    maxHp?: number;
    attack: number;
    factions: Faction[];
    abilityName: string;
    abilityDescription: string;
    portraitImage: string;
    cost?: number;
    compact?: boolean;
    isDead?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
    onSell?: () => void;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
}

const FACTION_COLORS: Record<Faction, string> = {
    Royal: 'text-[oklch(0.88_0.18_88)] bg-[oklch(0.30_0.08_80_/_0.4)]',
    Warrior: 'text-[oklch(0.70_0.18_27)] bg-[oklch(0.30_0.08_27_/_0.4)]',
    Priest: 'text-[oklch(0.85_0.15_88)] bg-[oklch(0.30_0.08_88_/_0.4)]',
    Nomad: 'text-[oklch(0.75_0.14_60)] bg-[oklch(0.30_0.08_60_/_0.4)]',
    Mystic: 'text-[oklch(0.72_0.14_195)] bg-[oklch(0.25_0.08_195_/_0.4)]',
    Undead: 'text-[oklch(0.65_0.10_280)] bg-[oklch(0.25_0.06_280_/_0.4)]',
};

const TIER_COLORS = ['', 'text-[oklch(0.75_0.05_80)]', 'text-[oklch(0.72_0.14_195)]', 'text-[oklch(0.88_0.18_88)]'];

export default function UnitCard({
    name, tier, hp, maxHp, attack, factions, abilityName, abilityDescription,
    portraitImage, cost, compact, isDead, isSelected, onClick, onSell, draggable, onDragStart
}: UnitCardProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const hpPercent = hp !== undefined && maxHp ? (hp / maxHp) * 100 : 100;
    const isLowHp = hpPercent < 30;

    return (
        <div
            className={cn(
                'unit-card relative rounded-sm cursor-pointer select-none',
                compact ? 'w-16' : 'w-20',
                isDead && 'opacity-40 grayscale',
                isSelected && 'ring-2 ring-[oklch(0.78_0.15_85)] shadow-[0_0_12px_oklch(0.78_0.15_85_/_0.6)]',
            )}
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Portrait */}
            <div className={cn('relative overflow-hidden rounded-t-sm', compact ? 'h-14' : 'h-16')}>
                <img
                    src={portraitImage}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23333" width="64" height="64"/><text fill="%23888" font-size="24" x="50%" y="55%" text-anchor="middle">⚔</text></svg>';
                    }}
                />
                {/* Tier stars */}
                <div className={cn('absolute top-0.5 left-0.5 flex gap-0.5', TIER_COLORS[tier])}>
                    {Array.from({ length: tier }).map((_, i) => (
                        <span key={i} className="text-[8px] leading-none">★</span>
                    ))}
                </div>
                {/* Cost badge */}
                {cost !== undefined && (
                    <div className="absolute top-0.5 right-0.5 bg-[oklch(0.20_0.04_55_/_0.9)] rounded-sm px-1 py-0.5">
                        <span className="text-[oklch(0.88_0.18_88)] text-[9px] font-cinzel font-bold">{cost}🪙</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-1 py-1">
                <p className={cn('font-cinzel font-semibold text-[oklch(0.90_0.08_80)] truncate leading-tight', compact ? 'text-[8px]' : 'text-[9px]')}>
                    {name}
                </p>

                {/* HP bar */}
                {hp !== undefined && maxHp && (
                    <div className="hp-bar-bg rounded-full h-1 mt-0.5 overflow-hidden">
                        <div
                            className={cn('hp-bar-fill h-full rounded-full', isLowHp && 'low')}
                            style={{ width: `${hpPercent}%` }}
                        />
                    </div>
                )}

                {/* Attack stat */}
                <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[oklch(0.70_0.18_27)] text-[8px]">⚔</span>
                    <span className="text-[oklch(0.80_0.06_80)] text-[8px]">{attack}</span>
                </div>

                {/* Faction tags */}
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {factions.map(f => (
                        <span key={f} className={cn('text-[7px] px-0.5 rounded-sm font-cinzel', FACTION_COLORS[f])}>
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            {/* Sell button */}
            {onSell && (
                <button
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[oklch(0.50_0.20_27)] rounded-full text-white text-[8px] flex items-center justify-center hover:bg-[oklch(0.60_0.22_27)] z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onSell(); }}
                    title="Sell unit"
                >
                    ×
                </button>
            )}

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-sm bg-[oklch(0.18_0.04_50)] border border-[oklch(0.55_0.12_75)] shadow-xl pointer-events-none">
                    <p className="font-cinzel font-bold text-[oklch(0.88_0.18_88)] text-xs mb-1">{abilityName}</p>
                    <p className="font-crimson text-[oklch(0.80_0.05_80)] text-xs leading-relaxed">{abilityDescription}</p>
                    {hp !== undefined && maxHp && (
                        <p className="text-[oklch(0.65_0.18_140)] text-xs mt-1">HP: {Math.floor(hp)}/{maxHp}</p>
                    )}
                </div>
            )}
        </div>
    );
}
