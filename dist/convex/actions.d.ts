export declare const getActions: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"actions">;
    _creationTime: number;
    dueAt?: number | undefined;
    doneAt?: number | undefined;
    title: string;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
}[]>>;
export declare const getAllActions: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"actions">;
    _creationTime: number;
    dueAt?: number | undefined;
    doneAt?: number | undefined;
    title: string;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
}[]>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    dueAt?: number | undefined;
    title: string;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<import("convex/values").GenericId<"actions">>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    title?: string | undefined;
    kind?: string | undefined;
    dueAt?: number | undefined;
    doneAt?: number | undefined;
    actionId: import("convex/values").GenericId<"actions">;
}, Promise<void>>;
export declare const markDone: import("convex/server").RegisteredMutation<"public", {
    actionId: import("convex/values").GenericId<"actions">;
}, Promise<void>>;
export declare const markUndone: import("convex/server").RegisteredMutation<"public", {
    actionId: import("convex/values").GenericId<"actions">;
}, Promise<void>>;
export declare const deleteAction: import("convex/server").RegisteredMutation<"public", {
    actionId: import("convex/values").GenericId<"actions">;
}, Promise<void>>;
export declare const getAction: import("convex/server").RegisteredQuery<"public", {
    actionId: import("convex/values").GenericId<"actions">;
}, Promise<{
    _id: import("convex/values").GenericId<"actions">;
    _creationTime: number;
    dueAt?: number | undefined;
    doneAt?: number | undefined;
    title: string;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
} | null>>;
//# sourceMappingURL=actions.d.ts.map