export declare const hatchPet: any;
export declare const updatePetData: import("convex/server").RegisteredMutation<"public", {
    petData: any;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<void>>;
export declare const updateVideoGenerationStatus: import("convex/server").RegisteredMutation<"public", {
    error?: string | undefined;
    completedAt?: number | undefined;
    startedAt?: number | undefined;
    status: "pending" | "generating" | "completed" | "failed";
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<void>>;
export declare const getPetData: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    color?: string | undefined;
    pattern?: string | undefined;
    petType?: string | undefined;
    petName?: string | undefined;
    level?: number | undefined;
    happiness?: number | undefined;
    accessory?: string | undefined;
    happyImageUrl?: string | undefined;
    neutralImageUrl?: string | undefined;
    sadImageUrl?: string | undefined;
    excitedImageUrl?: string | undefined;
    happyVideoUrl?: string | undefined;
    neutralVideoUrl?: string | undefined;
    sadVideoUrl?: string | undefined;
    excitedVideoUrl?: string | undefined;
    templateId?: string | undefined;
    generatedAt?: number | undefined;
    lastUpdated?: number | undefined;
    hatchedAt?: number | undefined;
    regeneratedAt?: number | undefined;
    evolutionTokens?: number | undefined;
    totalEvolutions?: number | undefined;
    lastEvolutionAt?: number | undefined;
    videoGenerationStatus?: string | undefined;
    videoGenerationStartedAt?: number | undefined;
    videoGenerationCompletedAt?: number | undefined;
    videoGenerationError?: string | undefined;
} | null>>;
export declare const updatePetHappiness: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
    relationshipStats: {
        connection: number;
        reliability: number;
        communication: number;
        energy: number;
    };
}, Promise<{
    success: boolean;
    happiness: number;
    level: number;
    leveledUp: boolean;
    tokensAwarded: number;
    totalTokens: number;
} | undefined>>;
export declare const customizePet: import("convex/server").RegisteredAction<"public", {
    color?: string | undefined;
    pattern?: string | undefined;
    petName?: string | undefined;
    accessory?: string | undefined;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    success: boolean;
} | undefined>>;
export declare const getPetTemplates: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    type: string;
    rarity: string;
    hatchChance: number;
    colors: string[];
    patterns: string[];
}[]>>;
export declare const getContact: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"contacts">;
    _creationTime: number;
    role?: string | undefined;
    birthday?: string | undefined;
    company?: string | undefined;
    location?: string | undefined;
    connectedUserId?: import("convex/values").GenericId<"users"> | undefined;
    isDynamicContact?: boolean | undefined;
    lastSyncedAt?: number | undefined;
    petData?: {
        color?: string | undefined;
        pattern?: string | undefined;
        petType?: string | undefined;
        petName?: string | undefined;
        level?: number | undefined;
        happiness?: number | undefined;
        accessory?: string | undefined;
        happyImageUrl?: string | undefined;
        neutralImageUrl?: string | undefined;
        sadImageUrl?: string | undefined;
        excitedImageUrl?: string | undefined;
        happyVideoUrl?: string | undefined;
        neutralVideoUrl?: string | undefined;
        sadVideoUrl?: string | undefined;
        excitedVideoUrl?: string | undefined;
        templateId?: string | undefined;
        generatedAt?: number | undefined;
        lastUpdated?: number | undefined;
        hatchedAt?: number | undefined;
        regeneratedAt?: number | undefined;
        evolutionTokens?: number | undefined;
        totalEvolutions?: number | undefined;
        lastEvolutionAt?: number | undefined;
        videoGenerationStatus?: string | undefined;
        videoGenerationStartedAt?: number | undefined;
        videoGenerationCompletedAt?: number | undefined;
        videoGenerationError?: string | undefined;
    } | undefined;
    name: string;
    ownerId: import("convex/values").GenericId<"users">;
    emails: string[];
    phones: string[];
    tags: string[];
    notes: string[];
    lastInteractionAt: number;
    pinned: boolean;
} | null>>;
export declare const evolvePet: any;
export declare const awardEvolutionTokens: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
    tokens: number;
    reason: string;
}, Promise<{
    success: boolean;
    newTokens: number;
    reason: string;
} | undefined>>;
export declare const getCustomizationOptions: import("convex/server").RegisteredQuery<"public", {
    petType: string;
}, Promise<{
    colors: string[];
    patterns: string[];
    accessories: string[];
}>>;
export declare const startVideoGeneration: import("convex/server").RegisteredAction<"public", {
    userId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    success: boolean;
    message: string;
    status: string;
}>>;
export declare const generatePetVideos: import("convex/server").RegisteredAction<"public", {
    userId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    success: boolean;
    videoUrls: Record<string, string>;
    message: string;
}>>;
export declare const debugPetData: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    color?: string | undefined;
    pattern?: string | undefined;
    petType?: string | undefined;
    petName?: string | undefined;
    level?: number | undefined;
    happiness?: number | undefined;
    accessory?: string | undefined;
    happyImageUrl?: string | undefined;
    neutralImageUrl?: string | undefined;
    sadImageUrl?: string | undefined;
    excitedImageUrl?: string | undefined;
    happyVideoUrl?: string | undefined;
    neutralVideoUrl?: string | undefined;
    sadVideoUrl?: string | undefined;
    excitedVideoUrl?: string | undefined;
    templateId?: string | undefined;
    generatedAt?: number | undefined;
    lastUpdated?: number | undefined;
    hatchedAt?: number | undefined;
    regeneratedAt?: number | undefined;
    evolutionTokens?: number | undefined;
    totalEvolutions?: number | undefined;
    lastEvolutionAt?: number | undefined;
    videoGenerationStatus?: string | undefined;
    videoGenerationStartedAt?: number | undefined;
    videoGenerationCompletedAt?: number | undefined;
    videoGenerationError?: string | undefined;
} | null>>;
export declare const createPetTemplate: import("convex/server").RegisteredMutation<"public", {
    petType: string;
    templateId: string;
    rarity: string;
    basePrompt: string;
    colors: string[];
    patterns: string[];
    accessories: string[];
    hatchChance: number;
}, Promise<import("convex/values").GenericId<"petTemplates">>>;
//# sourceMappingURL=pets.d.ts.map