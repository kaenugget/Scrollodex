"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Download, QrCode, Users, MapPin, Calendar, Star, Copy, Check } from "lucide-react";
import { QRCodeDisplay } from "./QRCodeDisplay";

interface CardDetailViewProps {
  cardId: string;
}

export function CardDetailView({ cardId }: CardDetailViewProps) {
  const [showFront, setShowFront] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [shareType, setShareType] = useState<"view" | "claim">("view");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Get card data
  const card = useQuery(api.social.getCard, { cardId: cardId as Id<"cards"> });
  
  // Get current user
  const { user: currentUser } = useAuth();

  // Mutations
  const createCardShare = useMutation(api.social.createCardShare);

  // Get file URLs
  const frontImageUrl = useQuery(
    api.files.getFileUrl,
    card?.frontFileId ? { fileId: card.frontFileId } : "skip"
  );
  
  const backImageUrl = useQuery(
    api.files.getFileUrl,
    card?.backFileId ? { fileId: card.backFileId } : "skip"
  );

  const photoUrls = useQuery(
    api.files.getFileUrl,
    card?.photosFileIds?.[0] ? { fileId: card.photosFileIds[0] } : "skip"
  );

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-emerald-400">Loading card...</div>
      </div>
    );
  }

  const isOwner = currentUser && card.deckId; // This would need proper deck ownership check

  const generateShareLink = async (type: "view" | "claim") => {
    try {
      const shareId = await createCardShare({
        cardId: cardId as Id<"cards">,
        shareType: type,
      });
      
      // For now, use the shareId as the token (this might need adjustment based on your schema)
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      setShareType(type);
      setShowQR(true);
    } catch (error) {
      console.error('Error creating share link:', error);
      alert('Failed to create share link. Please try again.');
    }
  };

  const handleShare = async () => {
    await generateShareLink("view");
  };

  const handleInvite = async () => {
    await generateShareLink("claim");
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
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
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
                onClick={handleInvite}
                className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Invite Friend
              </Button>
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
                    src={(showFront ? frontImageUrl : backImageUrl) || ''}
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

            {/* QR Code Modal */}
            {showQR && shareUrl && (
              <Card className="bg-gray-800 border-gray-700 p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {shareType === "view" ? "Share Card" : "Invite Friend"}
                </h3>
                
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <QRCodeDisplay url={shareUrl} size={128} />
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                  {shareType === "view" 
                    ? "Scan to view this card" 
                    : "Scan to claim this card"
                  }
                </p>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(false)}
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                  >
                    Close
                  </Button>
                </div>
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

            {/* Original Photos */}
            {card.photosFileIds.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Original Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {card.photosFileIds.slice(0, 4).map((photoId, index) => (
                    <PhotoThumbnail key={index} photoId={photoId} />
                  ))}
                  {card.photosFileIds.length > 4 && (
                    <div className="aspect-square bg-gray-700 rounded border border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                      +{card.photosFileIds.length - 4} more
                    </div>
                  )}
                </div>
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

interface PhotoThumbnailProps {
  photoId: Id<"_storage">;
}

function PhotoThumbnail({ photoId }: PhotoThumbnailProps) {
  const photoUrl = useQuery(api.files.getFileUrl, { fileId: photoId });

  if (!photoUrl) {
    return (
      <div className="aspect-square bg-gray-700 rounded border border-gray-600 animate-pulse" />
    );
  }

  return (
    <div className="aspect-square bg-gray-700 rounded border border-gray-600 overflow-hidden">
      <img
        src={photoUrl}
        alt="Original photo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
