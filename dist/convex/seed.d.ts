export declare const createDemoUser: import("convex/server").RegisteredMutation<"public", {}, Promise<import("convex/values").GenericId<"users">>>;
export declare const seedDemoData: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    contactIds: import("convex/values").GenericId<"contacts">[];
    dexIds: import("convex/values").GenericId<"dexEntries">[];
}>>;
//# sourceMappingURL=seed.d.ts.map