export declare const generateUploadUrl: import("convex/server").RegisteredMutation<"public", {}, Promise<string>>;
export declare const storeFileMetadata: import("convex/server").RegisteredMutation<"public", {
    fileId: import("convex/values").GenericId<"_storage">;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"_storage">>>;
export declare const getFileUrl: import("convex/server").RegisteredQuery<"public", {
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<string | null>>;
export declare const deleteFile: import("convex/server").RegisteredMutation<"public", {
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<void>>;
export declare const uploadAvatar: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<import("convex/values").GenericId<"_storage">>>;
export declare const uploadContactPfp: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<import("convex/values").GenericId<"_storage">>>;
export declare const uploadMomentPhoto: import("convex/server").RegisteredMutation<"public", {
    momentId: import("convex/values").GenericId<"moments">;
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<import("convex/values").GenericId<"_storage">>>;
export declare const uploadCardDesign: import("convex/server").RegisteredMutation<"public", {
    type: "front" | "back";
    cardId: import("convex/values").GenericId<"cards">;
    fileId: import("convex/values").GenericId<"_storage">;
}, Promise<import("convex/values").GenericId<"_storage">>>;
//# sourceMappingURL=files.d.ts.map