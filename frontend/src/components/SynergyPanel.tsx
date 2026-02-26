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
    <div className="egyptian-panel p-3 flex flex-col gap-2">
      <h3 className="cinzel text-egyptian-gold font-bold text-sm tracking-wider">✨ Synergies</h3>

      {activeSynergyList.length === 0 ? (
        <div className="text-egyptian-sand/40 text-xs cinzel text-center py-2">
          Place units to activate synergies
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {activeSynergyList.map(([trait, count]) => {
            const synDef = SYNERGY_DEFINITIONS[trait as keyof typeof SYNERGY_DEFINITIONS];
            if (!synDef) return null;

            // Find active threshold
            const activeThreshold = [...synDef.thresholds]
              .reverse()
              .find(t => count >= t.count);
            const nextThreshold = synDef.thresholds.find(t => count < t.count);
            const isActive = !!activeThreshold;

            return (
              <div
                key={trait}
                className={`flex items-start gap-2 p-1.5 rounded-sm border transition-all
                  ${isActive
                    ? 'border-egyptian-gold/40 bg-egyptian-gold/5'
                    : 'border-egyptian-gold/10 bg-transparent opacity-60'
                  }
                `}
              >
                <span className="text-base leading-none mt-0.5">{synDef.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`cinzel text-xs font-semibold ${isActive ? 'text-egyptian-gold' : 'text-egyptian-sand/60'}`}>
                      {synDef.name}
                    </span>
                    <span className={`cinzel text-xs px-1 rounded ${isActive ? 'bg-egyptian-gold/20 text-egyptian-gold' : 'bg-egyptian-dark/50 text-egyptian-sand/40'}`}>
                      {count}
                    </span>
                  </div>
                  {isActive && (
                    <div className="text-egyptian-turquoise text-xs mt-0.5 leading-tight">
                      {activeThreshold!.bonus}
                    </div>
                  )}
                  {nextThreshold && (
                    <div className="text-egyptian-sand/40 text-xs mt-0.5 leading-tight">
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
        <summary className="cinzel text-egyptian-sand/40 text-xs cursor-pointer hover:text-egyptian-sand/60 transition-colors">
          All Synergies ▾
        </summary>
        <div className="mt-2 flex flex-col gap-1">
          {Object.entries(SYNERGY_DEFINITIONS).map(([key, syn]) => {
            const count = activeSynergies[key] || 0;
            return (
              <div key={key} className="flex items-center gap-1.5 text-xs opacity-50 hover:opacity-80 transition-opacity">
                <span>{syn.icon}</span>
                <span className="cinzel text-egyptian-sand">{syn.name}</span>
                <span className="text-egyptian-sand/40">({count}/{syn.thresholds[0].count})</span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
