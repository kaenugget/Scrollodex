import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Get notes for a contact
export const getNotes = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("notes")
            .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
            .order("desc")
            .collect();
    },
});
// Create a note
export const create = mutation({
    args: {
        ownerId: v.id("users"),
        contactId: v.id("contacts"),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notes", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
// Update a note
export const update = mutation({
    args: {
        noteId: v.id("notes"),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.noteId, { body: args.body });
    },
});
// Delete a note
export const deleteNote = mutation({
    args: { noteId: v.id("notes") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.noteId);
    },
});
// Get a single note
export const getNote = query({
    args: { noteId: v.id("notes") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.noteId);
    },
});
//# sourceMappingURL=notes.js.map