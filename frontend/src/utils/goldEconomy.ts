export function getBaseGoldPerRound(round: number): number {
    return Math.min(5 + Math.floor(round / 3), 10);
}

export function getInterestGold(currentGold: number): number {
    return Math.min(Math.floor(currentGold / 10), 5);
}

export function getTotalGoldIncome(round: number, currentGold: number): number {
    return getBaseGoldPerRound(round) + getInterestGold(currentGold);
}

export function getUnitSellValue(cost: number): number {
    return Math.max(1, Math.floor(cost * 0.7));
}
