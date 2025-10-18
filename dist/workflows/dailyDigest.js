import { Workflow } from '@mastra/core/workflow';
import { curator } from '../agents/curator';
import { planner } from '../agents/planner';
import { writer } from '../agents/writer';
import { mcpForUser } from '../mcp/userMcp';
import { knex } from '../db/knex';
import { next8amInSGT } from '../utils/time';
export const dailyDigest = new Workflow('daily-digest')
    .then(async (ctx) => {
    const user = await knex('users').where({ email: 'demo@example.com' }).first();
    if (!user)
        throw new Error('Demo user missing');
    const mcp = await mcpForUser(user);
    const toolsets = await mcp.getToolsets();
    const contacts = await curator.generate('Fetch contacts with birthdays and last email touch', { toolsets });
    const plan = await planner.generate(`Score who to nudge today given: ${contacts.text}`, {});
    const drafts = await writer.generate(`Draft outreach for: ${plan.text}`, {});
    // Create Gmail drafts via MCP
    try {
        await (await mcp.tool('gmail.create_draft')).call({ payload: JSON.parse(drafts.text) });
    }
    catch (e) {
        ctx.logger?.warn('gmail.create_draft failed', e);
    }
    // Notify via Telegram
    try {
        const summary = `Daily digest ready. Drafts: ${JSON.parse(drafts.text).length}. Approve to send?`;
        await (await mcp.tool('telegram.send_message')).call({
            chat_id: user.telegram_chat_id,
            text: summary,
            reply_markup: { inline_keyboard: [[{ text: 'Approve All', callback_data: 'approve_all' }, { text: 'Skip', callback_data: 'skip' }]] }
        });
    }
    catch (e) {
        ctx.logger?.warn('telegram.send_message failed', e);
    }
})
    .sleepUntil(next8amInSGT)
    .then((ctx) => ctx.sendEvent('schedule_next_run'));
//# sourceMappingURL=dailyDigest.js.map