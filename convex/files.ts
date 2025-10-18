import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for files
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Store file metadata
export const storeFileMetadata = mutation({
  args: {
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Store metadata in a custom table if needed
    // For now, we'll just return the file ID
    return args.fileId;
  },
});

// Get file URL
export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Delete file
export const deleteFile = mutation({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.fileId);
  },
});

// Upload avatar for user
export const uploadAvatar = mutation({
  args: {
    userId: v.id("users"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Update user with new avatar
    await ctx.db.patch(args.userId, {
      avatarUrl: await ctx.storage.getUrl(args.fileId),
    });

    return args.fileId;
  },
});

// Upload contact profile picture
export const uploadContactPfp = mutation({
  args: {
    contactId: v.id("contacts"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");

    // Update the dex entry with the new profile picture
    const dexEntry = await ctx.db
      .query("dexEntries")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .first();

    if (dexEntry) {
      await ctx.db.patch(dexEntry._id, {
        pfpFileId: args.fileId,
        updatedAt: Date.now(),
      });
    }

    return args.fileId;
  },
});

// Upload moment photo
export const uploadMomentPhoto = mutation({
  args: {
    momentId: v.id("moments"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const moment = await ctx.db.get(args.momentId);
    if (!moment) throw new Error("Moment not found");

    // Update moment with new photo
    await ctx.db.patch(args.momentId, {
      photoFileId: args.fileId,
    });

    return args.fileId;
  },
});

// Upload card design files
export const uploadCardDesign = mutation({
  args: {
    cardId: v.id("cards"),
    fileId: v.id("_storage"),
    type: v.union(v.literal("front"), v.literal("back")),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    const updateData = args.type === "front" 
      ? { frontFileId: args.fileId }
      : { backFileId: args.fileId };

    await ctx.db.patch(args.cardId, updateData);
    return args.fileId;
  },
});
