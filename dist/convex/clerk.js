import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Create or find a Convex user for a Clerk user
export const createOrFindUser = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        displayName: v.string(),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists by Clerk ID
        let user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();
        if (!user) {
            // Check if user exists by email (in case they signed up with email first)
            user = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", args.email))
                .first();
            if (user) {
                // Update existing user with Clerk ID
                await ctx.db.patch(user._id, {
                    clerkUserId: args.clerkUserId,
                    avatarUrl: args.avatarUrl,
                    lastLoginAt: Date.now(),
                });
            }
            else {
                // Create new user
                const userId = await ctx.db.insert("users", {
                    clerkUserId: args.clerkUserId,
                    email: args.email,
                    displayName: args.displayName,
                    avatarUrl: args.avatarUrl,
                    createdAt: Date.now(),
                    lastLoginAt: Date.now(),
                });
                user = await ctx.db.get(userId);
            }
        }
        else {
            // Update existing user's info
            await ctx.db.patch(user._id, {
                email: args.email,
                displayName: args.displayName,
                avatarUrl: args.avatarUrl,
                lastLoginAt: Date.now(),
            });
        }
        if (!user)
            throw new Error("Failed to create/find user");
        return {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };
    },
});
// Get user by Clerk ID
export const getUserByClerkId = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();
        if (!user)
            return null;
        return {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };
    },
});
//# sourceMappingURL=clerk.js.map