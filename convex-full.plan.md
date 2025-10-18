# Scrollodex MVP: Full-Stack Migration Plan

## ✅ COMPLETED PHASES

### Phase 1: Foundation Setup ✅

#### 1.1 Next.js + Convex Project Setup ✅
- ✅ Initialize Next.js 14 app with App Router
- ✅ Install Convex, configure `convex/` directory  
- ✅ Set up Tailwind CSS + shadcn/ui components
- ✅ Configure TypeScript with strict mode
- ✅ Copy over existing UI utilities (`PIXEL_BORDER_CLASSES`, etc.) from current prototype

#### 1.2 Convex Schema Definition ✅
Created `convex/schema.ts` with all collections:
- ✅ **users**: displayName, avatarUrl, bio, createdAt, sessions
- ✅ **contacts**: ownerId, name, emails[], phones[], birthday, tags[], company, role, location, notes[], lastInteractionAt, pinned
- ✅ **peerPages**: aUserId, bUserId, title, createdAt, visibility
- ✅ **moments**: peerPageId, authorId, photoFileId, caption, placeName, lat, lng, createdAt
- ✅ **decks**: ownerId, kind (personal|duo), peerUserId, title, createdAt
- ✅ **cards**: deckId, title, date, location, people[], photosFileIds[], highlights[], aiCaption, frontFileId, backFileId, variant, createdAt
- ✅ **cardClaims**: cardId, claimerUserId, claimedAt
- ✅ **cardTemplates**: key, name, styleData, rarity, frameFileId
- ✅ **dexEntries**: ownerId, contactId, dexNumber, types[], level, xp, pfpFileId, prefs, updatedAt
- ✅ **preferences**: ownerId, contactId, food[], music[], hobbies[], notes
- ✅ **notes**: ownerId, contactId, body, createdAt
- ✅ **actions**: ownerId, contactId, title, dueAt, doneAt, kind (followup|todo)
- ✅ **embeddings**: ownerId, entityType, entityId, vector, text, updatedAt
- ✅ **introsSuggestions**: ownerId, aContactId, bContactId, why, score, createdAt
- ✅ **nudges**: ownerId, contactId, kind (birthday|checkin), dueAt, sentAt
- ✅ **aiUsage**, **aiSettings**, **invites**, **walletLinks**

#### 1.3 Convex Auth Setup ✅
- ✅ Install `@convex-dev/auth` package
- ✅ Configure Clerk authentication (Google, GitHub, email/password)
- ✅ Create auth provider component wrapping Next.js app
- ✅ Build login/signup UI with pixel-art styling

### Phase 2: Core Backend API Layer ✅

#### 2.1 File Storage Setup ✅
- ✅ Configure Convex file storage for: `avatars/`, `photos/`, `collages/`, `cards/`
- ✅ Create upload mutations with MIME type validation and size limits
- ✅ Build reusable upload components (avatar picker, photo uploader)

#### 2.2 Contacts Management (Queries + Mutations) ✅
**Queries:**
- ✅ `contacts.list({ ownerId, search?, tags?, company?, location? })`
- ✅ `contacts.get({ contactId })`
- ✅ `contacts.search({ q, filters })` - basic text search

**Mutations:**
- ✅ `contacts.upsert(contactData)` - create/update contact
- ✅ `contacts.pin({ contactId, pinned })`
- ✅ `contacts.delete({ contactId })`
- ✅ `interactions.bump({ contactId })` - update lastInteractionAt

#### 2.3 Dex Entries System (Queries + Mutations) ✅
**Queries:**
- ✅ `dex.list({ sort: 'dex'|'recent'|'level', filterType? })`
- ✅ `dex.getEntry({ contactId })` - returns contact + dex entry + preferences

**Mutations:**
- ✅ `dex.computeEntry({ contactId })` - calculate dexNumber, level, xp, types from contact data
- ✅ `dex.updateXp({ contactId, xpDelta, reason })` - XP events (+2 moment, +3 card, etc.)

**Logic:**
- ✅ Auto-assign dexNumber based on creation order
- ✅ Level thresholds: L1 (0-9 XP), L2 (10-24 XP), L3 (25+ XP)
- ✅ Types derived from tags/preferences (ART, ELEC, NORM, PSY, etc.)

#### 2.4 Notes & Actions (Queries + Mutations) ✅
**Queries:**
- ✅ `notes.listNotes({ contactId })`
- ✅ `notes.listOpenActions({ contactId })`

**Mutations:**
- ✅ `notes.addNote({ contactId, body })`
- ✅ `notes.deleteNote({ noteId })`
- ✅ `notes.addAction({ contactId, title, dueAt?, kind })`
- ✅ `notes.completeAction({ actionId })`
- ✅ `notes.deleteAction({ actionId })`

### Phase 3: Social Features Backend ✅

