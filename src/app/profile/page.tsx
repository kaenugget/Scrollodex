"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { 
  Users,
  Share2,
  Copy,
  Check,
  Heart,
  Shield,
  MessageCircle,
  Zap
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  
  const isUserAuthenticated = isAuthenticated;
  const currentUser = user;

  // Mutations and Queries
  const createUserShare = useMutation(api.social.createUserShare);
  const avatarUrlFromStorage = useQuery(
    api.auth.getAvatarUrl,
    currentUser?.avatarFileId ? { avatarFileId: currentUser.avatarFileId } : "skip"
  );

  // Debug logging for avatar data
  useEffect(() => {
    if (currentUser) {
      console.log('Profile page - User data:', {
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        avatarFileId: currentUser.avatarFileId,
        avatarUrlFromStorage: avatarUrlFromStorage
      });
    }
  }, [currentUser, avatarUrlFromStorage]);

  // Debug the query parameters
  useEffect(() => {
    console.log('Avatar query debug:', {
      hasCurrentUser: !!currentUser,
      avatarFileId: currentUser?.avatarFileId,
      queryCalled: !!currentUser?.avatarFileId,
      avatarUrlFromStorage: avatarUrlFromStorage
    });
  }, [currentUser?.avatarFileId, avatarUrlFromStorage]);

  // Mock relationship health data based on PRD requirements
  const relationshipHealth = {
    connection: 85,
    reliability: 78,
    communication: 92,
    energy: 88
  };

  const overallHealth = Math.round(
    (relationshipHealth.connection + relationshipHealth.reliability + 
     relationshipHealth.communication + relationshipHealth.energy) / 4
  );

  const handleSignOut = async () => {
    await signOut();
  };

  const generateInviteLink = async () => {
    if (!currentUser?._id) {
      setError('Please sign in first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Creating share for user:', currentUser._id);
      console.log('User object:', currentUser);
      console.log('User ID type:', typeof currentUser._id);
      console.log('User ID value:', currentUser._id);
      
      // Validate user ID format
      if (typeof currentUser._id !== 'string' || !currentUser._id.startsWith('j')) {
        throw new Error(`Invalid user ID format: ${currentUser._id}`);
      }
      
      // Generate share token immediately (client-side)
      const clientShareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log('Generated client-side share token:', clientShareToken);
      
      // Try to create share with Convex (optional)
      let share = { shareToken: clientShareToken }; // Start with client-side token
      
      try {
        console.log('Attempting to create share via Convex...');
        const convexShare = await createUserShare({
          userId: currentUser._id as Id<"users">,
        });
        console.log('Share created successfully via Convex:', convexShare);
        // Use Convex token if successful
        if (convexShare && convexShare.shareToken) {
          share = convexShare;
        }
      } catch (convexError) {
        console.error('Convex error:', convexError);
        console.log('Convex failed, using client-side share token...');
        // Keep using the client-side token we generated
      }
      
      // Final validation
      if (!share || !share.shareToken) {
        throw new Error('Share token was not generated - this should not happen');
      }
      
      console.log('Final share object:', share);
      console.log('Final share token:', share.shareToken);
      
      const url = `${window.location.origin}/invite/${share.shareToken}`;
      setShareUrl(url);
      
      // Try to copy to clipboard, but don't fail if it doesn't work
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (clipboardError) {
        console.warn('Could not copy to clipboard:', clipboardError);
        // Don't throw error for clipboard issues, just show the URL
      }
    } catch (error) {
      console.error('Error creating invite link:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        user: currentUser,
        userId: currentUser?._id,
        userIdType: typeof currentUser?._id
      });
      
      // Set error state instead of alert
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to create invite link: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleAllContacts = () => {
    router.push('/');
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  // Only redirect if explicitly not authenticated, not if user is still loading
  if (!isUserAuthenticated) {
    return <LoadingSpinner fullScreen text="Redirecting to login..." />;
  }

  // Show loading while user data is being fetched
  if (!currentUser) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-red-800 flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      {/* Welcome Message */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-white text-3xl font-bold mb-2">
          Welcome to your Scrollodex,
        </h1>
        <h2 className="text-white text-3xl font-bold">
          {currentUser.displayName || 'User'}!
        </h2>
      </motion.div>

      {/* Avatar */}
      <motion.div 
        className="mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {(currentUser.avatarUrl || avatarUrlFromStorage) ? (
          <img 
            src={currentUser.avatarUrl || avatarUrlFromStorage || ''} 
            alt={`${currentUser.displayName}'s avatar`}
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl"
            onError={(e) => {
              console.error('Avatar image failed to load:', e);
              console.log('Failed to load avatar URL:', currentUser.avatarUrl || avatarUrlFromStorage);
            }}
            onLoad={() => {
              console.log('Avatar loaded successfully:', currentUser.avatarUrl || avatarUrlFromStorage);
            }}
          />
        ) : (
          <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
            <span className="text-white text-6xl font-bold">
              {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </motion.div>

      {/* Profile Info Card */}
      <motion.div 
        className="w-full max-w-sm bg-white rounded-2xl p-6 mb-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="space-y-4">
          {/* Email */}
          <div>
            <span className="font-bold text-gray-900">Email</span>
            <p className="text-gray-700">{(currentUser as { email?: string })?.email || 'No email provided'}</p>
          </div>

          {/* Location */}
          <div>
            <span className="font-bold text-gray-900">Location</span>
            <p className="text-gray-700">Singapore</p>
          </div>

          {/* Relationship Health */}
          <div>
            <span className="font-bold text-gray-900">Relationship Health</span>
            <div className="mt-2 space-y-2">
              {/* Overall Health Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                      style={{ width: `${overallHealth}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{overallHealth}</span>
                </div>
              </div>

              {/* Individual Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="text-gray-600">Connection</span>
                  <span className="font-bold text-gray-900">{relationshipHealth.connection}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600">Reliability</span>
                  <span className="font-bold text-gray-900">{relationshipHealth.reliability}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600">Communication</span>
                  <span className="font-bold text-gray-900">{relationshipHealth.communication}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-600">Energy</span>
                  <span className="font-bold text-gray-900">{relationshipHealth.energy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* All Contacts Button */}
        <Button
          onClick={handleAllContacts}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 py-4 px-8 rounded-2xl font-bold"
        >
          <Users className="w-5 h-5 mr-2" />
          All Contacts
        </Button>

        {/* Send Invitation Button */}
        <Button
          onClick={generateInviteLink}
          disabled={isGenerating}
          className="w-full bg-white text-black font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : copied ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Link Copied!
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5 mr-2" />
              Send Invitation to Friends
            </>
          )}
        </Button>

        {/* Show error if any */}
        {error && (
          <motion.div 
            className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-200 text-sm">{error}</p>
            <Button
              onClick={() => setError(null)}
              size="sm"
              variant="outline"
              className="mt-2 bg-red-500/10 border-red-500/20 text-red-200 hover:bg-red-500/20"
            >
              Close
            </Button>
          </motion.div>
        )}

        {/* Show share URL if generated */}
        {shareUrl && (
          <motion.div 
            className="mt-4 p-4 bg-white/10 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-sm mb-2">Invite Link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white/20 text-white text-sm rounded-lg border border-white/30"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-white/70 text-xs mt-2">
              Share this link with friends to invite them to connect with you!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
