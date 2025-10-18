export declare const addWalletLink: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    platform: string;
    username: string;
}, Promise<import("convex/values").GenericId<"walletLinks">>>;
export declare const getContactWalletLinks: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"walletLinks">;
    _creationTime: number;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    platform: string;
    username: string;
}[]>>;
export declare const getUserWalletLinks: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"walletLinks">;
    _creationTime: number;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    platform: string;
    username: string;
}[]>>;
export declare const updateWalletLink: import("convex/server").RegisteredMutation<"public", {
    platform?: string | undefined;
    username?: string | undefined;
    walletLinkId: import("convex/values").GenericId<"walletLinks">;
}, Promise<void>>;
export declare const deleteWalletLink: import("convex/server").RegisteredMutation<"public", {
    walletLinkId: import("convex/values").GenericId<"walletLinks">;
}, Promise<void>>;
export declare const getWalletLinkByPlatform: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    platform: string;
    username: string;
}, Promise<{
    _id: import("convex/values").GenericId<"walletLinks">;
    _creationTime: number;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    platform: string;
    username: string;
} | null>>;
export declare const getUserPlatforms: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<string[]>>;
export declare const searchWalletLinksByPlatform: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    platform: string;
}, Promise<{
    _id: import("convex/values").GenericId<"walletLinks">;
    _creationTime: number;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    platform: string;
    username: string;
}[]>>;
//# sourceMappingURL=wallet.d.ts.map