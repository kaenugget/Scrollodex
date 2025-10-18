"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
export function useNotes(contactId, enabled = true) {
    const notes = useQuery(api.notes.getNotes, enabled ? { contactId } : "skip");
    const isLoading = notes === undefined;
    return {
        notes: notes || [],
        isLoading,
    };
}
//# sourceMappingURL=useNotes.js.map