import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get preferences for a contact
export const getPreferences = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("preferences")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();
  },
});

// Create or update preferences
export const upsertPreferences = mutation({
  args: {
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    food: v.array(v.string()),
    music: v.array(v.string()),
    hobbies: v.array(v.string()),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("preferences")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        food: args.food,
        music: args.music,
        hobbies: args.hobbies,
        notes: args.notes,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("preferences", args);
    }
  },
});

// Delete preferences
export const deletePreferences = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("preferences")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();

    if (preferences) {
      await ctx.db.delete(preferences._id);
    }
  },
});
