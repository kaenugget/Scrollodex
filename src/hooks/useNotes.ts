"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useNotes(contactId: Id<"contacts">, enabled: boolean = true) {
  const notes = useQuery(
    api.notes.listNotes,
    enabled ? { contactId } : "skip"
  );

  const isLoading = notes === undefined;
  
  return {
    notes: notes || [],
    isLoading,
  };
}
