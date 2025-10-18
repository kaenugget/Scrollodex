"use client";

import React from 'react';
import { Id } from "../../convex/_generated/dataModel";
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
  contacts: any[];
  dexEntries: any[];
  activeTab: "overview" | "notes" | "actions" | "preferences" | "moments";
  onTabChange: (tab: "overview" | "notes" | "actions" | "preferences" | "moments") => void;
}

export function ContactDetailView({ contactId, userId, contacts, dexEntries, activeTab, onTabChange }: ContactDetailViewProps) {
  const { pinContact } = useContacts(userId, false); // Disabled since we're passing data as props
  
  const contact = contacts.find(c => c._id === contactId);
  const dexEntry = dexEntries.find(d => d.contactId === contactId);

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

  // Calculate relationship stats based on actual contact data
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

    // Base score from dex entry if available
    let baseScore = 50;
    if (dexEntry) {
      baseScore = Math.min(95, 50 + (dexEntry.level * 5) + Math.floor(dexEntry.xp / 100));
    }

    // Connection: Based on interaction frequency, notes, and contact completeness
    const connectionScore = Math.min(100, Math.max(20, 
      baseScore + 
      (notesCount * 3) + // More notes = stronger connection
      (isPinned ? 10 : 0) + // Pinned contacts have stronger connection
      (lastInteractionDays < 7 ? 15 : lastInteractionDays < 30 ? 10 : lastInteractionDays < 90 ? 5 : -10) + // Recent interaction bonus
      (hasCompany ? 5 : 0) + // Complete profile
      (hasLocation ? 5 : 0) +
      (hasEmails ? 5 : 0) +
      (hasPhones ? 5 : 0) +
      (hasTags ? 5 : 0)
    ));

    // Reliability: Based on consistency of interaction and profile completeness
    const reliabilityScore = Math.min(100, Math.max(20,
      baseScore +
      (lastInteractionDays < 30 ? 15 : lastInteractionDays < 90 ? 10 : lastInteractionDays < 180 ? 5 : -15) + // Consistent interaction
      (notesCount > 3 ? 10 : notesCount > 1 ? 5 : 0) + // Multiple notes show reliability
      (hasCompany ? 8 : 0) + // Professional reliability
      (hasLocation ? 5 : 0) +
      (hasEmails ? 8 : 0) + // Contact info shows reliability
      (hasPhones ? 8 : 0) +
      (isPinned ? 5 : 0) // Pinned = reliable contact
    ));

    // Communication: Based on notes, contact methods, and interaction recency
    const communicationScore = Math.min(100, Math.max(20,
      baseScore +
      (notesCount * 4) + // Notes indicate communication
      (lastInteractionDays < 14 ? 20 : lastInteractionDays < 30 ? 15 : lastInteractionDays < 60 ? 10 : lastInteractionDays < 180 ? 5 : -10) + // Recent communication
      (hasEmails ? 10 : 0) + // Email = communication channel
      (hasPhones ? 10 : 0) + // Phone = communication channel
      (hasTags ? 5 : 0) + // Tags show understanding
      (isPinned ? 8 : 0) // Pinned = important communication
    ));

    // Energy: Based on interaction frequency, profile activity, and engagement
    const energyScore = Math.min(100, Math.max(20,
      baseScore +
      (lastInteractionDays < 7 ? 25 : lastInteractionDays < 14 ? 20 : lastInteractionDays < 30 ? 15 : lastInteractionDays < 60 ? 10 : lastInteractionDays < 180 ? 5 : -15) + // Recent activity
      (notesCount > 2 ? 15 : notesCount > 0 ? 8 : 0) + // Active note-taking
      (hasCompany ? 5 : 0) + // Professional energy
      (hasLocation ? 5 : 0) +
      (hasTags ? 8 : 0) + // Tagging shows engagement
      (isPinned ? 10 : 0) + // Pinned = high energy relationship
      (dexEntry ? Math.min(10, dexEntry.level) : 0) // Dex level shows engagement
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
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl sm:text-4xl font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Relationship Score */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Relationship Score</div>
              <div className="text-4xl font-bold scrollodex-text-dark">{overallScore}</div>
            </div>
          </div>

          {/* Pet Model */}
          <PetModel 
            contactId={contactId as Id<"contacts">} 
            userId={userId}
            relationshipStats={relationshipStats}
            petData={contact.petData}
          />

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

          {/* Dex Info Card */}
          {dexEntry && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dex Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-mono">Dex #{dexEntry.dexNumber.toString().padStart(3, '0')}</span>
                  <span className="text-sm font-semibold text-gray-900">Lv. {dexEntry.level}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {dexEntry.types.map(type => (
                    <TypeChip key={type} type={type as "FIRE" | "WATER" | "GRASS" | "ELEC" | "PSY" | "STEEL" | "DARK" | "ART" | "NORM"} size="sm"/>
                  ))}
                </div>
                <XpProgress level={dexEntry.level} xp={dexEntry.xp} />
              </div>
            </div>
          )}
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
              <div className="flex gap-2">
                {dexEntry && dexEntry.types.length > 0 ? (
                  dexEntry.types.map(type => (
                    <TypeChip key={type} type={type as "FIRE" | "WATER" | "GRASS" | "ELEC" | "PSY" | "STEEL" | "DARK" | "ART" | "NORM"} size="md"/>
                  ))
                ) : (
                  <span className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg">Professional</span>
                )}
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