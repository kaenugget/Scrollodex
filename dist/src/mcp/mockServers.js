import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
// Mock Gmail MCP Server
const gmailServer = new Server({
    name: 'gmail-mock-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
gmailServer.setRequestHandler(ListToolsRequestSchema, async () => {
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
gmailServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'create_draft':
            console.log('📧 Creating Gmail drafts:', args.payload);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Created ${args.payload.length} Gmail drafts successfully`,
                    },
                ],
            };
        case 'send_draft':
            console.log('📤 Sending Gmail draft:', args.draftId);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Sent draft ${args.draftId} successfully`,
                    },
                ],
            };
        case 'list_threads':
            console.log('📋 Listing Gmail threads:', args.query);
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
// Mock Google Contacts MCP Server
const contactsServer = new Server({
    name: 'google-contacts-mock-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
contactsServer.setRequestHandler(ListToolsRequestSchema, async () => {
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
contactsServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'list_contacts':
            console.log('👥 Listing Google Contacts');
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
// Mock Telegram MCP Server
const telegramServer = new Server({
    name: 'telegram-mock-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
telegramServer.setRequestHandler(ListToolsRequestSchema, async () => {
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
telegramServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'send_message':
            console.log('📱 Sending Telegram message:', args.text);
            console.log('📱 To chat:', args.chat_id);
            if (args.reply_markup) {
                console.log('📱 With buttons:', args.reply_markup);
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: `Message sent to ${args.chat_id} successfully`,
                    },
                ],
            };
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});
// Start servers
async function startServer(server, name) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log(`🚀 ${name} MCP server started`);
}
// Export for use in different processes
export { gmailServer, contactsServer, telegramServer, startServer };
//# sourceMappingURL=mockServers.js.map