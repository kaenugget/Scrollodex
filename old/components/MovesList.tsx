
import React from 'react';
import { FriendMove } from '../lib/types';
import { MoveIcon } from './Icons';

interface MovesListProps {
  moves: FriendMove[];
}

export const MovesList: React.FC<MovesListProps> = ({ moves }) => {
  return (
    <div className="space-y-3">
      {moves.map(move => (
        <div key={move.name} className="flex items-start gap-3">
          <MoveIcon className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-neutral-100">{move.name}</h4>
            <p className="text-sm text-neutral-400">{move.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
