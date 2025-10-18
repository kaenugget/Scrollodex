import React from 'react';

export type FriendType = 'ART' | 'ELEC' | 'NORM' | 'PSY' | 'STEEL' | 'DARK' | 'GRASS' | 'WATER' | 'FIRE';

export type StatName = 'closeness' | 'recency' | 'introPower' | 'collaboration';

export interface FriendStats {
  closeness: number;
  recency: number;
  introPower: number;
  collaboration: number;
}

export interface FriendMove {
  name: string;
  description: string;
}

export interface FriendPreferences {
  food: string[];
  music: string[];
  hobbies: string[];
}

export interface FriendEntry {
  id: string;
  dexNumber: number;
  name: string;
  types: FriendType[];
  level: number;
  xp: number;
  stats: FriendStats;
  moves: FriendMove[];
  preferences: FriendPreferences;
  about: string;
  pfp: React.FC<React.SVGProps<SVGSVGElement>>;
}

// --- NEW SOCIAL TYPES ---

export interface Tag {
  id: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

export interface Note {
  id: string;
  content: string;
  createdAt: string; // ISO string
}

export interface ActionItem {
  id: string;
  content: string;
  completed: boolean;
  dueDate?: string; // ISO string
}

export interface Contact {
  id: string;
  friendId?: string; // Link to original FriendEntry
  name: string;
  pfp: React.FC<React.SVGProps<SVGSVGElement>>;
  role: string;
  company: string;
  location: string;
  tags: Tag[];
  birthday?: string; // ISO string
  lastInteractionAt: string; // ISO string
  nextTouchAt?: string; // ISO string
  notes: Note[];
  actions: ActionItem[];
  preferences: FriendPreferences;
}
