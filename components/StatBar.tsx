
import React from 'react';
import { StatName } from '../lib/types';

interface StatBarProps {
  name: StatName;
  value: number;
}

const STAT_DETAILS: Record<StatName, { label: string; color: string }> = {
  closeness: { label: 'Closeness', color: 'bg-rose-500' },
  recency: { label: 'Recency', color: 'bg-sky-500' },
  introPower: { label: 'Intro Power', color: 'bg-amber-500' },
  collaboration: { label: 'Collaboration', color: 'bg-emerald-500' },
};

export const StatBar: React.FC<StatBarProps> = ({ name, value }) => {
  const { label, color } = STAT_DETAILS[name];
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="grid grid-cols-4 items-center gap-2">
      <span className="col-span-1 text-sm font-semibold text-neutral-400 capitalize">{label}</span>
      <div className="col-span-3 h-3 bg-neutral-700 border-2 border-t-neutral-800 border-l-neutral-800 border-b-neutral-600 border-r-neutral-600" aria-label={`${label}: ${value} out of 100`}>
        <div
          className={`h-full ${color}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};
