import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    return user;
  },
});

// Create or update user
export const upsertUser = mutation({
  args: {
    email: v.string(),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        bio: args.bio,
      });
      return existingUser._id;
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        email: args.email,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        bio: args.bio,
        createdAt: Date.now(),
      });
    }
  },
});
