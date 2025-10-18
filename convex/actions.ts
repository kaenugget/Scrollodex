import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get actions for a contact
export const getActions = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .order("desc")
      .collect();
  },
});

// Get all actions for a user
export const getAllActions = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .order("desc")
      .collect();
  },
});

// Create an action
export const create = mutation({
  args: {
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    title: v.string(),
    dueAt: v.optional(v.number()),
    kind: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("actions", args);
  },
});

// Update an action
export const update = mutation({
  args: {
    actionId: v.id("actions"),
    title: v.optional(v.string()),
    dueAt: v.optional(v.number()),
    doneAt: v.optional(v.number()),
    kind: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { actionId, ...updates } = args;
    await ctx.db.patch(actionId, updates);
  },
});

// Mark action as done
export const markDone = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.actionId, { doneAt: Date.now() });
  },
});

// Mark action as undone
export const markUndone = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.actionId, { doneAt: undefined });
  },
});

// Delete an action
export const deleteAction = mutation({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.actionId);
  },
});

// Get a single action
export const getAction = query({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.actionId);
  },
});
