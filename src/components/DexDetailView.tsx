"use client";

import { useState } from 'react';
import { Id } from "../../convex/_generated/dataModel";
import { useContacts } from '@/hooks/useContacts';
import { useDexEntries } from '@/hooks/useDex';
import { PixelFrame } from './PixelFrame';
import { TypeChip } from './TypeChip';
import { XpProgress } from './XpProgress';
import { ArrowLeft, Star, TrendingUp, Calendar } from 'lucide-react';

interface DexDetailViewProps {
  contactId: string;
  userId: Id<"users">;
}

export function DexDetailView({ contactId, userId }: DexDetailViewProps) {
  const { contacts, isLoading: contactsLoading } = useContacts(userId, true);
  const { dexEntries, isLoading: dexLoading } = useDexEntries(userId, true);
  
  const contact = contacts.find(c => c._id === contactId);
  const dexEntry = dexEntries.find(d => d.contactId === contactId);

  const handleBack = () => {
    window.history.back();
  };

  if (contactsLoading || dexLoading) {
    return (
      <div className="text-center">
        <div className="font-pixel text-xl mb-4 text-emerald-400">Loading...</div>
        <div className="text-neutral-400">Loading dex entry</div>
      </div>
    );
  }

  if (!contact || !dexEntry) {
    return (
      <div className="text-center">
        <div className="font-pixel text-xl mb-4 text-emerald-400">Dex Entry Not Found</div>
        <div className="text-neutral-400">This dex entry doesn't exist or you don't have access to it</div>
      </div>
    );
  }

  const getXpToNextLevel = () => {
    if (dexEntry.level === 3) return 0;
    const thresholds = [0, 10, 25];
    return thresholds[dexEntry.level] - dexEntry.xp;
  };

  const getXpProgress = () => {
    if (dexEntry.level === 3) return 100;
    const thresholds = [0, 10, 25];
    const currentThreshold = thresholds[dexEntry.level - 1] || 0;
    const nextThreshold = thresholds[dexEntry.level];
    return ((dexEntry.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  const getTypeEffectiveness = (type: string) => {
    // Mock type effectiveness data
    const effectiveness: Record<string, Record<string, number>> = {
      FIRE: { GRASS: 2, WATER: 0.5, FIRE: 0.5, NORM: 1 },
      WATER: { FIRE: 2, GRASS: 0.5, WATER: 0.5, NORM: 1 },
      GRASS: { WATER: 2, FIRE: 0.5, GRASS: 0.5, NORM: 1 },
      ELEC: { WATER: 2, GRASS: 0.5, ELEC: 0.5, NORM: 1 },
      PSY: { PSY: 0.5, DARK: 0.5, NORM: 1 },
      STEEL: { STEEL: 0.5, NORM: 1 },
      DARK: { PSY: 2, DARK: 0.5, NORM: 1 },
      ART: { ART: 0.5, NORM: 1 },
      NORM: { NORM: 1 }
    };
    return effectiveness[type] || {};
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-neutral-800 transition-colors pixel-border-outset"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400" />
        </button>
        <h1 className="text-3xl font-pixel text-emerald-400">Dex Entry</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Dex Card */}
        <div className="space-y-6">
          {/* Main Dex Card */}
          <PixelFrame padding="p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="bg-neutral-700 pixel-border-outset p-4 mx-auto w-48 h-48">
                  <div className="bg-neutral-900 aspect-square p-4">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <span className="font-pixel text-neutral-900 text-6xl">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-pixel text-neutral-100 mb-2">{contact.name}</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="font-pixel text-neutral-400">#{dexEntry.dexNumber.toString().padStart(3, '0')}</span>
                <span className="font-pixel text-emerald-400">Lv. {dexEntry.level}</span>
                <span className="font-pixel text-cyan-400">{dexEntry.xp} XP</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                {dexEntry.types.map(type => (
                  <TypeChip key={type} type={type as any} size="md"/>
                ))}
              </div>

              <div className="max-w-sm mx-auto">
                <XpProgress level={dexEntry.level} xp={dexEntry.xp} />
              </div>
            </div>
          </PixelFrame>

          {/* Stats */}
          <PixelFrame padding="p-6">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Level</span>
                <span className="font-pixel text-emerald-400">{dexEntry.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Experience</span>
                <span className="font-pixel text-cyan-400">{dexEntry.xp} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Types</span>
                <div className="flex gap-1">
                  {dexEntry.types.map(type => (
                    <TypeChip key={type} type={type as any} size="sm"/>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Dex Number</span>
                <span className="font-pixel text-neutral-400">#{dexEntry.dexNumber.toString().padStart(3, '0')}</span>
              </div>
              {dexEntry.level < 3 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">XP to Next Level</span>
                  <span className="font-pixel text-yellow-400">{getXpToNextLevel()} XP</span>
                </div>
              )}
            </div>
          </PixelFrame>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Type Effectiveness */}
          <PixelFrame padding="p-6">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">Type Effectiveness</h3>
            <div className="grid grid-cols-3 gap-2">
              {['FIRE', 'WATER', 'GRASS', 'ELEC', 'PSY', 'STEEL', 'DARK', 'ART', 'NORM'].map(type => {
                const effectiveness = getTypeEffectiveness(dexEntry.types[0])[type] || 1;
                const getEffectivenessColor = (eff: number) => {
                  if (eff > 1) return 'bg-green-600';
                  if (eff < 1) return 'bg-red-600';
                  return 'bg-neutral-600';
                };
                return (
                  <div key={type} className={`p-2 text-center ${getEffectivenessColor(effectiveness)}`}>
                    <div className="font-pixel text-xs text-white">{type}</div>
                    <div className="text-xs text-white">
                      {effectiveness === 2 ? '2x' : effectiveness === 0.5 ? '0.5x' : '1x'}
                    </div>
                  </div>
                );
              })}
            </div>
          </PixelFrame>

          {/* XP History */}
          <PixelFrame padding="p-6">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">XP History</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400"></div>
                <div className="flex-1">
                  <div className="text-sm text-neutral-300">Initial contact created</div>
                  <div className="text-xs text-neutral-500">+5 XP</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400"></div>
                <div className="flex-1">
                  <div className="text-sm text-neutral-300">Recent interaction</div>
                  <div className="text-xs text-neutral-500">+2 XP</div>
                </div>
              </div>
              <div className="text-neutral-400 text-center py-4">
                More XP events will appear here as you interact with this contact
              </div>
            </div>
          </PixelFrame>

          {/* Recent Interactions */}
          <PixelFrame padding="p-6">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">Recent Interactions</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-300">Last interaction</div>
                  <div className="text-xs text-neutral-500">
                    {new Date(contact.lastInteractionAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-neutral-400 text-center py-4">
                Interaction history will appear here
              </div>
            </div>
          </PixelFrame>

          {/* Quick Actions */}
          <PixelFrame padding="p-6">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400">
                Add XP
              </button>
              <button className="w-full px-4 py-2 bg-cyan-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-cyan-400">
                Update Types
              </button>
              <button className="w-full px-4 py-2 bg-violet-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-violet-400">
                Change PFP
              </button>
            </div>
          </PixelFrame>
        </div>
      </div>
    </div>
  );
}
