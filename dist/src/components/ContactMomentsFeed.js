"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useClerkConvexUser } from "../hooks/useClerkConvexUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MapPin, Calendar, User } from "lucide-react";
import { AddMomentSheet } from "./AddMomentSheet";
import { PhotoViewer } from "./PhotoViewer";
export function ContactMomentsFeed({ contactId, userId }) {
    const [showAddMoment, setShowAddMoment] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    // Get current user
    const { convexUser: currentUser } = useClerkConvexUser();
    // Get contact to check if it's a connected user
    const contact = useQuery(api.contacts.get, { contactId });
    // Find or create peer page between current user and contact
    const findOrCreatePeerPage = useMutation(api.social.findOrCreatePeerPage);
    const [peerPageId, setPeerPageId] = useState(null);
    // Get moments for this peer page
    const moments = useQuery(api.social.getMoments, peerPageId ? { peerPageId } : "skip");
    // Initialize peer page when component mounts
    React.useEffect(() => {
        if (currentUser && contact && contact.connectedUserId && !peerPageId) {
            findOrCreatePeerPage({
                userId1: currentUser._id,
                userId2: contact.connectedUserId,
            }).then((id) => {
                setPeerPageId(id);
            }).catch(console.error);
        }
    }, [currentUser, contact, peerPageId, findOrCreatePeerPage]);
    if (!contact) {
        return (<div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading contact...</div>
      </div>);
    }
    if (!contact.connectedUserId) {
        return (<div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-purple-600">Shared Moments</h2>
            <p className="text-gray-600">This contact is not connected to share moments</p>
          </div>
        </div>
        <Card className="bg-white border-gray-200 p-12 text-center">
          <div className="text-gray-600 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No moments available</h3>
            <p className="text-gray-600">
              This contact is not a connected user, so you cannot share moments with them.
            </p>
          </div>
        </Card>
      </div>);
    }
    if (!moments) {
        return (<div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading moments...</div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-purple-600">Shared Moments</h2>
          <p className="text-gray-600">
            {moments.length} {moments.length === 1 ? 'moment' : 'moments'} shared
          </p>
        </div>
        {peerPageId && (<Button onClick={() => setShowAddMoment(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2"/>
            Add Moment
          </Button>)}
      </div>

      {/* Moments Grid */}
      {moments.length === 0 ? (<Card className="bg-white border-gray-200 p-12 text-center">
          <div className="text-gray-600 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No moments yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing memories by adding your first moment!
            </p>
            {peerPageId && (<Button onClick={() => setShowAddMoment(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2"/>
                Add First Moment
              </Button>)}
          </div>
        </Card>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moments.map((moment) => (<MomentCard key={moment._id} moment={moment} onPhotoClick={(photoUrl) => setSelectedPhoto(photoUrl)}/>))}
        </div>)}

      {/* Add Moment Sheet */}
      {showAddMoment && peerPageId && (<AddMomentSheet peerPageId={peerPageId} onClose={() => setShowAddMoment(false)}/>)}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (<PhotoViewer photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)}/>)}
    </div>);
}
function MomentCard({ moment, onPhotoClick }) {
    const photoUrl = useQuery(api.files.getFileUrl, { fileId: moment.photoFileId });
    const author = useQuery(api.users.getUser, { userId: moment.authorId });
    if (!photoUrl) {
        return (<Card className="bg-white border-gray-200 p-4">
        <div className="animate-pulse bg-gray-200 h-48 rounded-md mb-4"></div>
      </Card>);
    }
    return (<Card className="bg-white border-gray-200 overflow-hidden">
      {/* Photo */}
      <div className="aspect-square bg-gray-200 cursor-pointer group relative" onClick={() => onPhotoClick(photoUrl)}>
        <img src={photoUrl} alt={moment.caption || "Moment"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"/>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Calendar className="w-6 h-6 text-white"/>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4"/>
            <span>{author?.displayName || "Unknown"}</span>
          </div>
          <span>{new Date(moment.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Caption */}
        {moment.caption && (<p className="text-gray-900 text-sm leading-relaxed">{moment.caption}</p>)}

        {/* Location */}
        {moment.placeName && (<div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4"/>
            <span>{moment.placeName}</span>
          </div>)}
      </div>
    </Card>);
}
//# sourceMappingURL=ContactMomentsFeed.js.map