import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List notes for a contact
export const listNotes = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .order("desc")
      .collect();
  },
});

// Add a note
export const addNote = mutation({
  args: { 
    ownerId: v.id("users"),
    contactId: v.id("contacts"), 
    body: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      ownerId: args.ownerId,
      contactId: args.contactId,
      body: args.body,
      createdAt: Date.now(),
    });
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
  },
});

// List open actions for a contact
export const listOpenActions = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .filter((q) => q.eq(q.field("doneAt"), undefined))
      .order("asc")
      .collect();
  },
});

// Add an action
export const addAction = mutation({
  args: { 
    ownerId: v.id("users"),
    contactId: v.id("contacts"), 
    title: v.string(),
    dueAt: v.optional(v.number()),
    kind: v.union(v.literal("followup"), v.literal("todo"))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("actions", {
      ownerId: args.ownerId,
      contactId: args.contactId,
      title: args.title,
      dueAt: args.dueAt,
      kind: args.kind,
    });
  },
});

// Complete an action
export const completeAction = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.actionId, { 
      doneAt: Date.now() 
    });
  },
});

// Delete an action
export const deleteAction = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.actionId);
  },
});
