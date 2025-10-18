import { MCPClient } from '@mastra/mcp';
export async function mcpForUser(user) {
    const headers = (svc) => ({
        Authorization: `Bearer ${user.oauth?.[svc]?.access_token || ''}`
    });
    return new MCPClient({
        id: `mcp-${user.id}`,
        servers: {
            gmail: process.env.GMAIL_MCP_URL ? {
                url: new URL(process.env.GMAIL_MCP_URL),
                requestInit: { headers: headers('gmail') }
            } : undefined,
            contacts: process.env.CONTACTS_MCP_URL ? {
                url: new URL(process.env.CONTACTS_MCP_URL),
                requestInit: { headers: headers('contacts') }
            } : undefined,
            calendar: process.env.CALENDAR_MCP_URL ? {
                url: new URL(process.env.CALENDAR_MCP_URL),
                requestInit: { headers: headers('calendar') }
            } : undefined,
            telegram: process.env.TELEGRAM_MCP_URL ? {
                url: new URL(process.env.TELEGRAM_MCP_URL),
                requestInit: { headers: { 'X-Bot-Token': process.env.TELEGRAM_BOT_TOKEN || '' } }
            } : undefined
        }
    });
}
//# sourceMappingURL=userMcp.js.map