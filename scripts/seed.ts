import { knex } from '../src/db/knex';
import { randomUUID } from 'crypto';

async function seed() {
  const id = randomUUID();
  await knex('users').insert({
    id,
    email: 'demo@example.com',
    name: 'Demo User',
    telegram_chat_id: process.env.TELEGRAM_DEFAULT_CHAT_ID || null,
    oauth: {}
  }).onConflict('email').ignore();
  console.log('Seeded demo user (demo@example.com)');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
