import { Contact, Tag } from './types';
import { SCOLLODEX_ENTRIES } from './seed';
import { inDays } from './date';

const TAGS: Record<string, Tag> = {
  work: { id: 't1', label: 'Work', color: 'blue' },
  friend: { id: 't2', label: 'Friend', color: 'green' },
  investor: { id: 't3', label: 'Investor', color: 'purple' },
  mentor: { id: 't4', label: 'Mentor', color: 'yellow' },
};

export const SOCIAL_CONTACTS: Contact[] = [
  {
    id: 'contact_001',
    friendId: 'tats_001',
    name: 'Tats',
    pfp: SCOLLODEX_ENTRIES[0].pfp,
    role: 'Founder',
    company: 'Scollodex',
    location: 'San Francisco, CA',
    tags: [TAGS.work, TAGS.friend],
    birthday: '1995-10-26T00:00:00.000Z',
    lastInteractionAt: inDays(-3),
    nextTouchAt: inDays(11),
    notes: [
      { id: 'n1', content: 'Discussed Q3 roadmap and design system updates. Follow up on component library.', createdAt: inDays(-3) },
      { id: 'n2', content: 'Grabbed ramen, talked about bouldering trip ideas.', createdAt: inDays(-20) },
    ],
    actions: [
      { id: 'a1', content: 'Review Figma prototypes for v2', completed: false, dueDate: inDays(2) },
      { id: 'a2', content: 'Send over the City Pop playlist', completed: true, dueDate: inDays(-19) },
    ],
    preferences: SCOLLODEX_ENTRIES[0].preferences,
  },
  {
    id: 'contact_002',
    friendId: 'kaelan_002',
    name: 'Kaelan',
    pfp: SCOLLODEX_ENTRIES[1].pfp,
    role: 'Staff Engineer',
    company: 'Vercel',
    location: 'New York, NY',
    tags: [TAGS.work, TAGS.mentor],
    lastInteractionAt: inDays(-10),
    notes: [
      { id: 'n3', content: 'Call about infra scaling strategies. Mentioned his new synthwave keyboard build.', createdAt: inDays(-10) },
    ],
    actions: [
      { id: 'a3', content: 'Read latency article he shared', completed: false, dueDate: inDays(4) },
    ],
    preferences: SCOLLODEX_ENTRIES[1].preferences,
  },
  {
    id: 'contact_003',
    friendId: 'chenchen_003',
    name: 'Chen Chen',
    pfp: SCOLLODEX_ENTRIES[2].pfp,
    role: 'UX Researcher',
    company: 'Stripe',
    location: 'Remote',
    tags: [TAGS.friend],
    lastInteractionAt: inDays(-35),
    nextTouchAt: inDays(7),
    notes: [
      { id: 'n4', content: 'Shared some illustration work, brainstormed ideas for a new matcha cafe.', createdAt: inDays(-35) },
    ],
    actions: [],
    preferences: SCOLLODEX_ENTRIES[2].preferences,
  },
  {
    id: 'contact_004',
    friendId: 'brent_004',
    name: 'Brent',
    pfp: SCOLLODEX_ENTRIES[3].pfp,
    role: 'Partner',
    company: 'Y Combinator',
    location: 'Mountain View, CA',
    tags: [TAGS.investor],
    lastInteractionAt: inDays(-60),
    nextTouchAt: inDays(3),
    notes: [
        { id: 'n5', content: 'Initial pitch meeting. Sent follow up email with deck.', createdAt: inDays(-60)}
    ],
    actions: [
      { id: 'a4', content: 'Send monthly investor update', completed: false, dueDate: inDays(3) },
    ],
    preferences: SCOLLODEX_ENTRIES[3].preferences,
  }
];
