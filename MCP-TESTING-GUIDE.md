# MCP Setup and Testing Guide

## 🚀 Quick Setup for Testing

### 1. Prerequisites
Make sure you have:
- Node.js 18+
- PostgreSQL running
- OpenAI API key

### 2. Environment Setup
```bash
# Copy and edit environment file
cp .env.example .env

# Add your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/mastra_crm" >> .env
echo "TELEGRAM_DEFAULT_CHAT_ID=123456789" >> .env
```

### 3. Database Setup
```bash
# Create database tables
npm run migrate

# Create demo user
npm run seed

# Test database connection
npm run test-db
```

### 4. Test Individual MCP Servers

#### Test Gmail MCP Server
```bash
# In terminal 1
ts-node --project tsconfig.server.json src/mcp/gmail-server.ts
```

#### Test Contacts MCP Server
```bash
# In terminal 2
ts-node --project tsconfig.server.json src/mcp/contacts-server.ts
```

#### Test Telegram MCP Server
```bash
# In terminal 3
ts-node --project tsconfig.server.json src/mcp/telegram-server.ts
```

### 5. Test the Full System

#### Start the Main Server
```bash
# In terminal 4
npm run dev
```

#### Trigger Daily Digest
```bash
# In terminal 5
curl -X POST http://localhost:3000/api/run/daily-now
```

## 🔧 MCP Server Details

### Gmail Mock Server (`src/mcp/gmail-server.ts`)
**Tools Available:**
- `create_draft`: Creates Gmail drafts
- `send_draft`: Sends Gmail drafts
- `list_threads`: Lists Gmail threads

**Test Commands:**
```bash
# Test Gmail server directly
echo '{"method": "tools/list"}' | ts-node --project tsconfig.server.json src/mcp/gmail-server.ts
```

### Contacts Mock Server (`src/mcp/contacts-server.ts`)
**Tools Available:**
- `list_contacts`: Returns mock contact data with birthdays

**Mock Data Includes:**
- John Doe (birthday: 1990-05-15)
- Jane Smith (birthday: 1985-12-03)
- Bob Johnson (birthday: 1992-08-22)
- Alice Brown (birthday: 1988-03-10)
- Charlie Wilson (birthday: 1995-11-28)

### Telegram Mock Server (`src/mcp/telegram-server.ts`)
**Tools Available:**
- `send_message`: Sends messages with inline buttons

## 🧪 Testing Workflow

### 1. Test Database Connection
```bash
npm run test-db
```
Expected output:
```
✅ Database connection successful
📋 Available tables: users, contacts, interactions, scores
👥 Users in database: 1
✅ Demo user found: demo@example.com
```

### 2. Test MCP Servers Individually
```bash
# Test each server in separate terminals
ts-node --project tsconfig.server.json src/mcp/gmail-server.ts
ts-node --project tsconfig.server.json src/mcp/contacts-server.ts
ts-node --project tsconfig.server.json src/mcp/telegram-server.ts
```

### 3. Test Full Integration
```bash
# Start main server
npm run dev

# Trigger workflow
curl -X POST http://localhost:3000/api/run/daily-now
```

Expected workflow:
1. **Contact Curator** fetches contacts from mock server
2. **Nurture Planner** scores relationships and selects targets
3. **Outreach Writer** drafts personalized messages
4. **Gmail MCP** creates drafts
5. **Telegram MCP** sends approval message

## 🔍 Debugging Tips

### Check MCP Server Logs
Look for these log messages:
- `🚀 Gmail Mock MCP server started`
- `🚀 Google Contacts Mock MCP server started`
- `🚀 Telegram Mock MCP server started`

### Check Agent Output
The agents will output:
- Contact data from the curator
- Scoring results from the planner
- Draft content from the writer

### Check MCP Tool Calls
Look for:
- `📧 Creating Gmail drafts:`
- `👥 Listing Google Contacts`
- `📱 Sending Telegram message:`

## 🚀 Production Setup

### Real MCP Servers
For production, replace mock servers with real ones:

1. **Gmail MCP Server**: Use official Google MCP server
2. **Contacts MCP Server**: Use Google People API MCP server
3. **Telegram MCP Server**: Use Telegram Bot API MCP server

### Environment Variables for Production
```bash
# Real MCP server URLs
GMAIL_MCP_URL=https://your-gmail-mcp-server.com
CONTACTS_MCP_URL=https://your-contacts-mcp-server.com
TELEGRAM_MCP_URL=https://your-telegram-mcp-server.com

# OAuth tokens
GOOGLE_ACCESS_TOKEN=your_google_token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## 📊 Expected Test Results

When you run the daily digest, you should see:

1. **Contact Curator** outputs 5 mock contacts
2. **Nurture Planner** scores contacts and selects top targets
3. **Outreach Writer** creates personalized drafts
4. **Gmail MCP** creates drafts (logged to console)
5. **Telegram MCP** sends approval message (logged to console)

The system is now ready for testing! 🎉
