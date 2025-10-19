# Scrollodex MVP

A pixel-art social contact manager built with Next.js, Convex, and Tailwind CSS.

🌐 **Live Demo**: [https://scrollodex.vercel.app/](https://scrollodex.vercel.app/)

## Features

- **Pixel-art UI** with dark theme and emerald accents
- **Contact Management** with tags, notes, and actions
- **Dex System** - Pokemon-style contact entries with XP and levels
- **3D Pet Integration** - AI-generated pets that evolve based on relationship health
- **Social Features** - Moments and peer pages (in development)
- **Card System** - Create and share memory cards (in development)
- **AI Integration** - Smart search and meeting briefs (in development)

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Convex (real-time database)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Custom Convex Auth (email/password)
- **File Storage**: Convex File Storage
- **AI**: OpenAI + FAL.ai (3D pet generation implemented)
- **3D Models**: FAL.ai integration for pet generation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account

### Setup

1. **Clone and install dependencies**:
   ```bash
   cd Scrollodex
   npm install
   ```

2. **Set up Convex**:
   ```bash
   npx convex dev
   ```
   - This will prompt you to login to Convex
   - Create a new project or select existing one
   - Copy the deployment URL to your `.env.local` file

3. **Create environment file**:
   ```bash
   cp env.example .env.local
   ```
   - Add your Convex deployment URL to `NEXT_PUBLIC_CONVEX_URL`
   - Add your FAL.ai API key to `FAL_KEY` (for 3D pet generation)
   - Add your OpenAI API key to `NEXT_PUBLIC_OPENAI_API_KEY` (optional)

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Main dashboard (contacts + dex)
│   ├── contacts/[id]/  # Contact detail pages
│   ├── dex/[id]/       # Dex entry detail pages
│   ├── profile/        # User profile page
│   ├── signup/         # Signup page
│   └── api/            # API routes (pet generation, etc.)
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   ├── ContactCard.tsx # Contact display cards
│   ├── DexCard.tsx     # Dex entry cards
│   ├── PetModel.tsx    # 3D pet integration
│   └── ...             # Other components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useContacts.ts  # Contact management
│   └── useDex.ts       # Dex entry management
└── lib/                # Utilities and providers
    ├── utils.ts        # UI utilities (PIXEL_BORDER_CLASSES, etc.)
    └── convex-provider.tsx

convex/
├── schema.ts           # Database schema
├── auth.ts            # Authentication functions
├── users.ts           # User management
├── contacts.ts        # Contact CRUD operations
├── dex.ts            # Dex entry system
├── pets.ts           # 3D pet generation
├── notes.ts          # Notes and actions
└── ...               # Other backend functions
```

## Current Status

✅ **Phase 1 Complete**: Foundation setup
- Next.js + Convex project initialized
- Tailwind CSS + shadcn/ui configured
- Pixel-art styling and dark theme
- Complete Convex schema defined
- Core API functions (contacts, dex, notes, pets)

✅ **Phase 2 Complete**: Authentication & Core Features
- Custom Convex authentication system
- User registration and login
- Contact management with CRUD operations
- Dex system with XP and levels
- Notes and actions management
- User profile management

✅ **Phase 3 Complete**: Advanced Features
- 3D pet generation with FAL.ai integration
- Pet evolution system based on relationship health
- Contact detail views with comprehensive information
- Dex detail views with stats and progression
- Real-time updates with Convex subscriptions

🚧 **In Development**:
- Social features (moments, peer pages)
- Card system for memory sharing
- AI-powered smart search
- Meeting companion features

## Development

- **Frontend**: `npm run dev` - Next.js dev server
- **Backend**: `npx convex dev` - Convex development mode
- **Build**: `npm run build` - Production build

## Deployment

### Prerequisites for Production
- Convex account with production deployment
- FAL.ai account and API key (for 3D pet generation)
- OpenAI API key (optional, for future AI features)

### Deploy to Vercel

1. **Connect GitHub repo to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your GitHub repository
   - Select the Scrollodex repository

2. **Set environment variables in Vercel**:
   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_production_url
   FAL_KEY=your_fal_ai_api_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key (optional)
   ```

3. **Set up Convex production**:
   - Create production deployment in [Convex Dashboard](https://dashboard.convex.dev)
   - Copy the production URL to your Vercel environment variables
   - Deploy your Convex functions: `npx convex deploy --prod`

4. **Deploy**:
   - Vercel will automatically deploy on push to main branch
   - Or manually trigger deployment from Vercel dashboard

### Environment Variables Required

**Required:**
- `NEXT_PUBLIC_CONVEX_URL`: Your Convex production deployment URL

**Optional but Recommended:**
- `FAL_KEY`: FAL.ai API key for 3D pet generation
- `NEXT_PUBLIC_OPENAI_API_KEY`: OpenAI API key for future AI features

## Key Features

### 3D Pet System
Each contact relationship has a unique 3D pet that evolves based on relationship health:
- **Pet Types**: Dragon, Phoenix, Fox, Cat, Dog, or Egg
- **Evolution**: Pets evolve as relationship health improves
- **AI Generation**: Uses FAL.ai to generate personalized 3D models
- **Nurturing**: Pets grow happier through interactions and meetings

### Dex System
Pokemon-inspired contact management:
- **XP System**: Contacts gain XP through interactions
- **Levels**: Visual progression with level-based unlocks
- **Types**: Contact categorization with effectiveness charts
- **Stats**: Comprehensive relationship analytics

### Real-time Updates
- **Live Data**: All changes sync instantly across devices
- **Convex Subscriptions**: Real-time database updates
- **Offline Support**: Graceful handling of connection issues

## Contributing

This is a personal project, but feel free to:
- Report issues
- Suggest features
- Submit pull requests

## Project Team Members
1. [Brent Deverman](https://deverman.org) brent@deverman.org
2. [Chen Chen](https://www.linkedin.com/in/chen-chen-12288439) cecichencc@gmail.com
3. [Tatsuya Kohrogi](https://www.linkedin.com/in/tatsuya-kohrogi/) tkohrogi@ripple.com
4. [Wan Sheng Fung, Kaelan](https://www.linkedin.com/in/kaelan-wan) kaelanwanshengfung@gmail.com

## License

Private project - All rights reserved.