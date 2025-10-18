import React, { useState } from 'react';
import { useContacts } from '../lib/hooksSocial';
import { PIXEL_BORDER_INSET_CLASSES, PIXEL_BORDER_CLASSES } from '../lib/utils';
import { SearchIcon, BriefcaseIcon, PinIcon, CalendarIcon } from '../components/Icons';
import { formatRelativeDate } from '../lib/date';
import { Contact } from '../lib/types';

interface ContactRowProps {
    contact: Contact;
    onSelect: (id: string) => void;
}

const ContactRow: React.FC<ContactRowProps> = ({ contact, onSelect }) => {
    const Pfp = contact.pfp;
    return (
        <div className={`grid grid-cols-12 gap-4 items-center p-3 bg-neutral-800/60 hover:bg-neutral-800 transition-colors duration-150 ${PIXEL_BORDER_CLASSES}`}>
            <div className="col-span-1">
                <div className={`w-12 h-12 ${PIXEL_BORDER_CLASSES} bg-neutral-900 p-1`}>
                    <Pfp className="w-full h-full" />
                </div>
            </div>
            <div className="col-span-3">
                <h3 className="font-bold text-base text-neutral-100">{contact.name}</h3>
                <p className="text-xs text-neutral-400">{contact.role} @ {contact.company}</p>
            </div>
            <div className="col-span-3 flex flex-wrap gap-1">
                {contact.tags.map(tag => (
                    <span key={tag.id} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded">{tag.label}</span>
                ))}
            </div>
            <div className="col-span-2 text-sm text-neutral-300 flex items-center gap-2">
                <CalendarIcon className="text-neutral-500"/>
                <span>{formatRelativeDate(contact.lastInteractionAt)}</span>
            </div>
            <div className="col-span-3 flex justify-end gap-2">
                <button onClick={() => onSelect(contact.id)} className={`font-pixel text-xs px-3 py-2 bg-emerald-500 text-neutral-900 ${PIXEL_BORDER_CLASSES} hover:bg-emerald-400`}>Open</button>
                <button className={`font-pixel text-xs px-3 py-2 bg-sky-500 text-neutral-900 ${PIXEL_BORDER_CLASSES} hover:bg-sky-400`}>Brief</button>
            </div>
        </div>
    );
};

const ContactRowSkeleton: React.FC = () => (
    <div className={`grid grid-cols-12 gap-4 items-center p-3 bg-neutral-800/60 ${PIXEL_BORDER_CLASSES} animate-pulse`}>
        <div className="col-span-1"><div className="w-12 h-12 bg-neutral-700"></div></div>
        <div className="col-span-3 space-y-2">
            <div className="h-5 w-3/4 bg-neutral-700 rounded"></div>
            <div className="h-3 w-full bg-neutral-700 rounded"></div>
        </div>
        <div className="col-span-3 flex gap-1">
            <div className="h-5 w-12 bg-neutral-700 rounded"></div>
            <div className="h-5 w-12 bg-neutral-700 rounded"></div>
        </div>
        <div className="col-span-2 h-4 w-3/4 bg-neutral-700 rounded"></div>
        <div className="col-span-3 flex justify-end gap-2">
            <div className="h-9 w-16 bg-neutral-700"></div>
            <div className="h-9 w-16 bg-neutral-700"></div>
        </div>
    </div>
);

const ContactsIndexView: React.FC<{ onSelectContact: (id: string) => void }> = ({ onSelectContact }) => {
    const [filters, setFilters] = useState({ search: '' });
    const { loading, contacts } = useContacts(filters);

    return (
        <div>
            <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className={`w-full bg-neutral-800 text-neutral-200 placeholder-neutral-500 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${PIXEL_BORDER_INSET_CLASSES}`}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            </div>

            <div className="space-y-3">
                {loading && [...Array(4)].map((_, i) => <ContactRowSkeleton key={i} />)}
                {!loading && contacts.map(contact => (
                    <ContactRow key={contact.id} contact={contact} onSelect={onSelectContact} />
                ))}
                {!loading && contacts.length === 0 && (
                     <div className="text-center py-20">
                        <h2 className="font-pixel text-xl text-neutral-500">No contacts found!</h2>
                        <p className="text-neutral-600 mt-2">Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactsIndexView;
