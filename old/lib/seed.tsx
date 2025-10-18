
import React from 'react';
import { FriendEntry } from './types';

// Placeholder SVGs for avatars
const TatsPFP: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 4h2v2H4V4zm2 2h2v2H6V6zm2 0h2v2H8V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 2h2v2h-2V8zM18 10h2v2h-2v-2zm0 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2H8v-2zm-2 0h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4v-2zm12-4H8v2h8V6zM8 10h8v2H8v-2z" fill="#f43f5e"/>
    <path d="M6 16h12v2H6v-2z" fill="#a1a1aa"/>
  </svg>
);

const KaelanPFP: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 4h2v2H4V4zm2 2h2v2H6V6zm2 0h2v2H8V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 2h2v2h-2V8zM18 10h2v2h-2v-2zm0 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2H8v-2zm-2 0h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4v-2zm4-4h2v10H8V6zm4 0h2v10h-2V6z" fill="#f59e0b"/>
    <path d="M4 18h16v2H4v-2z" fill="#71717a"/>
  </svg>
);

const ChenPFP: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
     <path d="M4 4h2v2H4V4zm2 2h2v2H6V6zm2 0h2v2H8V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 2h2v2h-2V8zM18 10h2v2h-2v-2zm0 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2H8v-2zm-2 0h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4v-2zm8 0a4 4 0 100-8 4 4 0 000 8z" fill="#8b5cf6"/>
    <path d="M8 18h8v2H8v-2z" fill="#10b981"/>
  </svg>
);

const BrentPFP: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 4h2v2H4V4zm2 2h2v2H6V6zm2 0h2v2H8V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 0h2v2h-2V6zm2 2h2v2h-2V8zM18 10h2v2h-2v-2zm0 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 0h2v2H8v-2zm-2 0h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4v-2zm4-2h8v2H8V8zm0 4h8v2H8v-2z" fill="#78716c"/>
    <path d="M6 18h12v2H6v-2z" fill="#a8a29e"/>
  </svg>
);


export const SCOLLODEX_ENTRIES: FriendEntry[] = [
  {
    id: 'tats_001',
    dexNumber: 1,
    name: 'Tats',
    types: ['ART', 'NORM'],
    level: 2,
    xp: 14,
    stats: { closeness: 65, recency: 72, introPower: 58, collaboration: 70 },
    moves: [
      { name: 'Design Sprint', description: 'Rapidly prototypes new ideas.' },
      { name: 'Warm Intro', description: 'Connects two people with perfect context.' },
      { name: 'Demo Day', description: 'Presents work with clarity and passion.' },
      { name: 'Pixel Polish', description: 'Obsesses over the smallest UI details.' },
    ],
    preferences: { food: ['ramen', 'yakitori'], music: ['city pop'], hobbies: ['bouldering', 'sketching'] },
    about: 'Builder of Scollodex. Loves cozy UI and late-night ramen.',
    pfp: TatsPFP,
  },
  {
    id: 'kaelan_002',
    dexNumber: 2,
    name: 'Kaelan',
    types: ['ELEC', 'STEEL'],
    level: 2,
    xp: 18,
    stats: { closeness: 60, recency: 64, introPower: 76, collaboration: 62 },
    moves: [
      { name: 'Infra Wizard', description: 'Spins up infrastructure from thin air.' },
      { name: 'Latency Slash', description: 'Reduces API response times dramatically.' },
      { name: 'Type Safety', description: 'Enforces strict typing across the codebase.' },
    ],
    preferences: { food: ['sourdough'], music: ['synthwave'], hobbies: ['cycling', 'keyboards'] },
    about: 'Infra first, vibes second. Makes fast things faster.',
    pfp: KaelanPFP,
  },
  {
    id: 'chenchen_003',
    dexNumber: 3,
    name: 'Chen Chen',
    types: ['PSY', 'ART'],
    level: 1,
    xp: 8,
    stats: { closeness: 55, recency: 50, introPower: 52, collaboration: 66 },
    moves: [
      { name: 'User Study', description: 'Gathers deep insights from user interviews.' },
      { name: 'UX Whisper', description: 'Identifies and solves usability issues.' },
      { name: 'Story Map', description: 'Visualizes the entire user journey.' },
    ],
    preferences: { food: ['hotpot'], music: ['lofi'], hobbies: ['illustration', 'matcha'] },
    about: 'Design researcher with a soft spot for tiny details.',
    pfp: ChenPFP,
  },
  {
    id: 'brent_004',
    dexNumber: 4,
    name: 'Brent',
    types: ['NORM', 'DARK'],
    level: 1,
    xp: 6,
    stats: { closeness: 48, recency: 40, introPower: 62, collaboration: 54 },
    moves: [
      { name: 'Outbound Ping', description: 'Initiates contact with a new lead.' },
      { name: 'Deal Flow', description: 'Manages a pipeline of potential partners.' },
      { name: 'Cold Open', description: 'Starts a conversation with anyone, anywhere.' },
    ],
    preferences: { food: ['tacos'], music: ['indie'], hobbies: ['pickup hoops', 'espresso'] },
    about: 'Connector. Finds the right room at the right time.',
    pfp: BrentPFP,
  },
];
