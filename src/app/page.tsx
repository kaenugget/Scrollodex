"use client";

import { ContactCard } from "@/components/ContactCard";
import { DexCard } from "@/components/DexCard";
import { SeedDataButton } from "@/components/SeedDataButton";
import { LoginForm, SignUpForm } from "@/components/AuthForms";
import { ClerkAuth, ClerkSignUp } from "@/components/ClerkAuth";
import { AppHeader } from "@/components/AppHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useContacts } from "@/hooks/useContacts";
import { useDexEntries } from "@/hooks/useDex";
import { useAuth } from "@/hooks/useAuth";
import { useClerkConvexUser } from "@/hooks/useClerkConvexUser";
import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"contacts" | "dex">("contacts");
  const [showAuth, setShowAuth] = useState<"login" | "signup" | "clerk-login" | "clerk-signup" | null>(null);
  const { isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  
  // Use Clerk authentication if available, otherwise fall back to custom auth
  const isUserAuthenticated = isSignedIn || isAuthenticated;
  const currentUser = convexUser || user;

  // Mutations for creating peer pages and demo user
  const createPeerPage = useMutation(api.social.createPeerPage);
  const getOrCreateDemoUser = useMutation(api.users.getOrCreateDemoUser);
  
  // Only use hooks when we have a valid Convex user ID
  const hasValidConvexUserId = currentUser?._id && typeof currentUser._id === 'string' && currentUser._id !== 'demo';
  
  // Use a dummy ID when we don't have a valid user ID, but disable the queries
  const dummyUserId = "demo" as Id<"users">;
  
  const { contacts, pinContact, isLoading: contactsLoading } = useContacts(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : dummyUserId, 
    !!(isUserAuthenticated && hasValidConvexUserId)
  );
  const { dexEntries, isLoading: dexLoading } = useDexEntries(
    hasValidConvexUserId ? (currentUser._id as Id<"users">) : dummyUserId, 
    !!(isUserAuthenticated && hasValidConvexUserId)
  );

  const handleContactView = (contactId: string) => {
    window.location.href = `/contacts/${contactId}`;
  };

  const handleAuthSuccess = () => {
    setShowAuth(null);
  };

  const createDemoPeerPage = async () => {
    if (!currentUser?._id) {
      alert('Please sign in first');
      return;
    }

    try {
      // Get or create a demo user
      const demoUserId = await getOrCreateDemoUser();
      
      // Create a peer page with the current user and demo user
      const peerPageId = await createPeerPage({
        aUserId: currentUser._id as Id<"users">,
        bUserId: demoUserId as Id<"users">,
        title: "Demo Peer Page",
        visibility: "private",
      });
      
      // Navigate to the peer page
      window.location.href = `/peer/${peerPageId}`;
    } catch (error) {
      console.error('Error creating peer page:', error);
      alert('Failed to create peer page. Please try again.');
    }
  };

  // Show loading while checking authentication
  if (authLoading || clerkConvexLoading) {
    return <LoadingSpinner fullScreen text="Loading Scrollodex..." />;
  }

  // Show auth forms if not authenticated
  if (!isUserAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Scrollodex
              </h1>
              <p className="text-lg text-gray-600">Your Personal Index of Amazing Contacts</p>
            </div>
            <p className="text-gray-500">
              Build meaningful connections and manage your network
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
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In (with Google, GitHub, etc.)
                </button>
                <button
                  onClick={() => setShowAuth("clerk-signup")}
                  className="w-full px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create Account (with Google, GitHub, etc.)
                </button>
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">or use email/password</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAuth("login")}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sign In with Email
                </button>
                <button
                  onClick={() => setShowAuth("signup")}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Account with Email
                </button>
              </div>

              {/* Features Preview */}
              <div className="mt-12 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
                  What you&apos;ll get:
                </h3>
                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Clean contact management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Social features & memory sharing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>AI-powered relationship insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Beautiful modern interface</span>
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
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 mx-auto"
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

  const handleSignOut = async () => {
    if (isSignedIn) {
      // Clerk sign out
      await clerkSignOut();
    } else {
      signOut();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader 
        currentPage={activeTab === 'dex' ? 'dex' : 'home'} 
        onNavigate={(page) => {
          if (page === 'dex') {
            setActiveTab('dex');
          }
        }}
        user={currentUser || undefined}
        onSignOut={handleSignOut}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Content */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Contacts</h2>
                <p className="text-gray-600 mt-1">Manage your personal network</p>
              </div>
              <div className="flex gap-3">
                {currentUser && (
                  <Button
                    onClick={createDemoPeerPage}
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Demo Peer Page
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
              <div className="text-center text-gray-500 py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">No contacts yet</p>
                <p className="mb-6">Add your first contact to start building your network!</p>
                {currentUser && <SeedDataButton userId={currentUser._id as Id<"users">} />}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Your Dex</h2>
              <p className="text-gray-600 mt-1">Track your relationship progress</p>
            </div>
            {dexLoading ? (
              <LoadingSpinner text="Loading dex entries..." />
            ) : dexEntries.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No dex entries yet</p>
                <p>Interact with contacts to generate dex entries!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
