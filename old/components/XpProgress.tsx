
import React from 'react';

interface XpProgressProps {
  level: number;
  xp: number;
}

const MAX_XP_PER_LEVEL = 20;

export const XpProgress: React.FC<XpProgressProps> = ({ level, xp }) => {
  const progressPercentage = (xp / MAX_XP_PER_LEVEL) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-pixel text-xs text-neutral-400">LV.{level}</span>
        <span className="font-pixel text-xs text-neutral-400">{xp}/{MAX_XP_PER_LEVEL} XP</span>
      </div>
      <div className="w-full h-3 bg-neutral-700 border-2 border-t-neutral-800 border-l-neutral-800 border-b-neutral-600 border-r-neutral-600" aria-label={`XP progress: ${xp} out of ${MAX_XP_PER_LEVEL}`}>
        <div
          className="h-full bg-cyan-400"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
