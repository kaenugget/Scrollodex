"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePreferences(contactId: Id<"contacts">, enabled: boolean = true) {
  const preferences = useQuery(
    api.preferences.getPreferences,
    enabled ? { contactId } : "skip"
  );

  const isLoading = preferences === undefined;
  
  return {
    preferences,
    isLoading,
  };
}
