
import React from 'react';
import { FriendType } from '../lib/types';
import { TYPE_COLORS } from '../lib/utils';

interface TypeChipProps {
  type: FriendType;
  size?: 'sm' | 'md';
}

export const TypeChip: React.FC<TypeChipProps> = ({ type, size = 'md' }) => {
  const color = TYPE_COLORS[type];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <div
      className={`font-pixel uppercase rounded-full tracking-widest ${sizeClasses} ${color.bg} ${color.text} border ${color.border}`}
      aria-label={`Type: ${type}`}
    >
      {type}
    </div>
  );
};
