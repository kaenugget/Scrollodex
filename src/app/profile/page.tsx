"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Trash2, 
  Mail,
  Share2,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'data'>('profile');
  const [showQR, setShowQR] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  
  const isUserAuthenticated = isAuthenticated;
  const currentUser = user;

  // Mutations
  const createUserShare = useMutation(api.social.createUserShare);
  const updateProfile = useMutation(api.users.updateProfile);

  const handleSignOut = async () => {
    await signOut();
  };

  const generateProfileShareLink = async () => {
    if (!currentUser?._id) {
      alert('Please sign in first');
      return;
    }

    try {
      const share = await createUserShare({
        userId: currentUser._id as Id<"users">,
      });
      
      const url = `${window.location.origin}/connect/${share.shareToken}`;
      setShareUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error('Error creating profile share link:', error);
      alert('Failed to create share link. Please try again.');
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

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'data', label: 'Data', icon: Database },
  ] as const;

  return (
    <main className="scrollodex-bg">
      <AnimatedBackground />
      <AppHeader 
        currentPage="profile" 
        onNavigate={(page) => {
          if (page === 'contacts' || page === 'dex' || page === 'home') {
            window.location.href = '/';
          }
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold scrollodex-text-white-bold mb-2">Profile & Settings</h1>
          <p className="scrollodex-text-white">Manage your account and app preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="scrollodex-card">
              <nav className="space-y-2">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === key
                        ? 'bg-blue-50 scrollodex-text-dark border border-blue-200'
                        : 'scrollodex-text-gray hover:scrollodex-text-dark hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="scrollodex-card-large">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold scrollodex-text-dark">{currentUser.displayName || 'User'}</h2>
                    <p className="scrollodex-text-gray">Manage your profile information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium scrollodex-text-dark mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue={currentUser.displayName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium scrollodex-text-dark mb-2">Email</label>
                      <input
                        type="email"
                        value={(currentUser as { email?: string })?.email || 'No email provided'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 scrollodex-text-light-gray"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium scrollodex-text-dark mb-2">Bio</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>

                  {/* Profile Sharing Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold scrollodex-text-dark mb-4">Share Your Profile</h3>
                    <p className="text-sm scrollodex-text-gray mb-4">
                      Let others connect with you by sharing your profile QR code or link
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={generateProfileShareLink}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Generate QR Code
                      </Button>
                    </div>

                    {/* QR Code Modal */}
                    {showQR && shareUrl && (
                      <div className="scrollodex-card mt-6 text-center">
                        <h4 className="text-lg font-semibold scrollodex-text-dark mb-4">
                          Share Your Profile
                        </h4>
                        
                        <div className="bg-white p-4 rounded-lg inline-block mb-4">
                          <QRCodeDisplay url={shareUrl} size={128} />
                        </div>
                        
                        <p className="scrollodex-text-gray text-sm mb-4">
                          Others can scan this QR code to connect with you
                        </p>
                        
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                            {copied ? "Copied!" : "Copy Link"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQR(false)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="scrollodex-card-large">
                <h2 className="text-2xl font-bold scrollodex-text-dark mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium scrollodex-text-dark">Birthday Reminders</h3>
                      <p className="text-sm scrollodex-text-gray">Get notified when your contacts have birthdays</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Follow-up Reminders</h3>
                      <p className="text-sm text-gray-600">Reminders for scheduled follow-ups with contacts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Weekly Summaries</h3>
                      <p className="text-sm text-gray-600">Receive weekly summaries of your relationship activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="scrollodex-card-large">
                <h2 className="text-2xl font-bold scrollodex-text-dark mb-6">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Data Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium scrollodex-text-dark">Profile Visibility</h4>
                          <p className="text-sm scrollodex-text-gray">Who can see your profile information</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Private</option>
                          <option>Contacts Only</option>
                          <option>Public</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium scrollodex-text-dark">Activity Sharing</h4>
                          <p className="text-sm scrollodex-text-gray">Allow contacts to see your activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Account Security</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="scrollodex-card-large">
                <h2 className="text-2xl font-bold scrollodex-text-dark mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                        <div className="w-full h-20 bg-white border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center scrollodex-text-dark">Light</p>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                        <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center scrollodex-text-dark">Dark</p>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-500 to-purple-600 border rounded mb-2"></div>
                        <p className="text-sm font-medium text-center scrollodex-text-dark">Auto</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Accent Color</h3>
                    <div className="flex gap-3">
                      {['blue', 'green', 'purple', 'red', 'orange'].map(color => (
                        <div
                          key={color}
                          className={`w-8 h-8 rounded-full bg-${color}-500 cursor-pointer border-2 ${
                            color === 'blue' ? 'border-gray-900' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="scrollodex-card-large">
                <h2 className="text-2xl font-bold scrollodex-text-dark mb-6">Data Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Export Data</h3>
                    <p className="text-sm scrollodex-text-gray mb-4">Download all your data in a portable format</p>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium scrollodex-text-dark mb-4">Storage Usage</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium scrollodex-text-dark">Contacts</span>
                        <span className="text-sm scrollodex-text-gray">12 contacts</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium scrollodex-text-dark">Photos</span>
                        <span className="text-sm scrollodex-text-gray">45 photos (2.3 MB)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium scrollodex-text-dark">Total Storage</span>
                        <span className="text-sm scrollodex-text-gray">2.8 MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
                    <p className="text-sm scrollodex-text-gray mb-4">Permanently delete your account and all associated data</p>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
