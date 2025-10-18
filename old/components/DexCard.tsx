
import React from 'react';
import { FriendEntry } from '../lib/types';
import { formatDexNumber, PIXEL_BORDER_CLASSES } from '../lib/utils';
import { TypeChip } from './TypeChip';
import { XpProgress } from './XpProgress';

interface DexCardProps {
  entry: FriendEntry;
  onSelect: (id: string) => void;
}

export const DexCard: React.FC<DexCardProps> = ({ entry, onSelect }) => {
  const PfpComponent = entry.pfp;

  return (
    <div 
      className="group bg-neutral-800/50 rounded-2xl w-64 md:w-full flex-shrink-0 transition-all duration-200 hover:bg-neutral-800 focus-within:bg-neutral-800 hover:-translate-y-1 focus-within:-translate-y-1"
      style={{
        boxShadow: `
          0 0 0 2px #404040, 
          0 0 0 4px #262626,
          4px 4px 0 4px #171717
        `,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-pixel text-lg text-neutral-100">{entry.name}</h2>
          <span className="font-pixel text-neutral-400">{formatDexNumber(entry.dexNumber)}</span>
        </div>

        <div className={`bg-neutral-700 ${PIXEL_BORDER_CLASSES} mb-4`}>
           <div className="bg-neutral-900 aspect-square p-2">
                <PfpComponent className="w-full h-full object-cover" />
           </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {entry.types.map(type => <TypeChip key={type} type={type} size="sm"/>)}
        </div>

        <div className="mb-4">
            <XpProgress level={entry.level} xp={entry.xp} />
        </div>

        <button 
          onClick={() => onSelect(entry.id)}
          className={`w-full text-center py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider ${PIXEL_BORDER_CLASSES} transition-colors hover:bg-emerald-400 focus:bg-emerald-400 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-emerald-400`}
        >
          Open Entry
        </button>
      </div>
    </div>
  );
};

export const DexCardSkeleton: React.FC = () => {
  return (
     <div 
      className="bg-neutral-800/50 rounded-2xl w-64 md:w-full flex-shrink-0"
      style={{
        boxShadow: `
          0 0 0 2px #404040, 
          0 0 0 4px #262626,
          4px 4px 0 4px #171717
        `,
      }}
    >
      <div className="p-4 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-6 w-24 bg-neutral-700 rounded"></div>
            <div className="h-5 w-12 bg-neutral-700 rounded"></div>
        </div>

        <div className="bg-neutral-700 aspect-square mb-4"></div>

        <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-16 bg-neutral-700 rounded-full"></div>
            <div className="h-6 w-16 bg-neutral-700 rounded-full"></div>
        </div>

        <div className="mb-4">
            <div className="h-3 w-full bg-neutral-700 rounded mt-3"></div>
        </div>

        <div className="h-10 w-full bg-neutral-700"></div>
      </div>
    </div>
  );
}
