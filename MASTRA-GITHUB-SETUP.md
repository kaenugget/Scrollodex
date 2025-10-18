# 🚀 Mastra + GitHub Integration Setup

This guide will help you connect your Scrollodex project to Mastra Cloud via GitHub integration.

## 📋 What We've Set Up

✅ **Mastra Project Structure**: Created proper Mastra configuration files
✅ **Workflow Objects**: Converted your functions to Mastra Workflow objects
✅ **Agent Configuration**: Set up your agents (curator, planner, writer)
✅ **MCP Integration**: Configured MCP client for external services
✅ **Server Setup**: Created Mastra server configuration

## 🔧 Step 1: Test Your Mastra Project Locally

Before connecting to GitHub, test your Mastra setup:

```bash
# Install dependencies (if needed)
npm install

# Start the Mastra server
npm run dev:mastra
```

You should see:
```
🚀 Mastra server started successfully!
📡 Server running on localhost:3001
```

## 🌐 Step 2: Connect to Mastra Cloud via GitHub

### 2.1 Push Your Code to GitHub
```bash
# Make sure your changes are committed
git add .
git commit -m "Add Mastra project configuration"
git push origin main
```

### 2.2 In Mastra Cloud Dashboard
1. **Go back to your Mastra Cloud dashboard**
2. **Choose "Create from Mastra project on Github"**
3. **Connect your GitHub account** if not already connected
4. **Select your repository**: `Scrollodex` (or your repo name)
5. **Select the branch**: `main`
6. **Configure the project**:
   - **Project Name**: `scrollodex-crm`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:mastra`
   - **Port**: `3001`

### 2.3 Environment Variables
In the Mastra Cloud dashboard, add these environment variables:

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mastra_crm

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_DEFAULT_CHAT_ID=your_chat_id

# MCP URLs (from Composio.dev or other registries)
GMAIL_MCP_URL=https://mcp.composio.dev/gmail/[your-private-url]
CONTACTS_MCP_URL=https://mcp.composio.dev/googlecontacts/[your-private-url]
TELEGRAM_MCP_URL=https://mcp.composio.dev/telegram/[your-private-url]

# Google OAuth (for Gmail/Contacts access)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-mastra-app.mastra.ai/auth/google/callback
```

## 🚀 Step 3: Deploy and Test

### 3.1 Deploy to Mastra Cloud
1. **Click "Deploy"** in the Mastra Cloud dashboard
2. **Wait for deployment** to complete (usually 2-5 minutes)
3. **Get your Mastra app URL** (e.g., `https://scrollodex-crm-abc123.mastra.ai`)

### 3.2 Test Your Workflows
You can test your workflows via the Mastra Cloud dashboard:

1. **Go to the "Playground" section**
2. **Select your workflow**: `dailyDigest`
3. **Run the workflow** and see the results
4. **Check the logs** for any errors

### 3.3 Test via API
```bash
# Test the daily digest workflow
curl -X POST https://your-mastra-app.mastra.ai/api/workflows/dailyDigest/execute

# Test the send approved workflow
curl -X POST https://your-mastra-app.mastra.ai/api/workflows/sendApproved/execute \
  -H "Content-Type: application/json" \
  -d '{"draftIds": ["draft1", "draft2"]}'
```

## 🔗 Step 4: Integrate with Your Next.js App

Update your existing API routes to use the Mastra workflows:

```typescript
// src/app/api/run/daily-now/route.ts
import { mastra } from '../../../mastra.config';

export async function POST() {
  try {
    const workflow = mastra.getWorkflow('dailyDigest');
    const result = await workflow.execute({});
    
    return Response.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

## 📊 Step 5: Monitor and Debug

### 5.1 Mastra Cloud Dashboard
- **View workflow executions** in the dashboard
- **Check logs** for debugging
- **Monitor performance** and usage

### 5.2 Local Development
```bash
# Run both Next.js and Mastra servers
npm run dev          # Next.js on port 3000
npm run dev:mastra   # Mastra on port 3001
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check TypeScript compilation: `npm run build:server`
   - Verify all imports are correct
   - Check environment variables

2. **Workflow Execution Errors**:
   - Check MCP server connectivity
   - Verify API keys and tokens
   - Check database connections

3. **GitHub Integration Issues**:
   - Ensure repository is public or you have proper access
   - Check branch name matches
   - Verify build/start commands

### Debug Commands
```bash
# Test database connection
npm run test-db

# Test workflow locally
npm run test-workflow

# Check Mastra server logs
npm run dev:mastra
```

## 🎉 Success Criteria

Your Mastra integration is working when:
- ✅ Mastra server starts locally
- ✅ GitHub integration completes successfully
- ✅ Deployment succeeds in Mastra Cloud
- ✅ Workflows execute without errors
- ✅ MCP servers connect properly
- ✅ Agents process data correctly

## 🚀 Next Steps

Once everything is working:
1. **Set up MCP servers** (Gmail, Contacts, Telegram)
2. **Configure OAuth** for Google services
3. **Test end-to-end** workflows
4. **Set up monitoring** and alerts
5. **Deploy to production**

Your agentic CRM is now running on Mastra Cloud! 🎉
