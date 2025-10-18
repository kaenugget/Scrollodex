export declare const getNotes: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"notes">;
    _creationTime: number;
    body: string;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
}[]>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    body: string;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<import("convex/values").GenericId<"notes">>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    body: string;
    noteId: import("convex/values").GenericId<"notes">;
}, Promise<void>>;
export declare const deleteNote: import("convex/server").RegisteredMutation<"public", {
    noteId: import("convex/values").GenericId<"notes">;
}, Promise<void>>;
export declare const getNote: import("convex/server").RegisteredQuery<"public", {
    noteId: import("convex/values").GenericId<"notes">;
}, Promise<{
    _id: import("convex/values").GenericId<"notes">;
    _creationTime: number;
    body: string;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
} | null>>;
//# sourceMappingURL=notes.d.ts.map