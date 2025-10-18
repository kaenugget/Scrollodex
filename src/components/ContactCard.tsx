"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Phone, Mail, MapPin, Building } from "lucide-react";
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
    <div className="bg-neutral-800/50 rounded-2xl transition-all duration-200 hover:bg-neutral-800 focus-within:bg-neutral-800 hover:-translate-y-1 focus-within:-translate-y-1 card-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-pixel text-lg text-neutral-100">{contact.name}</h3>
            {contact.company && (
              <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                <Building className="w-3 h-3" />
                {contact.company}
              </div>
            )}
          </div>
          <button
            onClick={handlePin}
            className={`p-1 transition-colors ${isPinned ? 'text-yellow-400' : 'text-neutral-500 hover:text-yellow-400'}`}
          >
            <Star className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          {contact.emails.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3 text-cyan-400" />
              <span className="text-neutral-300">{contact.emails[0]}</span>
            </div>
          )}
          
          {contact.phones.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="text-neutral-300">{contact.phones[0]}</span>
            </div>
          )}
          
          {contact.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-3 h-3 text-red-400" />
              <span className="text-neutral-300">{contact.location}</span>
            </div>
          )}
        </div>
        
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {contact.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 pixel-border-outset">
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 pixel-border-outset">
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-neutral-500">
            Last seen: {formatLastInteraction(contact.lastInteractionAt)}
          </span>
          <button 
            onClick={() => onView(contact._id)}
            className="px-3 py-1 text-xs bg-emerald-500 text-neutral-900 font-pixel text-sm tracking-wider pixel-border-outset transition-colors hover:bg-emerald-400 focus:bg-emerald-400 outline-none"
          >
            View Dex
          </button>
        </div>
      </div>
    </div>
  );
}
