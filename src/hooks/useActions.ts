"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useActions(contactId: Id<"contacts">, enabled: boolean = true) {
  const actions = useQuery(
    api.actions.getActions,
    enabled ? { contactId } : "skip"
  );

  const isLoading = actions === undefined;
  
  return {
    actions: actions || [],
    isLoading,
  };
}
