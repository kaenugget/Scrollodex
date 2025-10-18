import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Pet templates for different types
const PET_TEMPLATES = [
  // Common pets (70% chance)
  { type: "cat", rarity: "common", hatchChance: 0.25, colors: ["orange", "black", "white", "gray"], patterns: ["solid", "stripes", "spots"] },
  { type: "dog", rarity: "common", hatchChance: 0.25, colors: ["brown", "golden", "black", "white"], patterns: ["solid", "patches"] },
  { type: "rabbit", rarity: "common", hatchChance: 0.20, colors: ["white", "brown", "gray"], patterns: ["solid", "spots"] },
  
  // Rare pets (25% chance)
  { type: "fox", rarity: "rare", hatchChance: 0.15, colors: ["red", "silver", "arctic"], patterns: ["solid", "gradient"] },
  { type: "bird", rarity: "rare", hatchChance: 0.10, colors: ["blue", "green", "yellow", "rainbow"], patterns: ["solid", "feathers"] },
  
  // Epic pets (4% chance)
  { type: "dragon", rarity: "epic", hatchChance: 0.03, colors: ["red", "blue", "purple", "gold"], patterns: ["scales", "gradient"] },
  { type: "phoenix", rarity: "epic", hatchChance: 0.01, colors: ["fire", "gold", "crimson"], patterns: ["flames", "feathers"] },
];

// Generate a random pet using templates
export const hatchPet = mutation({
  args: {
    contactId: v.id("contacts"),
    relationshipHealth: v.number(),
  },
  handler: async (ctx, args) => {
    const { contactId, relationshipHealth } = args;
    
    try {
      // Select random pet template based on hatch chances
      const random = Math.random();
      let cumulativeChance = 0;
      let selectedTemplate = PET_TEMPLATES[0];
      
      for (const template of PET_TEMPLATES) {
        cumulativeChance += template.hatchChance;
        if (random <= cumulativeChance) {
          selectedTemplate = template;
          break;
        }
      }

      // Randomize visual traits
      const color = selectedTemplate.colors[Math.floor(Math.random() * selectedTemplate.colors.length)];
      const pattern = selectedTemplate.patterns[Math.floor(Math.random() * selectedTemplate.patterns.length)];
      const accessories = ["none", "hat", "bow", "collar", "glasses"];
      const accessory = accessories[Math.floor(Math.random() * accessories.length)];

      // Generate images and videos for different states
      const basePrompt = `A cute, adorable ${selectedTemplate.type} pet, kawaii style, ${color} color, ${pattern} pattern, ${accessory !== "none" ? `wearing ${accessory}` : ""}, friendly expression, digital art, high quality`;

      const states = [
        { 
          state: "neutral", 
          imageModifier: "neutral expression",
          videoModifier: "sitting calmly, gentle breathing, occasional blink, peaceful and relaxed"
        },
        { 
          state: "happy", 
          imageModifier: "happy, smiling, cheerful expression",
          videoModifier: "wagging tail, bouncing gently, cheerful expression, playful movements"
        },
        { 
          state: "sad", 
          imageModifier: "sad, droopy ears, melancholy expression",
          videoModifier: "droopy posture, slow movements, looking down, occasional sigh"
        },
        { 
          state: "excited", 
          imageModifier: "excited, wide eyes, energetic expression",
          videoModifier: "jumping up and down, energetic bouncing, wide excited eyes, rapid tail wagging"
        }
      ];

      const imageUrls: Record<string, string> = {};
      const videoUrls: Record<string, string> = {};

      // Generate images for each state
      for (const { state, imageModifier } of states) {
        const prompt = `${basePrompt}, ${imageModifier}`;
        
        const falResponse = await fetch("https://fal.run/fal-ai/flux-dev", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            image_size: "square_hd",
            num_inference_steps: 20, // Reduced for faster generation
            enable_safety_checker: true,
          }),
        });

        if (falResponse.ok) {
          const falData = await falResponse.json();
          imageUrls[`${state}ImageUrl`] = falData.images?.[0]?.url || "";
        }
      }

      // Generate videos for each state (4s duration for GIFs)
      for (const { state, videoModifier } of states) {
        const videoPrompt = `A cute, adorable ${selectedTemplate.type} pet, kawaii style, ${color} color, ${pattern} pattern, ${accessory !== "none" ? `wearing ${accessory}` : ""}, ${videoModifier}, digital art style, smooth animation, loop-friendly`;
        
        const videoResponse = await fetch("https://fal.run/fal-ai/veo3.1/fast", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: videoPrompt,
            duration: "4s",
            aspect_ratio: "1:1", // Square for pet display
            resolution: "720p",
            generate_audio: false, // No audio for GIFs
            enhance_prompt: true,
            auto_fix: true,
          }),
        });

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          videoUrls[`${state}VideoUrl`] = videoData.video?.url || "";
        }
      }

      // Calculate pet stats
      const petLevel = Math.max(1, Math.floor(relationshipHealth / 25));
      const happiness = Math.min(100, relationshipHealth + Math.floor(Math.random() * 15));

      // Generate unique template ID
      const templateId = `${selectedTemplate.type}_${color}_${pattern}_${Date.now()}`;

      // Update contact with pet data
      await ctx.db.patch(contactId, {
        petData: {
          petType: selectedTemplate.type,
          petName: `${selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)}`,
          level: petLevel,
          happiness: happiness,
          color: color,
          pattern: pattern,
          accessory: accessory,
          ...imageUrls,
          ...videoUrls,
          templateId: templateId,
          generatedAt: Date.now(),
          hatchedAt: Date.now(),
        },
      });

      return {
        success: true,
        petData: {
          petType: selectedTemplate.type,
          rarity: selectedTemplate.rarity,
          color: color,
          pattern: pattern,
          accessory: accessory,
          level: petLevel,
          happiness: happiness,
          ...imageUrls,
          ...videoUrls,
        },
      };
    } catch (error) {
      console.error("Failed to hatch pet:", error);
      throw new Error("Failed to hatch pet");
    }
  },
});

