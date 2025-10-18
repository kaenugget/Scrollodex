# 🚀 MCP Setup and Testing Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally
- OpenAI API key

### 2. Environment Setup
```bash
# Copy environment template
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

### 4. Test the Full System
```bash
# Test the complete workflow
npm run test-workflow
```

## 🧪 Individual Component Testing

### Test MCP Servers Individually

#### Gmail MCP Server
```bash
# Terminal 1
ts-node --project tsconfig.server.json src/mcp/gmail-server.ts
```

#### Contacts MCP Server
```bash
# Terminal 2
ts-node --project tsconfig.server.json src/mcp/contacts-server.ts
```

#### Telegram MCP Server
```bash
# Terminal 3
ts-node --project tsconfig.server.json src/mcp/telegram-server.ts
```

### Test Main Server
```bash
# Terminal 4
npm run dev

# Terminal 5 - Trigger workflow
curl -X POST http://localhost:3000/api/run/daily-now
```

## 📊 Expected Test Results

When you run `npm run test-workflow`, you should see:

```
🧪 Testing Agentic CRM Workflow...

1️⃣ Starting daily digest workflow...
✅ Daily digest completed successfully!

🎉 All tests passed! The agentic CRM is working correctly.

📋 What happened:
   • Contact Curator fetched mock contacts
   • Nurture Planner scored relationships
   • Outreach Writer created personalized drafts
   • Gmail MCP created drafts (check logs)
   • Telegram MCP sent approval message (check logs)
```

## 🔍 Debugging Guide

### Check MCP Server Logs
Look for these messages in the MCP server terminals:
- `🚀 Gmail Mock MCP server started`
- `🚀 Google Contacts Mock MCP server started`
- `🚀 Telegram Mock MCP server started`

### Check Agent Output
The agents will process:
1. **Contact Curator**: Fetches 5 mock contacts with birthdays
2. **Nurture Planner**: Scores contacts and selects top targets
3. **Outreach Writer**: Creates personalized email drafts

### Check MCP Tool Calls
Look for these log messages:
- `📧 Creating Gmail drafts: [array of drafts]`
- `👥 Listing Google Contacts`
- `📱 Sending Telegram message: Daily digest ready...`

## 🎯 Mock Data Overview

### Contacts Data
The mock contacts server returns 5 contacts:
- **John Doe** (birthday: 1990-05-15) - Met at conference
- **Jane Smith** (birthday: 1985-12-03) - Colleague from previous job
- **Bob Johnson** (birthday: 1992-08-22) - Birthday coming up soon
- **Alice Brown** (birthday: 1988-03-10) - Potential client
- **Charlie Wilson** (birthday: 1995-11-28) - Old friend, birthday soon

### Scoring Algorithm
The Nurture Planner uses this formula:
```
score = 0.4*recency + 0.25*frequency_neg + 0.25*importance + 0.1*event_bonus
```

### Generated Content
The Outreach Writer creates:
- Email subjects (≤60 chars)
- Email bodies (120-180 words, warm, personal, 1 clear CTA)
- Alternative Telegram DMs (2-4 sentences, casual)

## 🚀 Production Setup

### Real MCP Servers
For production, replace mock servers with real ones:

1. **Gmail MCP**: Use official Google MCP server
2. **Contacts MCP**: Use Google People API MCP server  
3. **Telegram MCP**: Use Telegram Bot API MCP server

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

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL is running
   brew services start postgresql  # macOS
   sudo systemctl start postgresql # Linux
   ```

2. **OpenAI API Key Missing**
   ```bash
   # Add to .env file
   echo "OPENAI_API_KEY=sk-your-key-here" >> .env
   ```

3. **MCP Server Not Starting**
   ```bash
   # Check TypeScript compilation
   npm run build
   
   # Run server directly
   ts-node --project tsconfig.server.json src/mcp/gmail-server.ts
   ```

4. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

### Log Analysis

**Successful Run:**
- Database connection established
- MCP servers started
- Agents processed data
- Drafts created
- Telegram message sent

**Failed Run:**
- Check error messages in console
- Verify all environment variables
- Ensure all dependencies installed
- Check database connectivity

## 📈 Performance Notes

- **Mock servers**: Instant response
- **Real servers**: Depends on API latency
- **Database**: Optimized with indexes
- **Agents**: Uses GPT-4o-mini for cost efficiency

## 🎉 Success Criteria

Your setup is working correctly when:
- ✅ Database test passes
- ✅ MCP servers start without errors
- ✅ Workflow test completes successfully
- ✅ All agents process data correctly
- ✅ Mock drafts are created
- ✅ Telegram approval message is sent

The agentic CRM is now ready for production deployment! 🚀
