export declare const createInvite: import("convex/server").RegisteredMutation<"public", {
    cardId?: import("convex/values").GenericId<"cards"> | undefined;
    expiresInHours?: number | undefined;
    kind: "card";
}, Promise<import("convex/values").GenericId<"invites">>>;
export declare const getInvite: import("convex/server").RegisteredQuery<"public", {
    code: string;
}, Promise<{
    _id: import("convex/values").GenericId<"invites">;
    _creationTime: number;
    userId?: import("convex/values").GenericId<"users"> | undefined;
    cardId?: import("convex/values").GenericId<"cards"> | undefined;
    shareToken?: string | undefined;
    shareType?: string | undefined;
    code: string;
    createdAt: number;
    expiresAt: number;
    kind: string;
} | null>>;
export declare const claimInvite: import("convex/server").RegisteredMutation<"public", {
    code: string;
    claimerUserId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"invites">;
    _creationTime: number;
    userId?: import("convex/values").GenericId<"users"> | undefined;
    cardId?: import("convex/values").GenericId<"cards"> | undefined;
    shareToken?: string | undefined;
    shareType?: string | undefined;
    code: string;
    createdAt: number;
    expiresAt: number;
    kind: string;
}>>;
export declare const getCardClaims: import("convex/server").RegisteredQuery<"public", {
    cardId: import("convex/values").GenericId<"cards">;
}, Promise<{
    _id: import("convex/values").GenericId<"cardClaims">;
    _creationTime: number;
    cardId: import("convex/values").GenericId<"cards">;
    claimerUserId: import("convex/values").GenericId<"users">;
    claimedAt: number;
}[]>>;
export declare const getClaimedCards: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    claimedAt: number;
    _id: import("convex/values").GenericId<"cards">;
    _creationTime: number;
    location?: string | undefined;
    aiCaption?: string | undefined;
    frontFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    backFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    variant?: string | undefined;
    title: string;
    createdAt: number;
    deckId: import("convex/values").GenericId<"decks">;
    date: string;
    people: string[];
    photosFileIds: import("convex/values").GenericId<"_storage">[];
    highlights: string[];
}[]>>;
export declare const removeCardClaim: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
    cardId: import("convex/values").GenericId<"cards">;
}, Promise<void>>;
export declare const getCardTemplates: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"cardTemplates">;
    _creationTime: number;
    frameFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    name: string;
    key: string;
    styleData: string;
    rarity: string;
}[]>>;
export declare const getCardTemplate: import("convex/server").RegisteredQuery<"public", {
    key: string;
}, Promise<{
    _id: import("convex/values").GenericId<"cardTemplates">;
    _creationTime: number;
    frameFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    name: string;
    key: string;
    styleData: string;
    rarity: string;
} | null>>;
export declare const createCardTemplate: import("convex/server").RegisteredMutation<"public", {
    frameFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    name: string;
    key: string;
    styleData: string;
    rarity: string;
}, Promise<import("convex/values").GenericId<"cardTemplates">>>;
//# sourceMappingURL=sharing.d.ts.map