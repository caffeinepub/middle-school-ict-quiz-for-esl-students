import React from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';

interface HowToPlayModalProps {
    open: boolean;
    onClose: () => void;
}

export default function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-[oklch(0.18_0.04_50)] border border-[oklch(0.55_0.12_75)] text-[oklch(0.90_0.05_80)] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-cinzel-decorative text-[oklch(0.88_0.18_88)] text-xl text-center">
                        𓂀 How to Play 𓂀
                    </DialogTitle>
                    <DialogDescription className="text-[oklch(0.65_0.08_70)] text-center font-cinzel text-xs">
                        Pharaoh's Conquest — Ancient Egyptian Auto-Chess
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {[
                        {
                            icon: '🏺',
                            title: 'Preparation Phase',
                            text: 'Each round begins with a preparation phase. Browse the Market to buy Egyptian warriors, priests, and mythical creatures. Drag units from your Barracks onto the battle board (bottom half only). You have 30 seconds to prepare!',
                        },
                        {
                            icon: '⚔️',
                            title: 'Combat Phase',
                            text: 'When preparation ends, your forces automatically battle the enemy! Units seek out the nearest foe and attack autonomously. Watch the battle unfold and see if your army prevails.',
                        },
                        {
                            icon: '𓂀',
                            title: 'Synergies',
                            text: 'Place multiple units of the same faction to activate powerful synergy bonuses! Warriors gain armor, Priests deal more magic damage, Nomads attack faster, and the Undead regenerate HP. Check the Synergy panel to track your progress.',
                        },
                        {
                            icon: '🪙',
                            title: 'Gold Economy',
                            text: 'You earn gold each round. Save gold to earn interest (1 gold per 10 saved, up to 5 bonus). Spend wisely — units cost 1–5 gold. Sell unwanted units for partial refunds. Refresh the shop for 2 gold.',
                        },
                        {
                            icon: '👑',
                            title: 'Win Condition',
                            text: 'Defeat enemy armies to win rounds. Losing a round costs you Pharaoh HP. When your HP reaches 0, your reign ends. Survive as many rounds as possible and build the mightiest Egyptian army!',
                        },
                        {
                            icon: '💡',
                            title: 'Tips',
                            text: 'Place tanks (Pharaoh, Mummy Warrior) in front rows. Keep ranged units (Horus Archer, Ra Priest) in the back. Combine synergies for powerful combos. The Sphinx and Isis Sorceress are powerful but expensive!',
                        },
                    ].map(section => (
                        <div key={section.title} className="flex gap-3 p-3 rounded-sm bg-[oklch(0.22_0.05_50)] border border-[oklch(0.35_0.07_60_/_0.5)]">
                            <span className="text-2xl flex-shrink-0">{section.icon}</span>
                            <div>
                                <h3 className="font-cinzel font-bold text-[oklch(0.88_0.18_88)] text-sm mb-1">{section.title}</h3>
                                <p className="font-crimson text-[oklch(0.75_0.05_80)] text-sm leading-relaxed">{section.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center">
                    <button
                        className="btn-egyptian px-6 py-2 rounded-sm text-sm"
                        onClick={onClose}
                    >
                        𓂀 Begin Your Conquest
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
