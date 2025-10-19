import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// List all contacts for a user
export const list = query({
  args: { 
    ownerId: v.id("users"),
    search: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    location: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { ownerId, search, tags, company, location } = args;
    
    let contacts = await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .collect();

    // Apply filters
    if (search) {
      contacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.company?.toLowerCase().includes(search.toLowerCase()) ||
        contact.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tags && tags.length > 0) {
      contacts = contacts.filter(contact => 
        tags.some(tag => contact.tags.includes(tag))
      );
    }

    if (company) {
      contacts = contacts.filter(contact => 
        contact.company?.toLowerCase().includes(company.toLowerCase())
      );
    }

    if (location) {
      contacts = contacts.filter(contact => 
        contact.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    return contacts.sort((a, b) => {
      // Sort pinned first, then by last interaction
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastInteractionAt - a.lastInteractionAt;
    });
  },
});

// Get a single contact
export const get = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactId);
  },
});

// Create or update a contact
export const upsert = mutation({
  args: {
    id: v.optional(v.id("contacts")),
    ownerId: v.id("users"),
    name: v.string(),
    emails: v.array(v.string()),
    phones: v.array(v.string()),
    birthday: v.optional(v.string()),
    tags: v.array(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.array(v.string()),
    lastInteractionAt: v.number(),
    pinned: v.boolean(),
    petData: v.optional(v.object({
      petType: v.optional(v.string()),
      petName: v.optional(v.string()),
      level: v.optional(v.float64()),
      happiness: v.optional(v.float64()),
      color: v.optional(v.string()),
      pattern: v.optional(v.string()),
      accessory: v.optional(v.string()),
      happyImageUrl: v.optional(v.string()),
      neutralImageUrl: v.optional(v.string()),
      sadImageUrl: v.optional(v.string()),
      excitedImageUrl: v.optional(v.string()),
      happyVideoUrl: v.optional(v.string()),
      neutralVideoUrl: v.optional(v.string()),
      sadVideoUrl: v.optional(v.string()),
      excitedVideoUrl: v.optional(v.string()),
      templateId: v.optional(v.string()),
      generatedAt: v.optional(v.float64()),
      lastUpdated: v.optional(v.float64()),
      hatchedAt: v.optional(v.float64()),
      regeneratedAt: v.optional(v.float64()),
      evolutionTokens: v.optional(v.float64()),
      totalEvolutions: v.optional(v.float64()),
      lastEvolutionAt: v.optional(v.float64()),
      videoGenerationStatus: v.optional(v.string()),
      videoGenerationStartedAt: v.optional(v.float64()),
      videoGenerationCompletedAt: v.optional(v.float64()),
      videoGenerationError: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...contactData } = args;
    
    if (id) {
      // Update existing contact
      await ctx.db.patch(id, contactData);
      return id;
    } else {
      // Create new contact
      const contactId = await ctx.db.insert("contacts", contactData);
      
      // Automatically create a dex entry for new contacts
      await ctx.runMutation(api.dex.computeEntry, { contactId });
      
      // Auto-generate pet if no petData provided and FAL_KEY is available
      if (!contactData.petData && process.env.FAL_KEY) {
        try {
          // Calculate relationship health based on contact data
          // Start with base health of 40% for new contacts
          let relationshipHealth = 40;
          
          // Boost health based on contact completeness
          if (contactData.emails.length > 0) relationshipHealth += 10;
          if (contactData.phones.length > 0) relationshipHealth += 10;
          if (contactData.company) relationshipHealth += 10;
          if (contactData.notes.length > 0) relationshipHealth += 10;
          if (contactData.tags.length > 0) relationshipHealth += 10;
          if (contactData.pinned) relationshipHealth += 10;
          
          // Cap at 90% for auto-generation
          relationshipHealth = Math.min(90, relationshipHealth);
          
          console.log(`🐣 Auto-generating pet for new contact ${contactData.name} with ${relationshipHealth}% health`);
          
          // Schedule pet generation asynchronously
          await ctx.scheduler.runAfter(0, api.pets.hatchPet, {
            contactId,
            userId: args.ownerId,
            relationshipHealth,
          });
        } catch (error) {
          console.error('🐣 Failed to schedule pet generation for new contact:', error);
          // Don't fail the contact creation if pet generation fails
        }
      }
      
      return contactId;
    }
  },
});

// Pin/unpin a contact
export const pin = mutation({
  args: { 
    contactId: v.id("contacts"), 
    pinned: v.boolean() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contactId, { pinned: args.pinned });
  },
});

// Delete a contact
export const deleteContact = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.contactId);
  },
});

// Bump interaction timestamp
export const bump = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contactId, { 
      lastInteractionAt: Date.now() 
    });
  },
});

// Sync all dynamic contacts for a user
export const syncAllDynamicContacts = mutation({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const dynamicContacts = await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .filter((q) => q.eq(q.field("isDynamicContact"), true))
      .collect();

    const syncPromises = dynamicContacts.map(async (contact) => {
      if (contact.connectedUserId) {
        const connectedUser = await ctx.db.get(contact.connectedUserId);
        if (connectedUser) {
          await ctx.db.patch(contact._id, {
            name: connectedUser.displayName,
            emails: connectedUser.email ? [connectedUser.email] : [],
            lastSyncedAt: Date.now(),
          });
        }
      }
    });

    await Promise.all(syncPromises);
    return { synced: dynamicContacts.length };
  },
});

// Get dynamic contacts that need syncing
export const getDynamicContactsNeedingSync = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .filter((q) => 
        q.and(
          q.eq(q.field("isDynamicContact"), true),
          q.or(
            q.eq(q.field("lastSyncedAt"), undefined),
            q.lt(q.field("lastSyncedAt"), oneHourAgo)
          )
        )
      )
      .collect();
  },
});
