"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Zap, Star, Sparkles, Palette, Wand2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface PetModelProps {
  contactId: Id<"contacts">;
  relationshipStats: {
    connection: number;
    reliability: number;
    communication: number;
    energy: number;
  };
  petData?: {
    petType?: string;
    petName?: string;
    level?: number;
    happiness?: number;
    color?: string;
    pattern?: string;
    accessory?: string;
    happyImageUrl?: string;
    neutralImageUrl?: string;
    sadImageUrl?: string;
    excitedImageUrl?: string;
    happyVideoUrl?: string;
    neutralVideoUrl?: string;
    sadVideoUrl?: string;
    excitedVideoUrl?: string;
  };
}

export function PetModel({ contactId, relationshipStats, petData }: PetModelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [petModel, setPetModel] = useState(petData);
  const [showCustomize, setShowCustomize] = useState(false);
  
  const hatchPet = useMutation(api.pets.hatchPet);
  const updatePetHappiness = useMutation(api.pets.updatePetHappiness);
  const customizePet = useMutation(api.pets.customizePet);
  const petTemplates = useQuery(api.pets.getPetTemplates);

  // Calculate overall relationship health for pet nurturing
  const overallHealth = Math.round(
    (relationshipStats.connection + relationshipStats.reliability + 
     relationshipStats.communication + relationshipStats.energy) / 4
  );

  // Get current pet state based on happiness
  const getPetState = () => {
    if (!petModel?.happiness) return 'neutral';
    if (petModel.happiness >= 80) return 'excited';
    if (petModel.happiness >= 60) return 'happy';
    if (petModel.happiness >= 40) return 'neutral';
    return 'sad';
  };

  // Get current pet video based on state
  const getCurrentPetVideo = () => {
    const state = getPetState();
    return petModel?.[`${state}VideoUrl` as keyof typeof petModel] as string || petModel?.neutralVideoUrl;
  };

  // Fallback to image if video not available
  const getCurrentPetImage = () => {
    const state = getPetState();
    return petModel?.[`${state}ImageUrl` as keyof typeof petModel] as string || petModel?.neutralImageUrl;
  };

  // Hatch a new pet
  const handleHatchPet = async () => {
    setIsGenerating(true);
    try {
      const result = await hatchPet({
        contactId,
        relationshipHealth: overallHealth,
      });

      if (result.success) {
        setPetModel(result.petData);
      }
    } catch (error) {
      console.error('Failed to hatch pet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update pet happiness when relationship stats change
  useEffect(() => {
    if (petModel) {
      updatePetHappiness({
        contactId,
        relationshipStats,
      });
    }
  }, [relationshipStats, contactId, updatePetHappiness, petModel]);

  // Pet happiness based on relationship health
  const petHappiness = petModel?.happiness || Math.min(100, overallHealth + Math.floor(Math.random() * 10));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Relationship Pet</h3>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700">{petHappiness}%</span>
        </div>
      </div>

      {/* Pet Display Area */}
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 mb-4 min-h-[200px] flex items-center justify-center">
        {isGenerating ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <div className="text-sm text-gray-600">Hatching your pet...</div>
          </div>
        ) : petModel && (getCurrentPetVideo() || getCurrentPetImage()) ? (
          <div className="text-center">
            {/* Pet Video/Image */}
            <div className="w-32 h-32 mb-4 mx-auto rounded-full overflow-hidden bg-white shadow-lg">
              {getCurrentPetVideo() ? (
                <video 
                  src={getCurrentPetVideo()} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to image if video fails
                    const video = e.currentTarget;
                    const img = document.createElement('img');
                    img.src = getCurrentPetImage() || '';
                    img.className = 'w-full h-full object-cover';
                    img.alt = `${petModel.petName} the ${petModel.petType}`;
                    img.onError = () => {
                      // Final fallback to placeholder
                      video.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                          <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      `;
                    };
                    video.parentElement!.replaceChild(img, video);
                  }}
                />
              ) : (
                <img 
                  src={getCurrentPetImage()} 
                  alt={`${petModel.petName} the ${petModel.petType}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                        <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    `;
                  }}
                />
              )}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {petModel.petName} the {petModel.petType}
            </div>
            <div className="text-xs text-gray-500">
              {petModel.color} {petModel.pattern} • {petModel.accessory !== 'none' ? petModel.accessory : 'no accessory'}
            </div>
            {getCurrentPetVideo() && (
              <div className="text-xs text-purple-600 mt-1">
                ✨ Animated Pet
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600 mb-4">No pet yet</div>
            <button
              onClick={handleHatchPet}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Hatch Pet
            </button>
          </div>
        )}
      </div>

      {/* Pet Stats */}
      {petModel && (
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pet Level</span>
            <span className="font-semibold text-gray-900">Lv. {petModel.level || 1}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pet Type</span>
            <span className="font-semibold text-gray-900 capitalize">{petModel.petType}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Happiness</span>
            <span className="font-semibold text-gray-900">{petHappiness}%</span>
          </div>

          {/* Happiness Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${petHappiness}%` }}
            ></div>
          </div>

          {/* Customize Button */}
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="w-full mt-3 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Palette className="w-4 h-4" />
            Customize Pet
          </button>
        </div>
      )}

      {/* Customization Panel */}
      {showCustomize && petModel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Customize Your Pet</h4>
          
          <div className="space-y-3">
            {/* Pet Name */}
            <div>
              <label className="text-xs text-gray-600">Pet Name</label>
              <input
                type="text"
                defaultValue={petModel.petName}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Enter pet name"
                onChange={(e) => {
                  if (e.target.value) {
                    customizePet({
                      contactId,
                      petName: e.target.value,
                    });
                  }
                }}
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-xs text-gray-600">Color</label>
              <div className="flex gap-2 mt-1">
                {['blue', 'purple', 'pink', 'green', 'yellow', 'red'].map(color => (
                  <button
                    key={color}
                    onClick={() => customizePet({ contactId, color })}
                    className={`w-6 h-6 rounded-full border-2 ${
                      petModel.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Accessory Selection */}
            <div>
              <label className="text-xs text-gray-600">Accessory</label>
              <div className="flex gap-2 mt-1">
                {['none', 'hat', 'bow', 'collar', 'glasses'].map(accessory => (
                  <button
                    key={accessory}
                    onClick={() => customizePet({ contactId, accessory })}
                    className={`px-2 py-1 text-xs rounded ${
                      petModel.accessory === accessory 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {accessory}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nurturing Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-800">
          <strong>Nurturing Tips:</strong> Schedule meetings, send messages, and maintain strong communication to help your pet grow!
        </div>
      </div>
    </div>
  );
}
