"use client";

import { useState } from 'react';
import { Id } from "../../convex/_generated/dataModel";
import { useContacts } from '@/hooks/useContacts';
import { useDexEntries } from '@/hooks/useDex';
import { PixelFrame } from './PixelFrame';
import { TypeChip } from './TypeChip';
import { XpProgress } from './XpProgress';
import { NotesSection } from './NotesSection';
import { ActionsSection } from './ActionsSection';
import { PreferencesSection } from './PreferencesSection';
import { Star, Phone, Mail, MapPin, Building, ArrowLeft } from 'lucide-react';

interface ContactDetailViewProps {
  contactId: string;
  userId: Id<"users">;
  activeTab: "overview" | "notes" | "actions" | "preferences";
  onTabChange: (tab: "overview" | "notes" | "actions" | "preferences") => void;
}

export function ContactDetailView({ contactId, userId, activeTab, onTabChange }: ContactDetailViewProps) {
  const { contacts, pinContact, isLoading: contactsLoading } = useContacts(userId, true);
  const { dexEntries, isLoading: dexLoading } = useDexEntries(userId, true);
  
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

  if (contactsLoading || dexLoading) {
    return (
      <div className="text-center">
        <div className="font-pixel text-xl mb-4 text-emerald-400">Loading...</div>
        <div className="text-neutral-400">Loading contact details</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center">
        <div className="font-pixel text-xl mb-4 text-emerald-400">Contact Not Found</div>
        <div className="text-neutral-400">This contact doesn't exist or you don't have access to it</div>
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-neutral-800 transition-colors pixel-border-outset"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-400" />
        </button>
        <h1 className="text-3xl font-pixel text-emerald-400">Contact Details</h1>
      </div>

      {/* Contact Header */}
      <PixelFrame className="mb-6" padding="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="bg-neutral-700 pixel-border-outset p-4">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <span className="font-pixel text-neutral-900 text-3xl">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-pixel text-neutral-100 mb-2">{contact.name}</h2>
                {contact.company && (
                  <div className="flex items-center gap-2 text-neutral-400 mb-2">
                    <Building className="w-4 h-4" />
                    <span>{contact.company}</span>
                  </div>
                )}
                {contact.location && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.location}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handlePin}
                className={`p-2 transition-colors ${contact.pinned ? 'text-yellow-400' : 'text-neutral-500 hover:text-yellow-400'}`}
              >
                <Star className={`w-5 h-5 ${contact.pinned ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {contact.emails.length > 0 && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-neutral-300">{contact.emails[0]}</span>
                </div>
              )}
              
              {contact.phones.length > 0 && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-neutral-300">{contact.phones[0]}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {contact.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm bg-neutral-700 text-neutral-300 pixel-border-outset">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Dex Info */}
            {dexEntry && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-sm text-neutral-400">Dex #{dexEntry.dexNumber.toString().padStart(3, '0')}</span>
                  <span className="font-pixel text-sm text-emerald-400">Lv. {dexEntry.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  {dexEntry.types.map(type => (
                    <TypeChip key={type} type={type as any} size="sm"/>
                  ))}
                </div>
                <div className="flex-1 max-w-xs">
                  <XpProgress level={dexEntry.level} xp={dexEntry.xp} />
                </div>
              </div>
            )}

            <div className="text-sm text-neutral-500 mt-4">
              Last interaction: {formatLastInteraction(contact.lastInteractionAt)}
            </div>
          </div>
        </div>
      </PixelFrame>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'notes', label: 'Notes' },
          { key: 'actions', label: 'Actions' },
          { key: 'preferences', label: 'Preferences' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key as any)}
            className={`px-4 py-2 font-pixel text-sm transition-colors ${
              activeTab === key
                ? 'bg-emerald-500 text-neutral-900'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <PixelFrame padding="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="font-pixel text-xl text-emerald-400 mb-4">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-pixel text-sm text-neutral-400 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {contact.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span className="text-neutral-300">{email}</span>
                    </div>
                  ))}
                  {contact.phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span className="text-neutral-300">{phone}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-pixel text-sm text-neutral-400 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400">
                    Add Moment
                  </button>
                  <button className="w-full px-4 py-2 bg-cyan-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-cyan-400">
                    Create Card
                  </button>
                  <button className="w-full px-4 py-2 bg-violet-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-violet-400">
                    Start Meeting
                  </button>
                </div>
              </div>
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
      </PixelFrame>
    </div>
  );
}
