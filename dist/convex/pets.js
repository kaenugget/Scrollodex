import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
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
export const hatchPet = action({
    args: {
        contactId: v.id("contacts"),
        userId: v.id("users"),
        relationshipHealth: v.number(),
    },
    handler: async (ctx, args) => {
        const { contactId, userId, relationshipHealth } = args;
        console.log('🐣 Convex: hatchPet action called with:', {
            contactId,
            userId,
            relationshipHealth,
        });
        // Check if FAL_KEY is configured
        if (!process.env.FAL_KEY) {
            console.error('🐣 Convex: FAL_KEY environment variable not set - pet generation will fail');
            throw new Error("Pet generation service not configured. Please contact support.");
        }
        try {
            // Verify the user owns the contact
            console.log('🐣 Convex: Verifying contact ownership...');
            const contact = await ctx.runQuery(api.contacts.get, { contactId });
            console.log('🐣 Convex: Contact found:', contact);
            if (!contact) {
                console.error('🐣 Convex: Contact not found');
                throw new Error("Contact not found");
            }
            if (contact.ownerId !== userId) {
                console.error('🐣 Convex: User does not own contact. OwnerId:', contact.ownerId, 'UserId:', userId);
                throw new Error("You don't have permission to hatch a pet for this contact");
            }
            console.log('🐣 Convex: Contact ownership verified, proceeding with pet generation...');
            // Check if there's already an existing pet to preserve its traits
            const existingPetData = contact.petData;
            let selectedTemplate;
            let color, pattern, accessory;
            if (existingPetData && existingPetData.petType) {
                console.log('🐣 Convex: Existing pet found, preserving traits:', existingPetData);
                // Find the template for the existing pet type
                selectedTemplate = PET_TEMPLATES.find(t => t.type === existingPetData.petType) || PET_TEMPLATES[0];
                // Preserve existing traits
                color = existingPetData.color || selectedTemplate.colors[0];
                pattern = existingPetData.pattern || selectedTemplate.patterns[0];
                accessory = existingPetData.accessory || "none";
                console.log('🐣 Convex: Preserved existing pet traits:', {
                    petType: existingPetData.petType,
                    color,
                    pattern,
                    accessory
                });
            }
            else {
                console.log('🐣 Convex: No existing pet found, generating new pet...');
                // Select random pet template based on hatch chances
                const random = Math.random();
                let cumulativeChance = 0;
                selectedTemplate = PET_TEMPLATES[0];
                console.log('🐣 Convex: Selecting pet template, random value:', random);
                for (const template of PET_TEMPLATES) {
                    cumulativeChance += template.hatchChance;
                    if (random <= cumulativeChance) {
                        selectedTemplate = template;
                        break;
                    }
                }
                console.log('🐣 Convex: Selected template:', selectedTemplate);
                // Randomize visual traits
                color = selectedTemplate.colors[Math.floor(Math.random() * selectedTemplate.colors.length)];
                pattern = selectedTemplate.patterns[Math.floor(Math.random() * selectedTemplate.patterns.length)];
                const accessories = ["none", "hat", "bow", "collar", "glasses"];
                accessory = accessories[Math.floor(Math.random() * accessories.length)];
                console.log('🐣 Convex: Generated new pet traits:', { color, pattern, accessory });
            }
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
            const imageUrls = {};
            const videoUrls = {};
            console.log('🐣 Convex: Starting image generation for', states.length, 'states');
            // Generate images for each state in parallel with retry logic
            const imagePromises = states.map(async ({ state, imageModifier }) => {
                const prompt = `${basePrompt}, ${imageModifier}`;
                console.log(`🐣 Convex: Generating ${state} image with prompt:`, prompt);
                // Retry logic for image generation
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        console.log(`🐣 Convex: Generating ${state} image (attempt ${attempt})`);
                        const falResponse = await fetch("https://fal.run/fal-ai/flux-pro", {
                            method: "POST",
                            headers: {
                                "Authorization": `Key ${process.env.FAL_KEY}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                prompt: prompt,
                                image_size: "square_hd",
                                num_inference_steps: 15, // Further reduced for faster generation
                                enable_safety_checker: true,
                            }),
                        });
                        console.log(`🐣 Convex: ${state} image response status:`, falResponse.status);
                        if (falResponse.ok) {
                            const falData = await falResponse.json();
                            console.log(`🐣 Convex: ${state} image response data:`, falData);
                            // Updated response format - images are directly in the response
                            const imageUrl = falData.images?.[0]?.url || "";
                            console.log(`🐣 Convex: ${state} image generated successfully on attempt ${attempt}:`, imageUrl);
                            return { state, imageUrl };
                        }
                        else {
                            console.error(`🐣 Convex: Failed to generate ${state} image (attempt ${attempt}):`, falResponse.status, falResponse.statusText);
                            const errorText = await falResponse.text();
                            console.error(`🐣 Convex: ${state} image error response:`, errorText);
                            // Check for specific error types
                            if (falResponse.status === 401) {
                                console.error(`🐣 Convex: FAL API authentication failed - check FAL_KEY environment variable`);
                            }
                            else if (falResponse.status === 429) {
                                console.error(`🐣 Convex: FAL API rate limit exceeded`);
                            }
                            else if (falResponse.status >= 500) {
                                console.error(`🐣 Convex: FAL API server error`);
                            }
                            if (attempt === 3) {
                                return { state, imageUrl: "" };
                            }
                            // Wait before retry
                            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                        }
                    }
                    catch (error) {
                        console.error(`🐣 Convex: Error generating ${state} image (attempt ${attempt}):`, error);
                        if (attempt === 3) {
                            return { state, imageUrl: "" };
                        }
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    }
                }
                return { state, imageUrl: "" };
            });
            // Wait for all images to complete
            const imageResults = await Promise.all(imagePromises);
            imageResults.forEach(({ state, imageUrl }) => {
                imageUrls[`${state}ImageUrl`] = imageUrl;
            });
            console.log('🐣 Convex: All images generated, skipping video generation for now (will be generated async)');
            // Calculate pet stats
            const petLevel = Math.max(1, Math.floor(relationshipHealth / 25));
            // Pet happiness should directly reflect relationship health
            const happiness = Math.min(100, Math.max(20, relationshipHealth));
            console.log('🐣 Convex: Calculated pet stats:', { petLevel, happiness });
            // Generate unique template ID
            const templateId = `${selectedTemplate.type}_${color}_${pattern}_${Date.now()}`;
            console.log('🐣 Convex: Generated template ID:', templateId);
            const petDataToSave = {
                petType: selectedTemplate.type,
                petName: existingPetData?.petName || `${selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)}`,
                level: petLevel,
                happiness: happiness,
                color: color,
                pattern: pattern,
                accessory: accessory,
                ...imageUrls,
                ...videoUrls,
                templateId: templateId,
                generatedAt: Date.now(),
                hatchedAt: existingPetData?.hatchedAt || Date.now(), // Preserve original hatch date
                regeneratedAt: Date.now(), // Track regeneration time
                evolutionTokens: existingPetData?.evolutionTokens || (existingPetData ? 0 : 3), // Give 3 tokens for new pets
                totalEvolutions: existingPetData?.totalEvolutions || 0,
                lastEvolutionAt: existingPetData?.lastEvolutionAt,
                // Video generation status
                videoGenerationStatus: "pending",
                videoGenerationStartedAt: undefined,
                videoGenerationCompletedAt: undefined,
                videoGenerationError: undefined,
            };
            console.log('🐣 Convex: Saving pet data:', petDataToSave);
            // Update contact with pet data using runMutation
            await ctx.runMutation(api.pets.updatePetData, {
                contactId,
                petData: petDataToSave,
            });
            console.log('🐣 Convex: Pet data saved successfully');
            const result = {
                success: true,
                isRegeneration: !!existingPetData,
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
            console.log('🐣 Convex: Returning success result:', result);
            return result;
        }
        catch (error) {
            console.error("🐣 Convex: Failed to hatch pet:", error);
            console.error("🐣 Convex: Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
            throw new Error("Failed to hatch pet");
        }
    },
});
// Update pet data (called by actions)
export const updatePetData = mutation({
    args: {
        contactId: v.id("contacts"),
        petData: v.any(), // We'll use any for now since the schema is complex
    },
    handler: async (ctx, args) => {
        console.log('🐣 Convex: updatePetData called for contactId:', args.contactId);
        console.log('🐣 Convex: Pet data to save:', args.petData);
        const contact = await ctx.db.get(args.contactId);
        console.log('🐣 Convex: Contact before update:', contact ? 'Found' : 'Not found');
        await ctx.db.patch(args.contactId, {
            petData: args.petData,
        });
        console.log('🐣 Convex: Pet data updated successfully');
        // Verify the update
        const updatedContact = await ctx.db.get(args.contactId);
        console.log('🐣 Convex: Contact after update:', updatedContact?.petData);
    },
});
// Dedicated mutation for updating video generation status to prevent concurrency conflicts
export const updateVideoGenerationStatus = mutation({
    args: {
        contactId: v.id("contacts"),
        status: v.union(v.literal("pending"), v.literal("generating"), v.literal("completed"), v.literal("failed")),
        startedAt: v.optional(v.number()),
        completedAt: v.optional(v.number()),
        error: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { contactId, status, startedAt, completedAt, error } = args;
        console.log('🎬 Convex: updateVideoGenerationStatus called for contactId:', contactId, 'status:', status);
        const contact = await ctx.db.get(contactId);
        if (!contact?.petData) {
            console.error('🎬 Convex: Contact or pet data not found');
            return;
        }
        // Only update the video generation related fields to minimize conflicts
        const updateData = {};
        if (startedAt !== undefined) {
            updateData.videoGenerationStartedAt = startedAt;
        }
        if (completedAt !== undefined) {
            updateData.videoGenerationCompletedAt = completedAt;
        }
        if (error !== undefined) {
            updateData.videoGenerationError = error;
        }
        updateData.videoGenerationStatus = status;
        await ctx.db.patch(contactId, {
            petData: {
                ...contact.petData,
                ...updateData,
            },
        });
        console.log('🎬 Convex: Video generation status updated successfully');
    },
});
// Get pet data for a contact
export const getPetData = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        console.log('🐣 Convex: getPetData called for contactId:', args.contactId);
        const contact = await ctx.db.get(args.contactId);
        console.log('🐣 Convex: Contact found:', contact ? 'Yes' : 'No');
        console.log('🐣 Convex: Contact petData:', contact?.petData);
        const result = contact?.petData || null;
        console.log('🐣 Convex: Returning petData:', result);
        return result;
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
        if (!contact?.petData)
            return;
        // Calculate new happiness based on relationship stats
        const overallHealth = Math.round((relationshipStats.connection + relationshipStats.reliability +
            relationshipStats.communication + relationshipStats.energy) / 4);
        // Pet happiness should directly reflect relationship health
        const newHappiness = Math.min(100, Math.max(20, overallHealth));
        const newLevel = Math.max(1, Math.floor(overallHealth / 25));
        // Check if pet leveled up and award evolution tokens
        const oldLevel = contact.petData.level || 1;
        const leveledUp = newLevel > oldLevel;
        const tokensToAward = leveledUp ? Math.floor(newLevel / 2) : 0; // Award tokens every 2 levels
        const currentTokens = contact.petData.evolutionTokens || 0;
        const newTokens = currentTokens + tokensToAward;
        // Update pet data
        await ctx.db.patch(contactId, {
            petData: {
                ...contact.petData,
                happiness: newHappiness,
                level: newLevel,
                evolutionTokens: newTokens,
                lastUpdated: Date.now(),
            },
        });
        return {
            success: true,
            happiness: newHappiness,
            level: newLevel,
            leveledUp,
            tokensAwarded: tokensToAward,
            totalTokens: newTokens
        };
    },
});
// Customize pet appearance
export const customizePet = action({
    args: {
        contactId: v.id("contacts"),
        petName: v.optional(v.string()),
        color: v.optional(v.string()),
        pattern: v.optional(v.string()),
        accessory: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { contactId, petName, color, pattern, accessory } = args;
        const contact = await ctx.runQuery(api.pets.getContact, { contactId });
        if (!contact?.petData)
            return;
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
            const imageUrls = {};
            const videoUrls = {};
            // Generate new images
            for (const { state, imageModifier } of states) {
                const prompt = `${basePrompt}, ${imageModifier}`;
                const falResponse = await fetch("https://fal.run/fal-ai/flux-pro", {
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
                const videoResponse = await fetch("https://fal.run/fal-ai/stable-video-diffusion", {
                    method: "POST",
                    headers: {
                        "Authorization": `Key ${process.env.FAL_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: videoPrompt,
                        duration: 3, // Duration in seconds
                        aspect_ratio: "1:1", // Square for pet display
                        fps: 8, // Lower FPS for smaller file size
                        motion_bucket_id: 127, // Lower motion for pet animations
                        cond_aug: 0.02,
                        steps: 25,
                        seed: Math.floor(Math.random() * 1000000),
                    }),
                });
                if (videoResponse.ok) {
                    const videoData = await videoResponse.json();
                    console.log(`🔄 Convex: ${state} video response data:`, videoData);
                    // Handle different response formats
                    let videoUrl = "";
                    if (videoData.video?.url) {
                        videoUrl = videoData.video.url;
                    }
                    else if (videoData.video) {
                        videoUrl = videoData.video;
                    }
                    else if (videoData.url) {
                        videoUrl = videoData.url;
                    }
                    else if (videoData.video_url) {
                        videoUrl = videoData.video_url;
                    }
                    videoUrls[`${state}VideoUrl`] = videoUrl;
                    console.log(`🔄 Convex: ${state} video URL saved:`, videoUrl);
                }
                else {
                    console.error(`🔄 Convex: Failed to generate ${state} video:`, videoResponse.status);
                }
            }
            // Update with new customization
            await ctx.runMutation(api.pets.updatePetData, {
                contactId,
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
        }
        else {
            // Just update name
            await ctx.runMutation(api.pets.updatePetData, {
                contactId,
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
// Get contact data (for actions)
export const getContact = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.contactId);
    },
});
// Evolution system functions
export const evolvePet = action({
    args: {
        contactId: v.id("contacts"),
        userId: v.id("users"),
        customizationType: v.string(), // "color", "pattern", "accessory", "name"
        newValue: v.string(),
    },
    handler: async (ctx, args) => {
        const { contactId, userId, customizationType, newValue } = args;
        console.log('🔄 Convex: evolvePet called with:', {
            contactId,
            userId,
            customizationType,
            newValue,
        });
        try {
            // Verify the user owns the contact
            const contact = await ctx.runQuery(api.contacts.get, { contactId });
            if (!contact || contact.ownerId !== userId) {
                throw new Error("You don't have permission to evolve this pet");
            }
            if (!contact.petData) {
                throw new Error("No pet found to evolve");
            }
            // Check if user has enough evolution tokens (disabled for testing)
            const currentTokens = contact.petData.evolutionTokens || 0;
            const tokenCost = getCustomizationCost(customizationType);
            // Skip token check for testing
            console.log('🔄 Convex: Evolution approved (token check disabled for testing), proceeding with customization...');
            // Update pet data with new customization
            const updatedPetData = {
                ...contact.petData,
                [customizationType]: newValue,
                evolutionTokens: currentTokens, // Keep tokens for testing
                totalEvolutions: (contact.petData.totalEvolutions || 0) + 1,
                lastEvolutionAt: Date.now(),
                lastUpdated: Date.now(),
            };
            // If visual traits changed, regenerate images (and optionally videos)
            if (["color", "pattern", "accessory"].includes(customizationType)) {
                console.log('🔄 Convex: Visual trait changed, regenerating images...');
                const currentPet = contact.petData;
                const newColor = customizationType === "color" ? newValue : currentPet.color || "blue";
                const newPattern = customizationType === "pattern" ? newValue : currentPet.pattern || "solid";
                const newAccessory = customizationType === "accessory" ? newValue : currentPet.accessory || "none";
                const basePrompt = `A cute, adorable ${currentPet.petType} pet, kawaii style, ${newColor} color, ${newPattern} pattern, ${newAccessory !== "none" ? `wearing ${newAccessory}` : ""}, friendly expression, digital art, high quality`;
                // For evolution, we'll generate images first and videos later (optional)
                const states = [
                    {
                        state: "neutral",
                        imageModifier: "neutral expression"
                    },
                    {
                        state: "happy",
                        imageModifier: "happy, smiling, cheerful expression"
                    },
                    {
                        state: "sad",
                        imageModifier: "sad, droopy ears, melancholy expression"
                    },
                    {
                        state: "excited",
                        imageModifier: "excited, wide eyes, energetic expression"
                    }
                ];
                const imageUrls = {};
                // Generate new images in parallel with retry logic (faster for evolution)
                const imagePromises = states.map(async ({ state, imageModifier }) => {
                    const prompt = `${basePrompt}, ${imageModifier}`;
                    // Retry logic for image generation
                    for (let attempt = 1; attempt <= 2; attempt++) {
                        try {
                            console.log(`🔄 Convex: Generating ${state} image (attempt ${attempt})`);
                            const falResponse = await fetch("https://fal.run/fal-ai/flux-pro", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Key ${process.env.FAL_KEY}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    prompt: prompt,
                                    image_size: "square_hd",
                                    num_inference_steps: 10, // Reduced for faster generation
                                    enable_safety_checker: true,
                                }),
                            });
                            if (falResponse.ok) {
                                const falData = await falResponse.json();
                                const imageUrl = falData.images?.[0]?.url || "";
                                console.log(`🔄 Convex: ${state} image generated successfully on attempt ${attempt}`);
                                return { state, imageUrl };
                            }
                            else {
                                console.error(`🔄 Convex: Failed to generate ${state} image (attempt ${attempt}):`, falResponse.status);
                                if (attempt === 2) {
                                    return { state, imageUrl: "" };
                                }
                                // Wait before retry
                                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                            }
                        }
                        catch (error) {
                            console.error(`🔄 Convex: Error generating ${state} image (attempt ${attempt}):`, error);
                            if (attempt === 2) {
                                return { state, imageUrl: "" };
                            }
                            // Wait before retry
                            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        }
                    }
                    return { state, imageUrl: "" };
                });
                const imageResults = await Promise.all(imagePromises);
                imageResults.forEach(({ state, imageUrl }) => {
                    imageUrls[`${state}ImageUrl`] = imageUrl;
                });
                // For evolution, we'll skip video generation to avoid timeouts
                // Videos can be generated later via regeneration if needed
                console.log('🔄 Convex: Skipping video generation for evolution to avoid timeouts');
                // Set video generation status to pending so user can generate videos later
                updatedPetData.videoGenerationStatus = "pending";
                updatedPetData.videoGenerationStartedAt = undefined;
                updatedPetData.videoGenerationCompletedAt = undefined;
                updatedPetData.videoGenerationError = undefined;
                // Merge the new images (videos will be empty for now)
                Object.assign(updatedPetData, imageUrls);
            }
            // Save the updated pet data
            await ctx.runMutation(api.pets.updatePetData, {
                contactId,
                petData: updatedPetData,
            });
            console.log('🔄 Convex: Pet evolution completed successfully');
            return {
                success: true,
                newTokens: currentTokens, // Return unchanged tokens for testing
                totalEvolutions: updatedPetData.totalEvolutions,
                customizationType,
                newValue,
            };
        }
        catch (error) {
            console.error("🔄 Convex: Failed to evolve pet:", error);
            console.error("🔄 Convex: Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
            throw new Error(`Failed to evolve pet: ${error.message}`);
        }
    },
});
// Helper function to get customization costs
function getCustomizationCost(type) {
    const costs = {
        "name": 0, // Free to rename
        "color": 1,
        "pattern": 1,
        "accessory": 2,
    };
    return costs[type] || 1;
}
// Award evolution tokens for quests/achievements
export const awardEvolutionTokens = mutation({
    args: {
        contactId: v.id("contacts"),
        tokens: v.number(),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const { contactId, tokens, reason } = args;
        console.log('🎁 Convex: Awarding evolution tokens:', { contactId, tokens, reason });
        const contact = await ctx.db.get(contactId);
        if (!contact?.petData)
            return;
        const currentTokens = contact.petData.evolutionTokens || 0;
        const newTokens = currentTokens + tokens;
        await ctx.db.patch(contactId, {
            petData: {
                ...contact.petData,
                evolutionTokens: newTokens,
                lastUpdated: Date.now(),
            },
        });
        console.log('🎁 Convex: Tokens awarded successfully. New total:', newTokens);
        return { success: true, newTokens, reason };
    },
});
// Get available customization options
export const getCustomizationOptions = query({
    args: { petType: v.string() },
    handler: async (ctx, args) => {
        const { petType } = args;
        // Find the template for this pet type
        const template = PET_TEMPLATES.find(t => t.type === petType);
        if (!template) {
            return {
                colors: ["blue", "red", "green", "purple", "orange"],
                patterns: ["solid", "stripes", "spots"],
                accessories: ["none", "hat", "bow", "collar", "glasses"],
            };
        }
        return {
            colors: template.colors,
            patterns: template.patterns,
            accessories: ["none", "hat", "bow", "collar", "glasses"],
        };
    },
});
// Start async video generation for a pet (returns immediately)
export const startVideoGeneration = action({
    args: {
        contactId: v.id("contacts"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { contactId, userId } = args;
        console.log('🎬 Convex: startVideoGeneration called for contactId:', contactId);
        try {
            // Verify the user owns the contact
            const contact = await ctx.runQuery(api.contacts.get, { contactId });
            if (!contact || contact.ownerId !== userId) {
                throw new Error("You don't have permission to generate videos for this pet");
            }
            if (!contact.petData) {
                throw new Error("No pet found to generate videos for");
            }
            // Check if video generation is already in progress
            if (contact.petData.videoGenerationStatus === "generating") {
                return {
                    success: true,
                    message: "Video generation is already in progress",
                    status: "generating"
                };
            }
            // Use a dedicated mutation to safely update video generation status
            // This prevents conflicts with other mutations like updatePetHappiness
            await ctx.runMutation(api.pets.updateVideoGenerationStatus, {
                contactId,
                status: "generating",
                startedAt: Date.now(),
                error: undefined,
            });
            console.log('🎬 Convex: Video generation status updated to generating');
            // Start the actual video generation process (this will run in the background)
            // We don't await this - it will run asynchronously
            generatePetVideosBackground(ctx, contactId, contact.petData).catch(error => {
                console.error('🎬 Convex: Background video generation failed:', error);
                // Update status to failed using the dedicated mutation
                ctx.runMutation(api.pets.updateVideoGenerationStatus, {
                    contactId,
                    status: "failed",
                    error: error.message,
                    completedAt: Date.now(),
                }).catch(updateError => {
                    console.error('🎬 Convex: Failed to update error status:', updateError);
                });
            });
            return {
                success: true,
                message: "Video generation started! Check back in a few minutes.",
                status: "generating"
            };
        }
        catch (error) {
            console.error("🎬 Convex: Failed to start video generation:", error);
            throw new Error(`Failed to start video generation: ${error.message}`);
        }
    },
});
// Background video generation function (not exported as action)
async function generatePetVideosBackground(ctx, contactId, petData) {
    console.log('🎬 Convex: Background video generation started for pet:', petData.petType);
    const basePrompt = `A cute, adorable ${petData.petType} pet, kawaii style, ${petData.color} color, ${petData.pattern} pattern, ${petData.accessory !== "none" ? `wearing ${petData.accessory}` : ""}, friendly expression, digital art, high quality`;
    const states = [
        {
            state: "neutral",
            videoModifier: "sitting calmly, gentle breathing, occasional blink, peaceful and relaxed"
        },
        {
            state: "happy",
            videoModifier: "wagging tail, bouncing gently, cheerful expression, playful movements"
        },
        {
            state: "sad",
            videoModifier: "droopy posture, slow movements, looking down, occasional sigh"
        },
        {
            state: "excited",
            videoModifier: "jumping up and down, energetic bouncing, wide excited eyes, rapid tail wagging"
        }
    ];
    const videoUrls = {};
    // Generate videos one at a time to avoid timeouts and API rate limits
    for (let i = 0; i < states.length; i++) {
        const { state, videoModifier } = states[i];
        const videoPrompt = `${basePrompt}, ${videoModifier}, digital art style, smooth animation, loop-friendly`;
        console.log(`🎬 Convex: Generating ${state} video (${i + 1}/${states.length})`);
        // Update progress status
        await ctx.runMutation(api.pets.updateVideoGenerationStatus, {
            contactId,
            status: "generating",
            error: `Generating ${state} video...`,
        });
        // Retry logic for video generation with shorter timeout
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`🎬 Convex: Generating ${state} video (attempt ${attempt})`);
                // Create a timeout promise for the video generation
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Video generation timeout after 5 minutes')), 300000) // 5 minutes timeout
                );
                const videoGenerationPromise = fetch("https://fal.run/fal-ai/stable-video-diffusion", {
                    method: "POST",
                    headers: {
                        "Authorization": `Key ${process.env.FAL_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: videoPrompt,
                        duration: 2, // Reduced from 3 to 2 seconds for faster generation
                        aspect_ratio: "1:1",
                        fps: 6, // Reduced from 8 to 6 fps for faster generation
                        motion_bucket_id: 127,
                        cond_aug: 0.02,
                        steps: 20, // Reduced from 25 to 20 steps for faster generation
                        seed: Math.floor(Math.random() * 1000000),
                    }),
                });
                // Race between video generation and timeout
                const videoResponse = await Promise.race([videoGenerationPromise, timeoutPromise]);
                if (videoResponse.ok) {
                    const videoData = await videoResponse.json();
                    console.log(`🎬 Convex: ${state} video response data:`, videoData);
                    // Handle different response formats
                    let videoUrl = "";
                    if (videoData.video?.url) {
                        videoUrl = videoData.video.url;
                    }
                    else if (videoData.video) {
                        videoUrl = videoData.video;
                    }
                    else if (videoData.url) {
                        videoUrl = videoData.url;
                    }
                    else if (videoData.video_url) {
                        videoUrl = videoData.video_url;
                    }
                    if (videoUrl) {
                        console.log(`🎬 Convex: ${state} video generated successfully:`, videoUrl);
                        videoUrls[`${state}VideoUrl`] = videoUrl;
                        // Save progress after each successful video
                        await ctx.runMutation(api.pets.updatePetData, {
                            contactId,
                            petData: {
                                ...petData,
                                ...videoUrls,
                                lastUpdated: Date.now(),
                            },
                        });
                        break; // Success, move to next video
                    }
                    else {
                        console.error(`🎬 Convex: No video URL returned for ${state} video`);
                        if (attempt === 2) {
                            videoUrls[`${state}VideoUrl`] = "";
                        }
                    }
                }
                else {
                    console.error(`🎬 Convex: Failed to generate ${state} video (attempt ${attempt}):`, videoResponse.status);
                    if (attempt === 2) {
                        videoUrls[`${state}VideoUrl`] = "";
                    }
                }
            }
            catch (error) {
                console.error(`🎬 Convex: Error generating ${state} video (attempt ${attempt}):`, error);
                if (attempt === 2) {
                    videoUrls[`${state}VideoUrl`] = "";
                }
                // If it's a timeout error, don't retry immediately
                if (error.message?.includes('timeout')) {
                    console.log(`🎬 Convex: ${state} video timed out, skipping retry`);
                    videoUrls[`${state}VideoUrl`] = "";
                    break;
                }
                // Wait before retry (longer wait for video generation)
                if (attempt < 2) {
                    await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
                }
            }
        }
        // Longer delay between videos to avoid overwhelming the API
        if (i < states.length - 1) {
            console.log(`🎬 Convex: Waiting 10 seconds before generating next video...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    // Update pet data with new videos and mark as completed
    // First update the video URLs using the general updatePetData mutation
    await ctx.runMutation(api.pets.updatePetData, {
        contactId,
        petData: {
            ...petData,
            ...videoUrls,
            lastUpdated: Date.now(),
        },
    });
    // Then update the video generation status using the dedicated mutation
    await ctx.runMutation(api.pets.updateVideoGenerationStatus, {
        contactId,
        status: "completed",
        completedAt: Date.now(),
    });
    console.log('🎬 Convex: Background video generation completed successfully');
}
// Generate videos for existing pet (separate from evolution to avoid timeouts)
export const generatePetVideos = action({
    args: {
        contactId: v.id("contacts"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { contactId, userId } = args;
        console.log('🎬 Convex: generatePetVideos called for contactId:', contactId);
        try {
            // Verify the user owns the contact
            const contact = await ctx.runQuery(api.contacts.get, { contactId });
            if (!contact || contact.ownerId !== userId) {
                throw new Error("You don't have permission to generate videos for this pet");
            }
            if (!contact.petData) {
                throw new Error("No pet found to generate videos for");
            }
            const currentPet = contact.petData;
            console.log('🎬 Convex: Generating videos for pet:', currentPet.petType);
            const basePrompt = `A cute, adorable ${currentPet.petType} pet, kawaii style, ${currentPet.color} color, ${currentPet.pattern} pattern, ${currentPet.accessory !== "none" ? `wearing ${currentPet.accessory}` : ""}, friendly expression, digital art, high quality`;
            const states = [
                {
                    state: "neutral",
                    videoModifier: "sitting calmly, gentle breathing, occasional blink, peaceful and relaxed"
                },
                {
                    state: "happy",
                    videoModifier: "wagging tail, bouncing gently, cheerful expression, playful movements"
                },
                {
                    state: "sad",
                    videoModifier: "droopy posture, slow movements, looking down, occasional sigh"
                },
                {
                    state: "excited",
                    videoModifier: "jumping up and down, energetic bouncing, wide excited eyes, rapid tail wagging"
                }
            ];
            const videoUrls = {};
            // Generate videos in batches to avoid overwhelming the API
            for (let i = 0; i < states.length; i += 2) {
                const batch = states.slice(i, i + 2);
                const batchPromises = batch.map(async ({ state, videoModifier }) => {
                    const videoPrompt = `${basePrompt}, ${videoModifier}, digital art style, smooth animation, loop-friendly`;
                    // Retry logic for video generation
                    for (let attempt = 1; attempt <= 2; attempt++) {
                        try {
                            console.log(`🎬 Convex: Generating ${state} video (attempt ${attempt})`);
                            const videoResponse = await fetch("https://fal.run/fal-ai/stable-video-diffusion", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Key ${process.env.FAL_KEY}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    prompt: videoPrompt,
                                    duration: 3,
                                    aspect_ratio: "1:1",
                                    fps: 8,
                                    motion_bucket_id: 127,
                                    cond_aug: 0.02,
                                    steps: 25,
                                    seed: Math.floor(Math.random() * 1000000),
                                }),
                            });
                            if (videoResponse.ok) {
                                const videoData = await videoResponse.json();
                                console.log(`🎬 Convex: ${state} video response data:`, videoData);
                                // Handle different response formats
                                let videoUrl = "";
                                if (videoData.video?.url) {
                                    videoUrl = videoData.video.url;
                                }
                                else if (videoData.video) {
                                    videoUrl = videoData.video;
                                }
                                else if (videoData.url) {
                                    videoUrl = videoData.url;
                                }
                                else if (videoData.video_url) {
                                    videoUrl = videoData.video_url;
                                }
                                console.log(`🎬 Convex: ${state} video generated successfully:`, videoUrl);
                                return { state, videoUrl };
                            }
                            else {
                                console.error(`🎬 Convex: Failed to generate ${state} video (attempt ${attempt}):`, videoResponse.status);
                                if (attempt === 2) {
                                    return { state, videoUrl: "" };
                                }
                                await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
                            }
                        }
                        catch (error) {
                            console.error(`🎬 Convex: Error generating ${state} video (attempt ${attempt}):`, error);
                            if (attempt === 2) {
                                return { state, videoUrl: "" };
                            }
                            await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
                        }
                    }
                    return { state, videoUrl: "" };
                });
                const batchResults = await Promise.all(batchPromises);
                batchResults.forEach(({ state, videoUrl }) => {
                    videoUrls[`${state}VideoUrl`] = videoUrl;
                });
                // Small delay between batches
                if (i + 2 < states.length) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            // Update pet data with new videos
            await ctx.runMutation(api.pets.updatePetData, {
                contactId,
                petData: {
                    ...currentPet,
                    ...videoUrls,
                    lastUpdated: Date.now(),
                },
            });
            console.log('🎬 Convex: Pet videos generated successfully');
            return {
                success: true,
                videoUrls,
                message: "Videos generated successfully! Your pet now has animated states.",
            };
        }
        catch (error) {
            console.error("🎬 Convex: Failed to generate pet videos:", error);
            throw new Error(`Failed to generate pet videos: ${error.message}`);
        }
    },
});
// Debug query to inspect pet data
export const debugPetData = query({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        console.log('🐛 Debug: Inspecting pet data for contactId:', args.contactId);
        const contact = await ctx.db.get(args.contactId);
        console.log('🐛 Debug: Contact found:', contact ? 'Yes' : 'No');
        if (contact?.petData) {
            console.log('🐛 Debug: Pet data exists');
            console.log('🐛 Debug: Pet type:', contact.petData.petType);
            console.log('🐛 Debug: Pet name:', contact.petData.petName);
            console.log('🐛 Debug: Image URLs:', {
                happyImageUrl: contact.petData.happyImageUrl,
                neutralImageUrl: contact.petData.neutralImageUrl,
                sadImageUrl: contact.petData.sadImageUrl,
                excitedImageUrl: contact.petData.excitedImageUrl,
            });
            console.log('🐛 Debug: Video URLs:', {
                happyVideoUrl: contact.petData.happyVideoUrl,
                neutralVideoUrl: contact.petData.neutralVideoUrl,
                sadVideoUrl: contact.petData.sadVideoUrl,
                excitedVideoUrl: contact.petData.excitedVideoUrl,
            });
            console.log('🐛 Debug: Full pet data:', JSON.stringify(contact.petData, null, 2));
        }
        else {
            console.log('🐛 Debug: No pet data found');
        }
        return contact?.petData || null;
    },
});
// Create pet template
export const createPetTemplate = mutation({
    args: {
        templateId: v.string(),
        petType: v.string(),
        rarity: v.string(),
        basePrompt: v.string(),
        colors: v.array(v.string()),
        patterns: v.array(v.string()),
        accessories: v.array(v.string()),
        hatchChance: v.number(),
    },
    handler: async (ctx, args) => {
        // Check if template already exists
        const existingTemplate = await ctx.db
            .query("petTemplates")
            .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
            .first();
        if (existingTemplate) {
            return existingTemplate._id;
        }
        return await ctx.db.insert("petTemplates", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
//# sourceMappingURL=pets.js.map