import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Get user by ID (for internal use)
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user)
            return null;
        // Return user without password hash
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
// Get user by ID (alias for getUserById)
export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user)
            return null;
        // Return user without password hash
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
// Get or create demo user
export const getOrCreateDemoUser = mutation({
    args: {},
    handler: async (ctx) => {
        // First, try to find an existing demo user
        const existingDemoUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), "demo@scrollodex.com"))
            .first();
        if (existingDemoUser) {
            return existingDemoUser._id;
        }
        // If no demo user exists, create one
        const demoUserId = await ctx.db.insert("users", {
            email: "demo@scrollodex.com",
            displayName: "Demo User",
            passwordHash: "demo123", // Simple hash for demo
            createdAt: Date.now(),
        });
        return demoUserId;
    },
});
// Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});
// Create a new user
export const createUser = mutation({
    args: {
        email: v.string(),
        displayName: v.string(),
        passwordHash: v.optional(v.string()),
        clerkUserId: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        if (existingUser) {
            return existingUser._id;
        }
        // Create new user
        return await ctx.db.insert("users", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
// Get or create user by email
export const getOrCreateUserByEmail = mutation({
    args: {
        email: v.string(),
        displayName: v.string(),
        passwordHash: v.optional(v.string()),
        clerkUserId: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        if (existingUser) {
            return existingUser._id;
        }
        // Create new user
        return await ctx.db.insert("users", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
// Update user profile
export const updateProfile = mutation({
    args: {
        token: v.string(),
        displayName: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Get current user from session
        const session = await ctx.db
            .query("sessions")
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .first();
        if (!session) {
            throw new Error("Invalid session");
        }
        const user = await ctx.db.get(session.userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Update user profile
        const updateData = {};
        if (args.displayName !== undefined)
            updateData.displayName = args.displayName;
        if (args.avatarUrl !== undefined)
            updateData.avatarUrl = args.avatarUrl;
        if (args.bio !== undefined)
            updateData.bio = args.bio;
        await ctx.db.patch(user._id, updateData);
        return { success: true };
    },
});
//# sourceMappingURL=users.js.map