"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, MapPin, Star } from "lucide-react";
import { CardComposer } from "./CardComposer";

interface DeckGridProps {
  peerPageId: Id<"peerPages">;
}

export function DeckGrid({ peerPageId }: DeckGridProps) {
  const [showCardComposer, setShowCardComposer] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "date">("newest");

  // Get peer page to find associated deck
  const peerPage = useQuery(api.social.getPeerPage, { peerPageId });
  
  // Get current user to find their decks
  const { user: currentUser } = useAuth();
  
  // Get decks for current user
  const decks = useQuery(
    api.social.getDecks, 
    currentUser ? { ownerId: currentUser._id } : "skip"
  );

  // Find the deck associated with this peer page (duo deck)
  const peerDeck = decks?.find(deck => 
    deck.kind === "duo" && 
    deck.peerUserId && 
    (peerPage?.aUserId === deck.peerUserId || peerPage?.bUserId === deck.peerUserId)
  );

  // Get cards for the peer deck
  const cards = useQuery(
    api.social.getCards,
    peerDeck ? { deckId: peerDeck._id } : "skip"
  );

  if (!peerPage || !currentUser || !decks) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-emerald-400">Loading deck...</div>
      </div>
    );
  }

  // Sort cards
  const sortedCards = cards ? [...cards].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Deck</h2>
          <p className="text-gray-400">
            {sortedCards.length} {sortedCards.length === 1 ? 'card' : 'cards'} in collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "date")}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="date">By Date</option>
          </select>
          
          <Button
            onClick={() => setShowCardComposer(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {!peerDeck ? (
        <Card className="bg-gray-800 border-gray-700 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No deck yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first card to start building your shared collection!
            </p>
            <Button
              onClick={() => setShowCardComposer(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Card
            </Button>
          </div>
        </Card>
      ) : sortedCards.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No cards yet</h3>
            <p className="text-gray-400 mb-6">
              Start building your collection by creating your first card!
            </p>
            <Button
              onClick={() => setShowCardComposer(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Card
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCards.map((card) => (
            <CardPreview
              key={card._id}
              card={card}
              onClick={() => {
                // Navigate to card detail view
                window.location.href = `/card/${card._id}`;
              }}
            />
          ))}
        </div>
      )}

      {/* Card Composer Modal */}
      {showCardComposer && (
        <CardComposer
          peerPageId={peerPageId}
          onClose={() => setShowCardComposer(false)}
        />
      )}
    </div>
  );
}

interface CardPreviewProps {
  card: {
    _id: Id<"cards">;
    title: string;
    date: string;
    location?: string;
    people: string[];
    photosFileIds: Id<"_storage">[];
    highlights: string[];
    aiCaption?: string;
    frontFileId?: Id<"_storage">;
    backFileId?: Id<"_storage">;
    variant?: string;
    createdAt: number;
  };
  onClick: () => void;
}

function CardPreview({ card, onClick }: CardPreviewProps) {
  const frontImageUrl = useQuery(
    api.files.getFileUrl,
    card.frontFileId ? { fileId: card.frontFileId } : "skip"
  );

  return (
    <Card 
      className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors group"
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="aspect-[3/4] bg-gray-700 relative">
        {frontImageUrl ? (
          <img
            src={frontImageUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Card Preview</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
        
        {/* Variant Badge */}
        {card.variant && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-emerald-900 text-emerald-300"
          >
            {card.variant}
          </Badge>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-white text-sm leading-tight">
          {card.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{new Date(card.date).toLocaleDateString()}</span>
        </div>
        
        {card.location && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{card.location}</span>
          </div>
        )}
        
        {card.people.length > 0 && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Users className="w-3 h-3" />
            <span>{card.people.length} {card.people.length === 1 ? 'person' : 'people'}</span>
          </div>
        )}
        
        {card.aiCaption && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {card.aiCaption}
          </p>
        )}
      </div>
    </Card>
  );
}
