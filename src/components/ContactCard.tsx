"use client";

import { useState } from "react";
import { Building, Wifi } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Contact {
  _id: Id<"contacts">;
  name: string;
  emails: string[];
  phones: string[];
  company?: string;
  location?: string;
  tags: string[];
  lastInteractionAt: number;
  pinned: boolean;
  isDynamicContact?: boolean;
  lastSyncedAt?: number;
}

interface ContactCardProps {
  contact: Contact;
  onPin: (contactId: Id<"contacts">, pinned: boolean) => void;
  onView: (contactId: string) => void;
}

export function ContactCard({ contact, onPin, onView }: ContactCardProps) {

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

  // Generate a consistent contact type (Personal/Professional) based on contact name
  const getContactType = (name: string) => {
    const index = name.charCodeAt(0) % 2;
    return index === 0 ? 'Personal' : 'Professional';
  };

  // Industry options with colors
  const industries = [
    { name: 'Tech', color: 'bg-yellow-500' },
    { name: 'Finance', color: 'bg-purple-500' },
    { name: 'Healthcare', color: 'bg-teal-500' },
    { name: 'Education', color: 'bg-pink-500' },
    { name: 'Marketing', color: 'bg-blue-500' },
    { name: 'Design', color: 'bg-indigo-500' },
    { name: 'Sales', color: 'bg-red-500' },
    { name: 'Consulting', color: 'bg-green-500' }
  ];

  // Generate a consistent industry based on contact name
  const getIndustry = (name: string) => {
    const index = name.charCodeAt(0) % industries.length;
    return industries[index];
  };

  // Role options
  const roles = [
    'Mentor', 'Investor', 'Childhood Friend', 'Golf Buddy', 'Colleague', 
    'Client', 'Partner', 'Advisor', 'Friend', 'Acquaintance', 
    'Family', 'Neighbor', 'Classmate', 'Teammate', 'Business Contact'
  ];

  // Generate a consistent role based on contact name
  const getRole = (name: string) => {
    const index = name.charCodeAt(0) % roles.length;
    return roles[index];
  };

  const formatLastInteraction = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  // Generate a consistent color for the accent bar based on contact name
  const getAccentColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="scrollodex-card scrollodex-card-entrance hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-3 sm:p-4">
        {/* Profile Image */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
            <img 
              src={`/assets-moji/${getMemojiImage(contact.name)}`}
              alt={`${contact.name} memoji`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold scrollodex-text-dark text-center mb-1 sm:mb-2">{contact.name}</h3>

        {/* Contact Type Tag, Role Tag and Dynamic Indicator */}
        <div className="text-center mb-1">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              getContactType(contact.name) === 'Personal' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {getContactType(contact.name)}
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
              {getRole(contact.name)}
            </div>
            {contact.isDynamicContact && (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                <Wifi className="w-3 h-3" />
                <span>Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Industry Tag */}
        <div className="flex justify-center mb-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getIndustry(contact.name).color}`}>
            {getIndustry(contact.name).name}
          </span>
        </div>

        {/* Contact Info */}
        {contact.company && (
          <div className="flex items-center justify-center gap-2 mb-3 text-sm scrollodex-text-gray">
            <Building className="w-4 h-4" />
            <span>{contact.company}</span>
          </div>
        )}

        {/* Last Interaction */}
        <div className="text-xs scrollodex-text-light-gray text-center mb-3">
          Last seen: {formatLastInteraction(contact.lastInteractionAt)}
        </div>

        {/* View Button */}
        <button 
          onClick={() => onView(contact._id)}
          className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Profile
        </button>
      </div>

      {/* Accent Bar */}
      <div className={`h-1 ${getAccentColor(contact.name)}`}></div>
    </div>
  );
}
