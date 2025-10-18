import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useClerkConvexUser() {
  const { user: clerkUser, isSignedIn, isLoaded: clerkLoaded } = useUser();
  const [convexUser, setConvexUser] = useState<{ _id: string; displayName?: string; avatarUrl?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createOrFindUser = useMutation(api.clerk.createOrFindUser);
  const getUserByClerkId = useQuery(
    api.clerk.getUserByClerkId,
    clerkUser?.id ? { clerkUserId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    const handleClerkUser = async () => {
      // Wait for Clerk to load first
      if (!clerkLoaded) {
        return;
      }

      if (!isSignedIn || !clerkUser) {
        setConvexUser(null);
        setIsLoading(false);
        return;
      }

      // If we already have a Convex user, use it
      if (getUserByClerkId) {
        setConvexUser(getUserByClerkId);
        setIsLoading(false);
        return;
      }

      // Create or find a Convex user for this Clerk user
      try {
        const user = await createOrFindUser({
          clerkUserId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          displayName: clerkUser.fullName || clerkUser.firstName || 'User',
          avatarUrl: clerkUser.imageUrl,
        });
        setConvexUser(user);
      } catch (error) {
        console.error('Failed to create/find Convex user:', error);
        setConvexUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    handleClerkUser();
  }, [isSignedIn, clerkUser, getUserByClerkId, createOrFindUser, clerkLoaded]);

  return {
    convexUser,
    isLoading,
    isSignedIn,
  };
}
