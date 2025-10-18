export declare const getUserById: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    email: string;
    displayName: string;
    avatarUrl: string | undefined;
    bio: string | undefined;
    createdAt: number;
    lastLoginAt: number | undefined;
} | null>>;
export declare const getUser: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    email: string;
    displayName: string;
    avatarUrl: string | undefined;
    bio: string | undefined;
    createdAt: number;
    lastLoginAt: number | undefined;
} | null>>;
export declare const getOrCreateDemoUser: import("convex/server").RegisteredMutation<"public", {}, Promise<import("convex/values").GenericId<"users">>>;
export declare const getUserByEmail: import("convex/server").RegisteredQuery<"public", {
    email: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    firstName?: string | undefined;
    lastName?: string | undefined;
    passwordHash?: string | undefined;
    clerkUserId?: string | undefined;
    avatarUrl?: string | undefined;
    selfieFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    bio?: string | undefined;
    lastLoginAt?: number | undefined;
    email: string;
    displayName: string;
    createdAt: number;
} | null>>;
export declare const createUser: import("convex/server").RegisteredMutation<"public", {
    passwordHash?: string | undefined;
    clerkUserId?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    email: string;
    displayName: string;
}, Promise<import("convex/values").GenericId<"users">>>;
export declare const getOrCreateUserByEmail: import("convex/server").RegisteredMutation<"public", {
    passwordHash?: string | undefined;
    clerkUserId?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    email: string;
    displayName: string;
}, Promise<import("convex/values").GenericId<"users">>>;
export declare const updateProfile: import("convex/server").RegisteredMutation<"public", {
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    token: string;
}, Promise<{
    success: boolean;
}>>;
//# sourceMappingURL=users.d.ts.map