#### 3.1 Peer Pages Backend ✅
**Queries:**
- ✅ `social.getPeerPages({ userId })` - get all peer pages for user

**Mutations:**
- ✅ `social.createPeerPage({ aUserId, bUserId, title, visibility })` - create peer page
- Access control: readable/writable by both participants only

#### 3.2 Moments Feed Backend ✅
**Queries:**
- ✅ `social.getMoments({ peerPageId })` - realtime subscription

**Mutations:**
- ✅ `social.addMoment({ peerPageId, photoFileId, caption?, placeName? })`
- ✅ `social.removeMoment({ momentId })`
- Auto-increment XP (+2) when moment added

**Realtime:** Use Convex live queries for instant updates

#### 3.3 Decks & Cards Backend ✅
**Queries:**
- ✅ `social.getDecks({ ownerId })` - personal + duo decks for current user
- ✅ `social.getCards({ deckId })`
- ✅ `social.getCard({ cardId })`

**Mutations:**
- ✅ `social.createDeck({ ownerId, kind, peerUserId?, title })` - create deck
- ✅ `social.createCard({ deckId, payload })` - create new card
- ✅ `social.updateCard({ cardId, updates })` - update card
- ✅ `social.deleteCard({ cardId })` - owner or duo participant only

### Phase 4: File Storage System ✅

#### 4.1 File Upload & Management ✅
**Functions:**
- ✅ `files.generateUploadUrl()` - get upload URL
- ✅ `files.getFileUrl({ fileId })` - get file URL
- ✅ `files.deleteFile({ fileId })` - delete file
- ✅ `files.uploadAvatar({ userId, fileId })` - upload user avatar
- ✅ `files.uploadContactPfp({ contactId, fileId })` - upload contact profile pic
- ✅ `files.uploadMomentPhoto({ momentId, fileId })` - upload moment photo
- ✅ `files.uploadCardDesign({ cardId, fileId, type })` - upload card front/back

### Phase 5: Basic Frontend ✅

#### 5.1 App Layout & Navigation ✅
- ✅ `/` - redirect to `/dex` if logged in, otherwise `/login`
- ✅ `/login` - Auth page (Clerk + custom email/password)
- ✅ Basic layout with pixel-art styling
- ✅ Navigation tabs: Contacts | Dex

**Components Ported:**
- ✅ `ContactCard`, `DexCard`, `AuthForms`, `ClerkAuth`
- ✅ Keep pixel-art aesthetic, dark theme, emerald accent color

#### 5.2 Basic Views ✅
- ✅ Contacts tab: list contacts with pin/unpin, search, seed data
- ✅ Dex tab: list dex entries with level, XP, types
- ✅ Basic responsive grid layouts

#### 5.3 Hooks & State Management ✅
- ✅ `useContacts()` - contacts list, pin, bump
- ✅ `useDexEntries()` - dex list with sorting
- ✅ `useAuth()` - authentication state

---

## 🚧 CURRENT PHASE: Detailed Views & Social UI

### Phase 6: Detailed Views ✅ COMPLETED

#### 6.1 Contact Detail View ✅
**Route:** `/contacts/[id]`

**Features implemented:**
- ✅ Contact header with avatar, name, company, tags
- ✅ Contact info tabs: Overview | Notes | Actions | Preferences
- ✅ Notes section: add/edit/delete notes with timestamps
- ✅ Actions section: add/edit/complete/delete todos and followups
- ✅ Preferences section: food, music, hobbies, custom notes
- ✅ Quick actions: "Add Moment", "Create Card", "Start Meeting" (stub)
- ✅ XP display and level progression
- ✅ Last interaction tracking

**Components implemented:**
- ✅ `ContactDetailView` - main detail page
- ✅ `NotesSection` - notes list with add/edit
- ✅ `ActionsSection` - todos/followups management
- ✅ `PreferencesSection` - preferences form
- ✅ Contact header integrated with avatar and basic info

#### 6.2 Dex Detail View ✅
**Route:** `/dex/[id]`

**Features implemented:**
- ✅ Dex card display with full stats
- ✅ Type effectiveness chart (Pokemon-style)
- ✅ XP history and level progression (mock data)
- ✅ Recent interactions timeline (mock data)
- ✅ Quick actions: "Add XP", "Update Types", "Change PFP" (stub)
- ✅ Stats display with level, XP, types, dex number

**Components implemented:**
- ✅ `DexDetailView` - main dex detail page
- ✅ Dex stats integrated with level, XP, types display
- ✅ XP history component with mock timeline
- ✅ Type effectiveness matrix with Pokemon-style chart

### Phase 7: Social UI (NEXT)

#### 7.1 Peer Pages Navigation
**Route:** `/peer/[peerPageId]`

