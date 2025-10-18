"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Star, Video, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';

interface PetModelProps {
  contactId: Id<"contacts">;
  userId: Id<"users">;
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
    evolutionTokens?: number;
    totalEvolutions?: number;
    lastEvolutionAt?: number;
  };
}

export function PetModel({ contactId, userId, relationshipStats, petData }: PetModelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [petModel, setPetModel] = useState(petData);
  const [showEvolve, setShowEvolve] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');
  const [debugStyle, setDebugStyle] = useState<'happy' | 'neutral' | 'sad' | 'excited' | null>(null);
  
  const hatchPet = useAction(api.pets.hatchPet);
  const updatePetHappiness = useMutation(api.pets.updatePetHappiness);
  const evolvePet = useAction(api.pets.evolvePet);
  const generatePetVideos = useAction(api.pets.generatePetVideos);
  const getCustomizationOptions = useQuery(api.pets.getCustomizationOptions, 
    petData?.petType ? { petType: petData.petType } : "skip"
  );
  const debugPetData = useQuery(api.pets.debugPetData, 
    contactId ? { contactId } : "skip"
  );
  
  // Video generation hook
  const {
    videoStatus,
    isPolling,
    handleStartVideoGeneration,
    getTimeElapsed,
    getEstimatedTimeRemaining,
    isGenerating: isVideoGenerating,
    isCompleted: isVideoCompleted,
    isFailed: isVideoFailed,
    isPending: isVideoPending,
    hasVideos,
  } = useVideoGeneration(contactId, userId);

  // Update pet model when petData changes
  useEffect(() => {
    console.log('🐣 PetModel: petData changed:', petData);
    setPetModel(petData);
  }, [petData]);

  // Test Convex connection
  const testConnection = async () => {
    try {
      console.log('🐣 PetModel: Testing Convex connection...');
      setConnectionStatus('unknown');
      
      // Try a simple query to test connection
      const testResult = await hatchPet({
        contactId,
        userId,
        relationshipHealth: 50, // Use a test value
      });
      
      console.log('🐣 PetModel: Connection test successful:', testResult);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('🐣 PetModel: Connection test failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Check if pet actually exists (has essential data)
  const hasExistingPet = !!(petModel && petModel.petType && petModel.level && petModel.happiness !== undefined);
  
  // Check if we're still loading pet data (petData is undefined but we expect it)
  const isLoadingPetData = petData === undefined;
  
  console.log('🐣 PetModel: State check:', {
    petData,
    petModel,
    hasExistingPet,
    isLoadingPetData,
    isGenerating,
    contactId,
    userId,
    relationshipStats,
  });

  // Enhanced debugging for pet existence check
  console.log('🐣 PetModel: Pet existence debug:', {
    'petData exists': !!petData,
    'petData.petType': petData?.petType,
    'petData.level': petData?.level,
    'petData.happiness': petData?.happiness,
    'petModel exists': !!petModel,
    'petModel.petType': petModel?.petType,
    'petModel.level': petModel?.level,
    'petModel.happiness': petModel?.happiness,
    'hasExistingPet calculation': hasExistingPet,
    'petData === petModel': petData === petModel,
    'JSON comparison': JSON.stringify(petData) === JSON.stringify(petModel),
  });

  // Calculate overall relationship health for pet nurturing
  const overallHealth = Math.round(
    (relationshipStats.connection + relationshipStats.reliability + 
     relationshipStats.communication + relationshipStats.energy) / 4
  );

  // Debug relationship health calculation
  console.log('🐣 PetModel: Relationship health calculation:', {
    connection: relationshipStats.connection,
    reliability: relationshipStats.reliability,
    communication: relationshipStats.communication,
    energy: relationshipStats.energy,
    sum: relationshipStats.connection + relationshipStats.reliability + relationshipStats.communication + relationshipStats.energy,
    average: (relationshipStats.connection + relationshipStats.reliability + relationshipStats.communication + relationshipStats.energy) / 4,
    overallHealth,
    timestamp: new Date().toISOString(),
  });

  // Get current pet state based on happiness
  const getPetState = () => {
    if (!petModel?.happiness) return 'neutral';
    if (petModel.happiness >= 80) return 'excited';
    if (petModel.happiness >= 60) return 'happy';
    if (petModel.happiness >= 40) return 'neutral';
    return 'sad';
  };

  // Get debug pet state (for testing different styles)
  const getDebugPetState = () => {
    return debugStyle || getPetState();
  };

  // Get current pet video based on state
  const getCurrentPetVideo = () => {
    const state = getPetState();
    return petModel?.[`${state}VideoUrl` as keyof typeof petModel] as string || petModel?.neutralVideoUrl;
  };

  // Get debug pet video (for testing different styles)
  const getDebugPetVideo = () => {
    const state = getDebugPetState();
    return petModel?.[`${state}VideoUrl` as keyof typeof petModel] as string || petModel?.neutralVideoUrl;
  };

  // Fallback to image if video not available
  const getCurrentPetImage = () => {
    const state = getPetState();
    const imageUrl = petModel?.[`${state}ImageUrl` as keyof typeof petModel] as string || petModel?.neutralImageUrl;
    // Return null instead of empty string to prevent browser from trying to load the current page
    return imageUrl || null;
  };

  // Get debug pet image (for testing different styles)
  const getDebugPetImage = () => {
    const state = getDebugPetState();
    const imageUrl = petModel?.[`${state}ImageUrl` as keyof typeof petModel] as string || petModel?.neutralImageUrl;
    return imageUrl || null;
  };

  // Hatch a new pet
  const handleHatchPet = async () => {
    console.log('🐣 PetModel: handleHatchPet called');
    console.log('🐣 PetModel: hasExistingPet =', hasExistingPet);
    console.log('🐣 PetModel: contactId =', contactId);
    console.log('🐣 PetModel: userId =', userId);
    console.log('🐣 PetModel: overallHealth =', overallHealth);
    console.log('🐣 PetModel: petData at click time =', petData);
    console.log('🐣 PetModel: petModel at click time =', petModel);
    
    // Allow regenerating existing pets, but log the action
    if (hasExistingPet) {
      console.log('🐣 PetModel: Regenerating existing pet:', {
        petModel: !!petModel,
        petType: petModel?.petType,
        level: petModel?.level,
        happiness: petModel?.happiness,
      });
    }
    
    console.log('🐣 PetModel: Starting pet hatching process...');
    setIsGenerating(true);
    
    try {
      console.log('🐣 PetModel: Calling hatchPet action with:', {
        contactId,
        userId,
        relationshipHealth: overallHealth,
      });
      
      // Add timeout and retry logic for connection issues
      // Increased timeout to 3 minutes since pet generation can take time
      const result = await Promise.race([
        hatchPet({
          contactId,
          userId,
          relationshipHealth: overallHealth,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Pet generation timeout after 3 minutes. The process may still be running in the background.')), 180000)
        )
      ]) as { success: boolean; petData?: any; isRegeneration?: boolean };

      console.log('🐣 PetModel: hatchPet result =', result);

      if (result.success) {
        if ((result as any).isRegeneration) {
          console.log('🐣 PetModel: Pet regenerated successfully, updating state');
        } else {
          console.log('🐣 PetModel: Pet hatched successfully, updating state');
        }
        setPetModel(result.petData);
        
        // Start video generation in the background
        try {
          console.log('🎬 PetModel: Starting video generation after pet creation...');
          await handleStartVideoGeneration();
        } catch (videoError) {
          console.error('🎬 PetModel: Failed to start video generation:', videoError);
          // Don't fail the whole operation if video generation fails
        }
      } else {
        console.error('🐣 PetModel: Pet hatching failed - result.success is false');
      }
    } catch (error) {
      console.error('🐣 PetModel: Failed to hatch pet:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('🐣 PetModel: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        
        // Check for specific error types
        if (error.message.includes('Connection lost')) {
          console.error('🐣 PetModel: CONVEX CONNECTION ERROR - Check your internet connection and Convex status');
        } else if (error.message.includes('timeout')) {
          console.error('🐣 PetModel: REQUEST TIMEOUT - The operation took too long');
        } else if (error.message.includes('permission')) {
          console.error('🐣 PetModel: PERMISSION ERROR - Check user authentication');
        } else if (error.message.includes('FAL_KEY')) {
          console.error('🐣 PetModel: FAL API KEY ERROR - Check environment configuration');
        } else if (error.message.includes('rate limit')) {
          console.error('🐣 PetModel: API RATE LIMIT ERROR - Too many requests');
        }
      } else {
        console.error('🐣 PetModel: Unknown error type:', typeof error);
      }
      
      // Show user-friendly error message based on error type
      let userMessage = 'Pet generation failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message?.includes('timeout')) {
          userMessage = 'Pet generation is taking longer than expected. Please refresh the page and check if your pet was created.';
        } else if (error.message?.includes('Connection lost')) {
          userMessage = 'Connection lost during pet generation. Please check your internet connection and try again.';
        } else if (error.message?.includes('permission')) {
          userMessage = 'You do not have permission to generate a pet for this contact.';
        } else if (error.message?.includes('not found')) {
          userMessage = 'Contact not found. Please refresh the page and try again.';
        } else if (error.message?.includes('FAL_KEY')) {
          userMessage = 'Pet generation service is not configured. Please contact support.';
        } else if (error.message?.includes('rate limit')) {
          userMessage = 'Too many requests. Please wait a moment and try again.';
        } else {
          userMessage = `Pet generation failed: ${error.message}. Please try again.`;
        }
      }
      
      alert(userMessage);
    } finally {
      console.log('🐣 PetModel: Setting isGenerating to false');
      setIsGenerating(false);
    }
  };

  // Generate videos for pet (now uses async system)
  const handleGenerateVideos = async () => {
    console.log('🎬 PetModel: Starting async video generation...');
    
    try {
      const result = await handleStartVideoGeneration();
      console.log('🎬 PetModel: Video generation started:', result);
      alert(result.message || 'Video generation started! Check back in a few minutes.');
    } catch (error) {
      console.error('🎬 PetModel: Video generation error:', error);
      
      let errorMessage = 'Failed to start video generation. Please try again.';
      
      if (error instanceof Error) {
        if (error.message?.includes('permission')) {
          errorMessage = 'You do not have permission to generate videos for this pet.';
        } else {
          errorMessage = `Video generation failed: ${error.message}. Please try again.`;
        }
      }
      
      alert(errorMessage);
    }
  };

  // Evolve pet with customization
  const handleEvolve = async (customizationType: string, newValue: string) => {
    console.log('🔄 PetModel: Starting evolution:', { customizationType, newValue });
    
    setIsGenerating(true);
    
    try {
      // Add timeout and retry logic for connection issues
      // Reduced timeout to 2 minutes since we're only generating images now
      const result = await Promise.race([
        evolvePet({
          contactId,
          userId,
          customizationType,
          newValue,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Evolution timeout after 2 minutes. The process may still be running in the background.')), 120000)
        )
      ]) as { success: boolean; newTokens?: number; totalEvolutions?: number };
      
      console.log('🔄 PetModel: Evolution result:', result);
      
      if (result.success) {
        console.log('🔄 PetModel: Evolution successful, updating state');
        // Refresh the pet data by triggering a re-render
        setPetModel(prev => ({
          ...prev,
          [customizationType]: newValue,
          evolutionTokens: result.newTokens,
          totalEvolutions: result.totalEvolutions,
        }));
        setShowEvolve(false);
        alert(`Evolution successful! ${customizationType} changed to ${newValue}.`);
        
        // Start video generation in the background for visual changes
        if (["color", "pattern", "accessory"].includes(customizationType)) {
          try {
            console.log('🎬 PetModel: Starting video generation after evolution...');
            await handleStartVideoGeneration();
          } catch (videoError) {
            console.error('🎬 PetModel: Failed to start video generation:', videoError);
            // Don't fail the whole operation if video generation fails
          }
        }
      } else {
        console.error('🔄 PetModel: Evolution failed - result.success is false');
        alert('Evolution failed. Please try again.');
      }
    } catch (error) {
      console.error('🔄 PetModel: Evolution error:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error('🔄 PetModel: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        
        // Check for specific error types
        if (error.message.includes('Connection lost')) {
          console.error('🔄 PetModel: CONVEX CONNECTION ERROR - Check your internet connection and Convex status');
        } else if (error.message.includes('timeout')) {
          console.error('🔄 PetModel: REQUEST TIMEOUT - The operation took too long');
        } else if (error.message.includes('permission')) {
          console.error('🔄 PetModel: PERMISSION ERROR - Check user authentication');
        } else if (error.message.includes('FAL_KEY')) {
          console.error('🔄 PetModel: FAL API KEY ERROR - Check environment configuration');
        } else if (error.message.includes('rate limit')) {
          console.error('🔄 PetModel: API RATE LIMIT ERROR - Too many requests');
        }
      } else {
        console.error('🔄 PetModel: Unknown error type:', typeof error);
      }
      
      // Show user-friendly error message based on error type
      let errorMessage = 'Evolution failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message?.includes('timeout')) {
          errorMessage = 'Evolution is taking longer than expected. Please refresh the page and check if your pet was evolved.';
        } else if (error.message?.includes('Connection lost')) {
          errorMessage = 'Connection lost during evolution. Please check your internet connection and try again.';
        } else if (error.message?.includes('permission')) {
          errorMessage = 'You do not have permission to evolve this pet.';
        } else if (error.message?.includes('Not enough evolution tokens')) {
          errorMessage = error.message;
        } else if (error.message?.includes('not found')) {
          errorMessage = 'Contact not found. Please refresh the page and try again.';
        } else if (error.message?.includes('FAL_KEY')) {
          errorMessage = 'Pet generation service is not configured. Please contact support.';
        } else if (error.message?.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else {
          errorMessage = `Evolution failed: ${error.message}. Please try again.`;
        }
      }
      
      alert(errorMessage);
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
      }).then((result) => {
        if (result?.leveledUp && result?.tokensAwarded > 0) {
          console.log('🎁 PetModel: Pet leveled up! Tokens awarded:', result.tokensAwarded);
          // Update local state to reflect new tokens
          setPetModel(prev => ({
            ...prev,
            level: result.level,
            happiness: result.happiness,
            evolutionTokens: result.totalTokens,
          }));
          
          // Show level up notification
          alert(`🎉 Level Up! Your pet reached level ${result.level} and earned ${result.tokensAwarded} evolution tokens!`);
        }
      }).catch((error) => {
        console.error('🐣 PetModel: Failed to update pet happiness:', error);
      });
    }
  }, [relationshipStats, contactId, updatePetHappiness, petModel]);

  // Pet happiness should directly reflect relationship health
  const petHappiness = hasExistingPet ? (petModel?.happiness || overallHealth) : overallHealth;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isLoadingPetData ? 'Loading...' : hasExistingPet ? `Your ${petModel?.petType || 'Pet'}` : 'Hatch Your Pet'}
        </h3>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700">
            {isLoadingPetData ? '...' : hasExistingPet ? `${petHappiness}%` : `${petHappiness}% potential`}
          </span>
        </div>
      </div>

      {/* Pet Display Area */}
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 mb-4 min-h-[200px] flex items-center justify-center">
        {isLoadingPetData ? (
          <div className="text-center">
            <LoadingSpinner size="xl" className="mx-auto mb-4" />
            <div className="text-sm text-gray-600">Loading pet data...</div>
          </div>
        ) : isGenerating ? (
          <div className="text-center">
            <LoadingSpinner size="xl" className="mx-auto mb-4" />
            <div className="text-sm text-gray-600">Hatching your pet...</div>
            <div className="text-xs text-gray-500 mt-2">This may take a few moments</div>
          </div>
        ) : hasExistingPet ? (
          <div className="text-center">
            {/* Pet Video/Image */}
            <div className="w-32 h-32 mb-4 mx-auto rounded-full overflow-hidden bg-white shadow-lg">
              {(() => {
                // Use debug functions when debugStyle is set, otherwise use normal functions
                const videoUrl = debugStyle ? getDebugPetVideo() : getCurrentPetVideo();
                const imageUrl = debugStyle ? getDebugPetImage() : getCurrentPetImage();
                
                // Debug logging
                console.log('🐣 PetModel: Media URLs for display:', {
                  debugStyle,
                  videoUrl,
                  imageUrl,
                  hasVideo: !!(videoUrl && videoUrl.trim() !== ""),
                  hasImage: !!(imageUrl && imageUrl.trim() !== "")
                });
                
                return videoUrl && videoUrl.trim() !== "" ? (
                  <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
                      console.log('🐣 PetModel: Video failed to load, falling back to image:', videoUrl);
                      // Fallback to image if video fails
                      const video = e.currentTarget;
                      const img = document.createElement('img');
                      img.src = imageUrl || '';
                      img.className = 'w-full h-full object-cover';
                      img.alt = `${petModel.petName} the ${petModel.petType}`;
                      img.onerror = () => {
                        console.log('🐣 PetModel: Image also failed to load, showing placeholder');
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
                    onLoadStart={() => console.log('🐣 PetModel: Video loading started:', videoUrl)}
                    onCanPlay={() => console.log('🐣 PetModel: Video can play:', videoUrl)}
                  />
                ) : imageUrl && imageUrl.trim() !== "" ? (
                  <img 
                    src={imageUrl} 
                    alt={`${petModel.petName} the ${petModel.petType}`}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      console.log('🐣 PetModel: Image failed to load, showing placeholder:', imageUrl);
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
                    onLoad={() => console.log('🐣 PetModel: Image loaded successfully:', imageUrl)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                );
              })()}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {petModel.petName} the {petModel.petType}
            </div>
            <div className="text-xs text-gray-500">
              {petModel.color} {petModel.pattern} • {petModel.accessory !== 'none' ? petModel.accessory : 'no accessory'}
            </div>
            {/* Video Status Indicator */}
            <div className="text-xs mt-1">
              {isVideoCompleted && hasVideos && (
                <div className="text-purple-600 flex items-center justify-center gap-1">
                  <Video className="w-3 h-3" />
                  ✨ Animated Pet
                </div>
              )}
              {isVideoGenerating && (
                <div className="text-blue-600 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 animate-spin" />
                  Generating videos... ({getTimeElapsed()}s)
                </div>
              )}
              {isVideoFailed && (
                <div className="text-red-600 flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Video generation failed
                </div>
              )}
              {isVideoPending && !hasVideos && (
                <div className="text-gray-500 flex items-center justify-center gap-1">
                  <Video className="w-3 h-3" />
                  Videos pending
                </div>
              )}
            </div>
          </div>
        ) : hasExistingPet ? (
          <div className="text-center">
            {/* Pet exists but no media yet - show placeholder with pet info */}
            <div className="w-32 h-32 mb-4 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🐱</div>
                <div className="text-xs font-bold">{petModel.petType?.charAt(0).toUpperCase()}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {petModel.petName} the {petModel.petType}
            </div>
            <div className="text-xs text-gray-500">
              {petModel.color} {petModel.pattern} • {petModel.accessory !== 'none' ? petModel.accessory : 'no accessory'}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              ✨ Pet Generated Successfully
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600 mb-2">No pet yet</div>
            <div className="text-xs text-gray-500 mb-4">
              Your relationship health is {petHappiness}% - perfect for hatching!
            </div>
            <button
              onClick={handleHatchPet}
              disabled={isGenerating || hasExistingPet}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasExistingPet 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Hatching...' : hasExistingPet ? 'Pet Already Exists' : 'Hatch Pet'}
            </button>
          </div>
        )}
      </div>

      {/* Pet Stats */}
      {hasExistingPet && (
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

          {/* Action Buttons */}
          <div className="flex justify-center mt-3">
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setShowEvolve(true)}
                disabled={isGenerating}
                className="px-6 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star className="w-4 h-4" />
                Evolve Your Pet
              </button>
              <button
                onClick={handleHatchPet}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate Pet'}
              </button>
              <button
                onClick={handleGenerateVideos}
                disabled={isGenerating || isVideoGenerating}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isVideoGenerating 
                    ? 'bg-blue-100 text-blue-700' 
                    : isVideoCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isVideoGenerating ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    Generating Videos...
                  </div>
                ) : isVideoCompleted ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Videos Ready
                  </div>
                ) : isVideoFailed ? (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Retry Videos
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Generate Videos
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evolution Panel */}
      {showEvolve && hasExistingPet && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-900">Evolve Your Pet</h4>
            <button
              onClick={() => setShowEvolve(false)}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-3 p-2 bg-purple-100 rounded text-xs text-purple-800">
            <strong>Evolution Mode:</strong> All customizations are free for testing!<br/>
            <strong>Note:</strong> Evolution generates images quickly. Use "Generate Videos" button for animations.
          </div>
          
          {getCustomizationOptions && (
            <div className="space-y-3">
              {/* Color Evolution */}
              <div>
                <label className="text-xs text-purple-700 font-medium">Change Color</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {getCustomizationOptions.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => handleEvolve('color', color)}
                      disabled={isGenerating}
                      className={`w-8 h-8 rounded-full border-2 ${
                        petModel?.color === color ? 'border-purple-800' : 'border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{ backgroundColor: color }}
                      title={`Change to ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Pattern Evolution */}
              <div>
                <label className="text-xs text-purple-700 font-medium">Change Pattern</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {getCustomizationOptions.patterns.map((pattern: string) => (
                    <button
                      key={pattern}
                      onClick={() => handleEvolve('pattern', pattern)}
                      disabled={isGenerating}
                      className={`px-3 py-1 text-xs rounded border ${
                        petModel?.pattern === pattern 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-white text-gray-700 border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessory Evolution */}
              <div>
                <label className="text-xs text-purple-700 font-medium">Change Accessory</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {getCustomizationOptions.accessories.map((accessory: string) => (
                    <button
                      key={accessory}
                      onClick={() => handleEvolve('accessory', accessory)}
                      disabled={isGenerating}
                      className={`px-3 py-1 text-xs rounded border ${
                        petModel?.accessory === accessory 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-white text-gray-700 border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {accessory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Evolution (Free) */}
              <div>
                <label className="text-xs text-purple-700 font-medium">Change Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    defaultValue={petModel?.petName || ''}
                    placeholder="Enter new name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleEvolve('petName', e.currentTarget.value.trim());
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {isGenerating && (
            <div className="mt-3 p-2 bg-purple-100 rounded text-xs text-purple-800 text-center">
              🔄 Evolving your pet...
            </div>
          )}
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
