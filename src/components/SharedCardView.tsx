"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin, Calendar, Star, Check, Download, Share2 } from "lucide-react";

interface SharedCardViewProps {
  shareToken: string;
}

export function SharedCardView({ shareToken }: SharedCardViewProps) {
  const [showFront, setShowFront] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Get card data by share token
  const card = useQuery(api.social.getCardByShareToken, { shareToken });
  
  // Get current user
  const { user: currentUser } = useAuth();

  // Mutations
  const claimCard = useMutation(api.social.claimCard);

  // Get file URLs
  const frontImageUrl = useQuery(
    api.files.getFileUrl,
    card?.frontFileId ? { fileId: card.frontFileId } : "skip"
  );
  
  const backImageUrl = useQuery(
    api.files.getFileUrl,
    card?.backFileId ? { fileId: card.backFileId } : "skip"
  );

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Card Not Found</div>
          <div className="text-gray-400 text-sm mb-4">
            This share link may have expired or is invalid.
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

  const handleClaim = async () => {
    if (!currentUser) {
      alert('Please sign in to claim this card');
      return;
    }

    setIsClaiming(true);
    
    try {
      await claimCard({
        shareToken,
        claimerUserId: currentUser._id,
      });
      
      setClaimed(true);
      alert('Card claimed successfully!');
      
    } catch (error) {
      console.error('Error claiming card:', error);
      alert('Failed to claim card. It may have already been claimed or expired.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDownload = () => {
    const imageUrl = showFront ? frontImageUrl : backImageUrl;
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${card.title}-${showFront ? 'front' : 'back'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: `Check out this card: ${card.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Card URL copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
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
                <h1 className="text-xl font-bold text-white">{card.title}</h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(card.date).toLocaleDateString()}</span>
                  </div>
                  {card.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{card.location}</span>
                    </div>
                  )}
                  {card.variant && (
                    <Badge variant="secondary" className="bg-emerald-900 text-emerald-300">
                      {card.variant}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="space-y-4">
            {/* Main Card Display */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-[3/4] bg-gray-700 relative">
                {(showFront ? frontImageUrl : backImageUrl) ? (
                  <img
                    src={showFront ? frontImageUrl : backImageUrl}
                    alt={`${card.title} - ${showFront ? 'Front' : 'Back'}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Star className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">{card.title}</p>
                      <p className="text-sm">
                        {showFront ? 'Front' : 'Back'} view
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Front/Back Toggle */}
            {frontImageUrl && backImageUrl && (
              <div className="flex gap-2">
                <Button
                  variant={showFront ? "default" : "outline"}
                  onClick={() => setShowFront(true)}
                  className={`flex-1 ${
                    showFront 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  Front
                </Button>
                <Button
                  variant={!showFront ? "default" : "outline"}
                  onClick={() => setShowFront(false)}
                  className={`flex-1 ${
                    !showFront 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  Back
                </Button>
              </div>
            )}

            {/* Claim Button */}
            {currentUser && !claimed && (
              <Card className="bg-gray-800 border-gray-700 p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Claim This Card</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Add this card to your collection
                </p>
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isClaiming ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Claiming...
                    </div>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Claim Card
                    </>
                  )}
                </Button>
              </Card>
            )}

            {claimed && (
              <Card className="bg-emerald-900 border-emerald-700 p-6 text-center">
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">Card Claimed!</h3>
                <p className="text-emerald-400 text-sm">
                  This card has been added to your collection.
                </p>
              </Card>
            )}
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            {/* Attendees */}
            {card.people.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Attendees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.people.map((person, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-emerald-900 text-emerald-300"
                    >
                      {person}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Highlights */}
            {card.highlights.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {card.highlights.map((highlight, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* AI Caption */}
            {card.aiCaption && (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  AI Caption
                </h3>
                <p className="text-gray-300 leading-relaxed">{card.aiCaption}</p>
              </Card>
            )}

            {/* Card Info */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Card Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">
                    {new Date(card.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Photos:</span>
                  <span className="text-gray-300">{card.photosFileIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Template:</span>
                  <span className="text-gray-300 capitalize">{card.variant || 'classic'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
