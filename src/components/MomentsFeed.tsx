"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, User, Heart, MessageCircle, Tag, Smile, Cloud, Activity, Eye } from "lucide-react";
import { AddMomentSheet } from "./AddMomentSheet";
import { PhotoViewer } from "./PhotoViewer";

interface MomentsFeedProps {
  peerPageId: Id<"peerPages">;
}

export function MomentsFeed({ peerPageId }: MomentsFeedProps) {
  const [showAddMoment, setShowAddMoment] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Get moments for this peer page
  const moments = useQuery(api.social.getMoments, { peerPageId });
  
  // Get current user
  const { user: currentUser } = useAuth();

  if (!moments) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-emerald-400">Loading moments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Moments</h2>
          <p className="text-gray-400">
            {moments.length} {moments.length === 1 ? 'moment' : 'moments'} shared
          </p>
        </div>
        <Button
          onClick={() => setShowAddMoment(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Moment
        </Button>
      </div>

      {/* Moments Grid */}
      {moments.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No moments yet</h3>
            <p className="text-gray-400 mb-6">
              Start sharing memories by adding your first moment!
            </p>
            <Button
              onClick={() => setShowAddMoment(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Moment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moments.map((moment) => (
            <MomentCard
              key={moment._id}
              moment={moment}
              onPhotoClick={(photoUrl) => setSelectedPhoto(photoUrl)}
            />
          ))}
        </div>
      )}

      {/* Add Moment Sheet */}
      {showAddMoment && (
        <AddMomentSheet
          peerPageId={peerPageId}
          onClose={() => setShowAddMoment(false)}
        />
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}

interface MomentCardProps {
  moment: {
    _id: Id<"moments">;
    photoFileId: Id<"_storage">;
    caption?: string;
    placeName?: string;
    lat?: number;
    lng?: number;
    createdAt: number;
    authorId: Id<"users">;
    tags?: string[];
    mood?: string;
    visibility?: string;
    weather?: string;
    activity?: string;
    likesCount?: number;
    commentsCount?: number;
  };
  onPhotoClick: (photoUrl: string) => void;
}

function MomentCard({ moment, onPhotoClick }: MomentCardProps) {
  const photoUrl = useQuery(api.files.getFileUrl, { fileId: moment.photoFileId });
  const author = useQuery(api.users.getUser, { userId: moment.authorId });
  const { user: currentUser } = useAuth();
  
  const likeMoment = useMutation(api.social.likeMoment);
  const unlikeMoment = useMutation(api.social.unlikeMoment);
  const isLiked = useQuery(api.social.isMomentLiked, 
    currentUser ? { momentId: moment._id, userId: currentUser._id } : "skip"
  );

  const handleLike = async () => {
    if (!currentUser) return;
    
    if (isLiked) {
      await unlikeMoment({ momentId: moment._id, userId: currentUser._id });
    } else {
      await likeMoment({ momentId: moment._id, userId: currentUser._id });
    }
  };

  if (!photoUrl) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="animate-pulse bg-gray-700 h-48 rounded-md mb-4"></div>
      </Card>
    );
  }

  const moodEmojis: { [key: string]: string } = {
    happy: "😊",
    excited: "🤩",
    peaceful: "😌",
    nostalgic: "😌",
    inspired: "✨",
    grateful: "🙏",
  };

  const weatherEmojis: { [key: string]: string } = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    clear: "🌤️",
    foggy: "🌫️",
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      {/* Photo */}
      <div
        className="aspect-square bg-gray-700 cursor-pointer group relative"
        onClick={() => onPhotoClick(photoUrl)}
      >
        <img
          src={photoUrl}
          alt={moment.caption || "Moment"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Visibility indicator */}
        {moment.visibility && moment.visibility !== "private" && (
          <div className="absolute top-2 right-2">
            <div className="bg-black bg-opacity-50 rounded-full p-1">
              <Eye className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{author?.displayName || "Unknown"}</span>
          </div>
          <span>{new Date(moment.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Caption */}
        {moment.caption && (
          <p className="text-white text-sm leading-relaxed">{moment.caption}</p>
        )}

        {/* Tags */}
        {moment.tags && moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {moment.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-emerald-600 text-white">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {moment.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                +{moment.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Mood, Weather, Activity */}
        <div className="flex items-center gap-3 text-sm text-gray-400">
          {moment.mood && (
            <div className="flex items-center gap-1">
              <Smile className="w-4 h-4" />
              <span>{moodEmojis[moment.mood] || "😊"} {moment.mood}</span>
            </div>
          )}
          {moment.weather && (
            <div className="flex items-center gap-1">
              <Cloud className="w-4 h-4" />
              <span>{weatherEmojis[moment.weather] || "☀️"} {moment.weather}</span>
            </div>
          )}
          {moment.activity && (
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span>{moment.activity}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {moment.placeName && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{moment.placeName}</span>
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{moment.likesCount || 0}</span>
          </button>
          
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{moment.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
