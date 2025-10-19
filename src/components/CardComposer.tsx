"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Users, MapPin, Calendar, Star, Sparkles } from "lucide-react";

interface CardComposerProps {
  peerPageId: Id<"peerPages">;
  onClose: () => void;
}

export function CardComposer({ peerPageId, onClose }: CardComposerProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [highlights, setHighlights] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [template, setTemplate] = useState<"classic" | "foil" | "shiny">("classic");
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createCard = useMutation(api.social.createCard);
  const createDeck = useMutation(api.social.createDeck);
  
  // Get current user and contacts
  const { user: currentUser } = useAuth();
  const getDecks = useQuery(api.social.getDecks, currentUser ? { ownerId: currentUser._id as Id<"users"> } : "skip");
  const contacts = useQuery(api.contacts.list, currentUser ? { ownerId: currentUser._id as Id<"users"> } : "skip");
  const peerPage = useQuery(api.social.getPeerPage, { peerPageId });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 6)); // Max 6 photos
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addAttendee = (contactName: string) => {
    if (!attendees.includes(contactName)) {
      setAttendees(prev => [...prev, contactName]);
    }
  };

  const removeAttendee = (contactName: string) => {
    setAttendees(prev => prev.filter(name => name !== contactName));
  };

  const generateCaption = async () => {
    if (selectedFiles.length === 0) {
      alert('Please upload at least one photo first');
      return;
    }

    setIsGeneratingCaption(true);
    
    try {
      // Stub implementation - in real version, this would call AI service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const stubCaptions = [
        "A memorable moment with friends",
        "Great times together",
        "An unforgettable experience",
        "Making memories",
        "Perfect day with amazing people"
      ];
      
      const randomCaption = stubCaptions[Math.floor(Math.random() * stubCaptions.length)];
      setHighlights(randomCaption);
      
    } catch (error) {
      console.error('Error generating caption:', error);
      alert('Failed to generate caption. Please try again.');
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!date) {
      alert('Please select a date');
      return;
    }
    
    if (selectedFiles.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload photos
      const photoFileIds: Id<"_storage">[] = [];
      
      for (const file of selectedFiles) {
        const uploadUrl = await generateUploadUrl();
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }
        
        const { storageId } = await uploadResponse.json();
        photoFileIds.push(storageId);
      }

      // Find or create deck for this peer page
      // Use the peerPage from the query
      if (!currentUser || !peerPage) {
        throw new Error('User or peer page not found');
      }
      
      const otherUserId = peerPage.aUserId === currentUser._id ? peerPage.bUserId : peerPage.aUserId;
      
      let deck = getDecks?.find(d => 
        d.kind === "duo" && 
        d.peerUserId && 
        (d.peerUserId === otherUserId) // Compare with the actual user ID from the peer page
      );

      if (!deck && currentUser) {
        // Create a new duo deck for this peer page
        const newDeckId = await createDeck({
          ownerId: currentUser._id,
          kind: "duo",
          peerUserId: otherUserId,
          title: `Shared Collection`,
        });
        
        // Use the new deck ID directly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deck = { _id: newDeckId } as any; // Temporary workaround
      }

      if (!deck) {
        throw new Error('Could not find or create deck');
      }

      // Create card
      await createCard({
        deckId: deck._id,
        title: title.trim(),
        date,
        location: location.trim() || undefined,
        people: attendees,
        photosFileIds: photoFileIds,
        highlights: highlights.split('\n').filter(h => h.trim()),
        variant: template,
      });
      
      // Reset form and close
      setTitle("");
      setDate("");
      setLocation("");
      setAttendees([]);
      setHighlights("");
      setSelectedFiles([]);
      setTemplate("classic");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
      
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Create Card</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What was this moment about?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={100}
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this happen?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={100}
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Attendees
              </label>
              
              {/* Selected Attendees */}
              {attendees.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attendees.map((name) => (
                    <Badge
                      key={name}
                      variant="secondary"
                      className="bg-emerald-900 text-emerald-300 cursor-pointer"
                      onClick={() => removeAttendee(name)}
                    >
                      {name} ×
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Contact Selector */}
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {contacts?.map((contact) => (
                  <button
                    key={contact._id}
                    type="button"
                    onClick={() => addAttendee(contact.name)}
                    disabled={attendees.includes(contact.name)}
                    className={`p-2 text-sm rounded border text-left transition-colors ${
                      attendees.includes(contact.name)
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {contact.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photos * (max 6)
              </label>
              
              {/* Selected Photos */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">
                  Click to upload photos
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 10MB each
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Highlights
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateCaption}
                  disabled={isGeneratingCaption || selectedFiles.length === 0}
                  className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {isGeneratingCaption ? "Generating..." : "Generate Caption"}
                </Button>
              </div>
              <textarea
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="What made this moment special? (one highlight per line)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={4}
              />
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["classic", "foil", "shiny"] as const).map((templateOption) => (
                  <button
                    key={templateOption}
                    type="button"
                    onClick={() => setTemplate(templateOption)}
                    className={`p-3 rounded border text-center transition-colors ${
                      template === templateOption
                        ? 'border-emerald-500 bg-emerald-900 text-emerald-300'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Star className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm capitalize">{templateOption}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!title.trim() || !date || selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Card"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
