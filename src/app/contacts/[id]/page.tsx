"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { ContactDetailView } from '@/components/ContactDetailView';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { useContacts } from '@/hooks/useContacts';
import { useDexEntries } from '@/hooks/useDex';
import { Id } from "../../../../convex/_generated/dataModel";

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "actions" | "preferences" | "moments">("overview");
  
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  
  const isUserAuthenticated = isAuthenticated;
  const currentUser = user;
  
  // Only use hooks when we have a valid Convex user ID (same logic as main page)
  const hasValidConvexUserId = currentUser?._id && typeof currentUser._id === 'string' && currentUser._id !== 'demo';
  
  // Use a dummy ID when we don't have a valid user ID, but disable the queries
  const dummyUserId = "demo" as Id<"users">;
  
  // Only load data if we have a valid user
  const { contacts, isLoading: contactsLoading } = useContacts(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : dummyUserId, 
    !!(isUserAuthenticated && hasValidConvexUserId)
  );
  const { dexEntries, isLoading: dexLoading } = useDexEntries(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : dummyUserId, 
    !!(isUserAuthenticated && hasValidConvexUserId)
  );

  const handleSignOut = () => {
    signOut();
  };

  if (authLoading || contactsLoading || dexLoading) {
    console.log('Loading states:', { authLoading, contactsLoading, dexLoading });
    return <LoadingSpinner fullScreen text="Loading contact details..." />;
  }

  if (!isUserAuthenticated || !hasValidConvexUserId) {
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
          contacts={contacts}
          dexEntries={dexEntries}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </main>
  );
}
