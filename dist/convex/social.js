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
            .filter((q) => q.or(q.and(q.eq(q.field("aUserId"), args.userId1), q.eq(q.field("bUserId"), args.userId2)), q.and(q.eq(q.field("aUserId"), args.userId2), q.eq(q.field("bUserId"), args.userId1))))
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
        tags: v.optional(v.array(v.string())),
        mood: v.optional(v.string()),
        visibility: v.optional(v.string()),
        weather: v.optional(v.string()),
        activity: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert("moments", {
            ...args,
            tags: args.tags || [],
            visibility: args.visibility || "private",
            likesCount: 0,
            commentsCount: 0,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
        });
    },
});
// Get moments for a peer page
export const getMoments = query({
    args: { peerPageId: v.id("peerPages") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("moments")
            .withIndex("by_peer_page", (q) => q.eq("peerPageId", args.peerPageId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
    },
});
// Get a single moment with details
export const getMoment = query({
    args: { momentId: v.id("moments") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.momentId);
    },
});
// Update a moment
export const updateMoment = mutation({
    args: {
        momentId: v.id("moments"),
        caption: v.optional(v.string()),
        placeName: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        mood: v.optional(v.string()),
        visibility: v.optional(v.string()),
        weather: v.optional(v.string()),
        activity: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { momentId, ...updates } = args;
        await ctx.db.patch(momentId, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});
// Delete a moment
export const deleteMoment = mutation({
    args: { momentId: v.id("moments") },
    handler: async (ctx, args) => {
        // Delete associated likes and comments first
        const likes = await ctx.db
            .query("momentLikes")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .collect();
        for (const like of likes) {
            await ctx.db.delete(like._id);
        }
        const comments = await ctx.db
            .query("momentComments")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .collect();
        for (const comment of comments) {
            await ctx.db.delete(comment._id);
        }
        // Delete the moment
        await ctx.db.delete(args.momentId);
    },
});
// Archive a moment
export const archiveMoment = mutation({
    args: { momentId: v.id("moments") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.momentId, {
            isArchived: true,
            updatedAt: Date.now(),
        });
    },
});
// Get moments by user
export const getMomentsByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("moments")
            .withIndex("by_author", (q) => q.eq("authorId", args.userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
    },
});
// Get moments by tags
export const getMomentsByTags = query({
    args: { tags: v.array(v.string()), peerPageId: v.id("peerPages") },
    handler: async (ctx, args) => {
        const moments = await ctx.db
            .query("moments")
            .withIndex("by_peer_page", (q) => q.eq("peerPageId", args.peerPageId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .collect();
        // Filter by tags (at least one tag must match)
        return moments.filter(moment => moment.tags.some(tag => args.tags.includes(tag)));
    },
});
// Moment Likes Functions
// Like a moment
export const likeMoment = mutation({
    args: {
        momentId: v.id("moments"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if already liked
        const existingLike = await ctx.db
            .query("momentLikes")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();
        if (existingLike) {
            return; // Already liked
        }
        // Add like
        await ctx.db.insert("momentLikes", {
            momentId: args.momentId,
            userId: args.userId,
            createdAt: Date.now(),
        });
        // Update likes count
        const moment = await ctx.db.get(args.momentId);
        if (moment) {
            await ctx.db.patch(args.momentId, {
                likesCount: (moment.likesCount || 0) + 1,
            });
        }
    },
});
// Unlike a moment
export const unlikeMoment = mutation({
    args: {
        momentId: v.id("moments"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Find and delete the like
        const like = await ctx.db
            .query("momentLikes")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();
        if (like) {
            await ctx.db.delete(like._id);
            // Update likes count
            const moment = await ctx.db.get(args.momentId);
            if (moment) {
                await ctx.db.patch(args.momentId, {
                    likesCount: Math.max((moment.likesCount || 0) - 1, 0),
                });
            }
        }
    },
});
// Get likes for a moment
export const getMomentLikes = query({
    args: { momentId: v.id("moments") },
    handler: async (ctx, args) => {
        const likes = await ctx.db
            .query("momentLikes")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .collect();
        // Get user details for each like
        const likesWithUsers = [];
        for (const like of likes) {
            const user = await ctx.db.get(like.userId);
            if (user) {
                likesWithUsers.push({
                    ...like,
                    user: {
                        _id: user._id,
                        displayName: user.displayName,
                        avatarUrl: user.avatarUrl,
                    },
                });
            }
        }
        return likesWithUsers;
    },
});
// Check if user liked a moment
export const isMomentLiked = query({
    args: {
        momentId: v.id("moments"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const like = await ctx.db
            .query("momentLikes")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();
        return !!like;
    },
});
// Moment Comments Functions
// Add a comment to a moment
export const addMomentComment = mutation({
    args: {
        momentId: v.id("moments"),
        authorId: v.id("users"),
        content: v.string(),
        parentCommentId: v.optional(v.id("momentComments")),
    },
    handler: async (ctx, args) => {
        const commentId = await ctx.db.insert("momentComments", {
            ...args,
            createdAt: Date.now(),
        });
        // Update comments count
        const moment = await ctx.db.get(args.momentId);
        if (moment) {
            await ctx.db.patch(args.momentId, {
                commentsCount: (moment.commentsCount || 0) + 1,
            });
        }
        return commentId;
    },
});
// Get comments for a moment
export const getMomentComments = query({
    args: { momentId: v.id("moments") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("momentComments")
            .withIndex("by_moment", (q) => q.eq("momentId", args.momentId))
            .filter((q) => q.eq(q.field("parentCommentId"), undefined)) // Only top-level comments
            .order("asc")
            .collect();
        // Get user details and replies for each comment
        const commentsWithDetails = [];
        for (const comment of comments) {
            const author = await ctx.db.get(comment.authorId);
            // Get replies
            const replies = await ctx.db
                .query("momentComments")
                .withIndex("by_parent", (q) => q.eq("parentCommentId", comment._id))
                .order("asc")
                .collect();
            const repliesWithAuthors = [];
            for (const reply of replies) {
                const replyAuthor = await ctx.db.get(reply.authorId);
                repliesWithAuthors.push({
                    ...reply,
                    author: replyAuthor ? {
                        _id: replyAuthor._id,
                        displayName: replyAuthor.displayName,
                        avatarUrl: replyAuthor.avatarUrl,
                    } : null,
                });
            }
            commentsWithDetails.push({
                ...comment,
                author: author ? {
                    _id: author._id,
                    displayName: author.displayName,
                    avatarUrl: author.avatarUrl,
                } : null,
                replies: repliesWithAuthors,
            });
        }
        return commentsWithDetails;
    },
});
// Update a comment
export const updateMomentComment = mutation({
    args: {
        commentId: v.id("momentComments"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.commentId, {
            content: args.content,
            updatedAt: Date.now(),
        });
    },
});
// Delete a comment
export const deleteMomentComment = mutation({
    args: { commentId: v.id("momentComments") },
    handler: async (ctx, args) => {
        const comment = await ctx.db.get(args.commentId);
        if (!comment)
            return;
        // Delete replies first
        const replies = await ctx.db
            .query("momentComments")
            .withIndex("by_parent", (q) => q.eq("parentCommentId", args.commentId))
            .collect();
        for (const reply of replies) {
            await ctx.db.delete(reply._id);
        }
        // Delete the comment
        await ctx.db.delete(args.commentId);
        // Update comments count on the moment
        const moment = await ctx.db.get(comment.momentId);
        if (moment) {
            await ctx.db.patch(comment.momentId, {
                commentsCount: Math.max((moment.commentsCount || 0) - 1, 0),
            });
        }
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
// User Connection Functions
// Create a shareable link for a user profile
export const createUserShare = mutation({
    args: {
        userId: v.id("users"),
        expiresAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Generate a unique share token
        const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return await ctx.db.insert("invites", {
            userId: args.userId,
            shareToken,
            shareType: "connect",
            kind: "user",
            code: shareToken, // Use shareToken as code for now
            expiresAt: args.expiresAt || Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days default
            createdAt: Date.now(),
        });
    },
});
// Get user by share token
export const getUserByShareToken = query({
    args: { shareToken: v.string() },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("invites")
            .filter((q) => q.eq(q.field("shareToken"), args.shareToken))
            .first();
        if (!invite || invite.expiresAt < Date.now()) {
            return null;
        }
        if (invite.kind !== "user" || !invite.userId) {
            return null;
        }
        return await ctx.db.get(invite.userId);
    },
});
// Connect to a user via share token
export const connectToUser = mutation({
    args: {
        shareToken: v.string(),
        claimerUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("invites")
            .filter((q) => q.eq(q.field("shareToken"), args.shareToken))
            .first();
        if (!invite || invite.expiresAt < Date.now()) {
            throw new Error("Share link expired or invalid");
        }
        if (invite.kind !== "user" || !invite.userId) {
            throw new Error("Invalid share link");
        }
        const targetUserId = invite.userId;
        // Check if already connected
        const existingConnection = await ctx.db
            .query("userConnections")
            .filter((q) => q.and(q.eq(q.field("fromUserId"), targetUserId), q.eq(q.field("toUserId"), args.claimerUserId)))
            .first();
        if (existingConnection) {
            throw new Error("You are already connected to this user");
        }
        // Get the target user's profile
        const targetUser = await ctx.db.get(targetUserId);
        if (!targetUser) {
            throw new Error("User not found");
        }
        // Create connection record
        await ctx.db.insert("userConnections", {
            fromUserId: targetUserId,
            toUserId: args.claimerUserId,
            connectedAt: Date.now(),
            status: "active",
        });
        // Create a dynamic contact for the claimer
        const contactId = await ctx.db.insert("contacts", {
            ownerId: args.claimerUserId,
            name: targetUser.displayName,
            emails: targetUser.email ? [targetUser.email] : [],
            phones: [],
            birthday: undefined,
            tags: [],
            company: undefined,
            role: undefined,
            location: undefined,
            notes: [],
            lastInteractionAt: Date.now(),
            pinned: false,
            connectedUserId: targetUserId,
            isDynamicContact: true,
            lastSyncedAt: Date.now(),
        });
        // Automatically create a dex entry for the new contact
        await ctx.runMutation(api.dex.computeEntry, { contactId });
        // Delete the invite to prevent reuse
        await ctx.db.delete(invite._id);
        return { contactId, targetUserId };
    },
});
// Get user connections
export const getUserConnections = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const connections = await ctx.db
            .query("userConnections")
            .filter((q) => q.eq(q.field("fromUserId"), args.userId))
            .collect();
        // Get user details for each connection
        const connectionDetails = [];
        for (const connection of connections) {
            const user = await ctx.db.get(connection.toUserId);
            if (user) {
                connectionDetails.push({
                    ...connection,
                    user: {
                        _id: user._id,
                        displayName: user.displayName,
                        avatarUrl: user.avatarUrl,
                        bio: user.bio,
                    },
                });
            }
        }
        return connectionDetails;
    },
});
// Sync dynamic contact data
export const syncDynamicContact = mutation({
    args: {
        contactId: v.id("contacts"),
    },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact || !contact.isDynamicContact || !contact.connectedUserId) {
            throw new Error("Contact not found or not a dynamic contact");
        }
        const connectedUser = await ctx.db.get(contact.connectedUserId);
        if (!connectedUser) {
            throw new Error("Connected user not found");
        }
        // Update contact with latest user data
        await ctx.db.patch(args.contactId, {
            name: connectedUser.displayName,
            emails: connectedUser.email ? [connectedUser.email] : [],
            lastSyncedAt: Date.now(),
        });
        return { success: true };
    },
});
//# sourceMappingURL=social.js.map