**Features to implement:**
- [ ] Peer page header with both users' info
- [ ] Tab navigation: Moments | Deck | Settings
- [ ] Access control (both users can view/edit)
- [ ] Real-time updates for both tabs

#### 7.2 Moments Feed Tab
**Features to implement:**
- [ ] Photo feed (reverse-chronological)
- [ ] Each moment card: image, caption, timestamp, place
- [ ] FAB (Floating Action Button) → "Add Moment" bottom sheet
- [ ] Bottom sheet: photo upload, caption textarea, place input, submit
- [ ] Real-time updates when moments added
- [ ] Photo viewer modal for full-size images

**Components needed:**
- [ ] `MomentsFeed` - main feed component
- [ ] `MomentCard` - individual moment display
- [ ] `AddMomentSheet` - bottom sheet for adding moments
- [ ] `PhotoUploader` - drag & drop photo upload
- [ ] `PhotoViewer` - full-size image modal

#### 7.3 Deck Tab
**Features to implement:**
- [ ] Binder-style grid of cards (front images)
- [ ] Click card → navigate to `/card/[cardId]`
- [ ] "Create Card" button → opens Card Composer modal
- [ ] Card sorting: newest, oldest, by date
- [ ] Empty state with onboarding

**Components needed:**
- [ ] `DeckGrid` - cards grid layout
- [ ] `CardPreview` - card thumbnail with hover effects
- [ ] `CreateCardButton` - FAB for card creation

#### 7.4 Card Composer Modal
**Features to implement:**
- [ ] Title (text input)
- [ ] Date (date picker)
- [ ] Attendees (multi-select from contacts)
- [ ] Photos (multi-upload, max 6)
- [ ] Highlights (textarea)
- [ ] Template selector (dropdown: classic, foil, shiny)
- [ ] "Generate Caption" button (AI stub)
- [ ] "Render Card" button → calls FAL.ai action (stub)
- [ ] Preview mode before saving

**Components needed:**
- [ ] `CardComposer` - main modal component
- [ ] `PhotoMultiUploader` - multiple photo upload
- [ ] `AttendeeSelector` - contact multi-select
- [ ] `TemplateSelector` - card template picker
- [ ] `CardPreview` - preview before render

#### 7.5 Card Detail View
**Route:** `/card/[cardId]`

**Features to implement:**
- [ ] Front/back image viewer (swipeable or toggle)
- [ ] Metadata: title, date, location, attendees list
- [ ] "Share" button → generate invite link + QR code
- [ ] "Invite Friend" button → show QR code for claiming
- [ ] Edit mode for card owner
- [ ] Claiming flow for shared cards

**Components needed:**
- [ ] `CardDetailView` - main card viewer
- [ ] `CardImageGallery` - front/back image viewer
- [ ] `CardMetadata` - title, date, attendees display
- [ ] `ShareCard` - invite link + QR generation
- [ ] `QRCodeDisplay` - QR code for claiming

---

## 🔮 UPCOMING PHASES

### Phase 8: AI Features (Stubs → Real)

#### 8.1 Smart Search (Stub Initially)
**Query:**
- [ ] `ai.smartSearch({ query, filters? })` → returns contacts with "why matched" text
- [ ] **Stub:** Simple text matching on name/notes/tags
- [ ] **Real:** Generate embeddings with OpenAI `text-embedding-3-small`, store in `embeddings` table, do vector similarity search

#### 8.2 Meeting Companion (Stub)
**UI:**
- [ ] Pre-brief: shows contact summary, recent notes, preferences, suggested talking points
- [ ] Notes box: during meeting, jot down notes
- [ ] Post-summary: AI generates action items from notes

**Actions:**
- [ ] `ai.preMeetingBrief({ contactId })` → stub: return contact.about + preferences
- [ ] `ai.postMeetingSummarize({ noteIds[], rawText })` → stub: return bullet points
- [ ] **Real:** Call Claude/GPT-4o-mini to generate summaries with token limits

#### 8.3 Card Caption Generation (Stub)
**Action:**
- [ ] `ai.captionCard({ photos[], context })` → 1-2 line caption
- [ ] **Stub:** Return generic caption like "A memorable moment with friends"
- [ ] **Real:** Send photo context + attendee names to multimodal AI (GPT-4o or Gemini)

#### 8.4 AI Budget & Usage Tracking
- [ ] Create `aiUsage` table: log tokens per feature per day
- [ ] Create `aiSettings` table: user toggles, daily/monthly budget caps
- [ ] Settings UI: enable/disable features, set budget limits

### Phase 9: Polish & Deployment

#### 9.1 Realtime UX
- [ ] Moments feed updates live (Convex reactivity)
- [ ] Dex XP bar updates after actions
- [ ] Nudges badge count in header
- [ ] Loading states and skeleton screens
- [ ] Error handling and retry logic

