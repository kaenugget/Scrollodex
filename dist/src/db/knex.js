import knexFactory from 'knex';
export const knex = knexFactory({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 10 }
});
//# sourceMappingURL=knex.js.map