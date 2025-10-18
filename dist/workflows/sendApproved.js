import { Workflow } from '@mastra/core/workflow';
import { mcpForUser } from '../mcp/userMcp';
import { knex } from '../db/knex';
export const sendApproved = new Workflow('send-approved')
    .then(async (ctx) => {
    const user = await knex('users').where({ email: 'demo@example.com' }).first();
    if (!user)
        throw new Error('Demo user missing');
    const mcp = await mcpForUser(user);
    const { draftIds } = ctx.input;
    for (const id of draftIds) {
        await (await mcp.tool('gmail.send_draft')).call({ draftId: id });
    }
});
//# sourceMappingURL=sendApproved.js.map