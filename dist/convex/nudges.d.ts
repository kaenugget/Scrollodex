export declare const createNudge: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    kind: "birthday" | "checkin";
    contactId: import("convex/values").GenericId<"contacts">;
    dueAt: number;
}, Promise<import("convex/values").GenericId<"nudges">>>;
export declare const getPendingNudges: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"nudges">;
    _creationTime: number;
    sentAt?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
    dueAt: number;
}[]>>;
export declare const markNudgeSent: import("convex/server").RegisteredMutation<"public", {
    nudgeId: import("convex/values").GenericId<"nudges">;
}, Promise<void>>;
export declare const getContactNudges: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"nudges">;
    _creationTime: number;
    sentAt?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
    dueAt: number;
}[]>>;
export declare const deleteNudge: import("convex/server").RegisteredMutation<"public", {
    nudgeId: import("convex/values").GenericId<"nudges">;
}, Promise<void>>;
export declare const createBirthdayNudge: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    birthday: string;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<import("convex/values").GenericId<"nudges">>>;
export declare const createCheckinNudge: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    contactId: import("convex/values").GenericId<"contacts">;
    daysFromNow: number;
}, Promise<import("convex/values").GenericId<"nudges">>>;
export declare const getOverdueNudges: import("convex/server").RegisteredQuery<"public", {
    daysOverdue: number;
}, Promise<{
    _id: import("convex/values").GenericId<"nudges">;
    _creationTime: number;
    sentAt?: number | undefined;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
    contactId: import("convex/values").GenericId<"contacts">;
    dueAt: number;
}[]>>;
//# sourceMappingURL=nudges.d.ts.map