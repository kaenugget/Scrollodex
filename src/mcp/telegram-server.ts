#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'telegram-mock-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'send_message',
        description: 'Send Telegram message with inline buttons',
        inputSchema: {
          type: 'object',
          properties: {
            chat_id: { type: 'string' },
            text: { type: 'string' },
            reply_markup: { type: 'object' },
          },
          required: ['chat_id', 'text'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('Missing arguments');
  }

  switch (name) {
    case 'send_message':
      console.error('📱 Sending Telegram message:', (args as any).text);
      console.error('📱 To chat:', (args as any).chat_id);
      if ((args as any).reply_markup) {
        console.error('📱 With buttons:', (args as any).reply_markup);
      }
      return {
        content: [
          {
            type: 'text',
            text: `Message sent to ${(args as any).chat_id} successfully`,
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Telegram Mock MCP server started');
}

main().catch(console.error);
