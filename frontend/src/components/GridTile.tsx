import React from 'react';
import { cn } from '@/lib/utils';
import { Position } from '../types/game';

interface GridTileProps {
    position: Position;
    cellSize: number;
    isEnemy: boolean;
    isOccupied: boolean;
    isDragOver: boolean;
    canDrop: boolean;
    onDrop: (position: Position) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onClick?: () => void;
}

export default function GridTile({
    position, cellSize, isEnemy, isOccupied, isDragOver, canDrop,
    onDrop, onDragOver, onDragLeave, onClick
}: GridTileProps) {
    return (
        <div
            className={cn(
                'absolute border transition-all duration-150',
                isEnemy
                    ? 'border-[oklch(0.35_0.08_27_/_0.4)] bg-[oklch(0.18_0.04_27_/_0.3)]'
                    : 'border-[oklch(0.40_0.08_60_/_0.4)] bg-[oklch(0.20_0.05_55_/_0.3)]',
                isDragOver && canDrop && 'bg-[oklch(0.78_0.15_85_/_0.25)] border-[oklch(0.78_0.15_85_/_0.8)]',
                isDragOver && !canDrop && 'bg-[oklch(0.50_0.20_27_/_0.25)] border-[oklch(0.50_0.20_27_/_0.8)]',
                !isEnemy && !isOccupied && 'hover:bg-[oklch(0.78_0.15_85_/_0.1)] cursor-pointer',
            )}
            style={{
                left: position.x * cellSize,
                top: position.y * cellSize,
                width: cellSize,
                height: cellSize,
            }}
            onDrop={(e) => { e.preventDefault(); onDrop(position); }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={onClick}
        >
            {/* Hieroglyph decoration on empty friendly tiles */}
            {!isEnemy && !isOccupied && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-[oklch(0.78_0.15_85)] text-xs">𓂀</span>
                </div>
            )}
        </div>
    );
}
