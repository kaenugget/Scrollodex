import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Embeddings Functions
// Store an embedding
export const storeEmbedding = mutation({
    args: {
        ownerId: v.id("users"),
        entityType: v.string(),
        entityId: v.string(),
        vector: v.array(v.number()),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if embedding already exists
        const existing = await ctx.db
            .query("embeddings")
            .filter((q) => q.and(q.eq(q.field("ownerId"), args.ownerId), q.eq(q.field("entityType"), args.entityType), q.eq(q.field("entityId"), args.entityId)))
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, {
                vector: args.vector,
                text: args.text,
                updatedAt: Date.now(),
            });
            return existing._id;
        }
        else {
            return await ctx.db.insert("embeddings", {
                ...args,
                updatedAt: Date.now(),
            });
        }
    },
});
// Search embeddings (simplified - in production you'd use vector similarity)
export const searchEmbeddings = query({
    args: {
        ownerId: v.id("users"),
        entityType: v.string(),
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const embeddings = await ctx.db
            .query("embeddings")
            .filter((q) => q.and(q.eq(q.field("ownerId"), args.ownerId), q.eq(q.field("entityType"), args.entityType)))
            .collect();
        // Simple text search for now
        const results = embeddings.filter(embedding => embedding.text.toLowerCase().includes(args.query.toLowerCase()));
        return results.slice(0, args.limit || 10);
    },
});
// Intro Suggestions Functions
// Generate intro suggestions
export const generateIntroSuggestions = mutation({
    args: {
        ownerId: v.id("users"),
        aContactId: v.id("contacts"),
        bContactId: v.id("contacts"),
    },
    handler: async (ctx, args) => {
        // Get both contacts
        const contactA = await ctx.db.get(args.aContactId);
        const contactB = await ctx.db.get(args.bContactId);
        if (!contactA || !contactB) {
            throw new Error("One or both contacts not found");
        }
        // Simple matching logic (in production, this would use AI)
        const suggestions = [];
        // Check for common tags
        const commonTags = contactA.tags.filter(tag => contactB.tags.includes(tag));
        if (commonTags.length > 0) {
            suggestions.push({
                why: `Both ${contactA.name} and ${contactB.name} are interested in ${commonTags.join(", ")}`,
                score: commonTags.length * 10,
            });
        }
        // Check for same company
        if (contactA.company && contactB.company &&
            contactA.company.toLowerCase() === contactB.company.toLowerCase()) {
            suggestions.push({
                why: `Both work at ${contactA.company}`,
                score: 50,
            });
        }
        // Check for same location
        if (contactA.location && contactB.location &&
            contactA.location.toLowerCase() === contactB.location.toLowerCase()) {
            suggestions.push({
                why: `Both are located in ${contactA.location}`,
                score: 30,
            });
        }
        // Store suggestions
        const suggestionIds = [];
        for (const suggestion of suggestions) {
            const id = await ctx.db.insert("introsSuggestions", {
                ownerId: args.ownerId,
                aContactId: args.aContactId,
                bContactId: args.bContactId,
                why: suggestion.why,
                score: suggestion.score,
                createdAt: Date.now(),
            });
            suggestionIds.push(id);
        }
        return suggestionIds;
    },
});
// Get intro suggestions
export const getIntroSuggestions = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("introsSuggestions")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
            .order("desc")
            .collect();
    },
});
// AI Usage Tracking Functions
// Track AI usage
export const trackUsage = mutation({
    args: {
        ownerId: v.id("users"),
        feature: v.string(),
        tokens: v.number(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("aiUsage", args);
    },
});
// Get AI usage for a user
export const getUsage = query({
    args: {
        ownerId: v.id("users"),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("aiUsage")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId));
        if (args.startDate) {
            query = query.filter((q) => q.gte(q.field("date"), args.startDate));
        }
        if (args.endDate) {
            query = query.filter((q) => q.lte(q.field("date"), args.endDate));
        }
        return await query.collect();
    },
});
// AI Settings Functions
// Get AI settings for a user
export const getSettings = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("aiSettings")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
            .first();
    },
});
// Update AI settings
export const updateSettings = mutation({
    args: {
        ownerId: v.id("users"),
        enabledFeatures: v.array(v.string()),
        dailyBudget: v.optional(v.number()),
        monthlyBudget: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("aiSettings")
            .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        }
        else {
            return await ctx.db.insert("aiSettings", args);
        }
    },
});
//# sourceMappingURL=ai.js.map