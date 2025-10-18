#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'gmail-mock-server',
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
        name: 'create_draft',
        description: 'Create a Gmail draft',
        inputSchema: {
          type: 'object',
          properties: {
            payload: {
              type: 'array',
              description: 'Array of draft objects',
              items: {
                type: 'object',
                properties: {
                  contactId: { type: 'string' },
                  email_subject: { type: 'string' },
                  email_body: { type: 'string' },
                },
              },
            },
          },
          required: ['payload'],
        },
      },
      {
        name: 'send_draft',
        description: 'Send a Gmail draft',
        inputSchema: {
          type: 'object',
          properties: {
            draftId: { type: 'string' },
          },
          required: ['draftId'],
        },
      },
      {
        name: 'list_threads',
        description: 'List Gmail threads',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            maxResults: { type: 'number' },
          },
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
    case 'create_draft':
      console.error('📧 Creating Gmail drafts:', (args as any).payload);
      return {
        content: [
          {
            type: 'text',
            text: `Created ${(args as any).payload.length} Gmail drafts successfully`,
          },
        ],
      };

    case 'send_draft':
      console.error('📤 Sending Gmail draft:', (args as any).draftId);
      return {
        content: [
          {
            type: 'text',
            text: `Sent draft ${(args as any).draftId} successfully`,
          },
        ],
      };

    case 'list_threads':
      console.error('📋 Listing Gmail threads:', (args as any).query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify([
              {
                id: 'thread1',
                subject: 'Test Email',
                from: 'test@example.com',
                date: new Date().toISOString(),
              },
            ]),
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
  console.error('🚀 Gmail Mock MCP server started');
}

main().catch(console.error);
