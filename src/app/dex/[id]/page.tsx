"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { DexDetailView } from '@/components/DexDetailView';
import { useAuth } from '@/hooks/useAuth';
import { useClerkConvexUser } from '@/hooks/useClerkConvexUser';
import { useUser } from '@clerk/nextjs';

export default function DexDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  const { user: clerkUser, isSignedIn } = useUser();
  
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
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-2xl mb-4 text-emerald-400">Loading...</div>
          <div className="text-neutral-400">Loading dex entry</div>
        </div>
      </main>
    );
  }

  if (!isUserAuthenticated || !currentUser) {
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-2xl mb-4 text-emerald-400">Access Denied</div>
          <div className="text-neutral-400">Please sign in to view dex entries</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-200">
      <AppHeader 
        currentPage="dex" 
        onNavigate={(page) => {
          if (page === 'contacts' || page === 'dex') {
            window.location.href = '/';
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <div className="container mx-auto px-4 py-8">
        <DexDetailView 
          contactId={contactId}
          userId={currentUser._id}
        />
      </div>
    </main>
  );
}
