export declare const storeEmbedding: import("convex/server").RegisteredMutation<"public", {
    text: string;
    ownerId: import("convex/values").GenericId<"users">;
    entityType: string;
    entityId: string;
    vector: number[];
}, Promise<import("convex/values").GenericId<"embeddings">>>;
export declare const searchEmbeddings: import("convex/server").RegisteredQuery<"public", {
    limit?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    entityType: string;
    query: string;
}, Promise<{
    _id: import("convex/values").GenericId<"embeddings">;
    _creationTime: number;
    text: string;
    ownerId: import("convex/values").GenericId<"users">;
    updatedAt: number;
    entityType: string;
    entityId: string;
    vector: number[];
}[]>>;
export declare const generateIntroSuggestions: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    aContactId: import("convex/values").GenericId<"contacts">;
    bContactId: import("convex/values").GenericId<"contacts">;
}, Promise<import("convex/values").GenericId<"introsSuggestions">[]>>;
export declare const getIntroSuggestions: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"introsSuggestions">;
    _creationTime: number;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    aContactId: import("convex/values").GenericId<"contacts">;
    bContactId: import("convex/values").GenericId<"contacts">;
    why: string;
    score: number;
}[]>>;
export declare const trackUsage: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    date: string;
    feature: string;
    tokens: number;
}, Promise<import("convex/values").GenericId<"aiUsage">>>;
export declare const getUsage: import("convex/server").RegisteredQuery<"public", {
    startDate?: string | undefined;
    endDate?: string | undefined;
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"aiUsage">;
    _creationTime: number;
    ownerId: import("convex/values").GenericId<"users">;
    date: string;
    feature: string;
    tokens: number;
}[]>>;
export declare const getSettings: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"aiSettings">;
    _creationTime: number;
    dailyBudget?: number | undefined;
    monthlyBudget?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    enabledFeatures: string[];
} | null>>;
export declare const updateSettings: import("convex/server").RegisteredMutation<"public", {
    dailyBudget?: number | undefined;
    monthlyBudget?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    enabledFeatures: string[];
}, Promise<import("convex/values").GenericId<"aiSettings">>>;
//# sourceMappingURL=ai.d.ts.map