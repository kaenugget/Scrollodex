#!/usr/bin/env node
import 'dotenv/config';
import { knex } from '../src/db/knex.js';
async function testDatabase() {
    try {
        console.log('Testing database connection...');
        // Test connection
        await knex.raw('SELECT 1');
        console.log('✅ Database connection successful');
        // Check if tables exist
        const tables = await knex('information_schema.tables')
            .where('table_schema', 'public')
            .select('table_name');
        console.log('📋 Available tables:', tables.map(t => t.table_name));
        // Test user table
        const users = await knex('users').select('*');
        console.log('👥 Users in database:', users.length);
        if (users.length === 0) {
            console.log('⚠️  No users found. Run "npm run seed" to create demo user.');
        }
        else {
            console.log('✅ Demo user found:', users[0].email);
        }
    }
    catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
    finally {
        await knex.destroy();
    }
}
testDatabase();
//# sourceMappingURL=test-db.js.map