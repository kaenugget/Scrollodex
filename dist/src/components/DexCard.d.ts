import React from 'react';
interface DexEntry {
    _id: string;
    dexNumber: number;
    types: string[];
    level: number;
    xp: number;
    updatedAt: number;
}
interface Contact {
    _id: string;
    name: string;
    tags: string[];
}
interface DexCardProps {
    dexEntry: DexEntry;
    contact: Contact;
    onView: (contactId: string) => void;
}
export declare function DexCard({ dexEntry, contact, onView }: DexCardProps): React.JSX.Element;
export declare const DexCardSkeleton: React.FC;
export {};
//# sourceMappingURL=DexCard.d.ts.map