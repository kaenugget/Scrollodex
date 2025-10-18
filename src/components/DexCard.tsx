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

const formatDexNumber = (num: number) => `#${String(num).padStart(4, '0')}`;

export function DexCard({ dexEntry, contact, onView }: DexCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Dex Number */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm text-gray-500 font-mono">{formatDexNumber(dexEntry.dexNumber)}</span>
          <span className="text-sm font-semibold text-gray-900">Lv. {dexEntry.level}</span>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">{contact.name}</h2>

        {/* Type Tags */}
        <div className="flex justify-center gap-2 mb-4">
          {dexEntry.types.map(type => (
            <TypeChip key={type} type={type as "FIRE" | "WATER" | "GRASS" | "ELEC" | "PSY" | "STEEL" | "DARK" | "ART" | "NORM"} size="sm"/>
          ))}
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <XpProgress level={dexEntry.level} xp={dexEntry.xp} />
        </div>

        {/* View Button */}
        <button 
          onClick={() => onView(contact._id)}
          className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Open Entry
        </button>
      </div>

      {/* Accent Bar */}
      <div className="h-1 bg-green-500"></div>
    </div>
  );
}

export const DexCardSkeleton: React.FC = () => {
  return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </div>

        <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-4"></div>

        <div className="flex justify-center gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>

        <div className="mb-4">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
        </div>

        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
