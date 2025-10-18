"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MomentsFeed } from "./MomentsFeed";
import { DeckGrid } from "./DeckGrid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Settings, Camera, CreditCard } from "lucide-react";
import { useClerkConvexUser } from "@/hooks/useClerkConvexUser";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from '@clerk/nextjs';

interface PeerPageViewProps {
  peerPageId: string;
}

export function PeerPageView({ peerPageId }: PeerPageViewProps) {
  const [activeTab, setActiveTab] = useState<"moments" | "deck" | "settings">("moments");
  
  // Get current user from auth context
  const { isSignedIn } = useUser();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { convexUser, isLoading: clerkConvexLoading } = useClerkConvexUser();
  
  // Use Clerk authentication if available, otherwise fall back to custom auth
  const isUserAuthenticated = isSignedIn || isAuthenticated;
  const currentUser = convexUser || user;

  // Get peer page data
  const peerPage = useQuery(api.social.getPeerPage, { peerPageId: peerPageId as Id<"peerPages"> });
  
  // Get user data for both participants
  const userA = useQuery(api.users.getUserById, peerPage?.aUserId ? { userId: peerPage.aUserId } : "skip");
  const userB = useQuery(api.users.getUserById, peerPage?.bUserId ? { userId: peerPage.bUserId } : "skip");

  if (authLoading || clerkConvexLoading) {
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{peerPage.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{userA.displayName} & {userB.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(peerPage.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-900 text-emerald-300">
                  {peerPage.visibility}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 ${
                    activeTab === tab.id
                      ? "border-emerald-400 bg-emerald-900 text-emerald-300"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-gray-700"
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === "moments" && (
          <MomentsFeed peerPageId={peerPageId as Id<"peerPages">} />
        )}
        {activeTab === "deck" && (
          <DeckGrid peerPageId={peerPageId as Id<"peerPages">} />
        )}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Peer Page Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={peerPage.title}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visibility
                  </label>
                  <Badge variant="secondary" className="bg-emerald-900 text-emerald-300">
                    {peerPage.visibility}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Created
                  </label>
                  <p className="text-gray-400">
                    {new Date(peerPage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
