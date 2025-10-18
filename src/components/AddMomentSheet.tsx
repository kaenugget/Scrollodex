"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useClerkConvexUser } from "../hooks/useClerkConvexUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, MapPin, Calendar } from "lucide-react";

interface AddMomentSheetProps {
  peerPageId: Id<"peerPages">;
  onClose: () => void;
}

export function AddMomentSheet({ peerPageId, onClose }: AddMomentSheetProps) {
  const [caption, setCaption] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addMoment = useMutation(api.social.addMoment);
  
  // Get current user
  const { convexUser: currentUser } = useClerkConvexUser();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a photo');
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': selectedFile.type },
        body: selectedFile,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }
      
      const { storageId } = await uploadResponse.json();
      
      // Create moment
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      await addMoment({
        peerPageId,
        authorId: currentUser._id as Id<"users">,
        photoFileId: storageId,
        caption: caption.trim() || undefined,
        placeName: placeName.trim() || undefined,
      });
      
      // Reset form and close
      setCaption("");
      setPlaceName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
      
    } catch (error) {
      console.error('Error adding moment:', error);
      alert('Failed to add moment. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 rounded-t-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Add Moment</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photo *
              </label>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-lg flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-400">{selectedFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's happening in this moment?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {caption.length}/500 characters
              </p>
            </div>

            {/* Place */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Place
              </label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Where was this taken?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* Submit Button */}
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
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add Moment"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
