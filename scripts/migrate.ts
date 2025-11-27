import { Client } from 'pg'; // PostgreSQL client
import { migrate } from 'some-migration-library'; // Replace with actual migration library

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
    try {
        await client.connect();
        console.log('Connected to the database.');

        // Run migrations
        await migrate(client);
        console.log('Migrations completed successfully.');
    } catch (error) {
        console.error('Error running migrations:', error);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

runMigrations();