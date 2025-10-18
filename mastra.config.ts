import { Mastra } from "@mastra/core/mastra";
import { openai } from "@ai-sdk/openai";

// Import your existing agents
import { curator } from "./src/agents/curator";
import { planner } from "./src/agents/planner";
import { writer } from "./src/agents/writer";

// Import your existing workflows
import { dailyDigestWorkflow } from "./src/workflows/dailyDigest";
import { sendApprovedWorkflow } from "./src/workflows/sendApproved";

// Import MCP configuration
import { userMcp } from "./src/mcp/userMcp";

export const mastra = new Mastra({
  name: "scrollodex-crm",
  version: "1.0.0",
  description: "Agentic CRM system for Scrollodex",
  
  // Configure model providers
  modelProviders: {
    openai: openai({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  },
  
  // Register your agents
  agents: {
    curator,
    planner,
    writer,
  },
  
  // Register your workflows
  workflows: {
    dailyDigest: dailyDigestWorkflow,
    sendApproved: sendApprovedWorkflow,
  },
  
  // Configure MCP servers
  mcpServers: {
    // We'll add MCP servers here once we have them configured
  },
});
