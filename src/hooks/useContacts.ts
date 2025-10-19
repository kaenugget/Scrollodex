import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useContacts(ownerId: Id<"users">, enabled: boolean = true) {
  // Skip the query if disabled or if ownerId is invalid
  const shouldSkip = !enabled || !ownerId || ownerId === "demo";
  const contacts = useQuery(api.contacts.list, shouldSkip ? "skip" : { ownerId });
  const pinContact = useMutation(api.contacts.pin);
  const bumpContact = useMutation(api.contacts.bump);

  const handlePin = (contactId: Id<"contacts">, pinned: boolean) => {
    pinContact({ contactId, pinned });
  };

  const handleBump = (contactId: Id<"contacts">) => {
    bumpContact({ contactId });
  };

  return {
    contacts: contacts || [],
    pinContact: handlePin,
    bumpContact: handleBump,
    isLoading: contacts === undefined,
  };
}
