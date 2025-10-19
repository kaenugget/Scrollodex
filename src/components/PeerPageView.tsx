"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MomentsFeed } from "./MomentsFeed";
import { DeckGrid } from "./DeckGrid";
import { AppHeader } from "./AppHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Settings, Camera, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PeerPageViewProps {
  peerPageId: string;
}

export function PeerPageView({ peerPageId }: PeerPageViewProps) {
  const [activeTab, setActiveTab] = useState<"moments" | "deck" | "settings">("moments");
  
  // Get current user from auth context
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  // Use custom auth system
  const isUserAuthenticated = isAuthenticated;
  const currentUser = user;

  // Get peer page data
  const peerPage = useQuery(api.social.getPeerPage, { peerPageId: peerPageId as Id<"peerPages"> });
  
  // Get user data for both participants
  const userA = useQuery(api.users.getUserById, peerPage?.aUserId ? { userId: peerPage.aUserId } : "skip");
  const userB = useQuery(api.users.getUserById, peerPage?.bUserId ? { userId: peerPage.bUserId } : "skip");

  if (authLoading) {
    return <LoadingSpinner fullScreen text="Loading peer page..." />;
  }

  if (!peerPage || !userA || !userB) {
    return <LoadingSpinner fullScreen text="Loading peer page..." />;
  }

  // Check if current user has access to this peer page
  const hasAccess = isUserAuthenticated && currentUser && (
    currentUser._id === peerPage.aUserId || 
    currentUser._id === peerPage.bUserId
  );

  if (!hasAccess) {
    return <LoadingSpinner fullScreen text="Redirecting to login..." />;
  }

  const tabs = [
    { id: "moments", label: "Moments", icon: Camera },
    { id: "deck", label: "Deck", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSignOut = () => {
    if (isSignedIn) {
      window.location.href = '/';
    } else {
      // Handle custom auth sign out
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader 
        currentPage="home" 
        onNavigate={(page) => {
          if (page === 'dex') {
            window.location.href = '/';
          } else if (page === 'settings') {
            window.location.href = '/settings';
          }
        }}
        user={currentUser || undefined}
        onSignOut={handleSignOut}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{peerPage.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{userA.displayName} & {userB.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(peerPage.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {peerPage.visibility}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors rounded-md ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "moments" && (
          <MomentsFeed peerPageId={peerPageId as Id<"peerPages">} />
        )}
        {activeTab === "deck" && (
          <DeckGrid peerPageId={peerPageId as Id<"peerPages">} />
        )}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Page Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={peerPage.title}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {peerPage.visibility}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created
                  </label>
                  <p className="text-gray-600">
                    {new Date(peerPage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
