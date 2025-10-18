import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
// List dex entries for a user
export const list = query({
    args: {
        ownerId: v.id("users"),
        sort: v.optional(v.union(v.literal("dex"), v.literal("recent"), v.literal("level"))),
        filterType: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { ownerId, sort = "dex", filterType } = args;
        let entries = await ctx.db
            .query("dexEntries")
            .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
            .collect();
        // Apply type filter
        if (filterType) {
            entries = entries.filter(entry => entry.types.includes(filterType));
        }
        // Sort entries
        switch (sort) {
            case "dex":
                entries.sort((a, b) => a.dexNumber - b.dexNumber);
                break;
            case "recent":
                entries.sort((a, b) => b.updatedAt - a.updatedAt);
                break;
            case "level":
                entries.sort((a, b) => {
                    if (b.level !== a.level)
                        return b.level - a.level;
                    return b.xp - a.xp;
                });
                break;
        }
        return entries;
    },
});
// Get a single dex entry with contact and preferences
export const getEntry = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact)
            return null;
        const dexEntry = await ctx.db
            .query("dexEntries")
            .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
            .first();
        const preferences = await ctx.db
            .query("preferences")
            .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
            .first();
        return {
            contact,
            dexEntry,
            preferences
        };
    },
});
// Compute dex entry from contact data
export const computeEntry = mutation({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact)
            throw new Error("Contact not found");
        // Get existing dex entry
        const existingEntry = await ctx.db
            .query("dexEntries")
            .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
            .first();
        // Calculate dex number (simple increment for now)
        const allEntries = await ctx.db
            .query("dexEntries")
            .withIndex("by_owner", (q) => q.eq("ownerId", contact.ownerId))
            .collect();
        const dexNumber = existingEntry?.dexNumber ?? allEntries.length + 1;
        // Calculate types from tags (simplified mapping)
        const types = [];
        contact.tags.forEach(tag => {
            const lowerTag = tag.toLowerCase();
            if (lowerTag.includes("art") || lowerTag.includes("creative"))
                types.push("ART");
            if (lowerTag.includes("tech") || lowerTag.includes("engineer"))
                types.push("ELEC");
            if (lowerTag.includes("music") || lowerTag.includes("sound"))
                types.push("PSY");
            if (lowerTag.includes("business") || lowerTag.includes("sales"))
                types.push("STEEL");
            if (lowerTag.includes("design") || lowerTag.includes("visual"))
                types.push("GRASS");
            if (lowerTag.includes("food") || lowerTag.includes("cooking"))
                types.push("FIRE");
            if (lowerTag.includes("water") || lowerTag.includes("ocean"))
                types.push("WATER");
        });
        // Default to NORM if no types found
        if (types.length === 0)
            types.push("NORM");
        // Calculate level and XP
        const xp = existingEntry?.xp ?? 0;
        let level = 1;
        if (xp >= 25)
            level = 3;
        else if (xp >= 10)
            level = 2;
        const entryData = {
            ownerId: contact.ownerId,
            contactId: args.contactId,
            dexNumber,
            types,
            level,
            xp,
            prefs: "{}", // Default empty preferences JSON string
            updatedAt: Date.now(),
        };
        if (existingEntry) {
            await ctx.db.patch(existingEntry._id, entryData);
            return existingEntry._id;
        }
        else {
            return await ctx.db.insert("dexEntries", entryData);
        }
    },
});
// Update XP for a dex entry
export const updateXp = mutation({
    args: {
        contactId: v.id("contacts"),
        xpDelta: v.number(),
        reason: v.string()
    },
    handler: async (ctx, args) => {
        const dexEntry = await ctx.db
            .query("dexEntries")
            .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
            .first();
        if (!dexEntry) {
            // Create dex entry if it doesn't exist
            await ctx.runMutation(api.dex.computeEntry, { contactId: args.contactId });
            return;
        }
        const newXp = Math.max(0, dexEntry.xp + args.xpDelta);
        let newLevel = 1;
        if (newXp >= 25)
            newLevel = 3;
        else if (newXp >= 10)
            newLevel = 2;
        await ctx.db.patch(dexEntry._id, {
            xp: newXp,
            level: newLevel,
            updatedAt: Date.now(),
        });
    },
});
//# sourceMappingURL=dex.js.map