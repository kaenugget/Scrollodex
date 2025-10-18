"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useDynamicContactSync(userId: Id<"users"> | null) {
  const syncAllDynamicContacts = useMutation(api.contacts.syncAllDynamicContacts);
  const dynamicContactsNeedingSync = useQuery(
    api.contacts.getDynamicContactsNeedingSync,
    userId ? { ownerId: userId } : "skip"
  );

  useEffect(() => {
    if (userId && dynamicContactsNeedingSync && dynamicContactsNeedingSync.length > 0) {
      // Auto-sync dynamic contacts every 5 minutes
      const interval = setInterval(async () => {
        try {
          await syncAllDynamicContacts({ ownerId: userId });
        } catch (error) {
          console.error('Error syncing dynamic contacts:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [userId, dynamicContactsNeedingSync, syncAllDynamicContacts]);

  return {
    needsSync: dynamicContactsNeedingSync?.length || 0,
    syncAll: () => userId ? syncAllDynamicContacts({ ownerId: userId }) : Promise.resolve(),
  };
}
