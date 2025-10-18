import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
export function useDexEntries(ownerId, enabled = true) {
    // Skip the query if disabled or if ownerId is invalid
    const shouldSkip = !enabled || !ownerId || ownerId === "demo";
    const dexEntries = useQuery(api.dex.list, shouldSkip ? "skip" : { ownerId });
    const updateXp = useMutation(api.dex.updateXp);
    const computeEntry = useMutation(api.dex.computeEntry);
    const handleUpdateXp = (contactId, xpDelta, reason) => {
        updateXp({ contactId, xpDelta, reason });
    };
    const handleComputeEntry = (contactId) => {
        computeEntry({ contactId });
    };
    return {
        dexEntries: dexEntries || [],
        updateXp: handleUpdateXp,
        computeEntry: handleComputeEntry,
        isLoading: dexEntries === undefined,
    };
}
//# sourceMappingURL=useDex.js.map