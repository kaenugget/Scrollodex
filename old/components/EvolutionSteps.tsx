
import React from 'react';

interface EvolutionStepsProps {
  currentLevel: number;
}

const EvolutionStep: React.FC<{ level: number; label: string; active: boolean; current: boolean }> = ({ level, label, active, current }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center font-pixel text-lg border-4 ${
          current 
            ? 'bg-emerald-500 border-emerald-300 text-neutral-900 animate-pulse' 
            : active 
            ? 'bg-neutral-600 border-neutral-500 text-neutral-300' 
            : 'bg-neutral-800 border-neutral-700 text-neutral-600'
        }`}
      >
        {level}
      </div>
      <span className={`mt-2 text-xs font-semibold ${active ? 'text-neutral-300' : 'text-neutral-500'}`}>{label}</span>
    </div>
  );
}

export const EvolutionSteps: React.FC<EvolutionStepsProps> = ({ currentLevel }) => {
  return (
    <div className="flex justify-between items-start">
      <EvolutionStep level={1} label="Acquaintance" active={currentLevel >= 1} current={currentLevel === 1} />
      <div className={`flex-grow h-1 mt-8 ${currentLevel > 1 ? 'bg-neutral-500' : 'bg-neutral-700'}`}></div>
      <EvolutionStep level={2} label="Friend" active={currentLevel >= 2} current={currentLevel === 2} />
      <div className={`flex-grow h-1 mt-8 ${currentLevel > 2 ? 'bg-neutral-500' : 'bg-neutral-700'}`}></div>
      <EvolutionStep level={3} label="Close Friend" active={currentLevel >= 3} current={currentLevel === 3} />
    </div>
  );
};
