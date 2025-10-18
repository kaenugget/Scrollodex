import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createDemoUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Create demo user with password
    const userId = await ctx.db.insert("users", {
      email: "demo@scrollodex.com",
      displayName: "Demo User",
      passwordHash: "demo123", // Simple hash for demo
      createdAt: Date.now(),
    });
    return userId;
  },
});

export const seedDemoData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Create demo contacts with more comprehensive data
    const contacts = [
      {
        name: "Alice Chen",
        emails: ["alice@techcorp.com", "alice.personal@gmail.com"],
        phones: ["+1-555-0101", "+1-555-0106"],
        company: "TechCorp",
        role: "Senior Software Engineer",
        location: "San Francisco, CA",
        tags: ["tech", "engineer", "javascript", "react", "node"],
        notes: ["Met at React conference", "Loves hiking", "Coffee enthusiast"],
        lastInteractionAt: Date.now() - 86400000, // 1 day ago
        pinned: true,
      },
      {
        name: "Bob Rodriguez",
        emails: ["bob@designstudio.com"],
        phones: ["+1-555-0102"],
        company: "Design Studio",
        role: "Creative Director",
        location: "New York, NY",
        tags: ["design", "creative", "art", "branding", "ui"],
        notes: ["Great eye for color", "Works with startups", "Skateboarding"],
        lastInteractionAt: Date.now() - 172800000, // 2 days ago
        pinned: false,
      },
      {
        name: "Carol Kim",
        emails: ["carol@musiclabel.com", "carol.music@yahoo.com"],
        phones: ["+1-555-0103"],
        company: "Independent Music Label",
        role: "Music Producer & Artist",
        location: "Los Angeles, CA",
        tags: ["music", "creative", "sound", "electronic", "indie"],
        notes: ["Amazing producer", "Into electronic music", "Night owl"],
        lastInteractionAt: Date.now() - 259200000, // 3 days ago
        pinned: true,
      },
      {
        name: "David Park",
        emails: ["david@foodtruck.com"],
        phones: ["+1-555-0104", "+1-555-0107"],
        company: "Park's Food Truck",
        role: "Chef & Owner",
        location: "Austin, TX",
        tags: ["food", "cooking", "business", "korean", "fusion"],
        notes: ["Best Korean fusion", "Food truck entrepreneur", "Family man"],
        lastInteractionAt: Date.now() - 432000000, // 5 days ago
        pinned: false,
      },
      {
        name: "Emma Watson",
        emails: ["emma@consulting.com"],
        phones: ["+1-555-0105"],
        company: "Business Consulting Co",
        role: "Senior Business Consultant",
        location: "Chicago, IL",
        tags: ["business", "consulting", "sales", "strategy", "leadership"],
        notes: ["Great networker", "Helps with business strategy", "Yoga instructor"],
        lastInteractionAt: Date.now() - 604800000, // 1 week ago
        pinned: true,
      },
      {
        name: "Frank Liu",
        emails: ["frank@startup.io"],
        phones: ["+1-555-0108"],
        company: "StartupXYZ",
        role: "Founder & CEO",
        location: "Seattle, WA",
        tags: ["startup", "tech", "entrepreneur", "ai", "venture"],
        notes: ["Serial entrepreneur", "AI enthusiast", "Coffee addict"],
        lastInteractionAt: Date.now() - 1209600000, // 2 weeks ago
        pinned: false,
      },
      {
        name: "Grace Thompson",
        emails: ["grace@photography.com"],
        phones: ["+1-555-0109"],
        company: "Grace Photography",
        role: "Photographer",
        location: "Portland, OR",
        tags: ["photography", "creative", "art", "wedding", "portrait"],
        notes: ["Amazing photographer", "Loves nature", "Vegan"],
        lastInteractionAt: Date.now() - 1814400000, // 3 weeks ago
        pinned: true,
      },
      {
        name: "Henry Davis",
        emails: ["henry@fitness.com"],
        phones: ["+1-555-0110"],
        company: "FitLife Gym",
        role: "Personal Trainer",
        location: "Miami, FL",
        tags: ["fitness", "health", "training", "nutrition", "motivation"],
        notes: ["Personal trainer", "Nutrition expert", "Early riser"],
        lastInteractionAt: Date.now() - 2419200000, // 4 weeks ago
        pinned: false,
      },
    ];

    const contactIds = [];
    for (const contactData of contacts) {
      const contactId = await ctx.db.insert("contacts", {
        ownerId: args.userId,
        ...contactData,
      });
      contactIds.push(contactId);
    }

    // Create dex entries for contacts
    const dexEntries = [
      { contactId: contactIds[0], dexNumber: 1, types: ["ELEC", "NORM"], level: 2, xp: 15, prefs: "{}" },
      { contactId: contactIds[1], dexNumber: 2, types: ["ART", "CREATIVE"], level: 3, xp: 28, prefs: "{}" },
      { contactId: contactIds[2], dexNumber: 3, types: ["PSY", "ELEC"], level: 2, xp: 12, prefs: "{}" },
      { contactId: contactIds[3], dexNumber: 4, types: ["FIRE", "NORM"], level: 1, xp: 7, prefs: "{}" },
      { contactId: contactIds[4], dexNumber: 5, types: ["STEEL", "NORM"], level: 3, xp: 30, prefs: "{}" },
      { contactId: contactIds[5], dexNumber: 6, types: ["ELEC", "STEEL"], level: 2, xp: 18, prefs: "{}" },
      { contactId: contactIds[6], dexNumber: 7, types: ["ART", "GRASS"], level: 1, xp: 5, prefs: "{}" },
      { contactId: contactIds[7], dexNumber: 8, types: ["FIRE", "NORM"], level: 2, xp: 14, prefs: "{}" },
    ];

    const dexIds = [];
    for (const dexData of dexEntries) {
      const dexId = await ctx.db.insert("dexEntries", {
        ownerId: args.userId,
        ...dexData,
        updatedAt: Date.now(),
      });
      dexIds.push(dexId);
    }

    // Create notes for contacts
    const notes = [
      { contactId: contactIds[0], body: "Met at React conference 2024. She's working on a new AI project and might be interested in collaborating.", createdAt: Date.now() - 86400000 },
      { contactId: contactIds[0], body: "Follow up about the hiking trip she mentioned. She loves outdoor activities.", createdAt: Date.now() - 172800000 },
      { contactId: contactIds[1], body: "Amazing designer with a great eye for detail. He mentioned wanting to work on more mobile projects.", createdAt: Date.now() - 259200000 },
      { contactId: contactIds[2], body: "Working on a new album. She's looking for collaborators for some electronic tracks.", createdAt: Date.now() - 345600000 },
      { contactId: contactIds[3], body: "His food truck is expanding to a second location. Might need help with business strategy.", createdAt: Date.now() - 432000000 },
      { contactId: contactIds[4], body: "Great consultant, helped me with my business plan. She's also a certified yoga instructor.", createdAt: Date.now() - 518400000 },
    ];

    for (const noteData of notes) {
      await ctx.db.insert("notes", {
        ownerId: args.userId,
        ...noteData,
      });
    }

    // Create actions for contacts
    const actions = [
      { contactId: contactIds[0], title: "Schedule coffee meeting", dueAt: Date.now() + 86400000, kind: "followup" },
      { contactId: contactIds[1], title: "Send portfolio review feedback", dueAt: Date.now() + 172800000, kind: "todo" },
      { contactId: contactIds[2], title: "Listen to her new tracks", dueAt: Date.now() + 259200000, kind: "followup" },
      { contactId: contactIds[3], title: "Visit his food truck", dueAt: Date.now() + 432000000, kind: "followup" },
      { contactId: contactIds[4], title: "Book yoga session", dueAt: Date.now() + 604800000, kind: "todo" },
    ];

    for (const actionData of actions) {
      await ctx.db.insert("actions", {
        ownerId: args.userId,
        ...actionData,
      });
    }

    // Create preferences for contacts
    const preferences = [
      { 
        contactId: contactIds[0], 
        food: ["Sushi", "Thai", "Coffee"], 
        music: ["Electronic", "Indie Rock", "Jazz"], 
        hobbies: ["Hiking", "Photography", "Coding"], 
        notes: "Loves outdoor activities and tech meetups" 
      },
      { 
        contactId: contactIds[1], 
        food: ["Italian", "Mexican", "Wine"], 
        music: ["Alternative", "Electronic", "Classical"], 
        hobbies: ["Skateboarding", "Art", "Travel"], 
        notes: "Creative type who loves exploring new cities" 
      },
      { 
        contactId: contactIds[2], 
        food: ["Korean", "Japanese", "Vegetarian"], 
        music: ["Electronic", "Ambient", "Experimental"], 
        hobbies: ["Music Production", "Night Photography", "Reading"], 
        notes: "Night owl who works best in the evening" 
      },
      { 
        contactId: contactIds[3], 
        food: ["Korean BBQ", "Fusion", "Street Food"], 
        music: ["K-Pop", "Hip Hop", "R&B"], 
        hobbies: ["Cooking", "Family Time", "Business"], 
        notes: "Family-oriented entrepreneur with great food" 
      },
      { 
        contactId: contactIds[4], 
        food: ["Healthy", "Mediterranean", "Green Smoothies"], 
        music: ["Yoga Music", "Ambient", "World Music"], 
        hobbies: ["Yoga", "Networking", "Reading"], 
        notes: "Health-conscious business professional" 
      },
    ];

    for (const prefData of preferences) {
      await ctx.db.insert("preferences", {
        ownerId: args.userId,
        ...prefData,
      });
    }

    return { contactIds, dexIds };
  },
});
