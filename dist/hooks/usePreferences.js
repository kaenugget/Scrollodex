"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
export function usePreferences(contactId, enabled = true) {
    const preferences = useQuery(api.preferences.getPreferences, enabled ? { contactId } : "skip");
    const isLoading = preferences === undefined;
    return {
        preferences,
        isLoading,
    };
}
//# sourceMappingURL=usePreferences.js.map