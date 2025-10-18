// Comprehensive script to seed moments data with enhanced features
// Run this with: node seed-moments-data.js

import { ConvexHttpClient } from "convex/browser";

// Initialize Convex client
const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://your-convex-url.convex.cloud");

// Sample photo URLs for moments (using Unsplash for demo)
const samplePhotos = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Mountain
  "https://images.unsplash.com/photo-1519904981063-e0f6a97a8c21?w=800&h=600&fit=crop", // Beach
  "https://images.unsplash.com/photo-1501594907352-04dda38ebc29?w=800&h=600&fit=crop", // Forest
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop", // City
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Lake
  "https://images.unsplash.com/photo-1501594907352-04dda38ebc29?w=800&h=600&fit=crop", // Sunset
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop", // Food
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Coffee
  "https://images.unsplash.com/photo-1501594907352-04dda38ebc29?w=800&h=600&fit=crop", // Concert
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop", // Travel
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

// Helper function to create moment likes
async function createMomentLike(momentId, userId) {
  try {
    await client.mutation("social:likeMoment", {
      momentId,
      userId,
    });
    console.log(`👍 Liked moment: ${momentId}`);
  } catch (error) {
    console.error("Error liking moment:", error);
  }
}

// Helper function to create moment comments
async function createMomentComment(momentId, authorId, content, parentCommentId = null) {
  try {
    const commentId = await client.mutation("social:addMomentComment", {
      momentId,
      authorId,
      content,
      parentCommentId,
    });
    console.log(`💬 Created comment: ${content.substring(0, 50)}...`);
    return commentId;
  } catch (error) {
    console.error("Error creating comment:", error);
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
  {
    caption: "Golden hour magic ✨",
    placeName: "Marin Headlands, CA",
    lat: 37.8261,
    lng: -122.4994,
    tags: ["sunset", "golden hour", "photography", "nature"],
    mood: "inspired",
    visibility: "public",
    weather: "clear",
    activity: "photography",
    photoUrl: samplePhotos[5],
  },
  {
    caption: "Amazing dinner at the new restaurant downtown 🍽️",
    placeName: "Downtown San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    tags: ["food", "restaurant", "dinner", "downtown"],
    mood: "excited",
    visibility: "public",
    weather: "clear",
    activity: "dining",
    photoUrl: samplePhotos[6],
  },
  {
    caption: "Perfect morning coffee ☕",
    placeName: "Blue Bottle Coffee, CA",
    lat: 37.7749,
    lng: -122.4194,
    tags: ["coffee", "morning", "cafe", "routine"],
    mood: "peaceful",
    visibility: "private",
    weather: "sunny",
    activity: "coffee",
    photoUrl: samplePhotos[7],
  },
  {
    caption: "Incredible concert last night! The energy was amazing 🎵",
    placeName: "The Fillmore, CA",
    lat: 37.7849,
    lng: -122.4334,
    tags: ["concert", "music", "night", "entertainment"],
    mood: "excited",
    visibility: "public",
    weather: "clear",
    activity: "concert",
    photoUrl: samplePhotos[8],
  },
  {
    caption: "Travel memories from last month's trip ✈️",
    placeName: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    tags: ["travel", "japan", "tokyo", "memories"],
    mood: "nostalgic",
    visibility: "public",
    weather: "sunny",
    activity: "travel",
    photoUrl: samplePhotos[9],
  },
];

async function seedMomentsData() {
  console.log("🌱 Starting to seed moments data...");
  
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
    
    // Step 2: Get contacts with connected users
    console.log("👥 Getting connected contacts...");
    const contacts = await client.query("contacts:getAll", { ownerId: mainUser._id });
    const connectedContacts = contacts.filter(c => c.connectedUserId);
    
    if (connectedContacts.length === 0) {
      console.log("❌ No connected contacts found. Please create some connected contacts first.");
      return;
    }
    
    console.log(`✅ Found ${connectedContacts.length} connected contacts`);
    
    // Step 3: Create peer pages and moments
    console.log("📸 Creating peer pages and moments...");
    
    for (let i = 0; i < Math.min(connectedContacts.length, 3); i++) {
      const contact = connectedContacts[i];
      const connectedUser = await client.query("users:getUser", { userId: contact.connectedUserId });
      
      if (!connectedUser) continue;
      
      console.log(`\n👥 Creating peer page with ${connectedUser.displayName}...`);
      
      // Create or find peer page
      const peerPageId = await client.mutation("social:findOrCreatePeerPage", {
        userId1: mainUser._id,
        userId2: connectedUser._id,
      });
      
      console.log(`✅ Peer page created: ${peerPageId}`);
      
      // Create moments for this peer page
      const momentsForThisPage = sampleMoments.slice(i * 3, (i + 1) * 3);
      
      for (let j = 0; j < momentsForThisPage.length; j++) {
        const momentData = momentsForThisPage[j];
        
        // Alternate between main user and connected user as authors
        const authorId = j % 2 === 0 ? mainUser._id : connectedUser._id;
        
        const momentId = await createMoment(peerPageId, authorId, momentData);
        
        if (momentId) {
          // Add some likes (random users)
          const likeCount = Math.floor(Math.random() * 3) + 1;
          for (let k = 0; k < likeCount; k++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            await createMomentLike(momentId, randomUser._id);
          }
          
          // Add some comments
          const commentCount = Math.floor(Math.random() * 2) + 1;
          for (let k = 0; k < commentCount; k++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const comments = [
              "Amazing shot! 📸",
              "Love this! ❤️",
              "Beautiful! ✨",
              "Great memories! 🎉",
              "So cool! 😍",
              "Perfect timing! ⏰",
              "Incredible view! 🌟",
              "Thanks for sharing! 🙏",
            ];
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            await createMomentComment(momentId, randomUser._id, randomComment);
          }
        }
      }
    }
    
    console.log("\n🎉 Moments data seeding completed successfully!");
    console.log(`✅ Created moments with likes and comments`);
    console.log(`📊 Total moments: ${sampleMoments.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding moments data:", error);
  }
}

// Run the seeding function
seedMomentsData().then(() => {
  console.log("🏁 Seeding process finished");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Seeding failed:", error);
  process.exit(1);
});
