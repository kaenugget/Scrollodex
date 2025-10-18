# Seed Data Guide

This guide explains how to use the seed data scripts to populate your Scrollodex application with demo contacts and data.

## Available Seed Scripts

### 1. `seed-dummy-data.js` - Full Featured Seed Script
Creates comprehensive demo data including:
- Demo contacts with varied relationship stats
- Pet templates and pet data
- Moments and peer pages
- Decks and cards
- Preferences, notes, and actions

### 2. `seed-dummy-data-simple.js` - Simple Seed Script
Creates basic demo data including:
- Demo contacts with varied relationship stats
- Pet data for contacts
- Basic preferences and notes

## Usage

### Default Usage (Demo User)
```bash
# Full featured seeding
node seed-dummy-data.js

# Simple seeding
node seed-dummy-data-simple.js
```

### Custom User Email
```bash
# Full featured seeding with custom email
node seed-dummy-data.js user@example.com

# Simple seeding with custom email
node seed-dummy-data-simple.js user@example.com
```

### Custom User Email and Name
```bash
# Full featured seeding with custom email and name
node seed-dummy-data.js user@example.com "John Doe"

# Simple seeding with custom email and name
node seed-dummy-data-simple.js user@example.com "John Doe"
```

## What Gets Created

### Demo Contacts
The scripts create 7 diverse contacts with:
- **Varied relationship stats** based on interaction frequency, notes count, and profile completeness
- **Meaningful tags** like `close-friend`, `tech-mentor`, `hiking-buddy`, `coffee-lover`
- **Different dex types** like `["TECH", "NATURE"]`, `["MUSIC", "NIGHT"]`, `["BUSINESS", "WELLNESS"]`
- **Varied pet data** with different levels, happiness, and evolution states

### Relationship Stats Variation
Contacts are designed to show different relationship strengths:
- **High Connection** (Alice, Emma, Carol, Grace): 75-90+ scores
- **Medium Connection** (Bob, Frank): 60-75 scores
- **Lower Connection** (David, Henry): 45-60 scores

### Pet Data
Each contact gets a unique pet with:
- Different pet types (cat, dog, dragon, fox, bird, rabbit, phoenix)
- Varied levels (2-6) and happiness (65-100)
- Different colors, patterns, and accessories
- Evolution tokens and history

## Prerequisites

1. Set your `CONVEX_URL` environment variable
2. Make sure your Convex backend is running
3. Ensure you have the necessary Convex mutations available

## Environment Setup

```bash
# Set your Convex URL
export CONVEX_URL="https://your-deployment.convex.cloud"

# Or create a .env file
echo "CONVEX_URL=https://your-deployment.convex.cloud" > .env
```

## Troubleshooting

### Common Issues

1. **Convex URL not set**: Make sure `CONVEX_URL` environment variable is set
2. **User creation fails**: Check if the user creation mutations are available in your Convex backend
3. **Permission errors**: Ensure your Convex deployment has the necessary permissions

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your Convex deployment is running
3. Ensure all required mutations are available in your Convex backend

## Customization

You can easily customize the seed data by:
1. Modifying the contact data in the scripts
2. Adding new contact types or categories
3. Adjusting relationship stat factors
4. Creating new pet templates

The scripts are designed to be easily modifiable for your specific needs.
