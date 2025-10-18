"use client";

import React from 'react';

type FriendType = 'ART' | 'ELEC' | 'NORM' | 'PSY' | 'STEEL' | 'DARK' | 'GRASS' | 'WATER' | 'FIRE';

interface TypeChipProps {
  type: FriendType;
  size?: 'sm' | 'md';
}

const TYPE_COLORS: Record<FriendType, { bg: string; text: string; border: string }> = {
  ART: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  ELEC: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  NORM: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  PSY: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  STEEL: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  DARK: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', border: 'border-neutral-500/30' },
  GRASS: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  WATER: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  FIRE: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export const TypeChip: React.FC<TypeChipProps> = ({ type, size = 'md' }) => {
  const color = TYPE_COLORS[type];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  // Fallback to NORM if type is not found
  if (!color) {
    const fallbackColor = TYPE_COLORS.NORM;
    return (
      <div
        className={`font-pixel uppercase rounded-full tracking-widest ${sizeClasses} ${fallbackColor.bg} ${fallbackColor.text} border ${fallbackColor.border}`}
        aria-label={`Type: ${type}`}
      >
        {type}
      </div>
    );
  }

  return (
    <div
      className={`font-pixel uppercase rounded-full tracking-widest ${sizeClasses} ${color.bg} ${color.text} border ${color.border}`}
      aria-label={`Type: ${type}`}
    >
      {type}
    </div>
  );
};