// Get pet data for a contact
export const getPetData = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    return contact?.petData || null;
  },
});

// Update pet happiness and regenerate images if needed
export const updatePetHappiness = mutation({
  args: {
    contactId: v.id("contacts"),
    relationshipStats: v.object({
      connection: v.number(),
      reliability: v.number(),
      communication: v.number(),
      energy: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { contactId, relationshipStats } = args;
    
    const contact = await ctx.db.get(contactId);
    if (!contact?.petData) return;

    // Calculate new happiness based on relationship stats
    const overallHealth = Math.round(
      (relationshipStats.connection + relationshipStats.reliability + 
       relationshipStats.communication + relationshipStats.energy) / 4
    );

    const newHappiness = Math.min(100, overallHealth + Math.floor(Math.random() * 10));
    const newLevel = Math.max(1, Math.floor(overallHealth / 25));

    // Update pet data
    await ctx.db.patch(contactId, {
      petData: {
        ...contact.petData,
        happiness: newHappiness,
        level: newLevel,
        lastUpdated: Date.now(),
      },
    });

    return { success: true, happiness: newHappiness, level: newLevel };
  },
});

// Customize pet appearance
export const customizePet = mutation({
  args: {
    contactId: v.id("contacts"),
    petName: v.optional(v.string()),
    color: v.optional(v.string()),
    pattern: v.optional(v.string()),
    accessory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { contactId, petName, color, pattern, accessory } = args;
    
    const contact = await ctx.db.get(contactId);
    if (!contact?.petData) return;

    // If visual traits changed, regenerate images
    if (color || pattern || accessory) {
      const currentPet = contact.petData;
      const newColor = color || currentPet.color || "blue";
      const newPattern = pattern || currentPet.pattern || "solid";
      const newAccessory = accessory || currentPet.accessory || "none";

      const basePrompt = `A cute, adorable ${currentPet.petType} pet, kawaii style, ${newColor} color, ${newPattern} pattern, ${newAccessory !== "none" ? `wearing ${newAccessory}` : ""}, friendly expression, digital art, high quality`;

      const states = [
        { 
          state: "neutral", 
          imageModifier: "neutral expression",
          videoModifier: "sitting calmly, gentle breathing, occasional blink, peaceful and relaxed"
        },
        { 
          state: "happy", 
          imageModifier: "happy, smiling, cheerful expression",
          videoModifier: "wagging tail, bouncing gently, cheerful expression, playful movements"
        },
        { 
          state: "sad", 
          imageModifier: "sad, droopy ears, melancholy expression",
          videoModifier: "droopy posture, slow movements, looking down, occasional sigh"
        },
        { 
          state: "excited", 
          imageModifier: "excited, wide eyes, energetic expression",
          videoModifier: "jumping up and down, energetic bouncing, wide excited eyes, rapid tail wagging"
        }
      ];

      const imageUrls: Record<string, string> = {};
      const videoUrls: Record<string, string> = {};

      // Generate new images
      for (const { state, imageModifier } of states) {
        const prompt = `${basePrompt}, ${imageModifier}`;
        
        const falResponse = await fetch("https://fal.run/fal-ai/flux-dev", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            image_size: "square_hd",
            num_inference_steps: 20,
            enable_safety_checker: true,
          }),
        });

        if (falResponse.ok) {
          const falData = await falResponse.json();
          imageUrls[`${state}ImageUrl`] = falData.images?.[0]?.url || "";
        }
      }

      // Generate new videos
      for (const { state, videoModifier } of states) {
        const videoPrompt = `A cute, adorable ${currentPet.petType} pet, kawaii style, ${newColor} color, ${newPattern} pattern, ${newAccessory !== "none" ? `wearing ${newAccessory}` : ""}, ${videoModifier}, digital art style, smooth animation, loop-friendly`;
        
        const videoResponse = await fetch("https://fal.run/fal-ai/veo3.1/fast", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: videoPrompt,
            duration: "4s",
            aspect_ratio: "1:1",
            resolution: "720p",
            generate_audio: false,
            enhance_prompt: true,
            auto_fix: true,
          }),
        });

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          videoUrls[`${state}VideoUrl`] = videoData.video?.url || "";
        }
      }

      // Update with new customization
      await ctx.db.patch(contactId, {
        petData: {
          ...currentPet,
          petName: petName || currentPet.petName,
          color: newColor,
          pattern: newPattern,
          accessory: newAccessory,
          ...imageUrls,
          ...videoUrls,
          lastUpdated: Date.now(),
        },
      });
    } else {
      // Just update name
      await ctx.db.patch(contactId, {
        petData: {
          ...contact.petData,
          petName: petName || contact.petData.petName,
          lastUpdated: Date.now(),
        },
      });
    }

    return { success: true };
  },
});

// Get all pet templates
export const getPetTemplates = query({
  args: {},
  handler: async (ctx) => {
    return PET_TEMPLATES;
  },
});
