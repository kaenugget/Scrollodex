import { Mastra } from "@mastra/core/mastra";
import { openai } from "@ai-sdk/openai";

// Import your existing agents
import { curator } from "./src/agents/curator";
import { planner } from "./src/agents/planner";
import { writer } from "./src/agents/writer";

export const mastra = new Mastra({
  // Register your agents (these will be deployed to Mastra Cloud)
  agents: {
    curator,
    planner,
    writer,
  },
  
  // Note: Workflows are now handled by Convex actions
  // MCP servers are now handled by Convex actions
});
