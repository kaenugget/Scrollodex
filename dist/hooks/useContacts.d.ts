import { Id } from "../../convex/_generated/dataModel";
export declare function useContacts(ownerId: Id<"users">, enabled?: boolean): {
    contacts: any;
    pinContact: (contactId: Id<"contacts">, pinned: boolean) => void;
    bumpContact: (contactId: Id<"contacts">) => void;
    isLoading: boolean;
};
//# sourceMappingURL=useContacts.d.ts.map