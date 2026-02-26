import React from 'react';
import { cn } from '@/lib/utils';

interface EgyptianPanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    titleIcon?: string;
    compact?: boolean;
}

export default function EgyptianPanel({ children, className, title, titleIcon, compact }: EgyptianPanelProps) {
    return (
        <div
            className={cn(
                'relative rounded-sm',
                'bg-gradient-to-b from-[oklch(0.24_0.06_55)] to-[oklch(0.20_0.04_50)]',
                'border border-[oklch(0.55_0.12_75)]',
                'shadow-[0_0_12px_oklch(0.78_0.15_85_/_0.2),inset_0_0_20px_oklch(0_0_0_/_0.3)]',
                className
            )}
        >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[oklch(0.78_0.15_85)] rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[oklch(0.78_0.15_85)] rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[oklch(0.78_0.15_85)] rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[oklch(0.78_0.15_85)] rounded-br-sm" />

            {title && (
                <div className={cn(
                    'flex items-center gap-2 border-b border-[oklch(0.45_0.10_70)]',
                    compact ? 'px-3 py-1.5' : 'px-4 py-2'
                )}>
                    {titleIcon && <span className="text-base">{titleIcon}</span>}
                    <h3 className={cn(
                        'font-cinzel font-semibold tracking-wider text-[oklch(0.88_0.16_85)]',
                        compact ? 'text-xs' : 'text-sm'
                    )}>
                        {title}
                    </h3>
                    {/* Decorative line */}
                    <div className="flex-1 h-px bg-gradient-to-r from-[oklch(0.78_0.15_85_/_0.5)] to-transparent" />
                    <span className="text-[oklch(0.78_0.15_85)] text-xs opacity-60">𓂀</span>
                </div>
            )}

            <div className={compact ? 'p-2' : 'p-3'}>
                {children}
            </div>
        </div>
    );
}
