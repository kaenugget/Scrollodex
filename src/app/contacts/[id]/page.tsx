"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  // Show loading while authentication is being checked
  if (authLoading) {
    return <LoadingSpinner fullScreen text="Loading contact details..." />;
  }

  // If we have a token but no user yet, wait for the user query to resolve
  if (!isUserAuthenticated && currentUser === undefined) {
    return <LoadingSpinner fullScreen text="Authenticating..." />;
  }

  // Only redirect if we're definitively not authenticated (no token or user query failed)
  if (!isUserAuthenticated && currentUser === null) {
    router.push('/');
    return <LoadingSpinner fullScreen text="Redirecting..." />;
  }

  // Show loading for data while authenticated
  if (contactsLoading || dexLoading) {
    return <LoadingSpinner fullScreen text="Loading contact details..." />;
  }

  return (
    <main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader 
        currentPage="home" 
        onNavigate={(page) => {
          if (page === 'dex') {
            router.push('/');
          } else if (page === 'settings') {
            router.push('/settings');
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <ContactDetailView 
        contactId={contactId}
        userId={currentUser._id as Id<"users">}
        contacts={contacts}
        dexEntries={dexEntries}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </main>
  );
}
