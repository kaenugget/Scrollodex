export declare const getPreferences: import("convex/server").RegisteredQuery<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    _id: import("convex/values").GenericId<"preferences">;
    _creationTime: number;
    ownerId: import("convex/values").GenericId<"users">;
    notes: string;
    contactId: import("convex/values").GenericId<"contacts">;
    food: string[];
    music: string[];
    hobbies: string[];
} | null>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    ownerId: import("convex/values").GenericId<"users">;
    notes: string;
    contactId: import("convex/values").GenericId<"contacts">;
    food: string[];
    music: string[];
    hobbies: string[];
}, Promise<import("convex/values").GenericId<"preferences">>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    notes?: string | undefined;
    food?: string[] | undefined;
    music?: string[] | undefined;
    hobbies?: string[] | undefined;
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<void>>;
export declare const deletePreferences: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<void>>;
//# sourceMappingURL=preferences.d.ts.map