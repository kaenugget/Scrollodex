import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Peer Pages Functions

// Create a peer page
export const createPeerPage = mutation({
  args: {
    aUserId: v.id("users"),
    bUserId: v.id("users"),
    title: v.string(),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("peerPages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get peer pages for a user
export const getPeerPages = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const pagesAsA = await ctx.db
      .query("peerPages")
      .filter((q) => q.eq(q.field("aUserId"), args.userId))
      .collect();

    const pagesAsB = await ctx.db
      .query("peerPages")
      .filter((q) => q.eq(q.field("bUserId"), args.userId))
      .collect();

    return [...pagesAsA, ...pagesAsB];
  },
});

// Get a single peer page
export const getPeerPage = query({
  args: { peerPageId: v.id("peerPages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.peerPageId);
  },
});

// Find or create a peer page between two users
export const findOrCreatePeerPage = mutation({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    // First, try to find an existing peer page
    const existingPage = await ctx.db
      .query("peerPages")
      .filter((q) => 
        q.or(
          q.and(q.eq(q.field("aUserId"), args.userId1), q.eq(q.field("bUserId"), args.userId2)),
          q.and(q.eq(q.field("aUserId"), args.userId2), q.eq(q.field("bUserId"), args.userId1))
        )
      )
      .first();

    if (existingPage) {
      return existingPage._id;
    }

    // If no existing page, create a new one
    return await ctx.db.insert("peerPages", {
      aUserId: args.userId1,
      bUserId: args.userId2,
      title: "Shared Moments",
      visibility: "private",
      createdAt: Date.now(),
    });
  },
});

// Moments Functions

// Add a moment to a peer page
export const addMoment = mutation({
  args: {
    peerPageId: v.id("peerPages"),
    authorId: v.id("users"),
    photoFileId: v.id("_storage"),
    caption: v.optional(v.string()),
    placeName: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("moments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get moments for a peer page
export const getMoments = query({
  args: { peerPageId: v.id("peerPages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moments")
      .filter((q) => q.eq(q.field("peerPageId"), args.peerPageId))
      .order("desc")
      .collect();
  },
});

// Deck Functions

// Create a deck
export const createDeck = mutation({
  args: {
    ownerId: v.id("users"),
    kind: v.union(v.literal("personal"), v.literal("duo")),
    peerUserId: v.optional(v.id("users")),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("decks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get decks for a user
export const getDecks = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("decks")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .order("desc")
      .collect();
  },
});

// Card Functions

// Create a card in a deck
export const createCard = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cards", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get cards for a deck
export const getCards = query({
  args: { deckId: v.id("decks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cards")
      .filter((q) => q.eq(q.field("deckId"), args.deckId))
      .order("desc")
      .collect();
  },
});

// Get a single card
export const getCard = query({
  args: { cardId: v.id("cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.cardId);
  },
});

// Update a card
export const updateCard = mutation({
  args: {
    cardId: v.id("cards"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    location: v.optional(v.string()),
    people: v.optional(v.array(v.string())),
    photosFileIds: v.optional(v.array(v.id("_storage"))),
    highlights: v.optional(v.array(v.string())),
    aiCaption: v.optional(v.string()),
    frontFileId: v.optional(v.id("_storage")),
    backFileId: v.optional(v.id("_storage")),
    variant: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { cardId, ...updates } = args;
    await ctx.db.patch(cardId, updates);
  },
});

// Delete a card
export const deleteCard = mutation({
  args: { cardId: v.id("cards") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cardId);
  },
});

// Card Sharing Functions

// Create a shareable link for a card
export const createCardShare = mutation({
  args: {
    cardId: v.id("cards"),
    shareType: v.union(v.literal("view"), v.literal("claim")),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate a unique share token
    const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return await ctx.db.insert("invites", {
      cardId: args.cardId,
      shareToken,
      shareType: args.shareType,
      kind: "card",
      code: shareToken, // Use shareToken as code for now
      expiresAt: args.expiresAt || Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days default
      createdAt: Date.now(),
    });
  },
});

// Get card by share token
export const getCardByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .filter((q) => q.eq(q.field("shareToken"), args.shareToken))
      .first();
    
    if (!invite || invite.expiresAt < Date.now() || !invite.cardId) {
      return null;
    }
    
    return await ctx.db.get(invite.cardId);
  },
});

// Claim a shared card
export const claimCard = mutation({
  args: {
    shareToken: v.string(),
    claimerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .filter((q) => q.eq(q.field("shareToken"), args.shareToken))
      .first();
    
    if (!invite || invite.expiresAt < Date.now() || !invite.cardId) {
      throw new Error("Share link expired or invalid");
    }
    
    if (invite.shareType !== "claim") {
      throw new Error("This card is not claimable");
    }
    
    // Check if already claimed
    const existingClaim = await ctx.db
      .query("cardClaims")
      .filter((q) => q.eq(q.field("cardId"), invite.cardId))
      .first();
    
    if (existingClaim) {
      throw new Error("Card has already been claimed");
    }
    
    // Create claim record
    await ctx.db.insert("cardClaims", {
      cardId: invite.cardId,
      claimerUserId: args.claimerUserId,
      claimedAt: Date.now(),
    });
    
    // Delete the invite to prevent reuse
    await ctx.db.delete(invite._id);
    
    return invite.cardId;
  },
});
