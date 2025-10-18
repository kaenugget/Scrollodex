# Agentic CRM Setup Guide

## Quick Start

This agentic CRM system is now fully implemented with Mastra + MCP integration. Here's how to get it running:

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Telegram Bot Token (optional for testing)

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values:
# - OPENAI_API_KEY=your_openai_key
# - DATABASE_URL=postgres://user:pass@localhost:5432/mastra_crm
# - TELEGRAM_BOT_TOKEN=your_bot_token (optional)
# - TELEGRAM_DEFAULT_CHAT_ID=your_chat_id (optional)
```

### 3. Database Setup

```bash
# Run migrations to create tables
npm run migrate

# Seed demo user
npm run seed

# Test database connection
npm run test-db
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Test the System

```bash
# Trigger daily digest manually
curl -X POST http://localhost:3000/api/run/daily-now
```

## Architecture Overview

### Core Components

1. **Agents** (`src/agents/`)
   - `curator.ts`: Fetches and normalizes contacts
   - `planner.ts`: Scores relationships and selects targets
   - `writer.ts`: Drafts personalized outreach

2. **Workflows** (`src/workflows/`)
   - `dailyDigest.ts`: Main daily workflow
   - `sendApproved.ts`: Handles draft approval

3. **MCP Integration** (`src/mcp/`)
   - `userMcp.ts`: Dynamic MCP client per user

4. **Database** (`src/db/`)
   - `knex.ts`: Database connection
   - `migrate.ts`: Schema migrations

### Database Schema

- `users`: User accounts with OAuth tokens
- `contacts`: Contact information with birthdays
- `interactions`: Communication history
- `scores`: Relationship scoring

### API Endpoints

- `POST /api/run/daily-now`: Manual trigger
- `POST /api/telegram/webhook`: Telegram bot webhook

## MCP Servers Required

To fully utilize the system, you'll need MCP servers for:

1. **Gmail MCP**: `create_draft`, `send_draft`, `list_threads`
2. **Google Contacts MCP**: `list_contacts` with birthdays
3. **Google Calendar MCP**: Read Birthdays calendar (optional)
4. **Telegram MCP**: `send_message` with inline buttons

Each MCP server should accept OAuth tokens via Authorization headers.

## Security Features

- Per-user OAuth scopes with least privilege
- PII redaction in logs
- Audit logging without email body content
- Rate limiting on API endpoints

## Development Notes

- The system uses simplified function-based workflows instead of complex Mastra Workflow objects
- All TypeScript compilation is isolated to server-side code
- Database migrations are idempotent and safe to run multiple times
- Demo user is created with email `demo@example.com`

## Next Steps

1. Set up MCP servers for Gmail, Contacts, Calendar, and Telegram
2. Configure OAuth flows for Google services
3. Set up Telegram bot webhook
4. Add real contact data and test the scoring algorithm
5. Implement web UI for reviewing/approving drafts

## Troubleshooting

- **Database connection issues**: Check `DATABASE_URL` in `.env`
- **MCP errors**: Ensure MCP server URLs are correct and accessible
- **Agent errors**: Verify `OPENAI_API_KEY` is set
- **Telegram errors**: Check bot token and chat ID configuration
