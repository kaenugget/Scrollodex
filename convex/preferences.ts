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
export const create = mutation({
  args: {
    ownerId: v.id("users"),
    contactId: v.id("contacts"),
    food: v.array(v.string()),
    music: v.array(v.string()),
    hobbies: v.array(v.string()),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if preferences already exist
    const existingPrefs = await ctx.db
      .query("preferences")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();

    if (existingPrefs) {
      // Update existing preferences
      await ctx.db.patch(existingPrefs._id, {
        food: args.food,
        music: args.music,
        hobbies: args.hobbies,
        notes: args.notes,
      });
      return existingPrefs._id;
    } else {
      // Create new preferences
      return await ctx.db.insert("preferences", args);
    }
  },
});

// Update preferences
export const update = mutation({
  args: {
    contactId: v.id("contacts"),
    food: v.optional(v.array(v.string())),
    music: v.optional(v.array(v.string())),
    hobbies: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { contactId, ...updates } = args;
    
    const preferences = await ctx.db
      .query("preferences")
      .withIndex("by_contact", (q) => q.eq("contactId", contactId))
      .first();

    if (!preferences) {
      throw new Error("Preferences not found");
    }

    await ctx.db.patch(preferences._id, updates);
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