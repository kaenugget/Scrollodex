"use client";

import { useState } from "react";
import { Star, Phone, Mail, MapPin, Building, Wifi } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

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
  const [isPinned, setIsPinned] = useState(contact.pinned);

  const handlePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    onPin(contact._id, newPinned);
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

  // Generate a consistent contact type (Personal/Professional) based on contact name
  const getContactType = (name: string) => {
    const index = name.charCodeAt(0) % 2;
    return index === 0 ? 'Personal' : 'Professional';
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
      <div className="p-4 sm:p-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
            <img 
              src={`/assets-moji/${getMemojiImage(contact.name)}`}
              alt={`${contact.name} memoji`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Type Tag and Dynamic Indicator */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              getContactType(contact.name) === 'Personal' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}>
              {getContactType(contact.name)}
            </div>
            {contact.isDynamicContact && (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                <Wifi className="w-3 h-3" />
                <span>Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base sm:text-lg font-semibold scrollodex-text-dark text-center mb-2 sm:mb-3">{contact.name}</h3>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {contact.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 2 && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                +{contact.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm scrollodex-text-gray">
          {contact.company && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{contact.company}</span>
            </div>
          )}
          
          {contact.emails.length > 0 && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{contact.emails[0]}</span>
            </div>
          )}
          
          {contact.phones.length > 0 && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{contact.phones[0]}</span>
            </div>
          )}
        </div>

        {/* Last Interaction */}
        <div className="text-xs scrollodex-text-light-gray text-center mb-4">
          Last seen: {formatLastInteraction(contact.lastInteractionAt)}
        </div>

        {/* Pin Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handlePin}
            className={`p-2 rounded-full transition-colors ${
              isPinned 
                ? 'text-yellow-500 bg-yellow-50' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
          >
            <Star className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`} />
          </button>
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
