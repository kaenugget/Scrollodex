import { useAction, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useEffect, useState } from 'react';

interface VideoGenerationStatus {
  status: 'pending' | 'generating' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export function useVideoGeneration(contactId: Id<"contacts">, userId: Id<"users">) {
  const [isPolling, setIsPolling] = useState(false);
  const [lastChecked, setLastChecked] = useState<number>(0);
  
  const startVideoGeneration = useAction(api.pets.startVideoGeneration);
  const petData = useQuery(api.pets.getPetData, { contactId });
  
  // Extract video generation status from pet data
  const videoStatus: VideoGenerationStatus = {
    status: (petData?.videoGenerationStatus as 'pending' | 'generating' | 'completed' | 'failed') || 'pending',
    startedAt: petData?.videoGenerationStartedAt,
    completedAt: petData?.videoGenerationCompletedAt,
    error: petData?.videoGenerationError,
  };
  
  // Auto-poll when video generation is in progress
  useEffect(() => {
    if (videoStatus.status === 'generating' && !isPolling) {
      console.log('🎬 useVideoGeneration: Starting polling for video generation status');
      setIsPolling(true);
      
      const pollInterval = setInterval(() => {
        console.log('🎬 useVideoGeneration: Polling for video generation status...');
        setLastChecked(Date.now());
        
        // The useQuery will automatically refetch when we call it
        // We just need to check if the status has changed
      }, 5000); // Poll every 5 seconds
      
      return () => {
        console.log('🎬 useVideoGeneration: Stopping polling');
        clearInterval(pollInterval);
        setIsPolling(false);
      };
    } else if (videoStatus.status === 'completed' || videoStatus.status === 'failed') {
      // Stop polling when generation is complete or failed
      if (isPolling) {
        console.log('🎬 useVideoGeneration: Video generation finished, stopping polling');
        setIsPolling(false);
      }
    }
  }, [videoStatus.status, isPolling]);
  
  const handleStartVideoGeneration = async () => {
    try {
      console.log('🎬 useVideoGeneration: Starting video generation...');
      const result = await startVideoGeneration({
        contactId,
        userId,
      });
      
      console.log('🎬 useVideoGeneration: Video generation started:', result);
      return result;
    } catch (error) {
      console.error('🎬 useVideoGeneration: Failed to start video generation:', error);
      throw error;
    }
  };
  
  // Calculate time elapsed for generating status
  const getTimeElapsed = () => {
    if (videoStatus.status === 'generating' && videoStatus.startedAt) {
      return Math.floor((Date.now() - videoStatus.startedAt) / 1000);
    }
    return 0;
  };
  
  // Calculate estimated time remaining (rough estimate)
  const getEstimatedTimeRemaining = () => {
    const elapsed = getTimeElapsed();
    if (elapsed < 30) return '2-3 minutes';
    if (elapsed < 60) return '1-2 minutes';
    if (elapsed < 120) return '30-60 seconds';
    return 'Almost done';
  };
  
  return {
    videoStatus,
    isPolling,
    lastChecked,
    handleStartVideoGeneration,
    getTimeElapsed,
    getEstimatedTimeRemaining,
    // Helper functions
    isGenerating: videoStatus.status === 'generating',
    isCompleted: videoStatus.status === 'completed',
    isFailed: videoStatus.status === 'failed',
    isPending: videoStatus.status === 'pending',
    hasVideos: !!(petData?.happyVideoUrl || petData?.neutralVideoUrl || petData?.sadVideoUrl || petData?.excitedVideoUrl),
  };
}
