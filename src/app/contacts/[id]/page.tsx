"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { ContactDetailView } from '@/components/ContactDetailView';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { useClerkConvexUser } from '@/hooks/useClerkConvexUser';
import { useUser } from '@clerk/nextjs';
import { useContacts } from '@/hooks/useContacts';
import { useDexEntries } from '@/hooks/useDex';
import { Id } from "../../../../convex/_generated/dataModel";

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "actions" | "preferences" | "moments">("overview");
  
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  const { isSignedIn } = useUser();
  
  const isUserAuthenticated = isSignedIn || isAuthenticated;
  const currentUser = convexUser || user;
  
  // Only load data if we have a user
  const { contacts, isLoading: contactsLoading } = useContacts(
    currentUser?._id as Id<"users">, 
    !!currentUser
  );
  const { dexEntries, isLoading: dexLoading } = useDexEntries(
    currentUser?._id as Id<"users">, 
    !!currentUser
  );

  const handleSignOut = () => {
    if (isSignedIn) {
      window.location.href = '/';
    } else {
      // Handle custom auth sign out
    }
  };

  if (authLoading || clerkConvexLoading || contactsLoading || dexLoading) {
    console.log('Loading states:', { authLoading, clerkConvexLoading, contactsLoading, dexLoading });
    return <LoadingSpinner fullScreen text="Loading contact details..." />;
  }

  if (!isUserAuthenticated || !currentUser) {
    return <LoadingSpinner fullScreen text="Redirecting to login..." />;
  }

  return (
    <main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader 
        currentPage="home" 
        onNavigate={(page) => {
          if (page === 'dex') {
            window.location.href = '/';
          } else if (page === 'settings') {
            window.location.href = '/settings';
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ContactDetailView 
          contactId={contactId}
          userId={currentUser._id as Id<"users">}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </main>
  );
}
