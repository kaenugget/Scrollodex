import { MCPClient } from '@mastra/mcp';

export async function mcpForUser(user: {
  id: string;
  oauth: Record<string, any>;
}) {
  const servers: Record<string, any> = {};
  
  // Use Composio.dev MCP servers for production
  if (process.env.GMAIL_MCP_URL) {
    servers.gmail = {
      url: new URL(process.env.GMAIL_MCP_URL),
      requestInit: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };
  }
  
  if (process.env.CONTACTS_MCP_URL) {
    servers.contacts = {
      url: new URL(process.env.CONTACTS_MCP_URL),
      requestInit: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };
  }
  
  if (process.env.TELEGRAM_MCP_URL) {
    servers.telegram = {
      url: new URL(process.env.TELEGRAM_MCP_URL),
      requestInit: {
        headers: {
          'X-Bot-Token': process.env.TELEGRAM_BOT_TOKEN || '',
          'Content-Type': 'application/json'
        }
      }
    };
  }

  // Fallback to local mock servers if Mastra URLs not configured
  if (!process.env.GMAIL_MCP_URL) {
    servers.gmail = {
      command: 'ts-node',
      args: ['--project', 'tsconfig.server.json', 'src/mcp/gmail-server.ts']
    };
  }
  
  if (!process.env.CONTACTS_MCP_URL) {
    servers.contacts = {
      command: 'ts-node',
      args: ['--project', 'tsconfig.server.json', 'src/mcp/contacts-server.ts']
    };
  }
  
  if (!process.env.TELEGRAM_MCP_URL) {
    servers.telegram = {
      command: 'ts-node',
      args: ['--project', 'tsconfig.server.json', 'src/mcp/telegram-server.ts']
    };
  }

  return new MCPClient({
    id: `mcp-${user.id}`,
    servers
  });
}
