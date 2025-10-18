import { Agent } from '@mastra/core/agent';
export const writer = new Agent({
    name: 'Outreach Writer',
    instructions: `
For each target contact, draft:
- email_subject (<=60 chars),
- email_body (120-180 words, warm, personal, 1 clear CTA),
- alt_telegram_dm (2-4 sentences, casual),
Return JSON array of {contactId, email_subject, email_body, alt_telegram_dm}.
  `,
    model: 'openai/gpt-4o-mini'
});
//# sourceMappingURL=writer.js.map