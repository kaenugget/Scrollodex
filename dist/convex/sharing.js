import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Invite Functions
// Create an invite
export const createInvite = mutation({
    args: {
        kind: v.union(v.literal("card")),
        cardId: v.optional(v.id("cards")),
        expiresInHours: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const code = generateInviteCode();
        const expiresAt = Date.now() + ((args.expiresInHours || 24) * 60 * 60 * 1000);
        return await ctx.db.insert("invites", {
            code,
            kind: args.kind,
            cardId: args.cardId,
            createdAt: Date.now(),
            expiresAt,
        });
    },
});
// Get invite by code
export const getInvite = query({
    args: { code: v.string() },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("invites")
            .filter((q) => q.eq(q.field("code"), args.code))
            .first();
        if (!invite)
            return null;
        // Check if expired
        if (invite.expiresAt < Date.now()) {
            return null;
        }
        return invite;
    },
});
// Claim an invite
export const claimInvite = mutation({
    args: {
        code: v.string(),
        claimerUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("invites")
            .filter((q) => q.eq(q.field("code"), args.code))
            .first();
        if (!invite)
            throw new Error("Invite not found");
        if (invite.expiresAt < Date.now())
            throw new Error("Invite expired");
        if (invite.kind === "card" && invite.cardId) {
            // Create card claim
            await ctx.db.insert("cardClaims", {
                cardId: invite.cardId,
                claimerUserId: args.claimerUserId,
                claimedAt: Date.now(),
            });
        }
        // Delete the invite after claiming
        await ctx.db.delete(invite._id);
        return invite;
    },
});
// Card Claims Functions
// Get claims for a card
export const getCardClaims = query({
    args: { cardId: v.id("cards") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cardClaims")
            .filter((q) => q.eq(q.field("cardId"), args.cardId))
            .order("desc")
            .collect();
    },
});
// Get cards claimed by a user
export const getClaimedCards = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const claims = await ctx.db
            .query("cardClaims")
            .filter((q) => q.eq(q.field("claimerUserId"), args.userId))
            .order("desc")
            .collect();
        // Get the actual cards
        const cards = [];
        for (const claim of claims) {
            const card = await ctx.db.get(claim.cardId);
            if (card) {
                cards.push({ ...card, claimedAt: claim.claimedAt });
            }
        }
        return cards;
    },
});
// Remove a card claim
export const removeCardClaim = mutation({
    args: {
        cardId: v.id("cards"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const claim = await ctx.db
            .query("cardClaims")
            .filter((q) => q.and(q.eq(q.field("cardId"), args.cardId), q.eq(q.field("claimerUserId"), args.userId)))
            .first();
        if (claim) {
            await ctx.db.delete(claim._id);
        }
    },
});
// Card Templates Functions
// Get all card templates
export const getCardTemplates = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("cardTemplates")
            .collect();
    },
});
// Get template by key
export const getCardTemplate = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cardTemplates")
            .filter((q) => q.eq(q.field("key"), args.key))
            .first();
    },
});
// Create a card template
export const createCardTemplate = mutation({
    args: {
        key: v.string(),
        name: v.string(),
        styleData: v.string(),
        rarity: v.string(),
        frameFileId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("cardTemplates", args);
    },
});
// Helper function to generate invite codes
function generateInviteCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
//# sourceMappingURL=sharing.js.map