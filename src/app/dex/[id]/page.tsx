"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { DexDetailView } from '@/components/DexDetailView';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { useClerkConvexUser } from '@/hooks/useClerkConvexUser';
import { useUser } from '@clerk/nextjs';
import { Id } from "../../../../convex/_generated/dataModel";

export default function DexDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  const { isSignedIn } = useUser();
  
  const isUserAuthenticated = isSignedIn || isAuthenticated;
  const currentUser = convexUser || user;

  const handleSignOut = () => {
    if (isSignedIn) {
      window.location.href = '/';
    } else {
      // Handle custom auth sign out
    }
  };

  if (authLoading || clerkConvexLoading) {
    return <LoadingSpinner fullScreen text="Loading dex entry..." />;
  }

  if (!isUserAuthenticated || !currentUser) {
    return <LoadingSpinner fullScreen text="Redirecting to login..." />;
  }

  return (
    <main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader 
        currentPage="dex" 
        onNavigate={(page) => {
          if (page === 'contacts' || page === 'dex' || page === 'home') {
            window.location.href = '/';
          } else if (page === 'settings') {
            window.location.href = '/settings';
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <DexDetailView 
          contactId={contactId}
          userId={currentUser._id as Id<"users">}
        />
      </div>
    </main>
  );
}
