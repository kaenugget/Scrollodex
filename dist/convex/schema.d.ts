declare const _default: import("convex/server").SchemaDefinition<{
    users: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        email: import("convex/values").VString<string, "required">;
        displayName: import("convex/values").VString<string, "required">;
        firstName: import("convex/values").VString<string | undefined, "optional">;
        lastName: import("convex/values").VString<string | undefined, "optional">;
        passwordHash: import("convex/values").VString<string | undefined, "optional">;
        clerkUserId: import("convex/values").VString<string | undefined, "optional">;
        avatarUrl: import("convex/values").VString<string | undefined, "optional">;
        selfieFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage"> | undefined, "optional">;
        bio: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        lastLoginAt: import("convex/values").VFloat64<number | undefined, "optional">;
    }, "required", "email" | "displayName" | "firstName" | "lastName" | "passwordHash" | "clerkUserId" | "avatarUrl" | "selfieFileId" | "bio" | "createdAt" | "lastLoginAt">, {
        by_email: ["email", "_creationTime"];
        by_clerk_id: ["clerkUserId", "_creationTime"];
    }, {}, {}>;
    sessions: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        userId: import("convex/values").GenericId<"users">;
        token: string;
        expiresAt: number;
    }, {
        userId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        token: import("convex/values").VString<string, "required">;
        expiresAt: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "userId" | "token" | "expiresAt">, {
        by_token: ["token", "_creationTime"];
        by_user: ["userId", "_creationTime"];
    }, {}, {}>;
    contacts: import("convex/server").TableDefinition<import("convex/values").VObject<{
        role?: string | undefined;
        birthday?: string | undefined;
        company?: string | undefined;
        location?: string | undefined;
        connectedUserId?: import("convex/values").GenericId<"users"> | undefined;
        isDynamicContact?: boolean | undefined;
        lastSyncedAt?: number | undefined;
        petData?: {
            color?: string | undefined;
            pattern?: string | undefined;
            petType?: string | undefined;
            petName?: string | undefined;
            level?: number | undefined;
            happiness?: number | undefined;
            accessory?: string | undefined;
            happyImageUrl?: string | undefined;
            neutralImageUrl?: string | undefined;
            sadImageUrl?: string | undefined;
            excitedImageUrl?: string | undefined;
            happyVideoUrl?: string | undefined;
            neutralVideoUrl?: string | undefined;
            sadVideoUrl?: string | undefined;
            excitedVideoUrl?: string | undefined;
            templateId?: string | undefined;
            generatedAt?: number | undefined;
            lastUpdated?: number | undefined;
            hatchedAt?: number | undefined;
            regeneratedAt?: number | undefined;
            evolutionTokens?: number | undefined;
            totalEvolutions?: number | undefined;
            lastEvolutionAt?: number | undefined;
            videoGenerationStatus?: string | undefined;
            videoGenerationStartedAt?: number | undefined;
            videoGenerationCompletedAt?: number | undefined;
            videoGenerationError?: string | undefined;
        } | undefined;
        name: string;
        ownerId: import("convex/values").GenericId<"users">;
        emails: string[];
        phones: string[];
        tags: string[];
        notes: string[];
        lastInteractionAt: number;
        pinned: boolean;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        name: import("convex/values").VString<string, "required">;
        emails: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        phones: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        birthday: import("convex/values").VString<string | undefined, "optional">;
        tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        company: import("convex/values").VString<string | undefined, "optional">;
        role: import("convex/values").VString<string | undefined, "optional">;
        location: import("convex/values").VString<string | undefined, "optional">;
        notes: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        lastInteractionAt: import("convex/values").VFloat64<number, "required">;
        pinned: import("convex/values").VBoolean<boolean, "required">;
        connectedUserId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        isDynamicContact: import("convex/values").VBoolean<boolean | undefined, "optional">;
        lastSyncedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        petData: import("convex/values").VObject<{
            color?: string | undefined;
            pattern?: string | undefined;
            petType?: string | undefined;
            petName?: string | undefined;
            level?: number | undefined;
            happiness?: number | undefined;
            accessory?: string | undefined;
            happyImageUrl?: string | undefined;
            neutralImageUrl?: string | undefined;
            sadImageUrl?: string | undefined;
            excitedImageUrl?: string | undefined;
            happyVideoUrl?: string | undefined;
            neutralVideoUrl?: string | undefined;
            sadVideoUrl?: string | undefined;
            excitedVideoUrl?: string | undefined;
            templateId?: string | undefined;
            generatedAt?: number | undefined;
            lastUpdated?: number | undefined;
            hatchedAt?: number | undefined;
            regeneratedAt?: number | undefined;
            evolutionTokens?: number | undefined;
            totalEvolutions?: number | undefined;
            lastEvolutionAt?: number | undefined;
            videoGenerationStatus?: string | undefined;
            videoGenerationStartedAt?: number | undefined;
            videoGenerationCompletedAt?: number | undefined;
            videoGenerationError?: string | undefined;
        } | undefined, {
            petType: import("convex/values").VString<string | undefined, "optional">;
            petName: import("convex/values").VString<string | undefined, "optional">;
            level: import("convex/values").VFloat64<number | undefined, "optional">;
            happiness: import("convex/values").VFloat64<number | undefined, "optional">;
            color: import("convex/values").VString<string | undefined, "optional">;
            pattern: import("convex/values").VString<string | undefined, "optional">;
            accessory: import("convex/values").VString<string | undefined, "optional">;
            happyImageUrl: import("convex/values").VString<string | undefined, "optional">;
            neutralImageUrl: import("convex/values").VString<string | undefined, "optional">;
            sadImageUrl: import("convex/values").VString<string | undefined, "optional">;
            excitedImageUrl: import("convex/values").VString<string | undefined, "optional">;
            happyVideoUrl: import("convex/values").VString<string | undefined, "optional">;
            neutralVideoUrl: import("convex/values").VString<string | undefined, "optional">;
            sadVideoUrl: import("convex/values").VString<string | undefined, "optional">;
            excitedVideoUrl: import("convex/values").VString<string | undefined, "optional">;
            templateId: import("convex/values").VString<string | undefined, "optional">;
            generatedAt: import("convex/values").VFloat64<number | undefined, "optional">;
            lastUpdated: import("convex/values").VFloat64<number | undefined, "optional">;
            hatchedAt: import("convex/values").VFloat64<number | undefined, "optional">;
            regeneratedAt: import("convex/values").VFloat64<number | undefined, "optional">;
            evolutionTokens: import("convex/values").VFloat64<number | undefined, "optional">;
            totalEvolutions: import("convex/values").VFloat64<number | undefined, "optional">;
            lastEvolutionAt: import("convex/values").VFloat64<number | undefined, "optional">;
            videoGenerationStatus: import("convex/values").VString<string | undefined, "optional">;
            videoGenerationStartedAt: import("convex/values").VFloat64<number | undefined, "optional">;
            videoGenerationCompletedAt: import("convex/values").VFloat64<number | undefined, "optional">;
            videoGenerationError: import("convex/values").VString<string | undefined, "optional">;
        }, "optional", "color" | "pattern" | "petType" | "petName" | "level" | "happiness" | "accessory" | "happyImageUrl" | "neutralImageUrl" | "sadImageUrl" | "excitedImageUrl" | "happyVideoUrl" | "neutralVideoUrl" | "sadVideoUrl" | "excitedVideoUrl" | "templateId" | "generatedAt" | "lastUpdated" | "hatchedAt" | "regeneratedAt" | "evolutionTokens" | "totalEvolutions" | "lastEvolutionAt" | "videoGenerationStatus" | "videoGenerationStartedAt" | "videoGenerationCompletedAt" | "videoGenerationError">;
    }, "required", "role" | "name" | "ownerId" | "emails" | "phones" | "birthday" | "tags" | "company" | "location" | "notes" | "lastInteractionAt" | "pinned" | "connectedUserId" | "isDynamicContact" | "lastSyncedAt" | "petData" | "petData.color" | "petData.pattern" | "petData.petType" | "petData.petName" | "petData.level" | "petData.happiness" | "petData.accessory" | "petData.happyImageUrl" | "petData.neutralImageUrl" | "petData.sadImageUrl" | "petData.excitedImageUrl" | "petData.happyVideoUrl" | "petData.neutralVideoUrl" | "petData.sadVideoUrl" | "petData.excitedVideoUrl" | "petData.templateId" | "petData.generatedAt" | "petData.lastUpdated" | "petData.hatchedAt" | "petData.regeneratedAt" | "petData.evolutionTokens" | "petData.totalEvolutions" | "petData.lastEvolutionAt" | "petData.videoGenerationStatus" | "petData.videoGenerationStartedAt" | "petData.videoGenerationCompletedAt" | "petData.videoGenerationError">, {
        by_owner: ["ownerId", "_creationTime"];
    }, {}, {}>;
    peerPages: import("convex/server").TableDefinition<import("convex/values").VObject<{
        title: string;
        createdAt: number;
        aUserId: import("convex/values").GenericId<"users">;
        bUserId: import("convex/values").GenericId<"users">;
        visibility: string;
    }, {
        aUserId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        bUserId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        title: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        visibility: import("convex/values").VString<string, "required">;
    }, "required", "title" | "createdAt" | "aUserId" | "bUserId" | "visibility">, {}, {}, {}>;
    moments: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        peerPageId: import("convex/values").VId<import("convex/values").GenericId<"peerPages">, "required">;
        authorId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        photoFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage">, "required">;
        caption: import("convex/values").VString<string | undefined, "optional">;
        placeName: import("convex/values").VString<string | undefined, "optional">;
        lat: import("convex/values").VFloat64<number | undefined, "optional">;
        lng: import("convex/values").VFloat64<number | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        mood: import("convex/values").VString<string | undefined, "optional">;
        visibility: import("convex/values").VString<string | undefined, "optional">;
        isArchived: import("convex/values").VBoolean<boolean | undefined, "optional">;
        likesCount: import("convex/values").VFloat64<number | undefined, "optional">;
        commentsCount: import("convex/values").VFloat64<number | undefined, "optional">;
        weather: import("convex/values").VString<string | undefined, "optional">;
        activity: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "caption" | "createdAt" | "tags" | "visibility" | "peerPageId" | "authorId" | "photoFileId" | "placeName" | "lat" | "lng" | "updatedAt" | "mood" | "isArchived" | "likesCount" | "commentsCount" | "weather" | "activity">, {
        by_peer_page: ["peerPageId", "_creationTime"];
        by_author: ["authorId", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    decks: import("convex/server").TableDefinition<import("convex/values").VObject<{
        peerUserId?: import("convex/values").GenericId<"users"> | undefined;
        title: string;
        createdAt: number;
        ownerId: import("convex/values").GenericId<"users">;
        kind: string;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        kind: import("convex/values").VString<string, "required">;
        peerUserId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        title: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "title" | "createdAt" | "ownerId" | "peerUserId" | "kind">, {}, {}, {}>;
    cards: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        deckId: import("convex/values").VId<import("convex/values").GenericId<"decks">, "required">;
        title: import("convex/values").VString<string, "required">;
        date: import("convex/values").VString<string, "required">;
        location: import("convex/values").VString<string | undefined, "optional">;
        people: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        photosFileIds: import("convex/values").VArray<import("convex/values").GenericId<"_storage">[], import("convex/values").VId<import("convex/values").GenericId<"_storage">, "required">, "required">;
        highlights: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        aiCaption: import("convex/values").VString<string | undefined, "optional">;
        frontFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage"> | undefined, "optional">;
        backFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage"> | undefined, "optional">;
        variant: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "title" | "createdAt" | "location" | "deckId" | "date" | "people" | "photosFileIds" | "highlights" | "aiCaption" | "frontFileId" | "backFileId" | "variant">, {}, {}, {}>;
    cardClaims: import("convex/server").TableDefinition<import("convex/values").VObject<{
        cardId: import("convex/values").GenericId<"cards">;
        claimerUserId: import("convex/values").GenericId<"users">;
        claimedAt: number;
    }, {
        cardId: import("convex/values").VId<import("convex/values").GenericId<"cards">, "required">;
        claimerUserId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        claimedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "cardId" | "claimerUserId" | "claimedAt">, {}, {}, {}>;
    cardTemplates: import("convex/server").TableDefinition<import("convex/values").VObject<{
        frameFileId?: import("convex/values").GenericId<"_storage"> | undefined;
        name: string;
        key: string;
        styleData: string;
        rarity: string;
    }, {
        key: import("convex/values").VString<string, "required">;
        name: import("convex/values").VString<string, "required">;
        styleData: import("convex/values").VString<string, "required">;
        rarity: import("convex/values").VString<string, "required">;
        frameFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage"> | undefined, "optional">;
    }, "required", "name" | "key" | "styleData" | "rarity" | "frameFileId">, {}, {}, {}>;
    dexEntries: import("convex/server").TableDefinition<import("convex/values").VObject<{
        pfpFileId?: import("convex/values").GenericId<"_storage"> | undefined;
        ownerId: import("convex/values").GenericId<"users">;
        level: number;
        updatedAt: number;
        contactId: import("convex/values").GenericId<"contacts">;
        dexNumber: number;
        types: string[];
        xp: number;
        prefs: string;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        dexNumber: import("convex/values").VFloat64<number, "required">;
        types: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        level: import("convex/values").VFloat64<number, "required">;
        xp: import("convex/values").VFloat64<number, "required">;
        pfpFileId: import("convex/values").VId<import("convex/values").GenericId<"_storage"> | undefined, "optional">;
        prefs: import("convex/values").VString<string, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "ownerId" | "level" | "updatedAt" | "contactId" | "dexNumber" | "types" | "xp" | "pfpFileId" | "prefs">, {
        by_owner: ["ownerId", "_creationTime"];
        by_contact: ["contactId", "_creationTime"];
    }, {}, {}>;
    preferences: import("convex/server").TableDefinition<import("convex/values").VObject<{
        ownerId: import("convex/values").GenericId<"users">;
        notes: string;
        contactId: import("convex/values").GenericId<"contacts">;
        food: string[];
        music: string[];
        hobbies: string[];
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        food: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        music: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        hobbies: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        notes: import("convex/values").VString<string, "required">;
    }, "required", "ownerId" | "notes" | "contactId" | "food" | "music" | "hobbies">, {
        by_contact: ["contactId", "_creationTime"];
    }, {}, {}>;
    notes: import("convex/server").TableDefinition<import("convex/values").VObject<{
        body: string;
        createdAt: number;
        ownerId: import("convex/values").GenericId<"users">;
        contactId: import("convex/values").GenericId<"contacts">;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        body: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "body" | "createdAt" | "ownerId" | "contactId">, {
        by_contact: ["contactId", "_creationTime"];
    }, {}, {}>;
    actions: import("convex/server").TableDefinition<import("convex/values").VObject<{
        dueAt?: number | undefined;
        doneAt?: number | undefined;
        title: string;
        ownerId: import("convex/values").GenericId<"users">;
        kind: string;
        contactId: import("convex/values").GenericId<"contacts">;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        title: import("convex/values").VString<string, "required">;
        dueAt: import("convex/values").VFloat64<number | undefined, "optional">;
        doneAt: import("convex/values").VFloat64<number | undefined, "optional">;
        kind: import("convex/values").VString<string, "required">;
    }, "required", "title" | "ownerId" | "kind" | "contactId" | "dueAt" | "doneAt">, {
        by_contact: ["contactId", "_creationTime"];
    }, {}, {}>;
    embeddings: import("convex/server").TableDefinition<import("convex/values").VObject<{
        text: string;
        ownerId: import("convex/values").GenericId<"users">;
        updatedAt: number;
        entityType: string;
        entityId: string;
        vector: number[];
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        entityType: import("convex/values").VString<string, "required">;
        entityId: import("convex/values").VString<string, "required">;
        vector: import("convex/values").VArray<number[], import("convex/values").VFloat64<number, "required">, "required">;
        text: import("convex/values").VString<string, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "text" | "ownerId" | "updatedAt" | "entityType" | "entityId" | "vector">, {}, {}, {}>;
    introsSuggestions: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        ownerId: import("convex/values").GenericId<"users">;
        aContactId: import("convex/values").GenericId<"contacts">;
        bContactId: import("convex/values").GenericId<"contacts">;
        why: string;
        score: number;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        aContactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        bContactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        why: import("convex/values").VString<string, "required">;
        score: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "ownerId" | "aContactId" | "bContactId" | "why" | "score">, {}, {}, {}>;
    nudges: import("convex/server").TableDefinition<import("convex/values").VObject<{
        sentAt?: number | undefined;
        ownerId: import("convex/values").GenericId<"users">;
        kind: string;
        contactId: import("convex/values").GenericId<"contacts">;
        dueAt: number;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        kind: import("convex/values").VString<string, "required">;
        dueAt: import("convex/values").VFloat64<number, "required">;
        sentAt: import("convex/values").VFloat64<number | undefined, "optional">;
    }, "required", "ownerId" | "kind" | "contactId" | "dueAt" | "sentAt">, {}, {}, {}>;
    aiUsage: import("convex/server").TableDefinition<import("convex/values").VObject<{
        ownerId: import("convex/values").GenericId<"users">;
        date: string;
        feature: string;
        tokens: number;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        feature: import("convex/values").VString<string, "required">;
        tokens: import("convex/values").VFloat64<number, "required">;
        date: import("convex/values").VString<string, "required">;
    }, "required", "ownerId" | "date" | "feature" | "tokens">, {}, {}, {}>;
    aiSettings: import("convex/server").TableDefinition<import("convex/values").VObject<{
        dailyBudget?: number | undefined;
        monthlyBudget?: number | undefined;
        ownerId: import("convex/values").GenericId<"users">;
        enabledFeatures: string[];
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        enabledFeatures: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        dailyBudget: import("convex/values").VFloat64<number | undefined, "optional">;
        monthlyBudget: import("convex/values").VFloat64<number | undefined, "optional">;
    }, "required", "ownerId" | "enabledFeatures" | "dailyBudget" | "monthlyBudget">, {}, {}, {}>;
    invites: import("convex/server").TableDefinition<import("convex/values").VObject<{
        userId?: import("convex/values").GenericId<"users"> | undefined;
        cardId?: import("convex/values").GenericId<"cards"> | undefined;
        shareToken?: string | undefined;
        shareType?: string | undefined;
        code: string;
        createdAt: number;
        expiresAt: number;
        kind: string;
    }, {
        code: import("convex/values").VString<string, "required">;
        kind: import("convex/values").VString<string, "required">;
        cardId: import("convex/values").VId<import("convex/values").GenericId<"cards"> | undefined, "optional">;
        userId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        shareToken: import("convex/values").VString<string | undefined, "optional">;
        shareType: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        expiresAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "code" | "createdAt" | "userId" | "expiresAt" | "kind" | "cardId" | "shareToken" | "shareType">, {}, {}, {}>;
    userConnections: import("convex/server").TableDefinition<import("convex/values").VObject<{
        status: string;
        fromUserId: import("convex/values").GenericId<"users">;
        toUserId: import("convex/values").GenericId<"users">;
        connectedAt: number;
    }, {
        fromUserId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        toUserId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        connectedAt: import("convex/values").VFloat64<number, "required">;
        status: import("convex/values").VString<string, "required">;
    }, "required", "status" | "fromUserId" | "toUserId" | "connectedAt">, {
        by_from_user: ["fromUserId", "_creationTime"];
        by_to_user: ["toUserId", "_creationTime"];
    }, {}, {}>;
    walletLinks: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        ownerId: import("convex/values").GenericId<"users">;
        contactId: import("convex/values").GenericId<"contacts">;
        platform: string;
        username: string;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        platform: import("convex/values").VString<string, "required">;
        username: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "ownerId" | "contactId" | "platform" | "username">, {}, {}, {}>;
    petTemplates: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        petType: string;
        templateId: string;
        rarity: string;
        basePrompt: string;
        colors: string[];
        patterns: string[];
        accessories: string[];
        hatchChance: number;
    }, {
        templateId: import("convex/values").VString<string, "required">;
        petType: import("convex/values").VString<string, "required">;
        rarity: import("convex/values").VString<string, "required">;
        basePrompt: import("convex/values").VString<string, "required">;
        colors: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        patterns: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        accessories: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        hatchChance: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "petType" | "templateId" | "rarity" | "basePrompt" | "colors" | "patterns" | "accessories" | "hatchChance">, {
        by_template_id: ["templateId", "_creationTime"];
        by_rarity: ["rarity", "_creationTime"];
    }, {}, {}>;
    evolutionQuests: import("convex/server").TableDefinition<import("convex/values").VObject<{
        expiresAt?: number | undefined;
        completedAt?: number | undefined;
        title: string;
        description: string;
        createdAt: number;
        ownerId: import("convex/values").GenericId<"users">;
        contactId: import("convex/values").GenericId<"contacts">;
        questType: string;
        rewardTokens: number;
    }, {
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        contactId: import("convex/values").VId<import("convex/values").GenericId<"contacts">, "required">;
        questType: import("convex/values").VString<string, "required">;
        title: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        rewardTokens: import("convex/values").VFloat64<number, "required">;
        completedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        expiresAt: import("convex/values").VFloat64<number | undefined, "optional">;
    }, "required", "title" | "description" | "createdAt" | "expiresAt" | "ownerId" | "contactId" | "questType" | "rewardTokens" | "completedAt">, {
        by_contact: ["contactId", "_creationTime"];
        by_owner: ["ownerId", "_creationTime"];
    }, {}, {}>;
    momentLikes: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        userId: import("convex/values").GenericId<"users">;
        momentId: import("convex/values").GenericId<"moments">;
    }, {
        momentId: import("convex/values").VId<import("convex/values").GenericId<"moments">, "required">;
        userId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "userId" | "momentId">, {
        by_moment: ["momentId", "_creationTime"];
        by_user: ["userId", "_creationTime"];
    }, {}, {}>;
    momentComments: import("convex/server").TableDefinition<import("convex/values").VObject<{
        updatedAt?: number | undefined;
        parentCommentId?: import("convex/values").GenericId<"momentComments"> | undefined;
        content: string;
        createdAt: number;
        authorId: import("convex/values").GenericId<"users">;
        momentId: import("convex/values").GenericId<"moments">;
    }, {
        momentId: import("convex/values").VId<import("convex/values").GenericId<"moments">, "required">;
        authorId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        content: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        parentCommentId: import("convex/values").VId<import("convex/values").GenericId<"momentComments"> | undefined, "optional">;
    }, "required", "content" | "createdAt" | "authorId" | "updatedAt" | "momentId" | "parentCommentId">, {
        by_moment: ["momentId", "_creationTime"];
        by_author: ["authorId", "_creationTime"];
        by_parent: ["parentCommentId", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map