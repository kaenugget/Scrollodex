# Agentic CRM with Mastra + MCP

An intelligent CRM system that aggregates contacts, scores relationships, drafts personalized outreach, and sends daily digests with approve-to-send flow.

## Features

- **Contact Curator**: Fetches and normalizes contacts from Google Contacts and Gmail
- **Nurture Planner**: Scores relationship health and selects targets for outreach
- **Outreach Writer**: Drafts personalized emails and Telegram DMs
- **Daily Digest**: Automated 8:00 SGT workflow with Telegram approval flow
- **MCP Integration**: Dynamic toolsets per user with OAuth-scoped access

## Tech Stack

- Node.js 18+ with TypeScript
- Mastra (agents + workflows) with MCP client
- Postgres for persistence
- Telegram Bot for notifications/approvals
- Google OAuth for Gmail, People/Contacts, Calendar

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

3. **Set up database**:
   ```bash
   # Start Postgres (Docker or local)
   npm run migrate
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for LLM operations
- `DATABASE_URL`: Postgres connection string
- `TELEGRAM_BOT_TOKEN`: Telegram bot token
- `TELEGRAM_DEFAULT_CHAT_ID`: Default chat ID for notifications
- `GMAIL_MCP_URL`: MCP server URL for Gmail operations
- `CONTACTS_MCP_URL`: MCP server URL for Google Contacts
- `CALENDAR_MCP_URL`: MCP server URL for Google Calendar
- `TELEGRAM_MCP_URL`: MCP server URL for Telegram operations

## Usage

### Manual Testing

Trigger the daily digest workflow manually:
```bash
curl -X POST http://localhost:3000/api/run/daily-now
```

### Telegram Webhook

Configure your Telegram bot webhook to:
```
https://your-domain.com/api/telegram/webhook
```

## API Endpoints

- `POST /api/run/daily-now` - Manually trigger daily digest
- `POST /api/telegram/webhook` - Telegram bot webhook

## Database Schema

- `users`: User accounts with OAuth tokens
- `contacts`: Contact information with birthdays and importance
- `interactions`: Communication history
- `scores`: Relationship scoring and categorization

## Workflows

1. **Daily Digest**: Runs at 8:00 SGT daily
   - Fetches contacts and scores relationships
   - Drafts personalized outreach
   - Sends Telegram summary with approval buttons

2. **Send Approved**: Triggered by Telegram approval
   - Sends all prepared Gmail drafts

## Security

- Per-user OAuth scopes with least privilege
- PII redaction in logs
- Audit logging without email body content
- Rate limiting on API endpoints

## Development

```bash
# Run migrations
npm run migrate

# Seed demo data
npm run seed

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## MCP Servers Required

You'll need to set up MCP servers for:
- Gmail (create_draft, send_draft, list_threads)
- Google Contacts (list contacts with birthdays)
- Google Calendar (optional: read Birthdays calendar)
- Telegram (sendMessage, inline buttons)

Each MCP server should accept OAuth tokens via Authorization headers.
