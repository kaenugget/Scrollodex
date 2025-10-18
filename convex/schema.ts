import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    displayName: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    passwordHash: v.optional(v.string()), // Optional for existing users
    clerkUserId: v.optional(v.string()), // Clerk user ID for integration
    avatarUrl: v.optional(v.string()), // Keep for backward compatibility
    avatarFileId: v.optional(v.id("_storage")), // Avatar image stored in Convex storage
    selfieFileId: v.optional(v.id("_storage")), // Selfie photo for signup
    bio: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"])
    .index("by_clerk_id", ["clerkUserId"]),

  // Sessions table for authentication
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // Contacts table
  contacts: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    emails: v.array(v.string()),
    phones: v.array(v.string()),
    birthday: v.optional(v.string()),
    tags: v.array(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.array(v.string()),
    lastInteractionAt: v.number(),
    pinned: v.boolean(),
    profilePictureUrl: v.optional(v.string()), // Profile picture URL for demo data
    // Dynamic connection fields
    connectedUserId: v.optional(v.id("users")), // If this contact is a connected user
    isDynamicContact: v.optional(v.boolean()), // True if this is a live-connected contact
    lastSyncedAt: v.optional(v.number()), // When the contact data was last synced
    petData: v.optional(v.object({
      // Core pet info
      petType: v.optional(v.string()), // "cat", "dog", "dragon", "fox", "bird", "rabbit", etc.
      petName: v.optional(v.string()), // Custom name
      level: v.optional(v.float64()),
      happiness: v.optional(v.float64()),
      
      // Visual customization
      color: v.optional(v.string()), // "blue", "purple", "gold", etc.
      pattern: v.optional(v.string()), // "spots", "stripes", "solid", etc.
      accessory: v.optional(v.string()), // "hat", "bow", "collar", etc.
      
      // State images
      happyImageUrl: v.optional(v.string()),
      neutralImageUrl: v.optional(v.string()),
      sadImageUrl: v.optional(v.string()),
      excitedImageUrl: v.optional(v.string()),
      
      // State videos (4s GIFs)
      happyVideoUrl: v.optional(v.string()),
      neutralVideoUrl: v.optional(v.string()),
      sadVideoUrl: v.optional(v.string()),
      excitedVideoUrl: v.optional(v.string()),
      
      // Generation data
      templateId: v.optional(v.string()), // Reference to egg template
      generatedAt: v.optional(v.float64()),
      lastUpdated: v.optional(v.float64()),
      hatchedAt: v.optional(v.float64()),
      regeneratedAt: v.optional(v.float64()),
      
      // Evolution system
      evolutionTokens: v.optional(v.float64()), // Tokens earned for customization
      totalEvolutions: v.optional(v.float64()), // Track how many times evolved
      lastEvolutionAt: v.optional(v.float64()),
      
      // Video generation status
      videoGenerationStatus: v.optional(v.string()), // "pending" | "generating" | "completed" | "failed"
      videoGenerationStartedAt: v.optional(v.float64()),
      videoGenerationCompletedAt: v.optional(v.float64()),
      videoGenerationError: v.optional(v.string()),
    })),
  }).index("by_owner", ["ownerId"]),

  // Peer pages for social features
  peerPages: defineTable({
    aUserId: v.id("users"),
    bUserId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    visibility: v.string(), // "private" | "public"
  }),

  // Moments in peer pages
  moments: defineTable({
    peerPageId: v.id("peerPages"),
    authorId: v.id("users"),
    photoFileId: v.id("_storage"),
    caption: v.optional(v.string()),
    placeName: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // Enhanced features
    tags: v.array(v.string()), // Categories like "travel", "food", "adventure", etc.
    mood: v.optional(v.string()), // "happy", "excited", "peaceful", "nostalgic", etc.
    visibility: v.optional(v.string()), // "public", "private", "friends_only"
    isArchived: v.optional(v.boolean()),
    // Engagement metrics
    likesCount: v.optional(v.number()),
    commentsCount: v.optional(v.number()),
    // Additional metadata
    weather: v.optional(v.string()), // "sunny", "rainy", "cloudy", etc.
    activity: v.optional(v.string()), // "hiking", "dining", "working", etc.
  }).index("by_peer_page", ["peerPageId"])
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"]),

  // Decks for cards
  decks: defineTable({
    ownerId: v.id("users"),
    kind: v.string(), // "personal" | "duo"
    peerUserId: v.optional(v.id("users")),
    title: v.string(),
    createdAt: v.number(),
  }),

  // Cards in decks
  cards: defineTable({
    deckId: v.id("decks"),
    title: v.string(),
    date: v.string(),
    location: v.optional(v.string()),
    people: v.array(v.string()),
    photosFileIds: v.array(v.id("_storage")),
    highlights: v.array(v.string()),
    aiCaption: v.optional(v.string()),
    frontFileId: v.optional(v.id("_storage")),
    backFileId: v.optional(v.id("_storage")),
    variant: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // Card claims for sharing
  cardClaims: defineTable({
    cardId: v.id("cards"),
    claimerUserId: v.id("users"),
    claimedAt: v.number(),
  }),

  // Card templates
  cardTemplates: defineTable({
    key: v.string(),
    name: v.string(),
    styleData: v.string(), // JSON string
    rarity: v.string(),
    frameFileId: v.optional(v.id("_storage")),
  }),

  // Dex entries
  dexEntries: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    dexNumber: v.number(),
    types: v.array(v.string()),
    level: v.number(),
    xp: v.number(),
    pfpFileId: v.optional(v.id("_storage")),
    prefs: v.string(), // JSON string
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"])
    .index("by_contact", ["contactId"]),

  // Preferences
  preferences: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    food: v.array(v.string()),
    music: v.array(v.string()),
    hobbies: v.array(v.string()),
    notes: v.string(),
  }).index("by_contact", ["contactId"]),

  // Notes
  notes: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_contact", ["contactId"]),

  // Actions/Todos
  actions: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    title: v.string(),
    dueAt: v.optional(v.number()),
    doneAt: v.optional(v.number()),
    kind: v.string(), // "followup" | "todo"
  }).index("by_contact", ["contactId"]),

  // Embeddings for AI search
  embeddings: defineTable({
    ownerId: v.id("users"),
    entityType: v.string(),
    entityId: v.string(),
    vector: v.array(v.number()),
    text: v.string(),
    updatedAt: v.number(),
  }),

  // Intro suggestions
  introsSuggestions: defineTable({
    ownerId: v.id("users"),
    aContactId: v.id("contacts"),
    bContactId: v.id("contacts"),
    why: v.string(),
    score: v.number(),
    createdAt: v.number(),
  }),

  // Nudges/reminders
  nudges: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    kind: v.string(), // "birthday" | "checkin"
    dueAt: v.number(),
    sentAt: v.optional(v.number()),
  }),

  // AI usage tracking
  aiUsage: defineTable({
    ownerId: v.id("users"),
    feature: v.string(),
    tokens: v.number(),
    date: v.string(),
  }),

  // AI settings
  aiSettings: defineTable({
    ownerId: v.id("users"),
    enabledFeatures: v.array(v.string()),
    dailyBudget: v.optional(v.number()),
    monthlyBudget: v.optional(v.number()),
  }),

  // Invites for sharing
  invites: defineTable({
    code: v.string(),
    kind: v.string(), // "card" | "user"
    cardId: v.optional(v.id("cards")),
    userId: v.optional(v.id("users")), // For user profile sharing
    shareToken: v.optional(v.string()),
    shareType: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(),
  }),

  // User connections - tracks who is connected to whom
  userConnections: defineTable({
    fromUserId: v.id("users"), // User who shared their profile
    toUserId: v.id("users"), // User who connected
    connectedAt: v.number(),
    status: v.string(), // "active" | "blocked"
  }).index("by_from_user", ["fromUserId"])
    .index("by_to_user", ["toUserId"]),

  // Wallet links (optional)
  walletLinks: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    platform: v.string(),
    username: v.string(),
    createdAt: v.number(),
  }),

  // Pet templates for egg hatching
  petTemplates: defineTable({
    templateId: v.string(), // Unique identifier
    petType: v.string(), // "cat", "dog", "dragon", etc.
    rarity: v.string(), // "common", "rare", "epic", "legendary"
    basePrompt: v.string(), // Base prompt for generation
    colors: v.array(v.string()), // Available colors
    patterns: v.array(v.string()), // Available patterns
    accessories: v.array(v.string()), // Available accessories
    hatchChance: v.number(), // Probability of hatching this type
    createdAt: v.number(),
  }).index("by_template_id", ["templateId"])
    .index("by_rarity", ["rarity"]),

  // Evolution quests and rewards
  evolutionQuests: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    questType: v.string(), // "level_up", "interaction", "time_based", "achievement"
    title: v.string(),
    description: v.string(),
    rewardTokens: v.number(), // Evolution tokens earned
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_contact", ["contactId"])
    .index("by_owner", ["ownerId"]),

  // Moment likes
  momentLikes: defineTable({
    momentId: v.id("moments"),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_moment", ["momentId"])
    .index("by_user", ["userId"]),

  // Moment comments
  momentComments: defineTable({
    momentId: v.id("moments"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    parentCommentId: v.optional(v.id("momentComments")), // For replies
  }).index("by_moment", ["momentId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentCommentId"]),
});
