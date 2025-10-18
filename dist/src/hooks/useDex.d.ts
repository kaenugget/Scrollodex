import { Id } from "../../convex/_generated/dataModel";
export declare function useDexEntries(ownerId: Id<"users">, enabled?: boolean): {
    dexEntries: any;
    updateXp: (contactId: Id<"contacts">, xpDelta: number, reason: string) => void;
    computeEntry: (contactId: Id<"contacts">) => void;
    isLoading: boolean;
};
//# sourceMappingURL=useDex.d.ts.map