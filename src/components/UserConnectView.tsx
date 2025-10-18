"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Calendar, Check, Users, Star } from "lucide-react";

interface UserConnectViewProps {
  shareToken: string;
}

export function UserConnectView({ shareToken }: UserConnectViewProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // Get user data by share token
  const user = useQuery(api.social.getUserByShareToken, { shareToken });
  
  // Get current user
  const { user: currentUser } = useAuth();

  // Mutations
  const connectToUser = useMutation(api.social.connectToUser);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Profile Not Found</div>
          <div className="text-gray-400 text-sm mb-4">
            This connection link may have expired or is invalid.
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleConnect = async () => {
    if (!currentUser) {
      alert('Please sign in to connect with this user');
      return;
    }

    setIsConnecting(true);
    
    try {
      await connectToUser({
        shareToken,
        claimerUserId: currentUser._id,
      });
      
      setConnected(true);
      alert('Successfully connected! This user has been added to your contacts.');
      
    } catch (error) {
      console.error('Error connecting to user:', error);
      alert('Failed to connect. You may already be connected to this user.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Connect with User</h1>
                <div className="text-gray-400 text-sm">
                  Add this person to your Scrollodex contacts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.displayName}</h2>
                {user.bio && (
                  <p className="text-gray-300 text-sm">{user.bio}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Connection Benefits */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                What you'll get:
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Live contact information that updates automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Track your relationship progress in your Dex</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Share memories and cards together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Get AI-powered relationship insights</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Connection Panel */}
          <div className="space-y-6">
            {/* Connect Button */}
            {!connected && (
              <Card className="bg-gray-800 border-gray-700 p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Connect with {user.displayName}</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Add this user to your contacts and start building your relationship
                </p>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting || !currentUser}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : !currentUser ? (
                    "Sign in to Connect"
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Connect & Add to Contacts
                    </>
                  )}
                </Button>
              </Card>
            )}

            {connected && (
              <Card className="bg-emerald-900 border-emerald-700 p-6 text-center">
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">Successfully Connected!</h3>
                <p className="text-emerald-400 text-sm mb-4">
                  {user.displayName} has been added to your contacts with live updates.
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Go to Contacts
                </Button>
              </Card>
            )}

            {/* Privacy Notice */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Privacy & Data</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>
                  • Only basic profile information is shared (name, email, bio)
                </p>
                <p>
                  • Contact information updates automatically when they change their profile
                </p>
                <p>
                  • You can disconnect at any time from your contacts page
                </p>
                <p>
                  • No personal data is shared without explicit connection
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
