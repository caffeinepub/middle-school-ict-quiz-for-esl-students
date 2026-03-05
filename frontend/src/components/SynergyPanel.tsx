import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { SYNERGY_DEFINITIONS } from '../data/units';

export default function SynergyPanel() {
  const { state } = useGameState();
  const { activeSynergies } = state;

  const activeSynergyList = Object.entries(activeSynergies)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="command-panel border border-aged-bronze/40 p-3 flex flex-col gap-2"
      style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
      <div className="flex items-center gap-2 border-b border-aged-bronze/25 pb-2">
        <span className="text-sm">✦</span>
        <h3 className="cinzel text-ember-gold font-bold text-xs tracking-widest uppercase">Synergies</h3>
      </div>

      {activeSynergyList.length === 0 ? (
        <div className="text-egyptian-sand/30 text-xs font-mono text-center py-2 border border-dashed border-aged-bronze/20">
          No active synergies
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {activeSynergyList.map(([trait, count]) => {
            const synDef = SYNERGY_DEFINITIONS[trait as keyof typeof SYNERGY_DEFINITIONS];
            if (!synDef) return null;

            const activeThreshold = [...synDef.thresholds].reverse().find(t => count >= t.count);
            const nextThreshold = synDef.thresholds.find(t => count < t.count);
            const isActive = !!activeThreshold;

            return (
              <div
                key={trait}
                className={`flex items-start gap-2 p-1.5 border transition-all
                  ${isActive
                    ? 'border-ember-gold/35 bg-ember-gold/5'
                    : 'border-aged-bronze/15 bg-transparent opacity-50'
                  }
                `}
                style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
              >
                <span className="text-sm leading-none mt-0.5">{synDef.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`cinzel text-xs font-semibold ${isActive ? 'text-ember-gold' : 'text-egyptian-sand/50'}`}>
                      {synDef.name}
                    </span>
                    <span className={`font-mono text-xs px-1 border ${isActive ? 'border-ember-gold/40 bg-ember-gold/15 text-ember-gold' : 'border-aged-bronze/20 bg-command-panel text-egyptian-sand/30'}`}>
                      {count}
                    </span>
                  </div>
                  {isActive && (
                    <div className="text-egyptian-turquoise/80 text-xs mt-0.5 leading-tight font-mono" style={{ fontSize: '0.6rem' }}>
                      {activeThreshold!.bonus}
                    </div>
                  )}
                  {nextThreshold && (
                    <div className="text-egyptian-sand/30 text-xs mt-0.5 leading-tight font-mono" style={{ fontSize: '0.6rem' }}>
                      Next: {nextThreshold.count} → {nextThreshold.bonus}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All synergies reference */}
      <details className="mt-1">
        <summary className="cinzel text-egyptian-sand/30 text-xs cursor-pointer hover:text-egyptian-sand/60 transition-colors tracking-wider">
          All Synergies ▾
        </summary>
        <div className="mt-2 flex flex-col gap-1">
          {Object.entries(SYNERGY_DEFINITIONS).map(([key, syn]) => {
            const count = activeSynergies[key] || 0;
            return (
              <div key={key} className="flex items-center gap-1.5 text-xs opacity-50 hover:opacity-80 transition-opacity">
                <span>{syn.icon}</span>
                <span className="cinzel text-egyptian-sand" style={{ fontSize: '0.65rem' }}>{syn.name}</span>
                <span className="font-mono text-egyptian-sand/30" style={{ fontSize: '0.6rem' }}>({count}/{syn.thresholds[0].count})</span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