#### 9.2 PWA Configuration
- [ ] Add `manifest.json` for installable app
- [ ] Service worker for offline support (Next.js PWA plugin)
- [ ] App icons with pixel-art logo
- [ ] Offline-first data caching

#### 9.3 Seed Data & Onboarding
- [ ] Seed 3-4 contacts on first login (similar to current `seed.tsx`)
- [ ] Onboarding flow: "Add your first contact" → "Create a moment" → "Make a card"
- [ ] Interactive tutorial with tooltips
- [ ] Welcome screen with feature highlights

#### 9.4 Deploy to Vercel
- [ ] Connect GitHub repo to Vercel
- [ ] Set Convex env vars (`CONVEX_DEPLOYMENT`)
- [ ] Set up FAL.ai + OpenAI API keys in Vercel env
- [ ] Deploy production build
- [ ] Set up custom domain
- [ ] Configure analytics and monitoring

---

## 🎯 IMPLEMENTATION PRIORITY

### Immediate Next Steps (Phase 7):
1. **Peer Pages** - `/peer/[peerPageId]` with Moments and Deck tabs
2. **Moments Feed** - photo sharing with real-time updates
3. **Card Composer** - create and share memory cards
4. **Card Detail View** - view and share individual cards

### Short Term (Phase 8):
1. **AI Stubs** - smart search, meeting briefs, card captions (placeholders)
2. **Real AI Integration** - OpenAI embeddings, Claude summaries, FAL.ai rendering
3. **Usage Tracking** - AI budget management and analytics

### Medium Term (Phase 9):
1. **Polish** - animations, loading states, error handling
2. **PWA** - offline support, installable app
3. **Deployment** - production setup, monitoring, analytics

---

## 📋 CURRENT TODO LIST

### Phase 6: Detailed Views ✅ COMPLETED
- ✅ Create `/contacts/[id]` route and ContactDetailView component
- ✅ Implement NotesSection with add/edit/delete functionality
- ✅ Implement ActionsSection with todo/followup management
- ✅ Implement PreferencesSection with form handling
- ✅ Create ContactHeader component with avatar and basic info
- ✅ Create `/dex/[id]` route and DexDetailView component
- ✅ Implement DexStats component with level/XP display
- ✅ Implement XpHistory component with timeline
- ✅ Implement TypeChart component for type effectiveness
- ✅ Add proper navigation between contact and dex views
- ✅ Wire up all mutations for notes, actions, preferences
- ✅ Add real-time updates for contact changes

### Phase 7: Social UI (NEXT)
- [ ] Create `/peer/[peerPageId]` route and PeerPageView component
- [ ] Implement MomentsFeed with photo upload and real-time updates
- [ ] Implement DeckGrid with card thumbnails
- [ ] Create CardComposer modal with form and photo upload
- [ ] Create CardDetailView with front/back image viewer
- [ ] Implement sharing system with QR codes and invite links
- [ ] Add FAL.ai card rendering integration (stub initially)
- [ ] Implement card claiming flow for shared cards

### Phase 8: AI Features (FUTURE)
- [ ] Create AI action stubs for smart search, briefs, captions
- [ ] Implement OpenAI embeddings for semantic search
- [ ] Integrate Claude/GPT-4o-mini for meeting summaries
- [ ] Add FAL.ai integration for card rendering
- [ ] Implement AI usage tracking and budget management
- [ ] Create AI settings UI for feature toggles

### Phase 9: Polish & Deployment (FUTURE)
- [ ] Add loading states and skeleton screens
- [ ] Implement error handling and retry logic
- [ ] Configure PWA with manifest and service worker
- [ ] Create onboarding flow and seed data
- [ ] Deploy to Vercel with production configuration
- [ ] Set up monitoring and analytics

---

## 🔧 TECHNICAL NOTES

### Current Architecture:
- **Frontend:** Next.js 14 with App Router, Tailwind CSS, shadcn/ui
- **Backend:** Convex with real-time subscriptions
- **Auth:** Clerk (Google, GitHub, email/password)
- **File Storage:** Convex file storage
- **Styling:** Pixel-art aesthetic with dark theme and emerald accents

### Key Dependencies:
- `convex` - Backend and real-time database
- `@clerk/nextjs` - Authentication
- `@convex-dev/auth` - Convex auth integration
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `@radix-ui/*` - UI components

### File Structure:
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
└── lib/                # Utilities and providers

convex/
├── schema.ts           # Database schema
├── contacts.ts         # Contact management
├── dex.ts             # Dex entries system
├── social.ts          # Social features
├── files.ts           # File storage
├── notes.ts           # Notes and actions
├── users.ts           # User management
└── ...                # Other backend functions
```

This plan provides a clear roadmap for completing the Scrollodex MVP with all core features, social functionality, AI integration, and production deployment.
