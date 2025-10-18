import React from 'react';
import { useContact } from '../lib/hooksSocial';
// Fix: Imported the missing 'UsersIcon' component.
import { BackIcon, BriefcaseIcon, CalendarIcon, NoteIcon, PlusIcon, SquareIcon, CheckSquareIcon, UsersIcon } from '../components/Icons';
import { PIXEL_BORDER_CLASSES, PIXEL_BORDER_INSET_CLASSES } from '../lib/utils';
import { formatDate, formatRelativeDate } from '../lib/date';
import { ActionItem, Note } from '../lib/types';
import { PixelFrame } from '../components/PixelFrame';

const QuickActionsBar: React.FC = () => {
    // TODO: wire up actions
    const actions = [
        { label: 'Start Meeting', icon: CalendarIcon },
        { label: 'Add Note', icon: NoteIcon },
        { label: 'Create Card', icon: UsersIcon },
    ];
    return (
        <div className={`flex items-center justify-center gap-2 bg-neutral-800 p-2 ${PIXEL_BORDER_CLASSES} mb-8`}>
            {actions.map(action => (
                <button key={action.label} className={`flex-1 flex items-center justify-center gap-2 font-pixel text-xs px-3 py-2 bg-neutral-700 text-neutral-200 ${PIXEL_BORDER_CLASSES} hover:bg-neutral-600`}>
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                </button>
            ))}
        </div>
    );
};

const NoteCard: React.FC<{ note: Note }> = ({ note }) => (
    <div className={`bg-neutral-800/50 p-3 ${PIXEL_BORDER_INSET_CLASSES}`}>
        <p className="text-sm text-neutral-300 whitespace-pre-wrap">{note.content}</p>
        <p className="text-right text-xs text-neutral-500 mt-2">{formatRelativeDate(note.createdAt)}</p>
    </div>
);

const ActionItemRow: React.FC<{ item: ActionItem }> = ({ item }) => (
    <div className="flex items-center gap-3">
        <button>
            {item.completed ? <CheckSquareIcon className="text-emerald-400" /> : <SquareIcon className="text-neutral-500" />}
        </button>
        <span className={`flex-grow text-sm ${item.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>{item.content}</span>
        {item.dueDate && <span className="text-xs text-neutral-400">{formatDate(item.dueDate, { month: 'short', day: 'numeric' })}</span>}
    </div>
);


const Section: React.FC<{ title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, children, actions }) => (
  <div className={`bg-neutral-800 p-4 ${PIXEL_BORDER_CLASSES}`}>
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-pixel text-base text-emerald-400">{title}</h3>
        {actions}
    </div>
    <div className="space-y-3">
        {children}
    </div>
  </div>
);

const ContactDetailView: React.FC<{ contactId: string; onBack: () => void }> = ({ contactId, onBack }) => {
    const { loading, contact } = useContact(contactId);

    if (loading) return <div className="text-center font-pixel">Loading...</div>;
    if (!contact) return <div className="text-center font-pixel">Contact not found.</div>;

    const Pfp = contact.pfp;

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={onBack} className={`mb-6 inline-flex items-center gap-2 font-pixel text-sm text-neutral-400 hover:text-emerald-400 transition-colors ${PIXEL_BORDER_CLASSES} bg-neutral-800 px-4 py-2`}>
                <BackIcon className="w-4 h-4" />
                Back to Contacts
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center text-center">
                    <PixelFrame padding="p-2" className="w-48 h-48">
                        <div className="bg-neutral-900 aspect-square p-2">
                             <Pfp className="w-full h-full" />
                        </div>
                    </PixelFrame>
                    <h1 className="font-pixel text-3xl text-neutral-100 mt-4">{contact.name}</h1>
                    <p className="text-neutral-400">{contact.role}</p>
                    <p className="text-neutral-500 flex items-center gap-2 mt-1"><BriefcaseIcon /> {contact.company}</p>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    <QuickActionsBar />

                    <Section 
                        title="Notes" 
                        actions={<button className={`font-pixel text-xs px-2 py-1 bg-neutral-700 text-neutral-200 ${PIXEL_BORDER_CLASSES} hover:bg-neutral-600`}><PlusIcon className="inline -mt-0.5"/> Add</button>}
                    >
                       {contact.notes.map(note => <NoteCard key={note.id} note={note} />)}
                    </Section>

                     <Section 
                        title="Follow-ups"
                        actions={<button className={`font-pixel text-xs px-2 py-1 bg-neutral-700 text-neutral-200 ${PIXEL_BORDER_CLASSES} hover:bg-neutral-600`}><PlusIcon className="inline -mt-0.5"/> Add</button>}
                    >
                       {contact.actions.map(item => <ActionItemRow key={item.id} item={item} />)}
                    </Section>

                     <Section title="Preferences">
                        <div className="flex flex-wrap gap-2">
                            {[...contact.preferences.food, ...contact.preferences.music, ...contact.preferences.hobbies].map(pref => (
                                <div key={pref} className="bg-neutral-700 text-neutral-300 text-sm px-3 py-1 rounded-full">{pref}</div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailView;