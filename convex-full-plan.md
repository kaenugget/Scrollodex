# Scrollodex Convex Full Plan

## Overview
This document outlines the complete Convex backend architecture for Scrollodex, a pixel-art social contact manager that gamifies relationship building.

## Database Schema

### Core Tables

#### Users
```typescript
users: defineTable({
  email: v.string(),
  displayName: v.string(),
  avatarUrl: v.optional(v.string()),
  bio: v.optional(v.string()),
  createdAt: v.number(),
}).index("by_email", ["email"])
```

#### Contacts
```typescript
contacts: defineTable({
  ownerId: v.id("users"),
  name: v.string(),
  emails: v.array(v.string()),
  phones: v.array(v.string()),
  birthday: v.optional(v.string()),
  tags: v.array(v.string()),
  company: v.optional(v.string()),
  role: v.optional(v.string()),
  location: v.optional(v.string()),
  notes: v.array(v.string()),
  lastInteractionAt: v.number(),
  pinned: v.boolean(),
}).index("by_owner", ["ownerId"])
```

#### Dex Entries (Gamified Contact Cards)
```typescript
dexEntries: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  dexNumber: v.number(),
  types: v.array(v.string()), // Pokemon-style types
  level: v.number(),
  xp: v.number(),
  pfpFileId: v.optional(v.id("_storage")),
  prefs: v.string(), // JSON string
  updatedAt: v.number(),
}).index("by_owner", ["ownerId"])
  .index("by_contact", ["contactId"])
```

### Social Features

#### Peer Pages (Shared Relationship Pages)
```typescript
peerPages: defineTable({
  aUserId: v.id("users"),
  bUserId: v.id("users"),
  title: v.string(),
  createdAt: v.number(),
  visibility: v.string(), // "private" | "public"
})
```

#### Moments (Shared Memories)
```typescript
moments: defineTable({
  peerPageId: v.id("peerPages"),
  authorId: v.id("users"),
  photoFileId: v.id("_storage"),
  caption: v.optional(v.string()),
  placeName: v.optional(v.string()),
  lat: v.optional(v.number()),
  lng: v.optional(v.number()),
  createdAt: v.number(),
})
```

#### Decks and Cards (Memory Collection)
```typescript
decks: defineTable({
  ownerId: v.id("users"),
  kind: v.string(), // "personal" | "duo"
  peerUserId: v.optional(v.id("users")),
  title: v.string(),
  createdAt: v.number(),
})

cards: defineTable({
  deckId: v.id("decks"),
  title: v.string(),
  date: v.string(),
  location: v.optional(v.string()),
  people: v.array(v.string()),
  photosFileIds: v.array(v.id("_storage")),
  highlights: v.array(v.string()),
  aiCaption: v.optional(v.string()),
  frontFileId: v.optional(v.id("_storage")),
  backFileId: v.optional(v.id("_storage")),
  variant: v.optional(v.string()),
  createdAt: v.number(),
})
```

### Relationship Management

#### Preferences
```typescript
preferences: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  food: v.array(v.string()),
  music: v.array(v.string()),
  hobbies: v.array(v.string()),
  notes: v.string(),
}).index("by_contact", ["contactId"])
```

#### Notes
```typescript
notes: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  body: v.string(),
  createdAt: v.number(),
}).index("by_contact", ["contactId"])
```

#### Actions/Todos
```typescript
actions: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  title: v.string(),
  dueAt: v.optional(v.number()),
  doneAt: v.optional(v.number()),
  kind: v.string(), // "followup" | "todo"
}).index("by_contact", ["contactId"])
```

### AI Features

#### Embeddings for Search
```typescript
embeddings: defineTable({
  ownerId: v.id("users"),
  entityType: v.string(),
  entityId: v.string(),
  vector: v.array(v.number()),
  text: v.string(),
  updatedAt: v.number(),
})
```

#### Intro Suggestions
```typescript
introsSuggestions: defineTable({
  ownerId: v.id("users"),
  aContactId: v.id("contacts"),
  bContactId: v.id("contacts"),
  why: v.string(),
  score: v.number(),
  createdAt: v.number(),
})
```

### Utility Tables

#### Nudges/Reminders
```typescript
nudges: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  kind: v.string(), // "birthday" | "checkin"
  dueAt: v.number(),
  sentAt: v.optional(v.number()),
})
```

#### AI Usage Tracking
```typescript
aiUsage: defineTable({
  ownerId: v.id("users"),
  feature: v.string(),
  tokens: v.number(),
  date: v.string(),
})

aiSettings: defineTable({
  ownerId: v.id("users"),
  enabledFeatures: v.array(v.string()),
  dailyBudget: v.optional(v.number()),
  monthlyBudget: v.optional(v.number()),
})
```

#### Sharing & Invites
```typescript
cardClaims: defineTable({
  cardId: v.id("cards"),
  claimerUserId: v.id("users"),
  claimedAt: v.number(),
})

invites: defineTable({
  code: v.string(),
  kind: v.string(), // "card"
  cardId: v.optional(v.id("cards")),
  createdAt: v.number(),
  expiresAt: v.number(),
})
```

#### Templates & Styling
```typescript
cardTemplates: defineTable({
  key: v.string(),
  name: v.string(),
  styleData: v.string(), // JSON string
  rarity: v.string(),
  frameFileId: v.optional(v.id("_storage")),
})
```

#### Wallet Links
```typescript
walletLinks: defineTable({
  ownerId: v.id("users"),
  contactId: v.id("contacts"),
  platform: v.string(),
  username: v.string(),
  createdAt: v.number(),
})
```

## Key Functions

### Contact Management
- `contacts.list` - List contacts with filtering and search
- `contacts.get` - Get single contact
- `contacts.upsert` - Create or update contact
- `contacts.pin` - Pin/unpin contact
- `contacts.deleteContact` - Delete contact
- `contacts.bump` - Update interaction timestamp

### Dex System
- `dex.list` - List dex entries with sorting and filtering
- `dex.getEntry` - Get dex entry with contact and preferences
- `dex.computeEntry` - Generate dex entry from contact data
- `dex.updateXp` - Update XP and level for contact

### Social Features
- Peer page creation and management
- Moment sharing with photos and location
- Deck and card creation for memories
- Card claiming and sharing system

### AI Integration
- Embedding generation for semantic search
- Intro suggestion algorithm
- AI caption generation for moments
- Usage tracking and budget management

## File Storage
Convex provides built-in file storage for:
- User avatars
- Contact profile pictures
- Moment photos
- Card designs and templates
- Deck artwork

## Authentication
Using `@convex-dev/auth` for:
- Email/password authentication
- Social login integration
- User session management

## Real-time Features
- Live updates for contact interactions
- Real-time collaboration on peer pages
- Instant notifications for nudges and reminders

## Scalability Considerations
- Efficient indexing for contact searches
- Pagination for large contact lists
- Optimized queries for dex entries
- Caching strategies for frequently accessed data

## Security
- Row-level security based on ownership
- Input validation on all mutations
- Rate limiting for AI features
- Secure file upload handling

This architecture supports the full Scrollodex vision of gamified relationship management with social features, AI assistance, and pixel-art aesthetics.
