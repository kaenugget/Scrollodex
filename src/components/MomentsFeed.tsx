"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useClerkConvexUser } from "../hooks/useClerkConvexUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, User } from "lucide-react";
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
  const { convexUser: currentUser } = useClerkConvexUser();

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
  };
  onPhotoClick: (photoUrl: string) => void;
}

function MomentCard({ moment, onPhotoClick }: MomentCardProps) {
  const photoUrl = useQuery(api.files.getFileUrl, { fileId: moment.photoFileId });
  const author = useQuery(api.users.getUser, { userId: moment.authorId });

  if (!photoUrl) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="animate-pulse bg-gray-700 h-48 rounded-md mb-4"></div>
      </Card>
    );
  }

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

        {/* Location */}
        {moment.placeName && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{moment.placeName}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
