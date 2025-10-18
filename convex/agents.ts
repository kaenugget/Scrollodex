"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// Import Mastra agents
import { curator } from "../src/agents/curator";
import { planner } from "../src/agents/planner";
import { writer } from "../src/agents/writer";

// Action to call Mastra curator agent
export const callCuratorAgent = action({
  args: {
    prompt: v.string(),
    context: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    try {
      console.log('🤖 Calling curator agent with prompt:', args.prompt);
      
      // Call the Mastra agent
      const result = await curator.generate(args.prompt, args.context || {});
      
      return {
        success: true,
        result: result.text,
        agent: 'curator'
      };
    } catch (error) {
      console.error('❌ Curator agent error:', error);
      return {
        success: false,
        error: String(error),
        agent: 'curator'
      };
    }
  }
});

// Action to call Mastra planner agent
export const callPlannerAgent = action({
  args: {
    prompt: v.string(),
    context: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    try {
      console.log('🤖 Calling planner agent with prompt:', args.prompt);
      
      const result = await planner.generate(args.prompt, args.context || {});
      
      return {
        success: true,
        result: result.text,
        agent: 'planner'
      };
    } catch (error) {
      console.error('❌ Planner agent error:', error);
      return {
        success: false,
        error: String(error),
        agent: 'planner'
      };
    }
  }
});

// Action to call Mastra writer agent
export const callWriterAgent = action({
  args: {
    prompt: v.string(),
    context: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    try {
      console.log('🤖 Calling writer agent with prompt:', args.prompt);
      
      const result = await writer.generate(args.prompt, args.context || {});
      
      return {
        success: true,
        result: result.text,
        agent: 'writer'
      };
    } catch (error) {
      console.error('❌ Writer agent error:', error);
      return {
        success: false,
        error: String(error),
        agent: 'writer'
      };
    }
  }
});

// Combined workflow using all agents
export const runAgentWorkflow = action({
  args: {
    contacts: v.string(),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      console.log('🚀 Running agent workflow');
      
      // Step 1: Use curator to process contacts
      const curatorResult = await callCuratorAgent(ctx, {
        prompt: `Process these contacts: ${args.contacts}`,
        context: { userId: args.userId }
      });
      
      if (!curatorResult.success) {
        throw new Error(`Curator failed: ${curatorResult.error}`);
      }
      
      // Step 2: Use planner to create strategy
      const plannerResult = await callPlannerAgent(ctx, {
        prompt: `Create outreach strategy based on: ${curatorResult.result}`,
        context: { userId: args.userId }
      });
      
      if (!plannerResult.success) {
        throw new Error(`Planner failed: ${plannerResult.error}`);
      }
      
      // Step 3: Use writer to create drafts
      const writerResult = await callWriterAgent(ctx, {
        prompt: `Create outreach drafts based on: ${plannerResult.result}`,
        context: { userId: args.userId }
      });
      
      if (!writerResult.success) {
        throw new Error(`Writer failed: ${writerResult.error}`);
      }
      
      return {
        success: true,
        curator: curatorResult.result,
        planner: plannerResult.result,
        writer: writerResult.result
      };
      
    } catch (error) {
      console.error('❌ Agent workflow failed:', error);
      return {
        success: false,
        error: String(error)
      };
    }
  }
});
