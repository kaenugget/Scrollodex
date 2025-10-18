import { Id } from '../../convex/_generated/dataModel';
interface VideoGenerationStatus {
    status: 'pending' | 'generating' | 'completed' | 'failed';
    startedAt?: number;
    completedAt?: number;
    error?: string;
}
export declare function useVideoGeneration(contactId: Id<"contacts">, userId: Id<"users">): {
    videoStatus: VideoGenerationStatus;
    isPolling: boolean;
    lastChecked: number;
    handleStartVideoGeneration: () => Promise<any>;
    getTimeElapsed: () => number;
    getEstimatedTimeRemaining: () => "2-3 minutes" | "1-2 minutes" | "30-60 seconds" | "Almost done";
    isGenerating: boolean;
    isCompleted: boolean;
    isFailed: boolean;
    isPending: boolean;
    hasVideos: boolean;
};
export {};
//# sourceMappingURL=useVideoGeneration.d.ts.map