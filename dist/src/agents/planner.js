import { Agent } from '@mastra/core/agent';
export const planner = new Agent({
    name: 'Nurture Planner',
    instructions: `
Given contacts with fields {birthday,last_contacted_at,importance},
compute a score per contact:
score = 0.4*recency + 0.25*frequency_neg + 0.25*importance + 0.1*event_bonus
- recency = log(1 + days since last_contacted_at)
- frequency_neg = 1 / (1 + emails in last 90 days)
- importance = 1..5
- event_bonus = 5 if birthday in 7 days, 10 if today
Return top 10 targets with reasons and a concise plan.
  `,
    model: 'openai/gpt-4o-mini'
});
//# sourceMappingURL=planner.js.map