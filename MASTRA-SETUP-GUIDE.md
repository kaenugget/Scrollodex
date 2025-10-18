# 🚀 Mastra Integration Setup Guide

This guide will help you set up Mastra's hosted MCP services for Gmail, Google Contacts, and Telegram integration.

## 📋 Prerequisites

- Node.js 18+
- Mastra account (sign up at [mastra.ai](https://mastra.ai))
- OpenAI API key
- Google OAuth credentials (for Gmail/Contacts)
- Telegram bot token

## 🔧 Step 1: Create Mastra Account

1. **Sign up for Mastra:**
   - Visit [mastra.ai](https://mastra.ai)
   - Create your account
   - Navigate to your dashboard

2. **Access MCP Services:**
   - In your Mastra dashboard, look for "MCP Services" or "Integrations"
   - Find Gmail, Google Contacts, and Telegram services
   - Note down the MCP server URLs provided

## 📧 Step 2: Set Up Gmail Integration

1. **Get Gmail MCP URL:**
   - In Mastra dashboard, locate Gmail MCP service
   - Copy the MCP server URL (should look like: `https://gmail-mcp.mastra.ai/v1`)

2. **Configure Google OAuth:**
   - Set up Google OAuth in your Mastra dashboard
   - Add your Google OAuth client ID and secret
   - Configure redirect URIs

## 👥 Step 3: Set Up Google Contacts Integration

1. **Get Contacts MCP URL:**
   - In Mastra dashboard, locate Google Contacts MCP service
   - Copy the MCP server URL (should look like: `https://contacts-mcp.mastra.ai/v1`)

2. **Enable Contacts API:**
   - Ensure Google Contacts API is enabled in your Google Cloud Console
   - Add the necessary scopes for contacts access

## 🤖 Step 4: Create Telegram Bot

### 4.1 Create Bot with BotFather

1. **Open Telegram and search for @BotFather**
2. **Start a chat with BotFather**
3. **Send `/newbot` command**
4. **Follow the prompts:**
   - Set bot name: `YourApp CRM Bot`
   - Set username: `yourapp_crm_bot` (must end with "bot")
5. **Copy the bot token** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 4.2 Get Your Chat ID

**For personal use:**
1. Start a chat with your bot using the link BotFather provided
2. Send any message to the bot
3. Search for **@userinfobot** on Telegram
4. Send `/start` to @userinfobot - it will reply with your user ID

**For group chats:**
1. Add your bot to the group
2. Send a message in the group
3. Visit: `https://api.telegram.org/bot<YourBotToken>/getUpdates`
4. Look for the `chat.id` field in the JSON response

### 4.3 Configure Telegram in Mastra

1. **In Mastra dashboard, locate Telegram MCP service**
2. **Set up the service:**
   - Enter your bot token
   - Set the base URL to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>`
3. **Copy the Telegram MCP URL** (should look like: `https://telegram-mcp.mastra.ai/v1`)

## 🔑 Step 5: Configure Environment Variables

Update your `.env` file with the following variables:

```bash
# Mastra MCP Server URLs (get these from your Mastra dashboard)
GMAIL_MCP_URL=https://gmail-mcp.mastra.ai/v1
CONTACTS_MCP_URL=https://contacts-mcp.mastra.ai/v1
TELEGRAM_MCP_URL=https://telegram-mcp.mastra.ai/v1

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_DEFAULT_CHAT_ID=your_chat_id_here

# Google OAuth (for Gmail/Contacts access)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# OpenAI (for AI agents)
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mastra_crm
```

## 🧪 Step 6: Test the Integration

### 6.1 Test Individual MCP Services

```bash
# Test Gmail MCP
curl -X POST https://your-gmail-mcp-url/tools/list \
  -H "Authorization: Bearer your_google_token" \
  -H "Content-Type: application/json"

# Test Contacts MCP
curl -X POST https://your-contacts-mcp-url/tools/list \
  -H "Authorization: Bearer your_google_token" \
  -H "Content-Type: application/json"

# Test Telegram MCP
curl -X POST https://your-telegram-mcp-url/tools/list \
  -H "X-Bot-Token: your_bot_token" \
  -H "Content-Type: application/json"
```

### 6.2 Test Full Workflow

```bash
# Start your application
npm run dev

# Trigger the daily digest workflow
curl -X POST http://localhost:3000/api/run/daily-now
```

## 🔍 Troubleshooting

### Common Issues

1. **MCP URLs not working:**
   - Verify URLs in Mastra dashboard
   - Check if services are properly configured
   - Ensure authentication tokens are valid

2. **Google OAuth issues:**
   - Verify OAuth credentials in Mastra
   - Check redirect URIs match your app
   - Ensure required APIs are enabled

3. **Telegram bot not responding:**
   - Verify bot token is correct
   - Check if bot is added to the chat
   - Ensure webhook is properly configured in Mastra

4. **Authentication failures:**
   - Check token expiration
   - Verify user OAuth data is stored correctly
   - Ensure proper scopes are requested

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=mastra:*
```

## 🚀 Production Deployment

### Environment Variables for Production

```bash
# Production Mastra URLs (get from your Mastra dashboard)
GMAIL_MCP_URL=https://prod-gmail-mcp.mastra.ai/v1
CONTACTS_MCP_URL=https://prod-contacts-mcp.mastra.ai/v1
TELEGRAM_MCP_URL=https://prod-telegram-mcp.mastra.ai/v1

# Production OAuth settings
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### Security Considerations

- Store all tokens securely
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Regularly rotate API keys and tokens

## 📚 Additional Resources

- [Mastra Documentation](https://docs.mastra.ai)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## 🎉 Success Criteria

Your Mastra integration is working correctly when:
- ✅ Gmail MCP can list and create drafts
- ✅ Contacts MCP can fetch contact data
- ✅ Telegram MCP can send messages
- ✅ Daily digest workflow completes successfully
- ✅ All agents process data using real services

## 🆘 Support

If you encounter issues:
1. Check Mastra dashboard for service status
2. Review Mastra documentation
3. Contact Mastra support through their platform
4. Check your application logs for detailed error messages

Your agentic CRM is now ready for production with Mastra! 🚀
