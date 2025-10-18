import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
// List all contacts for a user
export const list = query({
    args: {
        ownerId: v.id("users"),
        search: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        company: v.optional(v.string()),
        location: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { ownerId, search, tags, company, location } = args;
        let contacts = await ctx.db
            .query("contacts")
            .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
            .collect();
        // Apply filters
        if (search) {
            contacts = contacts.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()) ||
                contact.company?.toLowerCase().includes(search.toLowerCase()) ||
                contact.location?.toLowerCase().includes(search.toLowerCase()));
        }
        if (tags && tags.length > 0) {
            contacts = contacts.filter(contact => tags.some(tag => contact.tags.includes(tag)));
        }
        if (company) {
            contacts = contacts.filter(contact => contact.company?.toLowerCase().includes(company.toLowerCase()));
        }
        if (location) {
            contacts = contacts.filter(contact => contact.location?.toLowerCase().includes(location.toLowerCase()));
        }
        return contacts.sort((a, b) => {
            // Sort pinned first, then by last interaction
            if (a.pinned && !b.pinned)
                return -1;
            if (!a.pinned && b.pinned)
                return 1;
            return b.lastInteractionAt - a.lastInteractionAt;
        });
    },
});
// Get a single contact
export const get = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.contactId);
    },
});
// Create or update a contact
export const upsert = mutation({
    args: {
        id: v.optional(v.id("contacts")),
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
    },
    handler: async (ctx, args) => {
        const { id, ...contactData } = args;
        if (id) {
            // Update existing contact
            await ctx.db.patch(id, contactData);
            return id;
        }
        else {
            // Create new contact
            const contactId = await ctx.db.insert("contacts", contactData);
            // Automatically create a dex entry for new contacts
            await ctx.runMutation(api.dex.computeEntry, { contactId });
            return contactId;
        }
    },
});
// Pin/unpin a contact
export const pin = mutation({
    args: {
        contactId: v.id("contacts"),
        pinned: v.boolean()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.contactId, { pinned: args.pinned });
    },
});
// Delete a contact
export const deleteContact = mutation({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.contactId);
    },
});
// Bump interaction timestamp
export const bump = mutation({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.contactId, {
            lastInteractionAt: Date.now()
        });
    },
});
// Sync all dynamic contacts for a user
export const syncAllDynamicContacts = mutation({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        const dynamicContacts = await ctx.db
            .query("contacts")
            .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
            .filter((q) => q.eq(q.field("isDynamicContact"), true))
            .collect();
        const syncPromises = dynamicContacts.map(async (contact) => {
            if (contact.connectedUserId) {
                const connectedUser = await ctx.db.get(contact.connectedUserId);
                if (connectedUser) {
                    await ctx.db.patch(contact._id, {
                        name: connectedUser.displayName,
                        emails: connectedUser.email ? [connectedUser.email] : [],
                        lastSyncedAt: Date.now(),
                    });
                }
            }
        });
        await Promise.all(syncPromises);
        return { synced: dynamicContacts.length };
    },
});
// Get dynamic contacts that need syncing
export const getDynamicContactsNeedingSync = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        return await ctx.db
            .query("contacts")
            .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
            .filter((q) => q.and(q.eq(q.field("isDynamicContact"), true), q.or(q.eq(q.field("lastSyncedAt"), undefined), q.lt(q.field("lastSyncedAt"), oneHourAgo))))
            .collect();
    },
});
//# sourceMappingURL=contacts.js.map