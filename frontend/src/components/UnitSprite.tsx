import React from 'react';
import { cn } from '@/lib/utils';
import { BoardUnit } from '../types/game';

interface UnitSpriteProps {
    unit: BoardUnit;
    cellSize: number;
    isSelected?: boolean;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent) => void;
    draggable?: boolean;
}

export default function UnitSprite({ unit, cellSize, isSelected, onClick, onDragStart, draggable }: UnitSpriteProps) {
    const hpPercent = (unit.hp / unit.maxHp) * 100;
    const isLowHp = hpPercent < 30;

    const spriteSize = Math.floor(cellSize * 0.85);
    const offset = Math.floor((cellSize - spriteSize) / 2);

    return (
        <div
            className={cn(
                'absolute flex flex-col items-center cursor-pointer select-none',
                unit.isDead && 'animate-death pointer-events-none',
                unit.isAttacking && 'animate-attack',
                isSelected && !unit.isEnemy && 'ring-2 ring-[oklch(0.78_0.15_85)]',
            )}
            style={{
                left: unit.position.x * cellSize + offset,
                top: unit.position.y * cellSize + offset,
                width: spriteSize,
                zIndex: 10,
                transition: 'left 0.3s ease, top 0.3s ease',
            }}
            onClick={onClick}
            draggable={draggable && !unit.isDead}
            onDragStart={onDragStart}
        >
            {/* HP bar */}
            <div
                className="w-full h-1.5 rounded-full overflow-hidden mb-0.5"
                style={{ background: 'oklch(0.20 0.04 27)' }}
            >
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${hpPercent}%`,
                        background: isLowHp
                            ? 'linear-gradient(90deg, oklch(0.55 0.22 27), oklch(0.65 0.24 30))'
                            : 'linear-gradient(90deg, oklch(0.55 0.20 140), oklch(0.65 0.22 145))',
                    }}
                />
            </div>

            {/* Portrait */}
            <div
                className={cn(
                    'relative rounded-sm overflow-hidden',
                    unit.isEnemy
                        ? 'border border-[oklch(0.55_0.20_27_/_0.8)]'
                        : 'border border-[oklch(0.55_0.12_75_/_0.8)]',
                    isSelected && 'border-[oklch(0.78_0.15_85)]',
                )}
                style={{ width: spriteSize, height: spriteSize }}
            >
                <img
                    src={unit.portraitImage}
                    alt={unit.name}
                    className="w-full h-full object-cover"
                    style={unit.isEnemy ? { filter: 'hue-rotate(180deg) saturate(0.8)' } : undefined}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23333" width="64" height="64"/><text fill="%23888" font-size="24" x="50%" y="55%" text-anchor="middle">⚔</text></svg>';
                    }}
                />

                {/* Enemy indicator */}
                {unit.isEnemy && (
                    <div className="absolute inset-0 bg-[oklch(0.50_0.20_27_/_0.15)]" />
                )}

                {/* Tier stars */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
                    {Array.from({ length: unit.tier }).map((_, i) => (
                        <span key={i} className="text-[7px] leading-none text-[oklch(0.88_0.18_88)]">★</span>
                    ))}
                </div>
            </div>

            {/* Name label */}
            <div className="mt-0.5 px-1 py-0.5 rounded-sm bg-[oklch(0.15_0.04_50_/_0.9)] max-w-full">
                <p className="font-cinzel text-[6px] text-[oklch(0.85_0.06_80)] truncate text-center leading-none">
                    {unit.name}
                </p>
            </div>
        </div>
    );
}
