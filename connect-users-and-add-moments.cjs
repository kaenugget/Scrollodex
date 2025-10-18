// Script to connect users and add sample moments data
// Run this with: node connect-users-and-add-moments.cjs

const { ConvexHttpClient } = require("convex/browser");

// Initialize Convex client
const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://your-convex-url.convex.cloud");

// Sample photo URLs for moments (using Unsplash for demo)
const samplePhotos = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Mountain
  "https://images.unsplash.com/photo-1519904981063-e0f6a97a8c21?w=800&h=600&fit=crop", // Beach
  "https://images.unsplash.com/photo-1501594907352-04dda38ebc29?w=800&h=600&fit=crop", // Forest
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop", // City
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Lake
];

// Helper function to upload a photo and get file ID
async function uploadPhoto(photoUrl) {
  try {
    // Generate upload URL
    const uploadUrl = await client.mutation("files:generateUploadUrl");
    
    // Fetch the image
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    
    // Upload the image
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': blob.type },
      body: blob,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }
    
    const { storageId } = await uploadResponse.json();
    return storageId;
  } catch (error) {
    console.error("Error uploading photo:", error);
    return null;
  }
}

// Helper function to create moments
async function createMoment(peerPageId, authorId, momentData) {
  try {
    // Upload photo first
    const photoFileId = await uploadPhoto(momentData.photoUrl);
    if (!photoFileId) {
      console.error("Failed to upload photo for moment:", momentData.caption);
      return null;
    }

    const momentId = await client.mutation("social:addMoment", {
      peerPageId,
      authorId,
      photoFileId,
      caption: momentData.caption,
      placeName: momentData.placeName,
      lat: momentData.lat,
      lng: momentData.lng,
      tags: momentData.tags || [],
      mood: momentData.mood,
      visibility: momentData.visibility || "private",
      weather: momentData.weather,
      activity: momentData.activity,
    });
    console.log(`✅ Created moment: ${momentData.caption || 'Untitled'}`);
    return momentId;
  } catch (error) {
    console.error("Error creating moment:", error);
    return null;
  }
}

// Sample moments data
const sampleMoments = [
  {
    caption: "Amazing sunset hike today! The view from the top was absolutely breathtaking 🌅",
    placeName: "Mount Tamalpais, CA",
    lat: 37.9235,
    lng: -122.5964,
    tags: ["hiking", "nature", "sunset", "adventure"],
    mood: "peaceful",
    visibility: "public",
    weather: "sunny",
    activity: "hiking",
    photoUrl: samplePhotos[0],
  },
  {
    caption: "Beach day with friends! Perfect weather and great company 🏖️",
    placeName: "Santa Monica Beach, CA",
    lat: 34.0195,
    lng: -118.4912,
    tags: ["beach", "friends", "summer", "fun"],
    mood: "happy",
    visibility: "public",
    weather: "sunny",
    activity: "relaxing",
    photoUrl: samplePhotos[1],
  },
  {
    caption: "Morning coffee run turned into a beautiful forest walk 🌲",
    placeName: "Golden Gate Park, CA",
    lat: 37.7694,
    lng: -122.4862,
    tags: ["coffee", "nature", "morning", "walk"],
    mood: "peaceful",
    visibility: "private",
    weather: "cloudy",
    activity: "walking",
    photoUrl: samplePhotos[2],
  },
  {
    caption: "City lights at night are always magical ✨",
    placeName: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    tags: ["city", "night", "lights", "urban"],
    mood: "nostalgic",
    visibility: "public",
    weather: "clear",
    activity: "exploring",
    photoUrl: samplePhotos[3],
  },
  {
    caption: "Lakeside picnic with the perfect weather 🥪",
    placeName: "Lake Merritt, CA",
    lat: 37.8024,
    lng: -122.2578,
    tags: ["picnic", "lake", "outdoor", "food"],
    mood: "happy",
    visibility: "public",
    weather: "sunny",
    activity: "picnic",
    photoUrl: samplePhotos[4],
  },
];

async function connectUsersAndAddMoments() {
  console.log("🌱 Starting to connect users and add moments data...");
  
  try {
    // Step 1: Get or create users
    console.log("👤 Getting users...");
    const users = await client.query("users:getAllUsers");
    
    if (!users || users.length === 0) {
      console.log("❌ No users found. Please run the main seed script first.");
      return;
    }
    
    const mainUser = users.find(u => u.email === "kaelanwanshengfung@gmail.com") || users[0];
    console.log(`✅ Using main user: ${mainUser.displayName}`);
    
    // Step 2: Create additional users if needed
    let connectedUser = users.find(u => u.email !== mainUser.email);
    
    if (!connectedUser) {
      console.log("👤 Creating additional user for connection...");
      const newUserId = await client.mutation("users:create", {
        email: "friend@example.com",
        displayName: "Alex Johnson",
        firstName: "Alex",
        lastName: "Johnson",
        bio: "Love hiking and photography!",
      });
      connectedUser = await client.query("users:getUser", { userId: newUserId });
      console.log(`✅ Created connected user: ${connectedUser.displayName}`);
    }
    
    // Step 3: Create contact for connected user
    console.log("👥 Creating contact for connected user...");
    const contactId = await client.mutation("contacts:create", {
      ownerId: mainUser._id,
      name: connectedUser.displayName,
      emails: [connectedUser.email],
      phones: [],
      tags: ["friend", "photography"],
      company: "Tech Company",
      location: "San Francisco, CA",
      notes: [],
      lastInteractionAt: Date.now(),
      pinned: false,
      connectedUserId: connectedUser._id,
      isDynamicContact: true,
      lastSyncedAt: Date.now(),
    });
    console.log(`✅ Created contact: ${contactId}`);
    
    // Step 4: Create peer page
    console.log("📸 Creating peer page...");
    const peerPageId = await client.mutation("social:findOrCreatePeerPage", {
      userId1: mainUser._id,
      userId2: connectedUser._id,
    });
    console.log(`✅ Peer page created: ${peerPageId}`);
    
    // Step 5: Create moments
    console.log("📸 Creating moments...");
    for (let i = 0; i < sampleMoments.length; i++) {
      const momentData = sampleMoments[i];
      
      // Alternate between main user and connected user as authors
      const authorId = i % 2 === 0 ? mainUser._id : connectedUser._id;
      
      await createMoment(peerPageId, authorId, momentData);
    }
    
    console.log("\n🎉 User connection and moments data seeding completed successfully!");
    console.log(`✅ Connected users: ${mainUser.displayName} ↔ ${connectedUser.displayName}`);
    console.log(`📊 Created ${sampleMoments.length} moments`);
    
  } catch (error) {
    console.error("❌ Error connecting users and adding moments:", error);
  }
}

// Run the seeding function
connectUsersAndAddMoments().then(() => {
  console.log("🏁 Seeding process finished");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Seeding failed:", error);
  process.exit(1);
});
