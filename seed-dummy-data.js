// Script to populate dummy data for kaelanwanshengfung@gmail.com
// Run this with: node seed-dummy-data.js

const { ConvexHttpClient } = require("convex/browser");

// Initialize Convex client
const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://your-convex-url.convex.cloud");

// Helper function to create a user
async function createUser(email, displayName) {
  try {
    // First check if user exists
    const existingUsers = await client.query("users:getUserById", { userId: "temp" });
    
    // For now, we'll create the user directly in the database
    // This would normally be done through a proper user creation endpoint
    console.log(`Creating user: ${email}`);
    
    // We'll need to use a mutation to create the user
    // Since we don't have a direct createUser mutation, we'll work with existing data
    return null; // Placeholder
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Helper function to create contacts with pet data
async function createContact(ownerId, contactData) {
  try {
    const contactId = await client.mutation("contacts:upsert", {
      ownerId,
      ...contactData
    });
    console.log(`Created contact: ${contactData.name}`);
    return contactId;
  } catch (error) {
    console.error("Error creating contact:", error);
    return null;
  }
}

// Helper function to create pet templates
async function createPetTemplate(templateData) {
  try {
    const templateId = await client.mutation("pets:createPetTemplate", templateData);
    console.log(`Created pet template: ${templateData.petType}`);
    return templateId;
  } catch (error) {
    console.error("Error creating pet template:", error);
    return null;
  }
}

// Helper function to create moments
async function createMoment(peerPageId, authorId, momentData) {
  try {
    const momentId = await client.mutation("social:addMoment", {
      peerPageId,
      authorId,
      ...momentData
    });
    console.log(`Created moment: ${momentData.caption || 'Untitled'}`);
    return momentId;
  } catch (error) {
    console.error("Error creating moment:", error);
    return null;
  }
}

// Helper function to create decks and cards
async function createDeck(ownerId, deckData) {
  try {
    const deckId = await client.mutation("social:createDeck", {
      ownerId,
      ...deckData
    });
    console.log(`Created deck: ${deckData.title}`);
    return deckId;
  } catch (error) {
    console.error("Error creating deck:", error);
    return null;
  }
}

async function createCard(deckId, cardData) {
  try {
    const cardId = await client.mutation("social:createCard", {
      deckId,
      ...cardData
    });
    console.log(`Created card: ${cardData.title}`);
    return cardId;
  } catch (error) {
    console.error("Error creating card:", error);
    return null;
  }
}

// Main function to seed all dummy data
async function seedDummyData() {
  console.log("🌱 Starting to seed dummy data...");
  
  const userEmail = "kaelanwanshengfung@gmail.com";
  const displayName = "Kaelan Wan";
  
  try {
    // Step 1: Create or find the user
    console.log("👤 Creating user...");
    const userId = await createUser(userEmail, displayName);
    
    if (!userId) {
      console.log("⚠️  User creation failed, but continuing with dummy data...");
      // For now, we'll use a placeholder user ID
      // In a real scenario, you'd need to create the user first
      return;
    }
    
    console.log(`✅ User created/found: ${userId}`);
    
    // Available emoji assets for profile pictures
    const emojiAssets = [
      "08356205059d24549593d0b9a19cb1762abc8900.png",
      "0f3142c26306857d8e70277ea1bb8f087bc38fd9.png",
      "1273bdff1e02246ba2bc10e92c9ae54e27ecac5c.png",
      "175b568fdd31fff9ebc4eb30d2fd4b1a988fffc3.png",
      "18f3ede5ed062331e5fb62e6f9d5fbc8e4f5c6ac.png",
      "1967330d9961adf49d90841a7a35d8b513034ef9.png",
      "233a6fd519ce98178bfa9832ddd058403db1d3bb.png",
      "2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png",
      "40eea2bdc979e8303cfe5ad670c718ab7cc6cd26.png",
      "44faab3101d6e25090512693120c23866d347d02.png",
      "637f9d8820279c93bb2cefb93af72472f431eb50.png",
      "7d8e6fc528bf327988694404fca08058031b575e.png",
      "895ae4cd93b3ed20d216afcda2414d80547ae205.png",
      "8c98835dadb44f58c902e8b219525eadb42275c0.png",
      "90d4316f95dfa58f20b98e74e9e8a295574e84a4.png",
      "96ca4f3c99225394e50df5e7a78773cc97a178c7.png",
      "c2fddacc152d57392b08ecccebbd50e1a6f2af8a.png",
      "d6b40c57af7b91ce62fe3d8218a57c792f4e52b8.png",
      "dfa1cae2fdb7e947b9b28b566d7285888111b66a.png",
      "e6a83ff14ac76d1598087c994da84a379bd4b797.png",
      "fdee818f54b8c3fba3690e004d2a4967c796d17d.png"
    ];

    // Step 2: Create diverse contacts with different pet types
    console.log("👥 Creating contacts...");
    
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
        notes: ["Met at tech conference", "Great at React"],
        lastInteractionAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        pinned: true,
        profilePictureUrl: `/assets-moji/${emojiAssets[0]}`,
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
        notes: ["Amazing designer", "Loves coffee"],
        lastInteractionAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
        pinned: false,
        profilePictureUrl: `/assets-moji/${emojiAssets[1]}`,
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
        notes: ["Great mentor", "Very inspiring"],
        lastInteractionAt: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 week ago
        pinned: true,
        profilePictureUrl: `/assets-moji/${emojiAssets[2]}`,
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
        notes: ["Talented artist", "Very creative"],
        lastInteractionAt: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
        pinned: false,
        profilePictureUrl: `/assets-moji/${emojiAssets[3]}`,
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
        notes: ["Amazing musician", "Great collaborator"],
        lastInteractionAt: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
        pinned: false,
        profilePictureUrl: `/assets-moji/${emojiAssets[4]}`,
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
        notes: ["Great financial advice", "Very professional"],
        lastInteractionAt: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
        pinned: false,
        profilePictureUrl: `/assets-moji/${emojiAssets[5]}`,
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
        notes: ["Great athlete", "Very motivated"],
        lastInteractionAt: Date.now() - (6 * 24 * 60 * 60 * 1000), // 6 days ago
        pinned: false,
        profilePictureUrl: `/assets-moji/${emojiAssets[6]}`,
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
        }
      }
    ];
    
    const contactIds = [];
    for (const contact of contacts) {
      const contactId = await createContact(userId, contact);
      if (contactId) {
        contactIds.push(contactId);
      }
    }
    
    console.log(`✅ Created ${contactIds.length} contacts`);
    
    // Step 3: Create pet templates
    console.log("🐾 Creating pet templates...");
    
    const petTemplates = [
      {
        templateId: "cat_orange_stripes_bow",
        petType: "cat",
        rarity: "common",
        basePrompt: "A cute orange tabby cat with stripes, wearing a bow",
        colors: ["orange", "black", "white", "gray"],
        patterns: ["solid", "stripes", "spots"],
        accessories: ["hat", "bow", "collar", "glasses"],
        hatchChance: 0.25,
        createdAt: Date.now()
      },
      {
        templateId: "dog_golden_solid_collar",
        petType: "dog",
        rarity: "common",
        basePrompt: "A golden retriever dog with solid color, wearing a collar",
        colors: ["brown", "golden", "black", "white"],
        patterns: ["solid", "patches"],
        accessories: ["hat", "bow", "collar", "glasses"],
        hatchChance: 0.25,
        createdAt: Date.now()
      },
      {
        templateId: "dragon_red_scales_crown",
        petType: "dragon",
        rarity: "epic",
        basePrompt: "A majestic red dragon with scales, wearing a crown",
        colors: ["red", "blue", "purple", "gold"],
        patterns: ["scales", "gradient"],
        accessories: ["hat", "bow", "collar", "glasses", "crown"],
        hatchChance: 0.03,
        createdAt: Date.now()
      },
      {
        templateId: "fox_silver_gradient_glasses",
        petType: "fox",
        rarity: "rare",
        basePrompt: "A silver fox with gradient pattern, wearing glasses",
        colors: ["red", "silver", "arctic"],
        patterns: ["solid", "gradient"],
        accessories: ["hat", "bow", "collar", "glasses"],
        hatchChance: 0.15,
        createdAt: Date.now()
      },
      {
        templateId: "bird_rainbow_feathers_hat",
        petType: "bird",
        rarity: "rare",
        basePrompt: "A colorful bird with rainbow feathers, wearing a hat",
        colors: ["blue", "green", "yellow", "rainbow"],
        patterns: ["solid", "feathers"],
        accessories: ["hat", "bow", "collar", "glasses"],
        hatchChance: 0.10,
        createdAt: Date.now()
      },
      {
        templateId: "rabbit_white_spots_bow",
        petType: "rabbit",
        rarity: "common",
        basePrompt: "A white rabbit with spots, wearing a bow",
        colors: ["white", "brown", "gray"],
        patterns: ["solid", "spots"],
        accessories: ["hat", "bow", "collar", "glasses"],
        hatchChance: 0.20,
        createdAt: Date.now()
      },
      {
        templateId: "phoenix_fire_flames_crown",
        petType: "phoenix",
        rarity: "epic",
        basePrompt: "A legendary phoenix with fire and flames, wearing a crown",
        colors: ["fire", "gold", "crimson"],
        patterns: ["flames", "feathers"],
        accessories: ["hat", "bow", "collar", "glasses", "crown"],
        hatchChance: 0.01,
        createdAt: Date.now()
      }
    ];
    
    for (const template of petTemplates) {
      await createPetTemplate(template);
    }
    
    console.log("✅ Created pet templates");
    
    // Step 4: Create moments and peer pages
    console.log("📸 Creating moments and peer pages...");
    
    // Create a peer page with Alex Chen
    const peerPageId = await client.mutation("social:createPeerPage", {
      aUserId: userId,
      bUserId: userId, // For demo, we'll use the same user
      title: "Memories with Alex",
      visibility: "private"
    });
    
    // Create some moments
    const moments = [
      {
        caption: "Great coffee meeting with Alex! ☕",
        placeName: "Blue Bottle Coffee",
        lat: 37.7749,
        lng: -122.4194
      },
      {
        caption: "Amazing tech conference presentation! 🚀",
        placeName: "Moscone Center",
        lat: 37.7849,
        lng: -122.4094
      },
      {
        caption: "Late night coding session 💻",
        placeName: "Home Office",
        lat: 37.7649,
        lng: -122.4294
      }
    ];
    
    for (const moment of moments) {
      await createMoment(peerPageId, userId, {
        ...moment,
        photoFileId: "placeholder_file_id" // You'd need actual file IDs
      });
    }
    
    console.log("✅ Created moments and peer pages");
    
    // Step 5: Create decks and cards
    console.log("🃏 Creating decks and cards...");
    
    const personalDeckId = await createDeck(userId, {
      kind: "personal",
      title: "My Personal Memories"
    });
    
    const duoDeckId = await createDeck(userId, {
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
        photosFileIds: ["placeholder1", "placeholder2"],
        highlights: ["Amazing keynote", "Great networking", "New product launch"],
        aiCaption: "An exciting day at the tech conference with amazing presentations and networking opportunities."
      },
      {
        title: "Weekend Hiking Trip",
        date: "2024-01-20",
        location: "Yosemite National Park",
        people: ["Emma Wilson", "David Kim"],
        photosFileIds: ["placeholder3", "placeholder4", "placeholder5"],
        highlights: ["Beautiful views", "Great weather", "Fun conversations"],
        aiCaption: "A perfect hiking adventure through Yosemite with stunning natural beauty and great company."
      },
      {
        title: "Music Studio Session",
        date: "2024-01-25",
        location: "Nashville, TN",
        people: ["David Kim"],
        photosFileIds: ["placeholder6"],
        highlights: ["New song", "Great collaboration", "Amazing sound"],
        aiCaption: "An incredible music production session creating something truly special."
      }
    ];
    
    for (const card of personalCards) {
      await createCard(personalDeckId, card);
    }
    
    // Create cards for duo deck
    const duoCards = [
      {
        title: "Coffee Shop Meetup",
        date: "2024-01-18",
        location: "Blue Bottle Coffee",
        people: ["Alex Chen"],
        photosFileIds: ["placeholder7"],
        highlights: ["Great conversation", "New project ideas", "Delicious coffee"],
        aiCaption: "A productive coffee meeting that sparked new ideas and strengthened our friendship."
      },
      {
        title: "Art Gallery Opening",
        date: "2024-01-22",
        location: "Modern Art Gallery",
        people: ["Emma Wilson"],
        photosFileIds: ["placeholder8", "placeholder9"],
        highlights: ["Amazing art", "Great crowd", "Inspiring conversations"],
        aiCaption: "An inspiring evening at the art gallery opening with beautiful works and meaningful connections."
      }
    ];
    
    for (const card of duoCards) {
      await createCard(duoDeckId, card);
    }
    
    console.log("✅ Created decks and cards");
    
    // Step 6: Create preferences, notes, and actions
    console.log("📝 Creating preferences, notes, and actions...");
    
    // Create preferences for each contact
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
      await client.mutation("preferences:create", {
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
      await client.mutation("notes:create", {
        ownerId: userId,
        ...note,
        createdAt: Date.now()
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
      await client.mutation("actions:create", {
        ownerId: userId,
        ...action
      });
    }
    
    console.log("✅ Created preferences, notes, and actions");
    
    console.log("🎉 Dummy data seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - User: ${displayName} (${userEmail})`);
    console.log(`   - Contacts: ${contactIds.length}`);
    console.log(`   - Pet Templates: ${petTemplates.length}`);
    console.log(`   - Moments: ${moments.length}`);
    console.log(`   - Decks: 2`);
    console.log(`   - Cards: ${personalCards.length + duoCards.length}`);
    console.log(`   - Preferences: ${preferences.length}`);
    console.log(`   - Notes: ${notes.length}`);
    console.log(`   - Actions: ${actions.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding dummy data:", error);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDummyData().then(() => {
    console.log("✅ Seeding completed");
    process.exit(0);
  }).catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
}

module.exports = { seedDummyData };
