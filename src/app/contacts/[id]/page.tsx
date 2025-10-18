"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { ContactDetailView } from '@/components/ContactDetailView';
import { useAuth } from '@/hooks/useAuth';
import { useClerkConvexUser } from '@/hooks/useClerkConvexUser';
import { useUser } from '@clerk/nextjs';

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "actions" | "preferences">("overview");
  
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
          <div className="text-neutral-400">Loading contact details</div>
        </div>
      </main>
    );
  }

  if (!isUserAuthenticated || !currentUser) {
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-2xl mb-4 text-emerald-400">Access Denied</div>
          <div className="text-neutral-400">Please sign in to view contact details</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-200">
      <AppHeader 
        currentPage="contacts" 
        onNavigate={(page) => {
          if (page === 'contacts' || page === 'dex') {
            window.location.href = '/';
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <div className="container mx-auto px-4 py-8">
        <ContactDetailView 
          contactId={contactId}
          userId={currentUser._id}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </main>
  );
}
