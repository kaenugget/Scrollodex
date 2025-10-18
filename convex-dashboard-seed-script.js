// Convex Dashboard Script to populate dummy data for kaelanwanshengfung@gmail.com
// Copy and paste this into the Convex dashboard Functions tab and run each section

// ============================================================================
// SECTION 1: Create User
// ============================================================================
// Run this first to create the user
await ctx.runMutation(api.users.getOrCreateUserByEmail, {
  email: "kaelanwanshengfung@gmail.com",
  displayName: "Kaelan Wan",
  bio: "Product Manager & Tech Enthusiast",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
});

// ============================================================================
// SECTION 2: Create Pet Templates
// ============================================================================
// Run this to create pet templates
const petTemplates = [
  {
    templateId: "cat_orange_stripes_bow",
    petType: "cat",
    rarity: "common",
    basePrompt: "A cute orange tabby cat with stripes, wearing a bow",
    colors: ["orange", "black", "white", "gray"],
    patterns: ["solid", "stripes", "spots"],
    accessories: ["hat", "bow", "collar", "glasses"],
    hatchChance: 0.25
  },
  {
    templateId: "dog_golden_solid_collar",
    petType: "dog",
    rarity: "common",
    basePrompt: "A golden retriever dog with solid color, wearing a collar",
    colors: ["brown", "golden", "black", "white"],
    patterns: ["solid", "patches"],
    accessories: ["hat", "bow", "collar", "glasses"],
    hatchChance: 0.25
  },
  {
    templateId: "dragon_red_scales_crown",
    petType: "dragon",
    rarity: "epic",
    basePrompt: "A majestic red dragon with scales, wearing a crown",
    colors: ["red", "blue", "purple", "gold"],
    patterns: ["scales", "gradient"],
    accessories: ["hat", "bow", "collar", "glasses", "crown"],
    hatchChance: 0.03
  },
  {
    templateId: "fox_silver_gradient_glasses",
    petType: "fox",
    rarity: "rare",
    basePrompt: "A silver fox with gradient pattern, wearing glasses",
    colors: ["red", "silver", "arctic"],
    patterns: ["solid", "gradient"],
    accessories: ["hat", "bow", "collar", "glasses"],
    hatchChance: 0.15
  },
  {
    templateId: "bird_rainbow_feathers_hat",
    petType: "bird",
    rarity: "rare",
    basePrompt: "A colorful bird with rainbow feathers, wearing a hat",
    colors: ["blue", "green", "yellow", "rainbow"],
    patterns: ["solid", "feathers"],
    accessories: ["hat", "bow", "collar", "glasses"],
    hatchChance: 0.10
  },
  {
    templateId: "rabbit_white_spots_bow",
    petType: "rabbit",
    rarity: "common",
    basePrompt: "A white rabbit with spots, wearing a bow",
    colors: ["white", "brown", "gray"],
    patterns: ["solid", "spots"],
    accessories: ["hat", "bow", "collar", "glasses"],
    hatchChance: 0.20
  },
  {
    templateId: "phoenix_fire_flames_crown",
    petType: "phoenix",
    rarity: "epic",
    basePrompt: "A legendary phoenix with fire and flames, wearing a crown",
    colors: ["fire", "gold", "crimson"],
    patterns: ["flames", "feathers"],
    accessories: ["hat", "bow", "collar", "glasses", "crown"],
    hatchChance: 0.01
  }
];

for (const template of petTemplates) {
  await ctx.runMutation(api.pets.createPetTemplate, template);
}

// ============================================================================
// SECTION 3: Create Contacts with Pet Data
// ============================================================================
// First get the user ID
const user = await ctx.runQuery(api.users.getUserByEmail, { email: "kaelanwanshengfung@gmail.com" });
const userId = user._id;

