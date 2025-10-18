export declare const register: import("convex/server").RegisteredMutation<"public", {
    firstName?: string | undefined;
    lastName?: string | undefined;
    selfieFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    email: string;
    displayName: string;
    password: string;
}, Promise<{
    userId: import("convex/values").GenericId<"users">;
    token: string;
}>>;
export declare const login: import("convex/server").RegisteredMutation<"public", {
    email: string;
    password: string;
}, Promise<{
    userId: import("convex/values").GenericId<"users">;
    token: string;
}>>;
export declare const getCurrentUser: import("convex/server").RegisteredQuery<"public", {
    token: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    email: string;
    displayName: string;
    avatarUrl: string | undefined;
    bio: string | undefined;
    createdAt: number;
    lastLoginAt: number | undefined;
} | null>>;
export declare const logout: import("convex/server").RegisteredMutation<"public", {
    token: string;
}, Promise<void>>;
export declare const changePassword: import("convex/server").RegisteredMutation<"public", {
    token: string;
    currentPassword: string;
    newPassword: string;
}, Promise<{
    success: boolean;
}>>;
export declare const googleSignIn: import("convex/server").RegisteredMutation<"public", {
    avatarUrl?: string | undefined;
    email: string;
    displayName: string;
    googleId: string;
}, Promise<{
    userId: import("convex/values").GenericId<"users">;
    token: string;
}>>;
export declare const deleteAccount: import("convex/server").RegisteredMutation<"public", {
    password?: string | undefined;
    token: string;
}, Promise<{
    success: boolean;
}>>;
//# sourceMappingURL=auth.d.ts.map