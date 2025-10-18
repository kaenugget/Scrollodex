"use client";

import { ContactCard } from "@/components/ContactCard";
import { SeedDataButton } from "@/components/SeedDataButton";
import { LoginForm, SignUpForm } from "@/components/AuthForms";
import { ClerkAuth, ClerkSignUp } from "@/components/ClerkAuth";
import { AppHeader } from "@/components/AppHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SignupLandingPage } from "@/components/SignupLandingPage";
import { useContacts } from "@/hooks/useContacts";
import { useAuth } from "@/hooks/useAuth";
// import { useClerkConvexUser } from "@/hooks/useClerkConvexUser";
import { useDynamicContactSync } from "@/hooks/useDynamicContactSync";
// import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Users, Wifi } from "lucide-react";

export default function Home() {
  // Removed dex tab - focusing on core contact management
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null);
  // const { isSignedIn } = useUser();
  // const { signOut: clerkSignOut } = useClerk();
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  // const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  
  // Use custom auth only for now due to React 19 compatibility issues with Clerk
  const isUserAuthenticated = isAuthenticated;
  const currentUser = user;

  
  // Only use hooks when we have a valid Convex user ID
  const hasValidConvexUserId = currentUser?._id && typeof currentUser._id === 'string' && currentUser._id !== 'demo';
  
  // Use a dummy ID when we don't have a valid user ID, but disable the queries
  const dummyUserId = "demo" as Id<"users">;
  
  const { contacts, pinContact, isLoading: contactsLoading } = useContacts(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : dummyUserId, 
    !!(isUserAuthenticated && hasValidConvexUserId)
  );

  // Dynamic contact sync
  const { needsSync, syncAll } = useDynamicContactSync(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : null
  );

  const handleContactView = (contactId: string) => {
    window.location.href = `/contacts/${contactId}`;
  };

  const handleAuthSuccess = () => {
    setShowAuth(null);
  };


  // Show loading while checking authentication
  if (authLoading) {
    return <LoadingSpinner fullScreen text="Loading Scrollodex..." />;
  }

  // Show auth forms if not authenticated
  if (!isUserAuthenticated) {
    console.log('User not authenticated, showing landing page');
    return <SignupLandingPage />;
  }

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader 
        currentPage="home" 
        onNavigate={() => {}} // No navigation needed since Dex menu is removed
        user={currentUser || undefined}
        onSignOut={handleSignOut}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Content */}
        {(
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold scrollodex-text-white-bold scrollodex-text-animate">Your Contacts</h2>
                <p className="scrollodex-text-white mt-1">Manage your personal network</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {needsSync > 0 && (
                  <Button
                    onClick={syncAll}
                    variant="outline"
                    size="sm"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sync {needsSync} Contacts</span>
                    <span className="sm:hidden">Sync {needsSync}</span>
                  </Button>
                )}
                {contacts.length === 0 && currentUser && (
                  <SeedDataButton userId={currentUser._id as Id<"users">} />
                )}
              </div>
            </div>
            {contactsLoading ? (
              <LoadingSpinner text="Loading contacts..." />
            ) : contacts.length === 0 ? (
              <div className="scrollodex-card scrollodex-card-entrance text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2 scrollodex-text-dark">No contacts yet</p>
                <p className="mb-6 scrollodex-text-gray">Add your first contact to start building your network!</p>
                {currentUser && <SeedDataButton userId={currentUser._id as Id<"users">} />}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {contacts.map((contact: any) => (
                  <ContactCard
                    key={contact._id}
                    contact={contact}
                    onPin={pinContact}
                    onView={handleContactView}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
