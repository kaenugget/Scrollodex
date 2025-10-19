"use client";

import React from 'react';
import { Id } from "@/convex/_generated/dataModel";
import { useContacts } from '@/hooks/useContacts';
import { useDexEntries } from '@/hooks/useDex';
import { TypeChip } from './TypeChip';
import { XpProgress } from './XpProgress';
import { NotesSection } from './NotesSection';
import { ActionsSection } from './ActionsSection';
import { PreferencesSection } from './PreferencesSection';
import { ContactMomentsFeed } from './ContactMomentsFeed';
import { PetModel } from './PetModel';
import { Star, Phone, Mail, MapPin, Building, ArrowLeft, Calendar, User } from 'lucide-react';

interface ContactDetailViewProps {
  contactId: string;
  userId: Id<"users">;
  contacts: Doc<"contacts">[];
  dexEntries: Doc<"dexEntries">[];
  activeTab: "overview" | "notes" | "actions" | "preferences" | "moments";
  onTabChange: (tab: "overview" | "notes" | "actions" | "preferences" | "moments") => void;
}

export function ContactDetailView({ contactId, userId, contacts, dexEntries, activeTab, onTabChange }: ContactDetailViewProps) {
  const { pinContact } = useContacts(userId, false); // Disabled since we're passing data as props
  
  const contact = contacts.find(c => c._id === contactId);
  const dexEntry = dexEntries.find(d => d.contactId === contactId);

  // Helper functions for consistent type and role display
  const getContactType = (name: string) => {
    const index = name.charCodeAt(0) % 2;
    return index === 0 ? 'Personal' : 'Professional';
  };

  const getRole = (name: string) => {
    const roles = [
      'Mentor', 'Investor', 'Childhood Friend', 'Golf Buddy', 'Colleague', 
      'Client', 'Partner', 'Advisor', 'Friend', 'Acquaintance', 
      'Family', 'Neighbor', 'Classmate', 'Teammate', 'Business Contact'
    ];
    const index = name.charCodeAt(0) % roles.length;
    return roles[index];
  };

  // List of available memoji images
  const memojiImages = [
    '08356205059d24549593d0b9a19cb1762abc8900.png',
    '0f3142c26306857d8e70277ea1bb8f087bc38fd9.png',
    '1273bdff1e02246ba2bc10e92c9ae54e27ecac5c.png',
    '175b568fdd31fff9ebc4eb30d2fd4b1a988fffc3.png',
    '18f3ede5ed062331e5fb62e6f9d5fbc8e4f5c6ac.png',
    '1967330d9961adf49d90841a7a35d8b513034ef9.png',
    '233a6fd519ce98178bfa9832ddd058403db1d3bb.png',
    '2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png',
    '40eea2bdc979e8303cfe5ad670c718ab7cc6cd26.png',
    '44faab3101d6e25090512693120c23866d347d02.png',
    '637f9d8820279c93bb2cefb93af72472f431eb50.png',
    '7d8e6fc528bf327988694404fca08058031b575e.png',
    '895ae4cd93b3ed20d216afcda2414d80547ae205.png',
    '8c98835dadb44f58c902e8b219525eadb42275c0.png',
    '90d4316f95dfa58f20b98e74e9e8a295574e84a4.png',
    '96ca4f3c99225394e50df5e7a78773cc97a178c7.png',
    'c2fddacc152d57392b08ecccebbd50e1a6f2af8a.png',
    'd6b40c57af7b91ce62fe3d8218a57c792f4e52b8.png',
    'dfa1cae2fdb7e947b9b28b566d7285888111b66a.png',
    'e6a83ff14ac76d1598087c994da84a379bd4b797.png',
    'fdee818f54b8c3fba3690e004d2a4967c796d17d.png'
  ];

  // Generate a consistent memoji based on contact name
  const getMemojiImage = (name: string) => {
    const index = name.charCodeAt(0) % memojiImages.length;
    return memojiImages[index];
  };

  const handleBack = () => {
    window.history.back();
  };

  const handlePin = () => {
    if (contact) {
      pinContact(contact._id, !contact.pinned);
    }
  };

  if (!contact) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-semibold scrollodex-text-dark mb-2">Contact Not Found</div>
        <div className="text-gray-600">This contact doesn&apos;t exist or you don&apos;t have access to it</div>
      </div>
    );
  }

  const formatLastInteraction = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  // Calculate relationship stats with randomization for variety
  const getRelationshipStats = () => {
    if (!contact) {
      return {
        connection: 50,
        reliability: 50,
        communication: 50,
        energy: 50
      };
    }

    // Get additional data for calculations
    const notesCount = contact.notes?.length || 0;
    const isPinned = contact.pinned || false;
    const lastInteractionDays = Math.floor((Date.now() - contact.lastInteractionAt) / (1000 * 60 * 60 * 24));
    const hasCompany = !!contact.company;
    const hasLocation = !!contact.location;
    const hasEmails = contact.emails?.length > 0;
    const hasPhones = contact.phones?.length > 0;
    const hasTags = contact.tags?.length > 0;

    // Create a deterministic but varied seed based on contact name
    const nameHash = contact.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Generate consistent but varied base scores for each stat
    const connectionSeed = (nameHash + 1) % 100;
    const reliabilitySeed = (nameHash + 2) % 100;
    const communicationSeed = (nameHash + 3) % 100;
    const energySeed = (nameHash + 4) % 100;

    // Base scores with more variation (30-70 range)
    const baseConnection = 30 + (connectionSeed * 0.4);
    const baseReliability = 30 + (reliabilitySeed * 0.4);
    const baseCommunication = 30 + (communicationSeed * 0.4);
    const baseEnergy = 30 + (energySeed * 0.4);

    // Apply modifiers but keep them more conservative
    const connectionScore = Math.min(100, Math.max(15, 
      baseConnection + 
      (notesCount * 2) + // Reduced from 3
      (isPinned ? 8 : 0) + // Reduced from 10
      (lastInteractionDays < 7 ? 12 : lastInteractionDays < 30 ? 8 : lastInteractionDays < 90 ? 4 : -8) + // Reduced bonuses
      (hasCompany ? 3 : 0) + // Reduced from 5
      (hasLocation ? 3 : 0) +
      (hasEmails ? 3 : 0) +
      (hasPhones ? 3 : 0) +
      (hasTags ? 3 : 0)
    ));

    const reliabilityScore = Math.min(100, Math.max(15,
      baseReliability +
      (lastInteractionDays < 30 ? 10 : lastInteractionDays < 90 ? 6 : lastInteractionDays < 180 ? 3 : -12) + // Reduced bonuses
      (notesCount > 3 ? 6 : notesCount > 1 ? 3 : 0) + // Reduced from 10/5
      (hasCompany ? 5 : 0) + // Reduced from 8
      (hasLocation ? 3 : 0) +
      (hasEmails ? 5 : 0) + // Reduced from 8
      (hasPhones ? 5 : 0) +
      (isPinned ? 4 : 0) // Reduced from 5
    ));

    const communicationScore = Math.min(100, Math.max(15,
      baseCommunication +
      (notesCount * 3) + // Reduced from 4
      (lastInteractionDays < 14 ? 15 : lastInteractionDays < 30 ? 10 : lastInteractionDays < 60 ? 6 : lastInteractionDays < 180 ? 3 : -8) + // Reduced bonuses
      (hasEmails ? 6 : 0) + // Reduced from 10
      (hasPhones ? 6 : 0) + // Reduced from 10
      (hasTags ? 3 : 0) + // Reduced from 5
      (isPinned ? 5 : 0) // Reduced from 8
    ));

    const energyScore = Math.min(100, Math.max(15,
      baseEnergy +
      (lastInteractionDays < 7 ? 18 : lastInteractionDays < 14 ? 12 : lastInteractionDays < 30 ? 8 : lastInteractionDays < 60 ? 5 : lastInteractionDays < 180 ? 3 : -12) + // Reduced bonuses
      (notesCount > 2 ? 8 : notesCount > 0 ? 4 : 0) + // Reduced from 15/8
      (hasCompany ? 3 : 0) + // Reduced from 5
      (hasLocation ? 3 : 0) +
      (hasTags ? 5 : 0) + // Reduced from 8
      (isPinned ? 6 : 0) + // Reduced from 10
      (dexEntry ? Math.min(6, dexEntry.level * 2) : 0) // Reduced from 10
    ));

    return {
      connection: Math.round(connectionScore),
      reliability: Math.round(reliabilityScore),
      communication: Math.round(communicationScore),
      energy: Math.round(energyScore)
    };
  };

  const relationshipStats = getRelationshipStats();
  const overallScore = Math.round((relationshipStats.connection + relationshipStats.reliability + relationshipStats.communication + relationshipStats.energy) / 4);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold scrollodex-text-white">Contact Profile</h1>
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left Panel - Profile Picture and Stats */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src={`/assets-moji/${getMemojiImage(contact.name)}`}
                  alt={`${contact.name} memoji`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Relationship Score */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Relationship Score</div>
              <div className="text-4xl font-bold scrollodex-text-dark">{overallScore}</div>
            </div>
          </div>

          {/* Relationship Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Stats</h3>
            <div className="space-y-4">
              {/* Connection */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Connection</span>
                  <span className="font-semibold text-gray-900">{relationshipStats.connection}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${relationshipStats.connection}%` }}
                  ></div>
                </div>
              </div>

              {/* Reliability */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reliability</span>
                  <span className="font-semibold text-gray-900">{relationshipStats.reliability}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${relationshipStats.reliability}%` }}
                  ></div>
                </div>
              </div>

              {/* Communication */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Communication</span>
                  <span className="font-semibold text-gray-900">{relationshipStats.communication}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${relationshipStats.communication}%` }}
                  ></div>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Energy</span>
                  <span className="font-semibold text-gray-900">{relationshipStats.energy}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${relationshipStats.energy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Model */}
          <PetModel 
            contactId={contactId as Id<"contacts">} 
            userId={userId}
            relationshipStats={relationshipStats}
            petData={contact.petData}
          />

        </div>

        {/* Right Panel - Contact Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Name and Location */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{contact.name}</h2>
                {contact.location && (
                  <div className="text-base sm:text-lg text-gray-500">{contact.location}</div>
                )}
              </div>
              <button
                onClick={handlePin}
                className={`p-3 rounded-full transition-colors ${
                  contact.pinned 
                    ? 'text-yellow-500 bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                }`}
              >
                <Star className={`w-6 h-6 ${contact.pinned ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <p className="text-gray-600 italic leading-relaxed">
                {contact.name} is a highly valued contact with whom you share a strong professional relationship. 
                {dexEntry && ` Your connection has grown to level ${dexEntry.level} through consistent interactions. `}
                {contact.company && `Currently working at ${contact.company}, `}
                {contact.location && `based in ${contact.location}. `}
                Your communications reflect mutual respect and reliable collaboration.
              </p>
            </div>

            {/* General Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">General Info</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {contact.company && (
                    <div>
                      <span className="text-sm text-gray-500">Company</span>
                      <div className="font-medium text-gray-900">{contact.company}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Last Contacted</span>
                    <div className="font-medium text-gray-900">{formatLastInteraction(contact.lastInteractionAt)}</div>
                  </div>
                  {contact.tags.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">Role</span>
                      <div className="font-medium text-gray-900">{contact.tags[0]}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Birthday</span>
                    <div className="font-medium text-gray-900">Not specified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Type</h3>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-4 py-2 text-white font-medium rounded-lg ${
                  getContactType(contact.name) === 'Personal' 
                    ? 'bg-emerald-500' 
                    : 'bg-blue-500'
                }`}>
                  {getContactType(contact.name)}
                </span>
                <span className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg">
                  {getRole(contact.name)}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Info</h3>
              <div className="space-y-3">
                {contact.emails.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 w-20">Email:</span>
                    <a href={`mailto:${contact.emails[0]}`} className="text-blue-600 hover:underline">
                      {contact.emails[0]}
                    </a>
                  </div>
                )}
                {contact.phones.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 w-20">Phone:</span>
                    <span className="text-gray-900">{contact.phones[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 w-20">Social:</span>
                  <span className="text-gray-900">LinkedIn</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 w-20">Preferred Method:</span>
                  <span className="text-gray-900">Email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'notes', label: 'Notes' },
              { key: 'actions', label: 'Actions' },
              { key: 'preferences', label: 'Preferences' },
              { key: 'moments', label: 'Moments' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onTabChange(key as "overview" | "notes" | "actions" | "preferences" | "moments")}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors rounded-md flex-1 sm:flex-none ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <button className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Add Moment
                    </button>
                    <button className="px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Create Card
                    </button>
                    <button className="px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                      Start Meeting
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <NotesSection contactId={contactId as Id<"contacts">} userId={userId} />
              )}

              {activeTab === 'actions' && (
                <ActionsSection contactId={contactId as Id<"contacts">} userId={userId} />
              )}

              {activeTab === 'preferences' && (
                <PreferencesSection contactId={contactId as Id<"contacts">} userId={userId} />
              )}

              {activeTab === 'moments' && (
                <ContactMomentsFeed contactId={contactId as Id<"contacts">} userId={userId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}