import { Workflow } from '@mastra/core/workflow';
import { curator } from '../agents/curator';
import { planner } from '../agents/planner';
import { writer } from '../agents/writer';
import { mcpForUser } from '../mcp/userMcp';
import { knex } from '../db/knex';

export const dailyDigestWorkflow = new Workflow({
  name: 'dailyDigest',
  description: 'Daily CRM digest workflow that fetches contacts, scores them, and creates outreach drafts',
  
  steps: {
    fetchContacts: {
      description: 'Fetch contacts with birthdays and last email touch',
      execute: async () => {
        const user = await knex('users').where({ email: 'demo@example.com' }).first();
        if (!user) throw new Error('Demo user missing');
        const mcp = await mcpForUser(user);
        const toolsets = await mcp.getToolsets();
        
        const contacts = await curator.generate('Fetch contacts with birthdays and last email touch', { toolsets });
        return { contacts: contacts.text, user, mcp };
      }
    },
    
    scoreContacts: {
      description: 'Score contacts and select top targets for outreach',
      execute: async ({ fetchContacts }) => {
        const plan = await planner.generate(`Score who to nudge today given: ${fetchContacts.contacts}`, {});
        return { plan: plan.text };
      }
    },
    
    createDrafts: {
      description: 'Create personalized outreach drafts',
      execute: async ({ fetchContacts, scoreContacts }) => {
        const drafts = await writer.generate(`Draft outreach for: ${scoreContacts.plan}`, {});
        return { drafts: drafts.text };
      }
    },
    
    createGmailDrafts: {
      description: 'Create Gmail drafts via MCP',
      execute: async ({ fetchContacts, createDrafts }) => {
        try {
          const toolsets = await fetchContacts.mcp.getToolsets();
          if (toolsets.gmail) {
            await toolsets.gmail.call('create_draft', { payload: JSON.parse(createDrafts.drafts) });
            return { success: true };
          }
        } catch (e) { 
          console.warn('gmail.create_draft failed', e);
          return { success: false, error: e };
        }
      }
    },
    
    notifyTelegram: {
      description: 'Send approval notification via Telegram',
      execute: async ({ fetchContacts, createDrafts }) => {
        try {
          const toolsets = await fetchContacts.mcp.getToolsets();
          if (toolsets.telegram) {
            const summary = `Daily digest ready. Drafts: ${JSON.parse(createDrafts.drafts).length}. Approve to send?`;
            await toolsets.telegram.call('send_message', {
              chat_id: fetchContacts.user.telegram_chat_id,
              text: summary,
              reply_markup: { 
                inline_keyboard: [
                  [
                    { text: 'Approve All', callback_data: 'approve_all' }, 
                    { text: 'Skip', callback_data: 'skip' }
                  ]
                ] 
              }
            });
            return { success: true };
          }
        } catch (e) { 
          console.warn('telegram.send_message failed', e);
          return { success: false, error: e };
        }
      }
    }
  }
});

// Legacy function for backward compatibility
export async function runDailyDigest() {
  const result = await dailyDigestWorkflow.execute({});
  return result;
}
