import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Create a nudge
export const createNudge = mutation({
    args: {
        ownerId: v.id("users"),
        contactId: v.id("contacts"),
        kind: v.union(v.literal("birthday"), v.literal("checkin")),
        dueAt: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("nudges", {
            ...args,
            sentAt: undefined,
        });
    },
});
// Get pending nudges for a user
export const getPendingNudges = query({
    args: { ownerId: v.id("users") },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db
            .query("nudges")
            .filter((q) => q.and(q.eq(q.field("ownerId"), args.ownerId), q.lte(q.field("dueAt"), now), q.eq(q.field("sentAt"), undefined)))
            .collect();
    },
});
// Mark nudge as sent
export const markNudgeSent = mutation({
    args: { nudgeId: v.id("nudges") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.nudgeId, {
            sentAt: Date.now(),
        });
    },
});
// Get all nudges for a contact
export const getContactNudges = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("nudges")
            .filter((q) => q.eq(q.field("contactId"), args.contactId))
            .order("desc")
            .collect();
    },
});
// Delete a nudge
export const deleteNudge = mutation({
    args: { nudgeId: v.id("nudges") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.nudgeId);
    },
});
// Create birthday nudge for a contact
export const createBirthdayNudge = mutation({
    args: {
        ownerId: v.id("users"),
        contactId: v.id("contacts"),
        birthday: v.string(), // Format: "MM-DD"
    },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact)
            throw new Error("Contact not found");
        // Calculate next birthday
        const now = new Date();
        const currentYear = now.getFullYear();
        const [month, day] = args.birthday.split("-");
        const birthdayDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        // If birthday has passed this year, set for next year
        if (birthdayDate < now) {
            birthdayDate.setFullYear(currentYear + 1);
        }
        return await ctx.db.insert("nudges", {
            ownerId: args.ownerId,
            contactId: args.contactId,
            kind: "birthday",
            dueAt: birthdayDate.getTime(),
        });
    },
});
// Create check-in nudge
export const createCheckinNudge = mutation({
    args: {
        ownerId: v.id("users"),
        contactId: v.id("contacts"),
        daysFromNow: v.number(),
    },
    handler: async (ctx, args) => {
        const dueAt = Date.now() + (args.daysFromNow * 24 * 60 * 60 * 1000);
        return await ctx.db.insert("nudges", {
            ownerId: args.ownerId,
            contactId: args.contactId,
            kind: "checkin",
            dueAt,
        });
    },
});
// Get overdue nudges (for admin/cleanup)
export const getOverdueNudges = query({
    args: { daysOverdue: v.number() },
    handler: async (ctx, args) => {
        const cutoffTime = Date.now() - (args.daysOverdue * 24 * 60 * 60 * 1000);
        return await ctx.db
            .query("nudges")
            .filter((q) => q.and(q.lte(q.field("dueAt"), cutoffTime), q.eq(q.field("sentAt"), undefined)))
            .collect();
    },
});
//# sourceMappingURL=nudges.js.map