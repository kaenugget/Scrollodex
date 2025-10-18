export declare const list: import("convex/server").RegisteredQuery<"public", {
    sort?: "level" | "dex" | "recent" | undefined;
    filterType?: string | undefined;
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"dexEntries">;
    _creationTime: number;
    pfpFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    level: number;
    updatedAt: number;
    contactId: import("convex/values").GenericId<"contacts">;
    dexNumber: number;
    types: string[];
    xp: number;
    prefs: string;
}[]>>;
export declare const getEntry: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    contact: {
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
    };
    dexEntry: {
        _id: import("convex/values").GenericId<"dexEntries">;
        _creationTime: number;
        pfpFileId?: import("convex/values").GenericId<"_storage"> | undefined;
        ownerId: import("convex/values").GenericId<"users">;
        level: number;
        updatedAt: number;
        contactId: import("convex/values").GenericId<"contacts">;
        dexNumber: number;
        types: string[];
        xp: number;
        prefs: string;
    } | null;
    preferences: {
        _id: import("convex/values").GenericId<"preferences">;
        _creationTime: number;
        ownerId: import("convex/values").GenericId<"users">;
        notes: string;
        contactId: import("convex/values").GenericId<"contacts">;
        food: string[];
        music: string[];
        hobbies: string[];
    } | null;
} | null>>;
export declare const computeEntry: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<import("convex/values").GenericId<"dexEntries">>>;
export declare const updateXp: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
    xpDelta: number;
    reason: string;
}, Promise<void>>;
//# sourceMappingURL=dex.d.ts.map