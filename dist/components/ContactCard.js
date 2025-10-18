"use client";
import { useState } from "react";
import { Star, Phone, Mail, Building, Wifi } from "lucide-react";
export function ContactCard({ contact, onPin, onView }) {
    const [isPinned, setIsPinned] = useState(contact.pinned);
    const handlePin = () => {
        const newPinned = !isPinned;
        setIsPinned(newPinned);
        onPin(contact._id, newPinned);
    };
    const formatLastInteraction = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            return "Today";
        if (days === 1)
            return "Yesterday";
        if (days < 7)
            return `${days} days ago`;
        return `${Math.floor(days / 7)} weeks ago`;
    };
    // Generate a consistent color for the accent bar based on contact name
    const getAccentColor = (name) => {
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
    return (<div className="scrollodex-card scrollodex-card-entrance hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl sm:text-2xl font-bold">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Contact Number and Dynamic Indicator */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm scrollodex-text-light-gray font-mono">
              #{String(contact._id).slice(-3).padStart(3, '0')}
            </span>
            {contact.isDynamicContact && (<div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                <Wifi className="w-3 h-3"/>
                <span>Live</span>
              </div>)}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base sm:text-lg font-semibold scrollodex-text-dark text-center mb-2 sm:mb-3">{contact.name}</h3>

        {/* Tags */}
        {contact.tags.length > 0 && (<div className="flex flex-wrap justify-center gap-2 mb-4">
            {contact.tags.slice(0, 2).map((tag) => (<span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                {tag}
              </span>))}
            {contact.tags.length > 2 && (<span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                +{contact.tags.length - 2}
              </span>)}
          </div>)}

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm scrollodex-text-gray">
          {contact.company && (<div className="flex items-center gap-2">
              <Building className="w-4 h-4"/>
              <span>{contact.company}</span>
            </div>)}
          
          {contact.emails.length > 0 && (<div className="flex items-center gap-2">
              <Mail className="w-4 h-4"/>
              <span>{contact.emails[0]}</span>
            </div>)}
          
          {contact.phones.length > 0 && (<div className="flex items-center gap-2">
              <Phone className="w-4 h-4"/>
              <span>{contact.phones[0]}</span>
            </div>)}
        </div>

        {/* Last Interaction */}
        <div className="text-xs scrollodex-text-light-gray text-center mb-4">
          Last seen: {formatLastInteraction(contact.lastInteractionAt)}
        </div>

        {/* Pin Button */}
        <div className="flex justify-center mb-4">
          <button onClick={handlePin} className={`p-2 rounded-full transition-colors ${isPinned
            ? 'text-yellow-500 bg-yellow-50'
            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}>
            <Star className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`}/>
          </button>
        </div>

        {/* View Button */}
        <button onClick={() => onView(contact._id)} className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>

      {/* Accent Bar */}
      <div className={`h-1 ${getAccentColor(contact.name)}`}></div>
    </div>);
}
//# sourceMappingURL=ContactCard.js.map