"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, MapPin, Calendar, Tag, Smile, Eye, Cloud, Activity } from "lucide-react";

interface AddMomentSheetProps {
  peerPageId: Id<"peerPages">;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "excited", label: "Excited", emoji: "🤩" },
  { value: "peaceful", label: "Peaceful", emoji: "😌" },
  { value: "nostalgic", label: "Nostalgic", emoji: "😌" },
  { value: "inspired", label: "Inspired", emoji: "✨" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
];

const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny", emoji: "☀️" },
  { value: "cloudy", label: "Cloudy", emoji: "☁️" },
  { value: "rainy", label: "Rainy", emoji: "🌧️" },
  { value: "clear", label: "Clear", emoji: "🌤️" },
  { value: "foggy", label: "Foggy", emoji: "🌫️" },
];

const ACTIVITY_OPTIONS = [
  { value: "hiking", label: "Hiking" },
  { value: "dining", label: "Dining" },
  { value: "working", label: "Working" },
  { value: "relaxing", label: "Relaxing" },
  { value: "exploring", label: "Exploring" },
  { value: "photography", label: "Photography" },
  { value: "coffee", label: "Coffee" },
  { value: "travel", label: "Travel" },
];

const TAG_OPTIONS = [
  "nature", "city", "food", "travel", "friends", "family", "work", "adventure",
  "relaxation", "photography", "art", "music", "sports", "coffee", "sunset",
  "morning", "night", "summer", "winter", "spring", "autumn"
];

export function AddMomentSheet({ peerPageId, onClose }: AddMomentSheetProps) {
  const [caption, setCaption] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [weather, setWeather] = useState("");
  const [activity, setActivity] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addMoment = useMutation(api.social.addMoment);
  
  // Get current user
  const { user: currentUser } = useAuth();

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

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
        tags: tags.length > 0 ? tags : undefined,
        mood: mood || undefined,
        visibility: visibility,
        weather: weather || undefined,
        activity: activity || undefined,
      });
      
      // Reset form and close
      setCaption("");
      setPlaceName("");
      setTags([]);
      setMood("");
      setVisibility("private");
      setWeather("");
      setActivity("");
      setSelectedFile(null);
      setNewTag("");
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
      <Card className="w-full max-w-lg bg-gray-800 border-gray-700 rounded-t-xl max-h-[90vh] overflow-y-auto">
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="hover:text-gray-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd(newTag.trim());
                      setNewTag("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleTagAdd(newTag.trim());
                    setNewTag("");
                  }}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {TAG_OPTIONS.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagAdd(tag)}
                    className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Smile className="w-4 h-4 inline mr-1" />
                Mood
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(mood === option.value ? "" : option.value)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      mood === option.value
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {option.emoji} {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Cloud className="w-4 h-4 inline mr-1" />
                Weather
              </label>
              <div className="grid grid-cols-5 gap-2">
                {WEATHER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWeather(weather === option.value ? "" : option.value)}
                    className={`px-2 py-2 text-sm rounded-md border transition-colors ${
                      weather === option.value
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Activity className="w-4 h-4 inline mr-1" />
                Activity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select activity</option>
                {ACTIVITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Eye className="w-4 h-4 inline mr-1" />
                Visibility
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "private", label: "Private" },
                  { value: "friends_only", label: "Friends" },
                  { value: "public", label: "Public" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setVisibility(option.value)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      visibility === option.value
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
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
