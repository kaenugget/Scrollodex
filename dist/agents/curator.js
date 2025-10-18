import { Agent } from '@mastra/core/agent';
export const curator = new Agent({
    name: 'Contact Curator',
    instructions: `
You fetch and normalize contacts using MCP tools (google-contacts, gmail).
Return JSON array with fields:
{id,name,primary_email,birthday,last_contacted_at,notes}
  `,
    // Use your configured model provider inside Mastra; keep model name swappable
    model: { provider: 'openai', name: 'gpt-4o-mini' }
});
//# sourceMappingURL=curator.js.map