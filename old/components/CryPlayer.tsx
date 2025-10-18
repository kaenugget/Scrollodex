
import React from 'react';
import { SoundIcon } from './Icons';
import { PIXEL_BORDER_CLASSES } from '../lib/utils';

export const CryPlayer: React.FC = () => {
  const handleClick = () => {
    // TODO: Implement audio playback
    alert("TODO: Wire up audio player!");
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={handleClick}
        className={`p-3 bg-neutral-700 hover:bg-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${PIXEL_BORDER_CLASSES}`}
      >
        <SoundIcon className="w-6 h-6 text-neutral-200" />
      </button>
      <div className="w-full h-2 bg-neutral-700 relative">
        <div className="absolute top-0 left-0 h-2 w-1/4 bg-neutral-500"></div>
      </div>
    </div>
  );
};
