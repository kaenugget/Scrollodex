import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@clerk/nextjs/server";

// Simple password hashing (in production, use bcrypt or similar)
function simpleHash(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use a proper hashing library like bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Generate a secure session token
function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Register a new user
export const register = mutation({
  args: {
    email: v.string(),
    displayName: v.string(),
    password: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    selfieFileId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    avatarFileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate password
    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      displayName: args.displayName,
      firstName: args.firstName,
      lastName: args.lastName,
      selfieFileId: args.selfieFileId,
      avatarUrl: args.avatarUrl,
      avatarFileId: args.avatarFileId,
      passwordHash: simpleHash(args.password),
      createdAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { userId, token };
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const passwordHash = simpleHash(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new Error("Invalid email or password");
    }

    // Create new session
    const token = generateToken();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    // Update last login
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    return { userId: user._id, token };
  },
});

// Get current user from session token
export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    // Find session by token
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Session expired - return null (cleanup handled elsewhere)
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    // Return user without password hash
    return {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      avatarFileId: user.avatarFileId,
      bio: user.bio,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  },
});

// Logout user
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Change password
export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Get current user
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

    // Verify current password
    const currentPasswordHash = simpleHash(args.currentPassword);
    if (user.passwordHash !== currentPasswordHash) {
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Update password
    await ctx.db.patch(user._id, {
      passwordHash: simpleHash(args.newPassword),
    });

    return { success: true };
  },
});

// Google Sign-In
export const googleSignIn = mutation({
  args: {
    googleId: v.string(),
    email: v.string(),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by email
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email: args.email,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    } else {
      // Update existing user's last login
      await ctx.db.patch(user._id, {
        lastLoginAt: Date.now(),
        avatarUrl: args.avatarUrl, // Update avatar in case it changed
      });
    }

    if (!user) throw new Error("Failed to create/find user");

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { userId: user._id, token };
  },
});

// Delete account
export const deleteAccount = mutation({
  args: {
    token: v.string(),
    password: v.optional(v.string()), // Make password optional for Google users
  },
  handler: async (ctx, args) => {
    // Get current user
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

    // Only verify password if user has a password (not Google-only user)
    if (user.passwordHash && args.password) {
      const passwordHash = simpleHash(args.password);
      if (user.passwordHash !== passwordHash) {
        throw new Error("Password is incorrect");
      }
    } else if (user.passwordHash && !args.password) {
      throw new Error("Password required for account deletion");
    }

    // Delete all user sessions
    const userSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const userSession of userSessions) {
      await ctx.db.delete(userSession._id);
    }

    // Delete user
    await ctx.db.delete(user._id);

    return { success: true };
  },
});

// Get avatar URL from storage
export const getAvatarUrl = query({
  args: { avatarFileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.avatarFileId);
  },
});
