import React, { useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BattleLog() {
  const { state } = useGameState();
  const { battleLog, phase } = state;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLog]);

  if (battleLog.length === 0 && phase === 'prep') return null;

  return (
    <div className="egyptian-panel p-2">
      <h4 className="cinzel text-egyptian-gold/70 text-xs mb-1.5 tracking-wider">⚔️ Battle Log</h4>
      <ScrollArea className="h-20">
        <div className="flex flex-col gap-0.5 pr-2">
          {battleLog.map((entry, i) => (
            <div key={i} className="text-xs text-egyptian-sand/70 font-garamond leading-relaxed">
              {entry}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
