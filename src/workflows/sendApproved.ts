import { Workflow } from '@mastra/core/workflow';
import { mcpForUser } from '../mcp/userMcp';
import { knex } from '../db/knex';

export const sendApprovedWorkflow = new Workflow({
  name: 'sendApproved',
  description: 'Send approved Gmail drafts',
  
  steps: {
    sendDrafts: {
      description: 'Send approved Gmail drafts via MCP',
      execute: async ({ draftIds }: { draftIds: string[] }) => {
        const user = await knex('users').where({ email: 'demo@example.com' }).first();
        if (!user) throw new Error('Demo user missing');
        const mcp = await mcpForUser(user);
        const toolsets = await mcp.getToolsets();
        
        const results = [];
        if (toolsets.gmail) {
          for (const id of draftIds) {
            try {
              await toolsets.gmail.call('send_draft', { draftId: id });
              results.push({ draftId: id, success: true });
            } catch (error) {
              results.push({ draftId: id, success: false, error });
            }
          }
        }
        
        return { results };
      }
    }
  }
});

// Legacy function for backward compatibility
export async function sendApprovedDrafts(draftIds: string[]) {
  const result = await sendApprovedWorkflow.execute({ draftIds });
  return result;
}
