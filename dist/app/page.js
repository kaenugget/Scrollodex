"use client";
import { ContactCard } from "@/components/ContactCard";
import { DexCard } from "@/components/DexCard";
import { SeedDataButton } from "@/components/SeedDataButton";
import { AppHeader } from "@/components/AppHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import AnimatedMemojiLanding from "@/components/AnimatedMemojiLanding";
import { useContacts } from "@/hooks/useContacts";
import { useDexEntries } from "@/hooks/useDex";
import { useAuth } from "@/hooks/useAuth";
import { useClerkConvexUser } from "@/hooks/useClerkConvexUser";
import { useDynamicContactSync } from "@/hooks/useDynamicContactSync";
import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Users, Wifi } from "lucide-react";
export default function Home() {
    const [activeTab, setActiveTab] = useState("contacts");
    const [showAuth, setShowAuth] = useState(null);
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
    const dummyUserId = "demo";
    const { contacts, pinContact, isLoading: contactsLoading } = useContacts(hasValidConvexUserId ? currentUser._id : dummyUserId, !!(isUserAuthenticated && hasValidConvexUserId));
    const { dexEntries, isLoading: dexLoading } = useDexEntries(hasValidConvexUserId ? currentUser._id : dummyUserId, !!(isUserAuthenticated && hasValidConvexUserId));
    // Dynamic contact sync
    const { needsSync, syncAll } = useDynamicContactSync(hasValidConvexUserId ? currentUser._id : null);
    const handleContactView = (contactId) => {
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
                aUserId: currentUser._id,
                bUserId: demoUserId,
                title: "Demo Peer Page",
                visibility: "private",
            });
            // Navigate to the peer page
            window.location.href = `/peer/${peerPageId}`;
        }
        catch (error) {
            console.error('Error creating peer page:', error);
            alert('Failed to create peer page. Please try again.');
        }
    };
    // Show loading while checking authentication
    if (authLoading || clerkConvexLoading) {
        return <LoadingSpinner fullScreen text="Loading Scrollodex..."/>;
    }
    // Show auth forms if not authenticated
    if (!isUserAuthenticated) {
        return <AnimatedMemojiLanding />;
    }
    const handleSignOut = async () => {
        if (isSignedIn) {
            // Clerk sign out
            await clerkSignOut();
        }
        else {
            signOut();
        }
    };
    return (<main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader currentPage={activeTab === 'dex' ? 'dex' : 'home'} onNavigate={(page) => {
            if (page === 'dex') {
                setActiveTab('dex');
            }
        }} user={currentUser || undefined} onSignOut={handleSignOut}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Content */}
        {activeTab === "contacts" && (<div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold scrollodex-text-white-bold scrollodex-text-animate">Your Contacts</h2>
                <p className="scrollodex-text-white mt-1">Manage your personal network</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {needsSync > 0 && (<Button onClick={syncAll} variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <Wifi className="w-4 h-4 mr-2"/>
                    <span className="hidden sm:inline">Sync {needsSync} Contacts</span>
                    <span className="sm:hidden">Sync {needsSync}</span>
                  </Button>)}
                {currentUser && (<Button onClick={createDemoPeerPage} variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Users className="w-4 h-4 mr-2"/>
                    <span className="hidden sm:inline">Demo Peer Page</span>
                    <span className="sm:hidden">Demo</span>
                  </Button>)}
                {contacts.length === 0 && currentUser && (<SeedDataButton userId={currentUser._id}/>)}
              </div>
            </div>
            {contactsLoading ? (<LoadingSpinner text="Loading contacts..."/>) : contacts.length === 0 ? (<div className="scrollodex-card scrollodex-card-entrance text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400"/>
                </div>
                <p className="text-lg font-medium mb-2 scrollodex-text-dark">No contacts yet</p>
                <p className="mb-6 scrollodex-text-gray">Add your first contact to start building your network!</p>
                {currentUser && <SeedDataButton userId={currentUser._id}/>}
              </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {contacts.map((contact) => (<ContactCard key={contact._id} contact={contact} onPin={pinContact} onView={handleContactView}/>))}
              </div>)}
          </div>)}

        {activeTab === "dex" && (<div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold scrollodex-text-white-bold">Your Dex</h2>
              <p className="scrollodex-text-white mt-1">Track your relationship progress</p>
            </div>
            {dexLoading ? (<LoadingSpinner text="Loading dex entries..."/>) : dexEntries.length === 0 ? (<div className="scrollodex-card text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2 scrollodex-text-dark">No dex entries yet</p>
                <p className="scrollodex-text-gray">Interact with contacts to generate dex entries!</p>
              </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {dexEntries.map((dexEntry) => {
                    // Find the contact for this dex entry
                    const contact = contacts.find(c => c._id === dexEntry.contactId);
                    if (!contact)
                        return null;
                    return (<DexCard key={dexEntry._id} dexEntry={dexEntry} contact={contact} onView={handleContactView}/>);
                })}
              </div>)}
          </div>)}
      </div>
    </main>);
}
//# sourceMappingURL=page.js.map