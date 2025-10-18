import { knex } from './knex';

async function up() {
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (t) => {
      t.uuid('id').primary();
      t.string('email').notNullable().unique();
      t.string('name');
      t.jsonb('oauth').defaultTo('{}'); // per-provider refresh/access tokens
      t.string('telegram_chat_id');
      t.timestamps(true, true);
    });
  }

  const hasContacts = await knex.schema.hasTable('contacts');
  if (!hasContacts) {
    await knex.schema.createTable('contacts', (t) => {
      t.uuid('id').primary();
      t.uuid('user_id').notNullable().index();
      t.string('name').notNullable();
      t.string('primary_email');
      t.date('birthday');
      t.timestamp('last_contacted_at');
      t.text('notes');
      t.integer('importance').defaultTo(1); // 1..5
      t.timestamps(true, true);
    });
  }

  const hasInteractions = await knex.schema.hasTable('interactions');
  if (!hasInteractions) {
    await knex.schema.createTable('interactions', (t) => {
      t.uuid('id').primary();
      t.uuid('user_id').notNullable().index();
      t.uuid('contact_id').notNullable().index();
      t.enu('channel', ['email', 'telegram', 'manual']);
      t.timestamp('happened_at').notNullable();
      t.text('summary');
      t.timestamps(true, true);
    });
  }

  const hasScores = await knex.schema.hasTable('scores');
  if (!hasScores) {
    await knex.schema.createTable('scores', (t) => {
      t.uuid('user_id').notNullable().index();
      t.uuid('contact_id').notNullable().index();
      t.float('score').notNullable();
      t.enu('bucket', ['healthy', 'nurture', 'dormant']).notNullable();
      t.specificType('reasons', 'text[]');
      t.timestamp('computed_at').notNullable();
      t.primary(['user_id', 'contact_id']);
    });
  }

  console.log('Migrations complete');
  process.exit(0);
}

up().catch((e) => { console.error(e); process.exit(1); });
