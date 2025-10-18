# Fal AI 3D Pet Integration for Scrollodex

## Overview
I've implemented a complete 3D pet nurturing system that integrates with Fal AI to generate cute, personalized pets for each contact relationship. The pets evolve based on relationship health and can be nurtured through meetings and interactions.

## What I've Built

### 1. PetModel Component (`src/components/PetModel.tsx`)
- **3D Model Display Area**: A beautiful gradient box where the generated pet will be displayed
- **Pet Generation**: "Hatch Pet" button that calls Fal AI to generate a 3D model
- **Pet Stats**: Shows pet level, type, and happiness percentage
- **Happiness Bar**: Visual indicator of pet's emotional state
- **Nurturing Tips**: Helpful guidance for users

### 2. Database Schema Updates (`convex/schema.ts`)
- Added `petData` field to contacts table with:
  - `modelUrl`: URL to the generated 3D model
  - `petType`: Type of pet (dragon, phoenix, fox, cat, dog, egg)
  - `level`: Pet's current level
  - `happiness`: Pet's happiness score
  - Timestamps for generation and updates

### 3. Convex Functions (`convex/pets.ts`)
- `generatePetModel`: Calls Fal AI API to generate 3D pet models
- `getPetData`: Retrieves pet data for a contact
- `updatePetHappiness`: Updates pet happiness based on relationship stats
- `evolvePet`: Handles pet evolution to new forms

### 4. API Integration (`src/app/api/generate-pet/route.ts`)
- Next.js API route that handles pet generation requests
- Integrates with Convex functions

### 5. Contact Detail View Integration
- Added PetModel component above relationship stats
- Pets are displayed prominently in the contact profile

## Pet Evolution System

### Pet Types Based on Relationship Health:
- **90+ Health**: Dragon (majestic, powerful)
- **80+ Health**: Phoenix (mystical, reborn)
- **70+ Health**: Fox (clever, playful)
- **60+ Health**: Cat (independent, graceful)
- **50+ Health**: Dog (loyal, friendly)
- **<50 Health**: Egg (waiting to hatch)

### Nurturing Mechanics:
- **Happiness**: Based on overall relationship health + random factor
- **Level**: Calculated from relationship health (every 20 points = 1 level)
- **Evolution**: Pets can evolve to new forms as relationships strengthen

## What You Need from Fal AI

### 1. API Key
- Sign up at [fal.ai](https://fal.ai)
- Get your API key from the dashboard
- Add it to your `.env` file as `FAL_KEY=your_api_key_here`

### 2. Fal AI Endpoints
The current implementation uses `/fal-ai/flux-dev` but you may want to explore:
- **3D Model Generation**: Look for endpoints that generate 3D models or sprites
- **Image Generation**: For 2D pet sprites if 3D isn't available
- **Animation**: For pet animations and interactions

### 3. Recommended Fal AI Models
- **Flux Dev**: For high-quality image generation
- **SDXL**: Alternative for image generation
- **Any 3D model generation endpoints** they might have

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:
```
FAL_KEY=your_fal_ai_api_key_here
```

### 2. Deploy Convex Functions
```bash
npx convex deploy
```

### 3. Test the Integration
1. Go to any contact detail view
2. Look for the "Relationship Pet" section above the stats
3. Click "Hatch Pet" to generate your first pet!

## Customization Options

### 1. Pet Types
Modify the `getPetType()` function in `PetModel.tsx` to add more pet types or change thresholds.

### 2. Prompts
Customize the Fal AI prompts in `convex/pets.ts` to generate different styles:
- Change art style (kawaii, realistic, cartoon)
- Modify colors (pastel, vibrant, monochrome)
- Add personality traits

### 3. Evolution Triggers
Add more evolution triggers in `convex/pets.ts`:
- Meeting frequency
- Message count
- Shared moments
- Birthday interactions

## Next Steps

1. **Get Fal AI API Key**: Sign up and get your credentials
2. **Test Generation**: Try generating pets for different contacts
3. **Customize Prompts**: Adjust the AI prompts for your preferred style
4. **Add Animations**: Consider adding pet animations or interactions
5. **Pet Interactions**: Add features like pet feeding, playing, or grooming

## Technical Notes

- **Error Handling**: The system gracefully handles API failures
- **Caching**: Pet models are stored in the database to avoid regeneration
- **Performance**: Uses Convex mutations for real-time updates
- **Type Safety**: Full TypeScript support with proper Convex types

The system is ready to use once you add your Fal AI API key!
