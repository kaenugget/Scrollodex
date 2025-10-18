import { MCPClient } from '@mastra/mcp';
export async function mcpForUser(user) {
    const servers = {};
    // Use local mock servers for testing
    servers.gmail = {
        command: 'ts-node',
        args: ['--project', 'tsconfig.server.json', 'src/mcp/gmail-server.ts']
    };
    servers.contacts = {
        command: 'ts-node',
        args: ['--project', 'tsconfig.server.json', 'src/mcp/contacts-server.ts']
    };
    servers.telegram = {
        command: 'ts-node',
        args: ['--project', 'tsconfig.server.json', 'src/mcp/telegram-server.ts']
    };
    return new MCPClient({
        id: `mcp-${user.id}`,
        servers
    });
}
//# sourceMappingURL=userMcp.js.map