export declare const createPeerPage: import("convex/server").RegisteredMutation<"public", {
    title: string;
    aUserId: import("convex/values").GenericId<"users">;
    bUserId: import("convex/values").GenericId<"users">;
    visibility: "public" | "private";
}, Promise<import("convex/values").GenericId<"peerPages">>>;
export declare const getPeerPages: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"peerPages">;
    _creationTime: number;
    title: string;
    createdAt: number;
    aUserId: import("convex/values").GenericId<"users">;
    bUserId: import("convex/values").GenericId<"users">;
    visibility: string;
}[]>>;
export declare const getPeerPage: import("convex/server").RegisteredQuery<"public", {
    peerPageId: import("convex/values").GenericId<"peerPages">;
}, Promise<{
    _id: import("convex/values").GenericId<"peerPages">;
    _creationTime: number;
    title: string;
    createdAt: number;
    aUserId: import("convex/values").GenericId<"users">;
    bUserId: import("convex/values").GenericId<"users">;
    visibility: string;
} | null>>;
export declare const findOrCreatePeerPage: import("convex/server").RegisteredMutation<"public", {
    userId1: import("convex/values").GenericId<"users">;
    userId2: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"peerPages">>>;
export declare const addMoment: import("convex/server").RegisteredMutation<"public", {
    caption?: string | undefined;
    tags?: string[] | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    mood?: string | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    peerPageId: import("convex/values").GenericId<"peerPages">;
    authorId: import("convex/values").GenericId<"users">;
    photoFileId: import("convex/values").GenericId<"_storage">;
}, Promise<import("convex/values").GenericId<"moments">>>;
export declare const getMoments: import("convex/server").RegisteredQuery<"public", {
    peerPageId: import("convex/values").GenericId<"peerPages">;
}, Promise<{
    _id: import("convex/values").GenericId<"moments">;
    _creationTime: number;
    caption?: string | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    updatedAt?: number | undefined;
    mood?: string | undefined;
    isArchived?: boolean | undefined;
    likesCount?: number | undefined;
    commentsCount?: number | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    createdAt: number;
    tags: string[];
    peerPageId: import("convex/values").GenericId<"peerPages">;
    authorId: import("convex/values").GenericId<"users">;
    photoFileId: import("convex/values").GenericId<"_storage">;
}[]>>;
export declare const getMoment: import("convex/server").RegisteredQuery<"public", {
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<{
    _id: import("convex/values").GenericId<"moments">;
    _creationTime: number;
    caption?: string | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    updatedAt?: number | undefined;
    mood?: string | undefined;
    isArchived?: boolean | undefined;
    likesCount?: number | undefined;
    commentsCount?: number | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    createdAt: number;
    tags: string[];
    peerPageId: import("convex/values").GenericId<"peerPages">;
    authorId: import("convex/values").GenericId<"users">;
    photoFileId: import("convex/values").GenericId<"_storage">;
} | null>>;
export declare const updateMoment: import("convex/server").RegisteredMutation<"public", {
    caption?: string | undefined;
    tags?: string[] | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    mood?: string | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<void>>;
export declare const deleteMoment: import("convex/server").RegisteredMutation<"public", {
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<void>>;
export declare const archiveMoment: import("convex/server").RegisteredMutation<"public", {
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<void>>;
export declare const getMomentsByUser: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"moments">;
    _creationTime: number;
    caption?: string | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    updatedAt?: number | undefined;
    mood?: string | undefined;
    isArchived?: boolean | undefined;
    likesCount?: number | undefined;
    commentsCount?: number | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    createdAt: number;
    tags: string[];
    peerPageId: import("convex/values").GenericId<"peerPages">;
    authorId: import("convex/values").GenericId<"users">;
    photoFileId: import("convex/values").GenericId<"_storage">;
}[]>>;
export declare const getMomentsByTags: import("convex/server").RegisteredQuery<"public", {
    tags: string[];
    peerPageId: import("convex/values").GenericId<"peerPages">;
}, Promise<{
    _id: import("convex/values").GenericId<"moments">;
    _creationTime: number;
    caption?: string | undefined;
    visibility?: string | undefined;
    placeName?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    updatedAt?: number | undefined;
    mood?: string | undefined;
    isArchived?: boolean | undefined;
    likesCount?: number | undefined;
    commentsCount?: number | undefined;
    weather?: string | undefined;
    activity?: string | undefined;
    createdAt: number;
    tags: string[];
    peerPageId: import("convex/values").GenericId<"peerPages">;
    authorId: import("convex/values").GenericId<"users">;
    photoFileId: import("convex/values").GenericId<"_storage">;
}[]>>;
export declare const likeMoment: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<void>>;
export declare const unlikeMoment: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<void>>;
export declare const getMomentLikes: import("convex/server").RegisteredQuery<"public", {
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<{
    user: {
        _id: import("convex/values").GenericId<"users">;
        displayName: string;
        avatarUrl: string | undefined;
    };
    _id: import("convex/values").GenericId<"momentLikes">;
    _creationTime: number;
    createdAt: number;
    userId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}[]>>;
export declare const isMomentLiked: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<boolean>>;
export declare const addMomentComment: import("convex/server").RegisteredMutation<"public", {
    parentCommentId?: import("convex/values").GenericId<"momentComments"> | undefined;
    content: string;
    authorId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<import("convex/values").GenericId<"momentComments">>>;
export declare const getMomentComments: import("convex/server").RegisteredQuery<"public", {
    momentId: import("convex/values").GenericId<"moments">;
}, Promise<{
    author: {
        _id: import("convex/values").GenericId<"users">;
        displayName: string;
        avatarUrl: string | undefined;
    } | null;
    replies: {
        author: {
            _id: import("convex/values").GenericId<"users">;
            displayName: string;
            avatarUrl: string | undefined;
        } | null;
        _id: import("convex/values").GenericId<"momentComments">;
        _creationTime: number;
        updatedAt?: number | undefined;
        parentCommentId?: import("convex/values").GenericId<"momentComments"> | undefined;
        content: string;
        createdAt: number;
        authorId: import("convex/values").GenericId<"users">;
        momentId: import("convex/values").GenericId<"moments">;
    }[];
    _id: import("convex/values").GenericId<"momentComments">;
    _creationTime: number;
    updatedAt?: number | undefined;
    parentCommentId?: import("convex/values").GenericId<"momentComments"> | undefined;
    content: string;
    createdAt: number;
    authorId: import("convex/values").GenericId<"users">;
    momentId: import("convex/values").GenericId<"moments">;
}[]>>;
export declare const updateMomentComment: import("convex/server").RegisteredMutation<"public", {
    content: string;
    commentId: import("convex/values").GenericId<"momentComments">;
}, Promise<void>>;
export declare const deleteMomentComment: import("convex/server").RegisteredMutation<"public", {
    commentId: import("convex/values").GenericId<"momentComments">;
}, Promise<void>>;
export declare const createDeck: import("convex/server").RegisteredMutation<"public", {
    peerUserId?: import("convex/values").GenericId<"users"> | undefined;
    title: string;
    ownerId: import("convex/values").GenericId<"users">;
    kind: "personal" | "duo";
}, Promise<import("convex/values").GenericId<"decks">>>;
export declare const getDecks: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"decks">;
    _creationTime: number;
    peerUserId?: import("convex/values").GenericId<"users"> | undefined;
    title: string;
    createdAt: number;
    ownerId: import("convex/values").GenericId<"users">;
    kind: string;
}[]>>;
export declare const createCard: import("convex/server").RegisteredMutation<"public", {
    location?: string | undefined;
    aiCaption?: string | undefined;
    frontFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    backFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    variant?: string | undefined;
    title: string;
    deckId: import("convex/values").GenericId<"decks">;
    date: string;
    people: string[];
    photosFileIds: import("convex/values").GenericId<"_storage">[];
    highlights: string[];
}, Promise<import("convex/values").GenericId<"cards">>>;
export declare const getCards: import("convex/server").RegisteredQuery<"public", {
    deckId: import("convex/values").GenericId<"decks">;
}, Promise<{
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
export declare const getCard: import("convex/server").RegisteredQuery<"public", {
    cardId: import("convex/values").GenericId<"cards">;
}, Promise<{
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
} | null>>;
export declare const updateCard: import("convex/server").RegisteredMutation<"public", {
    title?: string | undefined;
    location?: string | undefined;
    date?: string | undefined;
    people?: string[] | undefined;
    photosFileIds?: import("convex/values").GenericId<"_storage">[] | undefined;
    highlights?: string[] | undefined;
    aiCaption?: string | undefined;
    frontFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    backFileId?: import("convex/values").GenericId<"_storage"> | undefined;
    variant?: string | undefined;
    cardId: import("convex/values").GenericId<"cards">;
}, Promise<void>>;
export declare const deleteCard: import("convex/server").RegisteredMutation<"public", {
    cardId: import("convex/values").GenericId<"cards">;
}, Promise<void>>;
export declare const createCardShare: import("convex/server").RegisteredMutation<"public", {
    expiresAt?: number | undefined;
    cardId: import("convex/values").GenericId<"cards">;
    shareType: "view" | "claim";
}, Promise<import("convex/values").GenericId<"invites">>>;
export declare const getCardByShareToken: import("convex/server").RegisteredQuery<"public", {
    shareToken: string;
}, Promise<{
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
} | null>>;
export declare const claimCard: import("convex/server").RegisteredMutation<"public", {
    claimerUserId: import("convex/values").GenericId<"users">;
    shareToken: string;
}, Promise<import("convex/values").GenericId<"cards">>>;
export declare const createUserShare: import("convex/server").RegisteredMutation<"public", {
    expiresAt?: number | undefined;
    userId: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"invites">>>;
export declare const getUserByShareToken: import("convex/server").RegisteredQuery<"public", {
    shareToken: string;
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
export declare const connectToUser: import("convex/server").RegisteredMutation<"public", {
    claimerUserId: import("convex/values").GenericId<"users">;
    shareToken: string;
}, Promise<{
    contactId: import("convex/values").GenericId<"contacts">;
    targetUserId: import("convex/values").GenericId<"users">;
}>>;
export declare const getUserConnections: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    user: {
        _id: import("convex/values").GenericId<"users">;
        displayName: string;
        avatarUrl: string | undefined;
        bio: string | undefined;
    };
    _id: import("convex/values").GenericId<"userConnections">;
    _creationTime: number;
    status: string;
    fromUserId: import("convex/values").GenericId<"users">;
    toUserId: import("convex/values").GenericId<"users">;
    connectedAt: number;
}[]>>;
export declare const syncDynamicContact: import("convex/server").RegisteredMutation<"public", {
    contactId: import("convex/values").GenericId<"contacts">;
}, Promise<{
    success: boolean;
}>>;
//# sourceMappingURL=social.d.ts.map