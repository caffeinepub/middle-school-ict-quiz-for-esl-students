import { BoardUnit, Faction, ActiveSynergy } from '../types/game';
import { SYNERGY_DEFINITIONS } from '../data/synergies';
import { SynergyBuffs } from './combatEngine';

export function calculateSynergies(boardUnits: BoardUnit[]): ActiveSynergy[] {
    const factionCounts: Partial<Record<Faction, number>> = {};

    for (const unit of boardUnits) {
        if (unit.isDead) continue;
        for (const faction of unit.factions) {
            factionCounts[faction] = (factionCounts[faction] || 0) + 1;
        }
    }

    return SYNERGY_DEFINITIONS.map(synergy => {
        const count = factionCounts[synergy.faction] || 0;
        let activeThreshold: number | null = null;
        for (const threshold of [...synergy.thresholds].reverse()) {
            if (count >= threshold) {
                activeThreshold = threshold;
                break;
            }
        }
        return {
            synergyId: synergy.id,
            faction: synergy.faction,
            count,
            activeThreshold,
        };
    });
}

export function getSynergyBuffs(activeSynergies: ActiveSynergy[]): SynergyBuffs {
    const buffs: SynergyBuffs = {
        priestMagicBonus: 0,
        warriorArmorReduction: 0,
        nomadAttackSpeedBonus: 0,
        undeadRegen: 0,
        royalAttackBonus: 0,
        mysticAbilityBonus: 0,
    };

    for (const synergy of activeSynergies) {
        if (!synergy.activeThreshold) continue;
        const thresholdIndex = SYNERGY_DEFINITIONS
            .find(s => s.id === synergy.synergyId)
            ?.thresholds.indexOf(synergy.activeThreshold) ?? -1;

        if (synergy.faction === 'Priest') {
            buffs.priestMagicBonus = thresholdIndex >= 1 ? 0.60 : 0.25;
        }
        if (synergy.faction === 'Warrior') {
            buffs.warriorArmorReduction = thresholdIndex >= 1 ? 0.30 : 0.15;
        }
        if (synergy.faction === 'Nomad') {
            buffs.nomadAttackSpeedBonus = thresholdIndex >= 1 ? 0.50 : 0.20;
        }
        if (synergy.faction === 'Undead') {
            buffs.undeadRegen = thresholdIndex >= 1 ? 50 : 20;
        }
        if (synergy.faction === 'Royal') {
            buffs.royalAttackBonus = thresholdIndex >= 1 ? 25 : 10;
        }
        if (synergy.faction === 'Mystic') {
            buffs.mysticAbilityBonus = thresholdIndex >= 1 ? 0.70 : 0.30;
        }
    }

    return buffs;
}
