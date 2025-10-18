export declare const createOrFindUser: import("convex/server").RegisteredMutation<"public", {
    avatarUrl?: string | undefined;
    email: string;
    displayName: string;
    clerkUserId: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    email: string;
    displayName: string;
    avatarUrl: string | undefined;
    bio: string | undefined;
    createdAt: number;
    lastLoginAt: number | undefined;
}>>;
export declare const getUserByClerkId: import("convex/server").RegisteredQuery<"public", {
    clerkUserId: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    email: string;
    displayName: string;
    avatarUrl: string | undefined;
    bio: string | undefined;
    createdAt: number;
    lastLoginAt: number | undefined;
} | null>>;
//# sourceMappingURL=clerk.d.ts.map