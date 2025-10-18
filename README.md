# Scrollodex MVP

A pixel-art social contact manager built with Next.js, Convex, and Tailwind CSS.

## Features

- **Pixel-art UI** with dark theme and emerald accents
- **Contact Management** with tags, notes, and actions
- **Dex System** - Pokemon-style contact entries with XP and levels
- **Social Features** - Moments and peer pages (planned)
- **Card System** - Create and share memory cards (planned)
- **AI Integration** - Smart search and meeting briefs (planned)

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Convex (real-time database)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Convex Auth (email OTP)
- **File Storage**: Convex File Storage
- **AI**: OpenAI + FAL.ai (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account

### Setup

1. **Clone and install dependencies**:
   ```bash
   cd scrollodex-mvp
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

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── lib/                 # Utilities and types
│   ├── utils.ts        # UI utilities (PIXEL_BORDER_CLASSES, etc.)
│   ├── types.ts        # TypeScript types
│   └── convex-provider.tsx
convex/
├── schema.ts           # Database schema
├── users.ts           # User management
├── contacts.ts        # Contact CRUD operations
├── dex.ts            # Dex entry system
└── notes.ts          # Notes and actions
```

## Current Status

✅ **Phase 1 Complete**: Foundation setup
- Next.js + Convex project initialized
- Tailwind CSS + shadcn/ui configured
- Pixel-art styling and dark theme
- Basic Convex schema defined
- Core API functions (contacts, dex, notes)

🚧 **Next Steps**:
- Set up Convex authentication
- Build login/signup UI
- Port existing components from prototype
- Create `/dex` and `/contacts` pages

## Development

- **Frontend**: `npm run dev` - Next.js dev server
- **Backend**: `npx convex dev` - Convex development mode
- **Build**: `npm run build` - Production build

## Deployment

1. **Deploy to Vercel**:
   - Connect GitHub repo to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main

2. **Set up Convex production**:
   - Create production deployment in Convex dashboard
   - Update `NEXT_PUBLIC_CONVEX_URL` in Vercel env vars

## Contributing

This is a personal project, but feel free to:
- Report issues
- Suggest features
- Submit pull requests

## License

Private project - All rights reserved.