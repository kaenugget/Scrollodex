"use client";

import React from 'react';
import { TypeChip } from './TypeChip';
import { XpProgress } from './XpProgress';

interface DexEntry {
  _id: string;
  dexNumber: number;
  types: string[];
  level: number;
  xp: number;
  updatedAt: number;
}

interface Contact {
  _id: string;
  name: string;
  tags: string[];
}

interface DexCardProps {
  dexEntry: DexEntry;
  contact: Contact;
  onView: (contactId: string) => void;
}

const formatDexNumber = (num: number) => `#${String(num).padStart(3, '0')}`;

export function DexCard({ dexEntry, contact, onView }: DexCardProps) {
  return (
    <div 
      className="group bg-neutral-800/50 rounded-2xl w-64 md:w-full flex-shrink-0 transition-all duration-200 hover:bg-neutral-800 focus-within:bg-neutral-800 hover:-translate-y-1 focus-within:-translate-y-1 card-shadow"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-pixel text-lg text-neutral-100">{contact.name}</h2>
          <span className="font-pixel text-neutral-400">{formatDexNumber(dexEntry.dexNumber)}</span>
        </div>

        <div className="bg-neutral-700 pixel-border-outset mb-4">
           <div className="bg-neutral-900 aspect-square p-2">
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <span className="font-pixel text-neutral-900 text-4xl">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
           </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {dexEntry.types.map(type => (
            <TypeChip key={type} type={type as any} size="sm"/>
          ))}
        </div>

        <div className="mb-4">
            <XpProgress level={dexEntry.level} xp={dexEntry.xp} />
        </div>

        <button 
          onClick={() => onView(contact._id)}
          className="w-full text-center py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 focus:bg-emerald-400 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-emerald-400"
        >
          Open Entry
        </button>
      </div>
    </div>
  );
}

export const DexCardSkeleton: React.FC = () => {
  return (
     <div 
      className="bg-neutral-800/50 rounded-2xl w-64 md:w-full flex-shrink-0 card-shadow"
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