// Create contacts with diverse pet data
const contacts = [
  {
    name: "Alex Chen",
    emails: ["alex.chen@tech.com"],
    phones: ["+1-555-0101"],
    birthday: "1995-03-15",
    tags: ["work", "tech", "friend"],
    company: "TechCorp",
    role: "Software Engineer",
    location: "San Francisco, CA",
    notes: ["Met at tech conference", "Great at React", "Coffee enthusiast"],
    lastInteractionAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
    pinned: true,
    petData: {
      petType: "cat",
      petName: "Whiskers",
      level: 3,
      happiness: 85,
      color: "orange",
      pattern: "stripes",
      accessory: "bow",
      templateId: "cat_orange_stripes_bow",
      generatedAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
      evolutionTokens: 5,
      totalEvolutions: 2,
      lastUpdated: Date.now()
    }
  },
  {
    name: "Sarah Johnson",
    emails: ["sarah.j@design.com"],
    phones: ["+1-555-0102"],
    birthday: "1992-07-22",
    tags: ["design", "creative", "friend"],
    company: "Design Studio",
    role: "UX Designer",
    location: "New York, NY",
    notes: ["Amazing designer", "Loves coffee", "Art gallery enthusiast"],
    lastInteractionAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    pinned: false,
    petData: {
      petType: "dog",
      petName: "Buddy",
      level: 2,
      happiness: 70,
      color: "golden",
      pattern: "solid",
      accessory: "collar",
      templateId: "dog_golden_solid_collar",
      generatedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
      evolutionTokens: 3,
      totalEvolutions: 1,
      lastUpdated: Date.now()
    }
  },
  {
    name: "Mike Rodriguez",
    emails: ["mike.r@startup.com"],
    phones: ["+1-555-0103"],
    birthday: "1988-11-08",
    tags: ["startup", "entrepreneur", "mentor"],
    company: "StartupXYZ",
    role: "CEO",
    location: "Austin, TX",
    notes: ["Great mentor", "Very inspiring", "Early riser"],
    lastInteractionAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 week ago
    pinned: true,
    petData: {
      petType: "dragon",
      petName: "Flame",
      level: 5,
      happiness: 95,
      color: "red",
      pattern: "scales",
      accessory: "crown",
      templateId: "dragon_red_scales_crown",
      generatedAt: Date.now() - (14 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (21 * 24 * 60 * 60 * 1000),
      evolutionTokens: 8,
      totalEvolutions: 3,
      lastUpdated: Date.now()
    }
  },
  {
    name: "Emma Wilson",
    emails: ["emma.w@art.com"],
    phones: ["+1-555-0104"],
    birthday: "1990-05-12",
    tags: ["art", "creative", "friend"],
    company: "Art Gallery",
    role: "Curator",
    location: "Los Angeles, CA",
    notes: ["Talented artist", "Very creative", "Museum lover"],
    lastInteractionAt: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
    pinned: false,
    petData: {
      petType: "fox",
      petName: "Sage",
      level: 4,
      happiness: 80,
      color: "silver",
      pattern: "gradient",
      accessory: "glasses",
      templateId: "fox_silver_gradient_glasses",
      generatedAt: Date.now() - (8 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (15 * 24 * 60 * 60 * 1000),
      evolutionTokens: 6,
      totalEvolutions: 2,
      lastUpdated: Date.now()
    }
  },
  {
    name: "David Kim",
    emails: ["david.k@music.com"],
    phones: ["+1-555-0105"],
    birthday: "1993-09-30",
    tags: ["music", "producer", "friend"],
    company: "Music Studio",
    role: "Music Producer",
    location: "Nashville, TN",
    notes: ["Amazing musician", "Great collaborator", "Night owl"],
    lastInteractionAt: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
    pinned: false,
    petData: {
      petType: "bird",
      petName: "Melody",
      level: 3,
      happiness: 75,
      color: "rainbow",
      pattern: "feathers",
      accessory: "hat",
      templateId: "bird_rainbow_feathers_hat",
      generatedAt: Date.now() - (6 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (12 * 24 * 60 * 60 * 1000),
      evolutionTokens: 4,
      totalEvolutions: 1,
      lastUpdated: Date.now()
    }
  },
  {
    name: "Lisa Zhang",
    emails: ["lisa.z@finance.com"],
    phones: ["+1-555-0106"],
    birthday: "1987-12-03",
    tags: ["finance", "advisor", "professional"],
    company: "Finance Corp",
    role: "Financial Advisor",
    location: "Chicago, IL",
    notes: ["Great financial advice", "Very professional", "Detail-oriented"],
    lastInteractionAt: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
    pinned: false,
    petData: {
      petType: "rabbit",
      petName: "Cotton",
      level: 2,
      happiness: 65,
      color: "white",
      pattern: "spots",
      accessory: "bow",
      templateId: "rabbit_white_spots_bow",
      generatedAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (9 * 24 * 60 * 60 * 1000),
      evolutionTokens: 2,
      totalEvolutions: 0,
      lastUpdated: Date.now()
    }
  },
  {
    name: "James Brown",
    emails: ["james.b@sports.com"],
    phones: ["+1-555-0107"],
    birthday: "1991-04-18",
    tags: ["sports", "fitness", "friend"],
    company: "Sports Agency",
    role: "Sports Agent",
    location: "Miami, FL",
    notes: ["Great athlete", "Very motivated", "Gym enthusiast"],
    lastInteractionAt: Date.now() - (6 * 24 * 60 * 60 * 1000), // 6 days ago
    pinned: false,
    petData: {
      petType: "phoenix",
      petName: "Blaze",
      level: 6,
      happiness: 100,
      color: "fire",
      pattern: "flames",
      accessory: "crown",
      templateId: "phoenix_fire_flames_crown",
      generatedAt: Date.now() - (20 * 24 * 60 * 60 * 1000),
      hatchedAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
      evolutionTokens: 12,
      totalEvolutions: 4,
      lastUpdated: Date.now()
    }
  }
];

const contactIds = [];
for (const contact of contacts) {
  const contactId = await ctx.runMutation(api.contacts.upsert, {
    ownerId: userId,
    ...contact
  });
  contactIds.push(contactId);
}

// ============================================================================
// SECTION 4: Create Decks and Cards
// ============================================================================
// Create decks
const personalDeckId = await ctx.runMutation(api.social.createDeck, {
  ownerId: userId,
  kind: "personal",
  title: "My Personal Memories"
});

const duoDeckId = await ctx.runMutation(api.social.createDeck, {
  ownerId: userId,
  kind: "duo",
  title: "Shared Adventures",
  peerUserId: userId // For demo
});

// Create cards for personal deck
const personalCards = [
  {
    title: "Tech Conference 2024",
    date: "2024-01-15",
    location: "San Francisco, CA",
    people: ["Alex Chen", "Sarah Johnson", "Mike Rodriguez"],
    photosFileIds: [],
    highlights: ["Amazing keynote", "Great networking", "New product launch"],
    aiCaption: "An exciting day at the tech conference with amazing presentations and networking opportunities."
  },
  {
    title: "Weekend Hiking Trip",
    date: "2024-01-20",
    location: "Yosemite National Park",
    people: ["Emma Wilson", "David Kim"],
    photosFileIds: [],
    highlights: ["Beautiful views", "Great weather", "Fun conversations"],
    aiCaption: "A perfect hiking adventure through Yosemite with stunning natural beauty and great company."
  },
  {
    title: "Music Studio Session",
    date: "2024-01-25",
    location: "Nashville, TN",
    people: ["David Kim"],
    photosFileIds: [],
    highlights: ["New song", "Great collaboration", "Amazing sound"],
    aiCaption: "An incredible music production session creating something truly special."
  }
];

for (const card of personalCards) {
  await ctx.runMutation(api.social.createCard, {
    deckId: personalDeckId,
    ...card
  });
}

// Create cards for duo deck
const duoCards = [
  {
    title: "Coffee Shop Meetup",
    date: "2024-01-18",
    location: "Blue Bottle Coffee",
    people: ["Alex Chen"],
    photosFileIds: [],
    highlights: ["Great conversation", "New project ideas", "Delicious coffee"],
    aiCaption: "A productive coffee meeting that sparked new ideas and strengthened our friendship."
  },
  {
    title: "Art Gallery Opening",
    date: "2024-01-22",
    location: "Modern Art Gallery",
    people: ["Emma Wilson"],
    photosFileIds: [],
    highlights: ["Amazing art", "Great crowd", "Inspiring conversations"],
    aiCaption: "An inspiring evening at the art gallery opening with beautiful works and meaningful connections."
  }
];

for (const card of duoCards) {
  await ctx.runMutation(api.social.createCard, {
    deckId: duoDeckId,
    ...card
  });
}

// ============================================================================
// SECTION 5: Create Preferences, Notes, and Actions
// ============================================================================
// Create preferences for contacts
const preferences = [
  {
    contactId: contactIds[0], // Alex Chen
    food: ["Sushi", "Ramen", "Coffee"],
    music: ["Electronic", "Indie Rock", "Jazz"],
    hobbies: ["Coding", "Gaming", "Photography"],
    notes: "Prefers morning meetings, loves trying new restaurants"
  },
  {
    contactId: contactIds[1], // Sarah Johnson
    food: ["Vegetarian", "Mediterranean", "Tea"],
    music: ["Classical", "Ambient", "Folk"],
    hobbies: ["Design", "Painting", "Yoga"],
    notes: "Very creative, loves art galleries and museums"
  },
  {
    contactId: contactIds[2], // Mike Rodriguez
    food: ["BBQ", "Mexican", "Whiskey"],
    music: ["Rock", "Blues", "Country"],
    hobbies: ["Entrepreneurship", "Reading", "Golf"],
    notes: "Early riser, very focused on business goals"
  }
];

for (const pref of preferences) {
  await ctx.runMutation(api.preferences.create, {
    ownerId: userId,
    ...pref
  });
}

// Create notes for contacts
const notes = [
  {
    contactId: contactIds[0],
    body: "Alex mentioned he's working on a new React project. Should follow up about potential collaboration opportunities."
  },
  {
    contactId: contactIds[1],
    body: "Sarah's design portfolio is incredible. She might be interested in freelance work for our startup."
  },
  {
    contactId: contactIds[2],
    body: "Mike gave great advice about scaling the business. Need to schedule another mentoring session."
  }
];

for (const note of notes) {
  await ctx.runMutation(api.notes.create, {
    ownerId: userId,
    ...note
  });
}

// Create actions/todos
const actions = [
  {
    contactId: contactIds[0],
    title: "Follow up on React project collaboration",
    dueAt: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
    kind: "followup"
  },
  {
    contactId: contactIds[1],
    title: "Send design portfolio review",
    dueAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 1 week from now
    kind: "todo"
  },
  {
    contactId: contactIds[2],
    title: "Schedule next mentoring session",
    dueAt: Date.now() + (14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    kind: "followup"
  }
];

for (const action of actions) {
  await ctx.runMutation(api.actions.create, {
    ownerId: userId,
    ...action
  });
}

// ============================================================================
// COMPLETION MESSAGE
// ============================================================================
console.log("🎉 Dummy data seeding completed successfully!");
console.log(`📊 Summary:`);
console.log(`   - User: Kaelan Wan (kaelanwanshengfung@gmail.com)`);
console.log(`   - Contacts: ${contactIds.length}`);
console.log(`   - Pet Templates: ${petTemplates.length}`);
console.log(`   - Decks: 2`);
console.log(`   - Cards: ${personalCards.length + duoCards.length}`);
console.log(`   - Preferences: ${preferences.length}`);
console.log(`   - Notes: ${notes.length}`);
console.log(`   - Actions: ${actions.length}`);
