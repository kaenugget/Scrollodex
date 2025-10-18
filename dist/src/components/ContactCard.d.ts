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
export declare function ContactCard({ contact, onPin, onView }: ContactCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ContactCard.d.ts.map