import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    displayName: v.string(),
    passwordHash: v.optional(v.string()), // Optional for existing users
    clerkUserId: v.optional(v.string()), // Clerk user ID for integration
    avatarUrl: v.optional(v.string()),
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
  }),

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
    kind: v.string(), // "card"
    cardId: v.optional(v.id("cards")),
    createdAt: v.number(),
    expiresAt: v.number(),
  }),

  // Wallet links (optional)
  walletLinks: defineTable({
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    platform: v.string(),
    username: v.string(),
    createdAt: v.number(),
  }),
});
