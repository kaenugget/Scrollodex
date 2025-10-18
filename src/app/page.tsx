"use client";

import { ContactCard } from "@/components/ContactCard";
import { DexCard } from "@/components/DexCard";
import { SeedDataButton } from "@/components/SeedDataButton";
import { LoginForm, SignUpForm } from "@/components/AuthForms";
import { ClerkAuth, ClerkSignUp } from "@/components/ClerkAuth";
import { AppHeader } from "@/components/AppHeader";
import { useContacts } from "@/hooks/useContacts";
import { useDexEntries } from "@/hooks/useDex";
import { useAuth } from "@/hooks/useAuth";
import { useClerkConvexUser } from "@/hooks/useClerkConvexUser";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"contacts" | "dex">("contacts");
  const [showAuth, setShowAuth] = useState<"login" | "signup" | "clerk-login" | "clerk-signup" | null>(null);
  const { user: clerkUser, isSignedIn } = useUser();
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  
  // Use Clerk authentication if available, otherwise fall back to custom auth
  const isUserAuthenticated = isSignedIn || isAuthenticated;
  const currentUser = convexUser || user;
  
  // Only use hooks when we have a valid Convex user ID
  const hasValidConvexUserId = currentUser?._id && typeof currentUser._id === 'string' && currentUser._id !== 'demo';
  
  // Use a dummy ID when we don't have a valid user ID, but disable the queries
  const dummyUserId = "demo" as any;
  
  const { contacts, pinContact, isLoading: contactsLoading } = useContacts(
    hasValidConvexUserId ? (currentUser._id as any) : dummyUserId, 
    isUserAuthenticated && hasValidConvexUserId
  );
  const { dexEntries, isLoading: dexLoading } = useDexEntries(
    hasValidConvexUserId ? (currentUser._id as any) : dummyUserId, 
    isUserAuthenticated && hasValidConvexUserId
  );

  const handleContactView = (contactId: string) => {
    window.location.href = `/contacts/${contactId}`;
  };

  const handleAuthSuccess = () => {
    setShowAuth(null);
  };

  // Show loading while checking authentication
  if (authLoading || clerkConvexLoading) {
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-2xl mb-4 text-emerald-400">Loading...</div>
          <div className="text-neutral-400">Checking authentication</div>
        </div>
      </main>
    );
  }

  // Show auth forms if not authenticated
  if (!isUserAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-6xl font-pixel mb-4 glow text-emerald-400">
                Scrollodex
              </h1>
              <div className="w-16 h-1 bg-emerald-400 mx-auto"></div>
            </div>
            <p className="text-xl text-neutral-300 mb-2">
              Your pixel-art social contact manager
            </p>
            <p className="text-sm text-neutral-500">
              Gamify your relationships and build meaningful connections
            </p>
          </div>

          {/* Auth Forms */}
          {showAuth === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : showAuth === "signup" ? (
            <SignUpForm onSuccess={handleAuthSuccess} />
          ) : showAuth === "clerk-login" ? (
            <ClerkAuth onSuccess={handleAuthSuccess} />
          ) : showAuth === "clerk-signup" ? (
            <ClerkSignUp onSuccess={handleAuthSuccess} />
          ) : (
            <div className="space-y-6">
              {/* Quick Sign In Options */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowAuth("clerk-login")}
                  className="w-full px-8 py-4 bg-emerald-600 text-white font-pixel text-sm tracking-wider pixel-border-outset hover:bg-emerald-700 transition-all duration-300"
                >
                  Sign In (with Google, GitHub, etc.)
                </button>
                <button
                  onClick={() => setShowAuth("clerk-signup")}
                  className="w-full px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-pixel text-sm tracking-wider hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  Create Account (with Google, GitHub, etc.)
                </button>
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-900 text-neutral-400">or use email/password</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAuth("login")}
                  className="w-full px-8 py-3 bg-neutral-800 border border-neutral-600 text-neutral-300 font-pixel text-sm tracking-wider hover:bg-neutral-700 transition-all duration-300"
                >
                  Sign In with Email
                </button>
                <button
                  onClick={() => setShowAuth("signup")}
                  className="w-full px-8 py-3 border border-neutral-600 text-neutral-400 font-pixel text-sm tracking-wider hover:bg-neutral-800 transition-all duration-300"
                >
                  Create Account with Email
                </button>
              </div>

              {/* Features Preview */}
              <div className="mt-12 space-y-4">
                <h3 className="text-lg font-pixel text-neutral-300 text-center mb-6">
                  What you'll get:
                </h3>
                <div className="grid grid-cols-1 gap-4 text-sm text-neutral-400">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500"></div>
                    <span>Gamified contact management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500"></div>
                    <span>Social features & memory sharing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500"></div>
                    <span>AI-powered relationship insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500"></div>
                    <span>Beautiful pixel-art interface</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          {showAuth && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAuth(null)}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to options
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  const handleSignOut = () => {
    if (isSignedIn) {
      // Clerk sign out
      window.location.href = '/';
    } else {
      signOut();
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-200">
      <AppHeader 
        currentPage={activeTab} 
        onNavigate={(page) => setActiveTab(page as "contacts" | "dex")}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <div className="container mx-auto px-4 py-8">

        {/* Content */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-pixel text-emerald-400">Your Contacts</h2>
              {contacts.length === 0 && currentUser && (
                <SeedDataButton userId={currentUser._id} />
              )}
            </div>
            {contactsLoading ? (
              <div className="text-center text-neutral-500 font-pixel">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center text-neutral-500 space-y-4">
                <p>No contacts yet. Add your first contact to start building your dex!</p>
                {currentUser && <SeedDataButton userId={currentUser._id} />}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
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

        {activeTab === "dex" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-pixel text-emerald-400 mb-4">Your Dex</h2>
            {dexLoading ? (
              <div className="text-center text-neutral-500 font-pixel">Loading dex entries...</div>
            ) : dexEntries.length === 0 ? (
              <div className="text-center text-neutral-500">
                <p>No dex entries yet. Interact with contacts to generate dex entries!</p>
              </div>
            ) : (
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {dexEntries.map((dexEntry) => {
                  // Find the contact for this dex entry
                  const contact = contacts.find(c => c._id === dexEntry.contactId);
                  if (!contact) return null;
                  
                  return (
                    <DexCard
                      key={dexEntry._id}
                      dexEntry={dexEntry}
                      contact={contact}
                      onView={handleContactView}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
