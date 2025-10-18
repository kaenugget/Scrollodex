import { mcpForUser } from '../mcp/userMcp';
import { knex } from '../db/knex';
export async function sendApprovedDrafts(draftIds) {
    const user = await knex('users').where({ email: 'demo@example.com' }).first();
    if (!user)
        throw new Error('Demo user missing');
    const mcp = await mcpForUser(user);
    const toolsets = await mcp.getToolsets();
    if (toolsets.gmail) {
        for (const id of draftIds) {
            await toolsets.gmail.call('send_draft', { draftId: id });
        }
    }
}
//# sourceMappingURL=sendApproved.js.map