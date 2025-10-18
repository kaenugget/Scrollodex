import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Wallet Links Functions
// Add a wallet link for a contact
export const addWalletLink = mutation({
    args: {
        ownerId: v.id("users"),
        contactId: v.id("contacts"),
        platform: v.string(),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("walletLinks", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
// Get wallet links for a contact
export const getContactWalletLinks = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("walletLinks")
            .filter((q) => q.eq(q.field("contactId"), args.contactId))
            .order("desc")
            .collect();
    },
});
// Get wallet links for a user
export const getUserWalletLinks = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("walletLinks")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
            .order("desc")
            .collect();
    },
});
// Update a wallet link
export const updateWalletLink = mutation({
    args: {
        walletLinkId: v.id("walletLinks"),
        platform: v.optional(v.string()),
        username: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { walletLinkId, ...updates } = args;
        await ctx.db.patch(walletLinkId, updates);
    },
});
// Delete a wallet link
export const deleteWalletLink = mutation({
    args: { walletLinkId: v.id("walletLinks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.walletLinkId);
    },
});
// Get wallet link by platform and username
export const getWalletLinkByPlatform = query({
    args: {
        ownerId: v.id("users"),
        platform: v.string(),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("walletLinks")
            .filter((q) => q.and(q.eq(q.field("ownerId"), args.ownerId), q.eq(q.field("platform"), args.platform), q.eq(q.field("username"), args.username)))
            .first();
    },
});
// Get all unique platforms for a user
export const getUserPlatforms = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        const links = await ctx.db
            .query("walletLinks")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
            .collect();
        const platforms = new Set(links.map(link => link.platform));
        return Array.from(platforms);
    },
});
// Search wallet links by platform
export const searchWalletLinksByPlatform = query({
    args: {
        ownerId: v.id("users"),
        platform: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("walletLinks")
            .filter((q) => q.and(q.eq(q.field("ownerId"), args.ownerId), q.eq(q.field("platform"), args.platform)))
            .collect();
    },
});
//# sourceMappingURL=wallet.js.map