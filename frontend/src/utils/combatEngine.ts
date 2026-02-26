import { BoardUnit, CombatEvent, Position } from '../types/game';

function getDistance(a: Position, b: Position): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findTarget(attacker: BoardUnit, enemies: BoardUnit[]): BoardUnit | null {
    const aliveEnemies = enemies.filter(e => !e.isDead && e.hp > 0);
    if (aliveEnemies.length === 0) return null;

    // Find nearest enemy
    let nearest: BoardUnit | null = null;
    let minDist = Infinity;
    for (const enemy of aliveEnemies) {
        const dist = getDistance(attacker.position, enemy.position);
        if (dist < minDist) {
            minDist = dist;
            nearest = enemy;
        }
    }
    return nearest;
}

export function runCombatTick(
    friendlyUnits: BoardUnit[],
    enemyUnits: BoardUnit[],
    currentTime: number,
    deltaTime: number,
    synergyBuffs: SynergyBuffs
): { updatedFriendly: BoardUnit[]; updatedEnemy: BoardUnit[]; events: CombatEvent[] } {
    const events: CombatEvent[] = [];

    const friendly = friendlyUnits.map(u => ({ ...u }));
    const enemy = enemyUnits.map(u => ({ ...u }));

    // Apply undead regen
    const undeadRegenRate = synergyBuffs.undeadRegen;
    if (undeadRegenRate > 0) {
        for (const u of friendly) {
            if (!u.isDead && u.factions.includes('Undead')) {
                u.hp = Math.min(u.maxHp, u.hp + undeadRegenRate * deltaTime);
            }
        }
    }

    // Process friendly attacks
    for (const attacker of friendly) {
        if (attacker.isDead || attacker.hp <= 0) continue;
        const attackInterval = 1 / (attacker.attackSpeed * (1 + synergyBuffs.nomadAttackSpeedBonus));
        if (currentTime - attacker.lastAttackTime >= attackInterval) {
            const target = findTarget(attacker, enemy);
            if (target) {
                const dist = getDistance(attacker.position, target.position);
                if (dist <= attacker.attackRange) {
                    let dmg = attacker.attack + synergyBuffs.royalAttackBonus;
                    // Apply warrior armor reduction to enemy
                    const enemyArmorReduction = 0; // enemies don't have synergy buffs
                    dmg = Math.max(1, dmg - enemyArmorReduction);
                    const isCrit = Math.random() < 0.1;
                    if (isCrit) dmg = Math.floor(dmg * 1.5);

                    const targetIdx = enemy.findIndex(e => e.instanceId === target.instanceId);
                    if (targetIdx >= 0) {
                        enemy[targetIdx].hp -= dmg;
                        attacker.lastAttackTime = currentTime;
                        attacker.isAttacking = true;

                        events.push({
                            type: 'attack',
                            attackerId: attacker.instanceId,
                            targetId: target.instanceId,
                            damage: dmg,
                            isCrit,
                        });

                        if (enemy[targetIdx].hp <= 0) {
                            enemy[targetIdx].isDead = true;
                            enemy[targetIdx].hp = 0;
                            events.push({ type: 'death', attackerId: attacker.instanceId, targetId: target.instanceId });
                        }
                    }
                }
            }
        } else {
            attacker.isAttacking = false;
        }
    }

    // Process enemy attacks
    for (const attacker of enemy) {
        if (attacker.isDead || attacker.hp <= 0) continue;
        const attackInterval = 1 / attacker.attackSpeed;
        if (currentTime - attacker.lastAttackTime >= attackInterval) {
            const target = findTarget(attacker, friendly);
            if (target) {
                const dist = getDistance(attacker.position, target.position);
                if (dist <= attacker.attackRange) {
                    let dmg = attacker.attack;
                    // Apply warrior armor reduction to friendly
                    const armorReduction = synergyBuffs.warriorArmorReduction;
                    dmg = Math.max(1, Math.floor(dmg * (1 - armorReduction)));
                    const isCrit = Math.random() < 0.1;
                    if (isCrit) dmg = Math.floor(dmg * 1.5);

                    const targetIdx = friendly.findIndex(f => f.instanceId === target.instanceId);
                    if (targetIdx >= 0) {
                        friendly[targetIdx].hp -= dmg;
                        attacker.lastAttackTime = currentTime;
                        attacker.isAttacking = true;

                        events.push({
                            type: 'attack',
                            attackerId: attacker.instanceId,
                            targetId: target.instanceId,
                            damage: dmg,
                            isCrit,
                        });

                        if (friendly[targetIdx].hp <= 0) {
                            friendly[targetIdx].isDead = true;
                            friendly[targetIdx].hp = 0;
                            events.push({ type: 'death', attackerId: attacker.instanceId, targetId: target.instanceId });
                        }
                    }
                }
            }
        } else {
            attacker.isAttacking = false;
        }
    }

    return { updatedFriendly: friendly, updatedEnemy: enemy, events };
}

export interface SynergyBuffs {
    priestMagicBonus: number;       // multiplier e.g. 0.25
    warriorArmorReduction: number;  // fraction e.g. 0.15
    nomadAttackSpeedBonus: number;  // fraction e.g. 0.20
    undeadRegen: number;            // HP per second
    royalAttackBonus: number;       // flat attack bonus
    mysticAbilityBonus: number;     // multiplier
}

export function isCombatOver(friendly: BoardUnit[], enemy: BoardUnit[]): 'friendly_win' | 'enemy_win' | null {
    const aliveF = friendly.filter(u => !u.isDead && u.hp > 0).length;
    const aliveE = enemy.filter(u => !u.isDead && u.hp > 0).length;
    if (aliveF === 0) return 'enemy_win';
    if (aliveE === 0) return 'friendly_win';
    return null;
}
