#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'google-contacts-mock-server',
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
        name: 'list_contacts',
        description: 'List Google Contacts with birthdays',
        inputSchema: {
          type: 'object',
          properties: {
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
    case 'list_contacts':
      console.error('👥 Listing Google Contacts');
      const mockContacts = [
        {
          id: 'contact1',
          name: 'John Doe',
          primary_email: 'john@example.com',
          birthday: '1990-05-15',
          last_contacted_at: '2024-01-15T10:00:00Z',
          notes: 'Met at conference',
        },
        {
          id: 'contact2',
          name: 'Jane Smith',
          primary_email: 'jane@example.com',
          birthday: '1985-12-03',
          last_contacted_at: '2024-02-01T14:30:00Z',
          notes: 'Colleague from previous job',
        },
        {
          id: 'contact3',
          name: 'Bob Johnson',
          primary_email: 'bob@example.com',
          birthday: '1992-08-22',
          last_contacted_at: '2023-12-20T09:15:00Z',
          notes: 'Birthday coming up soon',
        },
        {
          id: 'contact4',
          name: 'Alice Brown',
          primary_email: 'alice@example.com',
          birthday: '1988-03-10',
          last_contacted_at: '2024-01-05T16:45:00Z',
          notes: 'Potential client',
        },
        {
          id: 'contact5',
          name: 'Charlie Wilson',
          primary_email: 'charlie@example.com',
          birthday: '1995-11-28',
          last_contacted_at: '2023-11-15T11:20:00Z',
          notes: 'Old friend, birthday soon',
        },
      ];

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockContacts),
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
  console.error('🚀 Google Contacts Mock MCP server started');
}

main().catch(console.error);
