"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
export function useActions(contactId, enabled = true) {
    const actions = useQuery(api.actions.getActions, enabled ? { contactId } : "skip");
    const isLoading = actions === undefined;
    return {
        actions: actions || [],
        isLoading,
    };
}
//# sourceMappingURL=useActions.js.map