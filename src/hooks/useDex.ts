import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useDexEntries(ownerId: Id<"users">, enabled: boolean = true) {
  // Skip the query if disabled or if ownerId is invalid
  const shouldSkip = !enabled || !ownerId || ownerId === "demo";
  const dexEntries = useQuery(api.dex.list, shouldSkip ? "skip" : { ownerId });
  const updateXp = useMutation(api.dex.updateXp);
  const computeEntry = useMutation(api.dex.computeEntry);

  const handleUpdateXp = (contactId: Id<"contacts">, xpDelta: number, reason: string) => {
    updateXp({ contactId, xpDelta, reason });
  };

  const handleComputeEntry = (contactId: Id<"contacts">) => {
    computeEntry({ contactId });
  };

  return {
    dexEntries: dexEntries || [],
    updateXp: handleUpdateXp,
    computeEntry: handleComputeEntry,
    isLoading: dexEntries === undefined,
  };
}
